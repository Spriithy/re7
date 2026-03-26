import logging
import secrets

from fastapi import APIRouter, Cookie, HTTPException, Response, status
from sqlalchemy import select

from app.api.deps import CurrentUser, CurrentWorkOSUser, DbSession
from app.core.config import settings
from app.core.security import get_password_hash_async, verify_password
from app.models.invite import InviteLink
from app.models.user import User
from app.schemas.auth import (
    SessionResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    WorkOSLinkExistingRequest,
    WorkOSLinkRequest,
)
from app.services.auth_sessions import (
    clear_auth_cookies,
    create_user_session,
    revoke_session_by_refresh_token,
    rotate_refresh_session,
)
from app.services.identity import (
    WORKOS_PROVIDER,
    get_identity_for_user,
    get_user_by_identity,
    link_user_identity,
)

logger = logging.getLogger(__name__)
router = APIRouter()


async def get_valid_invite(db: DbSession, invite_token: str) -> InviteLink:
    result = await db.execute(select(InviteLink).where(InviteLink.token == invite_token))
    invite = result.scalar_one_or_none()

    if invite is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid invite token",
        )

    if not invite.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite token has expired or already been used",
        )

    return invite


async def create_local_session_response(
    *,
    db: DbSession,
    user: User,
    response: Response,
) -> SessionResponse:
    await create_user_session(db, user, response)
    await db.refresh(user)
    return SessionResponse(user=UserResponse.model_validate(user))


@router.post("/login", response_model=SessionResponse)
async def login(
    credentials: UserLogin,
    response: Response,
    db: DbSession,
) -> SessionResponse:
    result = await db.execute(select(User).where(User.username == credentials.username))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(credentials.password, user.password_hash):
        logger.warning("auth_login_failed", extra={"username": credentials.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    logger.info("auth_login_succeeded", extra={"user_id": user.id})
    return await create_local_session_response(db=db, user=user, response=response)


@router.post("/register", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    response: Response,
    db: DbSession,
) -> SessionResponse:
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    invite = await get_valid_invite(db, user_data.invite_token)

    password_hash = await get_password_hash_async(user_data.password)
    user = User(
        username=user_data.username,
        password_hash=password_hash,
    )
    db.add(user)
    await db.flush()

    invite.used_by = user.id
    logger.info("auth_register_succeeded", extra={"user_id": user.id})
    return await create_local_session_response(db=db, user=user, response=response)


@router.post("/workos/exchange", response_model=SessionResponse)
async def exchange_workos_session(
    response: Response,
    workos_user: CurrentWorkOSUser,
    db: DbSession,
) -> SessionResponse:
    user = await get_user_by_identity(
        db,
        provider=WORKOS_PROVIDER,
        provider_user_id=workos_user.sub,
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated WorkOS user is not linked to a local account",
        )

    logger.info("auth_workos_exchange_succeeded", extra={"user_id": user.id})
    return await create_local_session_response(db=db, user=user, response=response)


@router.post("/workos/link", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def link_workos_account(
    data: WorkOSLinkRequest,
    response: Response,
    workos_user: CurrentWorkOSUser,
    db: DbSession,
) -> SessionResponse:
    existing_identity_user = await get_user_by_identity(
        db,
        provider=WORKOS_PROVIDER,
        provider_user_id=workos_user.sub,
    )
    if existing_identity_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce compte WorkOS est déjà lié",
        )

    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    invite = await get_valid_invite(db, data.invite_token)

    password_hash = await get_password_hash_async(secrets.token_urlsafe(32))
    user = User(
        username=data.username,
        password_hash=password_hash,
        full_name=data.full_name or workos_user.name,
    )
    db.add(user)
    await db.flush()

    await link_user_identity(
        db,
        user=user,
        provider=WORKOS_PROVIDER,
        provider_user_id=workos_user.sub,
        provider_email=None,
    )

    invite.used_by = user.id
    logger.info("auth_workos_link_succeeded", extra={"user_id": user.id})
    return await create_local_session_response(db=db, user=user, response=response)


@router.post("/workos/link-existing", response_model=SessionResponse)
async def link_existing_account_to_workos(
    data: WorkOSLinkExistingRequest,
    response: Response,
    workos_user: CurrentWorkOSUser,
    db: DbSession,
) -> SessionResponse:
    existing_identity_user = await get_user_by_identity(
        db,
        provider=WORKOS_PROVIDER,
        provider_user_id=workos_user.sub,
    )
    if existing_identity_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce compte WorkOS est déjà lié",
        )

    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(data.password, user.password_hash):
        logger.warning("auth_workos_link_existing_failed", extra={"username": data.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    existing_provider_identity = await get_identity_for_user(
        db,
        user_id=user.id,
        provider=WORKOS_PROVIDER,
    )
    if existing_provider_identity is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce compte local est déjà lié à WorkOS",
        )

    await link_user_identity(
        db,
        user=user,
        provider=WORKOS_PROVIDER,
        provider_user_id=workos_user.sub,
        provider_email=None,
    )
    logger.info("auth_workos_link_existing_succeeded", extra={"user_id": user.id})
    return await create_local_session_response(db=db, user=user, response=response)


@router.post("/refresh", response_model=SessionResponse)
async def refresh_session(
    response: Response,
    db: DbSession,
    refresh_cookie: str | None = Cookie(default=None, alias=settings.refresh_cookie_name),
) -> SessionResponse:
    user = await rotate_refresh_session(db, response, refresh_cookie)
    return SessionResponse(user=UserResponse.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    db: DbSession,
    refresh_cookie: str | None = Cookie(default=None, alias=settings.refresh_cookie_name),
) -> None:
    await revoke_session_by_refresh_token(db, refresh_cookie)
    clear_auth_cookies(response)
    logger.info("auth_logout")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(current_user)
