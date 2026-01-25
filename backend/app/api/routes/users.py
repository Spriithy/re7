from fastapi import APIRouter, HTTPException, status, UploadFile, File
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.core.security import get_password_hash, verify_password
from app.models.invite import InviteLink
from app.models.user import User
from app.schemas.auth import (
    UserResponse,
    UserUpdateProfile,
    UserChangePassword,
    InvitedUserResponse,
)
from app.services.image import save_user_avatar, delete_user_avatar

router = APIRouter()


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdateProfile,
    current_user: CurrentUser,
    db: DbSession,
) -> UserResponse:
    """Update current user's profile information."""
    # Update full name
    current_user.full_name = profile_data.full_name

    await db.commit()
    await db.refresh(current_user)

    return UserResponse.model_validate(current_user)


@router.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_data: UserChangePassword,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Change current user's password."""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe actuel incorrect",
        )

    # Update password
    current_user.password_hash = get_password_hash(password_data.new_password)

    await db.commit()


@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    current_user: CurrentUser,
    db: DbSession,
    file: UploadFile = File(...),
) -> UserResponse:
    """Upload or replace current user's avatar image."""
    # Delete old avatar if exists
    if current_user.avatar_url:
        delete_user_avatar(current_user.avatar_url)

    # Save new avatar
    avatar_path = await save_user_avatar(file, current_user.id)
    current_user.avatar_url = avatar_path

    await db.commit()
    await db.refresh(current_user)

    return UserResponse.model_validate(current_user)


@router.delete("/me/avatar", status_code=status.HTTP_204_NO_CONTENT)
async def delete_avatar(
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Remove current user's avatar image."""
    if current_user.avatar_url:
        delete_user_avatar(current_user.avatar_url)
        current_user.avatar_url = None
        await db.commit()


@router.get("/me/invited", response_model=list[InvitedUserResponse])
async def get_invited_users(
    current_user: CurrentUser,
    db: DbSession,
) -> list[InvitedUserResponse]:
    """Get list of users invited by current user."""
    # Query for invite links created by current user that have been used
    result = await db.execute(
        select(InviteLink)
        .where(InviteLink.created_by == current_user.id)
        .where(InviteLink.used_by.isnot(None))
    )
    invites = result.scalars().all()

    # Get the users who used these invites
    user_ids = [invite.used_by for invite in invites if invite.used_by]

    if not user_ids:
        return []

    result = await db.execute(
        select(User).where(User.id.in_(user_ids))
    )
    users = result.scalars().all()

    return [InvitedUserResponse.model_validate(user) for user in users]
