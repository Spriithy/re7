import time
import logging

import httpx
from jose import JWTError, jwt
from pydantic import BaseModel

from app.core.config import settings

WORKOS_JWKS_TTL_SECONDS = 300
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
    "keys": {},
}


def get_workos_jwks_url() -> str | None:
    if not settings.workos_client_id:
        return None

    return f"https://api.workos.com/sso/jwks/{settings.workos_client_id}"


async def fetch_workos_jwks() -> list[dict] | None:
    now = time.time()
    if _jwks_cache["expires_at"] > now:
        return _jwks_cache["keys"]  # type: ignore[return-value]

    jwks_url = get_workos_jwks_url()
    if jwks_url is None:
        return None

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(jwks_url)
            response.raise_for_status()
    except httpx.HTTPError:
        return None

    keys = response.json().get("keys")
    if not isinstance(keys, list):
        return None

    _jwks_cache["keys"] = keys
    _jwks_cache["expires_at"] = now + WORKOS_JWKS_TTL_SECONDS
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
