import logging
import json
import time
from pathlib import Path

import httpx
from jose import JWTError, jwt
from pydantic import BaseModel

from app.core.config import settings

WORKOS_JWKS_TTL_SECONDS = 300
WORKOS_JWKS_CACHE_PATH = settings.base_dir / "data" / "workos_jwks_cache.json"
logger = logging.getLogger(__name__)


class WorkOSAccessTokenClaims(BaseModel):
    sub: str
    sid: str | None = None
    iss: str | None = None
    org_id: str | None = None
    role: str | None = None
    permissions: list[str] = []
    exp: int


_jwks_cache: dict[str, object] = {
    "expires_at": 0.0,
    "keys": [],
}


def load_persisted_workos_jwks() -> list[dict] | None:
    try:
        payload = json.loads(WORKOS_JWKS_CACHE_PATH.read_text())
    except FileNotFoundError:
        return None
    except (OSError, json.JSONDecodeError):
        logger.exception("WorkOS JWKS cache load failed")
        return None

    keys = payload.get("keys")
    if not isinstance(keys, list) or not keys:
        return None

    expires_at = payload.get("expires_at")
    if isinstance(expires_at, (int, float)):
        _jwks_cache["expires_at"] = float(expires_at)
    else:
        _jwks_cache["expires_at"] = 0.0

    _jwks_cache["keys"] = keys
    return keys


def persist_workos_jwks(keys: list[dict], expires_at: float) -> None:
    try:
        WORKOS_JWKS_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        WORKOS_JWKS_CACHE_PATH.write_text(
            json.dumps(
                {
                    "expires_at": expires_at,
                    "keys": keys,
                }
            )
        )
    except OSError:
        logger.exception("WorkOS JWKS cache persist failed")


def get_workos_jwks_url() -> str | None:
    if not settings.workos_client_id:
        return None

    return f"https://api.workos.com/sso/jwks/{settings.workos_client_id}"


async def fetch_workos_jwks() -> list[dict] | None:
    now = time.time()
    cached_keys = _jwks_cache["keys"]
    stale_keys = cached_keys if isinstance(cached_keys, list) and cached_keys else None

    if stale_keys is None:
        stale_keys = load_persisted_workos_jwks()

    if _jwks_cache["expires_at"] > now and stale_keys is not None:
        return stale_keys

    jwks_url = get_workos_jwks_url()
    if jwks_url is None:
        return None

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(jwks_url)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        if stale_keys is not None:
            logger.warning(
                "WorkOS JWKS refresh failed, using stale cached keys: %s",
                exc,
            )
            return stale_keys

        logger.warning("WorkOS JWKS refresh failed: %s", exc)
        return None

    keys = response.json().get("keys")
    if not isinstance(keys, list):
        if stale_keys is not None:
            logger.warning("WorkOS JWKS response was invalid, using stale cached keys")
            return stale_keys

        logger.warning("WorkOS JWKS response was invalid")
        return None

    _jwks_cache["keys"] = keys
    expires_at = now + WORKOS_JWKS_TTL_SECONDS
    _jwks_cache["expires_at"] = expires_at
    persist_workos_jwks(keys, expires_at)
    return keys


async def verify_workos_access_token(token: str) -> WorkOSAccessTokenClaims | None:
    if not settings.workos_client_id:
        logger.warning("WorkOS token verification skipped: missing workos_client_id")
        return None

    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        logger.exception("WorkOS token verification failed: invalid JWT header")
        return None

    try:
        unverified_claims = jwt.get_unverified_claims(token)
    except JWTError:
        logger.exception("WorkOS token verification failed: invalid JWT claims")
        return None

    kid = unverified_header.get("kid")
    if not isinstance(kid, str):
        logger.warning("WorkOS token verification failed: missing kid in header")
        return None

    logger.info(
        "Verifying WorkOS token",
        extra={
            "workos_kid": kid,
            "workos_iss": unverified_claims.get("iss"),
            "workos_sub": unverified_claims.get("sub"),
            "workos_aud": unverified_claims.get("aud"),
            "workos_exp": unverified_claims.get("exp"),
        },
    )

    keys = await fetch_workos_jwks()
    if keys is None:
        logger.warning("WorkOS token verification failed: JWKS unavailable")
        return None

    key = next(
        (
            candidate
            for candidate in keys
            if isinstance(candidate, dict) and candidate.get("kid") == kid
        ),
        None,
    )
    if key is None:
        logger.warning("WorkOS token verification failed: no JWKS key matched kid %s", kid)
        return None

    try:
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
        )
    except JWTError as exc:
        logger.warning("WorkOS token verification failed during decode: %s", exc)
        return None

    try:
        return WorkOSAccessTokenClaims.model_validate(claims)
    except Exception:
        logger.exception("WorkOS token verification failed: claims validation error")
        return None
