from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_token
from app.core.workos import WorkOSAccessTokenClaims, verify_workos_access_token
from app.models.user import User
from app.services.identity import WORKOS_PROVIDER, get_user_by_identity

security = HTTPBearer(auto_error=False)


def normalize_token_value(token: str | None) -> str | None:
    if token is None:
        return None
    return token.strip().strip('"')


async def get_current_workos_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> WorkOSAccessTokenClaims:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    workos_user = await verify_workos_access_token(credentials.credentials)
    if workos_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return workos_user


async def get_current_user(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> User:
    access_cookie = request.cookies.get(settings.access_cookie_name)
    token = (
        normalize_token_value(credentials.credentials)
        if credentials is not None
        else normalize_token_value(access_cookie)
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(token)

    if payload is not None:
        result = await db.execute(select(User).where(User.id == payload.sub))
        user = result.scalar_one_or_none()
        if user is not None:
            return user

    if credentials is not None:
        workos_user = await verify_workos_access_token(token)
        if workos_user is not None:
            user = await get_user_by_identity(
                db,
                provider=WORKOS_PROVIDER,
                provider_user_id=workos_user.sub,
            )
            if user is not None:
                return user

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authenticated WorkOS user is not linked to a local account",
                headers={"WWW-Authenticate": "Bearer"},
            )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_request_id(
    request_id: Annotated[str | None, Header(alias="X-Request-ID")] = None,
) -> str | None:
    return request_id


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentAdmin = Annotated[User, Depends(get_current_admin)]
CurrentWorkOSUser = Annotated[
    WorkOSAccessTokenClaims, Depends(get_current_workos_user)
]
DbSession = Annotated[AsyncSession, Depends(get_db)]
RequestId = Annotated[str | None, Depends(get_request_id)]
