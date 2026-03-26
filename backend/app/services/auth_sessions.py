import logging
from datetime import datetime

from fastapi import HTTPException, Response, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_refresh_expiry,
    hash_refresh_token,
    utcnow,
)
from app.models.session import Session
from app.models.user import User

logger = logging.getLogger(__name__)


def set_auth_cookies(
    response: Response,
    *,
    access_token: str,
    access_expires_at: datetime,
    refresh_token: str,
    refresh_expires_at: datetime,
) -> None:
    access_max_age = max(int((access_expires_at - utcnow()).total_seconds()), 0)
    refresh_max_age = max(int((refresh_expires_at - utcnow()).total_seconds()), 0)

    response.set_cookie(
        key=settings.access_cookie_name,
        value=access_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path=settings.cookie_path,
        max_age=access_max_age,
    )
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=refresh_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path=settings.refresh_cookie_path,
        max_age=refresh_max_age,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(
        key=settings.access_cookie_name,
        domain=settings.cookie_domain,
        path=settings.cookie_path,
    )
    response.delete_cookie(
        key=settings.refresh_cookie_name,
        domain=settings.cookie_domain,
        path=settings.refresh_cookie_path,
    )


async def revoke_session_by_refresh_token(
    db: AsyncSession,
    refresh_token: str | None,
) -> None:
    if not refresh_token:
        return

    refresh_token_hash = hash_refresh_token(refresh_token.strip('"'))
    result = await db.execute(
        select(Session).where(Session.refresh_token_hash == refresh_token_hash)
    )
    session = result.scalar_one_or_none()
    if session is None:
        return

    session.revoked_at = utcnow()
    await db.flush()


async def revoke_all_user_sessions(db: AsyncSession, user_id: str) -> None:
    await db.execute(
        delete(Session).where(Session.user_id == user_id)
    )


async def create_user_session(
    db: AsyncSession,
    user: User,
    response: Response,
) -> None:
    access_token, access_expires_at = create_access_token(user.id)
    refresh_token, refresh_token_hash = create_refresh_token()
    refresh_expires_at = get_refresh_expiry()

    db.add(
        Session(
            user_id=user.id,
            refresh_token_hash=refresh_token_hash,
            expires_at=refresh_expires_at,
            last_used_at=utcnow(),
        )
    )
    await db.flush()

    set_auth_cookies(
        response,
        access_token=access_token,
        access_expires_at=access_expires_at,
        refresh_token=refresh_token,
        refresh_expires_at=refresh_expires_at,
    )


async def rotate_refresh_session(
    db: AsyncSession,
    response: Response,
    refresh_token: str | None,
) -> User:
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )

    refresh_token_hash = hash_refresh_token(refresh_token.strip('"'))
    result = await db.execute(
        select(Session)
        .join(User, Session.user_id == User.id)
        .where(Session.refresh_token_hash == refresh_token_hash)
    )
    session = result.scalar_one_or_none()

    if session is None or session.revoked_at is not None:
        logger.warning("refresh_session_invalid")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    if session.expires_at <= utcnow():
        session.revoked_at = utcnow()
        logger.warning("refresh_session_expired", extra={"session_id": session.id})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    user = await db.get(User, session.user_id)
    if user is None:
        session.revoked_at = utcnow()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    session.revoked_at = utcnow()
    await db.flush()
    await create_user_session(db, user, response)
    logger.info("refresh_session_rotated", extra={"user_id": user.id})
    return user
