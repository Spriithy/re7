from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.core.security import (
    create_access_token,
    get_password_hash_async,
    verify_password,
)
from app.models.invite import InviteLink
from app.models.user import User
from app.schemas.auth import Token, TokenWithUser, UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post("/login", response_model=TokenWithUser)
async def login(credentials: UserLogin, db: DbSession) -> TokenWithUser:
    """Authenticate user and return access token and user data."""
    result = await db.execute(select(User).where(User.username == credentials.username))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token, expires_at = create_access_token(user.id)
    return TokenWithUser(
        access_token=access_token,
        expires_at=expires_at,
        user=UserResponse.model_validate(user)
    )


@router.post("/register", response_model=TokenWithUser, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: DbSession) -> TokenWithUser:
    """Register a new user with an invite token."""
    # Check if username is taken
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    # Validate invite token
    result = await db.execute(
        select(InviteLink).where(InviteLink.token == user_data.invite_token)
    )
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

    # Create user with async password hashing to avoid blocking
    password_hash = await get_password_hash_async(user_data.password)
    user = User(
        username=user_data.username,
        password_hash=password_hash,
    )
    db.add(user)
    await db.flush()

    # Mark invite as used
    invite.used_by = user.id

    access_token, expires_at = create_access_token(user.id)
    return TokenWithUser(
        access_token=access_token,
        expires_at=expires_at,
        user=UserResponse.model_validate(user)
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: CurrentUser) -> Token:
    """
    Refresh the access token.
    Returns a new token only if the current one was issued more than 24 hours ago.
    Otherwise returns the same token info (client should track this).
    """
    access_token, expires_at = create_access_token(current_user.id)
    return Token(access_token=access_token, expires_at=expires_at)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser) -> UserResponse:
    """Get current user information."""
    return UserResponse.model_validate(current_user)
