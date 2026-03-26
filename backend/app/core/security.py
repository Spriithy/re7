import asyncio
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.schemas.auth import TokenPayload

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def utcnow() -> datetime:
    return datetime.utcnow()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def get_password_hash_async(password: str) -> str:
    return await asyncio.to_thread(get_password_hash, password)


def create_access_token(
    user_id: str,
    *,
    expires_delta: timedelta | None = None,
) -> tuple[str, datetime]:
    now_utc = datetime.now(timezone.utc)
    expire_utc = now_utc + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )

    encoded_jwt = jwt.encode(
        {
            "sub": user_id,
            "exp": int(expire_utc.timestamp()),
            "iat": int(now_utc.timestamp()),
        },
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    return encoded_jwt, expire_utc.replace(tzinfo=None)


def decode_token(token: str) -> TokenPayload | None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return TokenPayload(
            sub=payload["sub"],
            exp=datetime.utcfromtimestamp(payload["exp"]),
            iat=datetime.utcfromtimestamp(payload["iat"]),
        )
    except JWTError:
        return None


def create_refresh_token() -> tuple[str, str]:
    token = secrets.token_urlsafe(48)
    return token, hash_refresh_token(token)


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_refresh_expiry() -> datetime:
    return utcnow() + timedelta(days=settings.refresh_token_expire_days)
