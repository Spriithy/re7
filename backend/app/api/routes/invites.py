from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select

from app.api.deps import CurrentAdmin, DbSession
from app.models.invite import InviteLink
from app.schemas.invite import InviteCreate, InviteResponse

router = APIRouter()


class InviteValidation(BaseModel):
    valid: bool


@router.get("/validate/{token}", response_model=InviteValidation)
async def validate_invite(token: str, db: DbSession) -> InviteValidation:
    """Check if an invite token is valid. Public endpoint."""
    result = await db.execute(select(InviteLink).where(InviteLink.token == token))
    invite = result.scalar_one_or_none()

    if invite is None or not invite.is_valid:
        return InviteValidation(valid=False)

    return InviteValidation(valid=True)


@router.post("/", response_model=InviteResponse, status_code=status.HTTP_201_CREATED)
async def create_invite(
    invite_data: InviteCreate,
    current_admin: CurrentAdmin,
    db: DbSession,
) -> InviteResponse:
    """Create a new invite link. Admin only."""
    expires_at = datetime.utcnow() + timedelta(days=invite_data.expires_in_days)

    invite = InviteLink(
        created_by=current_admin.id,
        expires_at=expires_at,
    )
    db.add(invite)
    await db.flush()
    await db.refresh(invite)

    return InviteResponse.from_orm_with_used(invite)


@router.get("/", response_model=list[InviteResponse])
async def list_invites(
    current_admin: CurrentAdmin,
    db: DbSession,
) -> list[InviteResponse]:
    """List all invite links. Admin only."""
    result = await db.execute(select(InviteLink).order_by(InviteLink.created_at.desc()))
    invites = result.scalars().all()
    return [InviteResponse.from_orm_with_used(invite) for invite in invites]


@router.delete("/{invite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invite(
    invite_id: str,
    current_admin: CurrentAdmin,
    db: DbSession,
) -> None:
    """Delete an invite link. Admin only."""
    result = await db.execute(select(InviteLink).where(InviteLink.id == invite_id))
    invite = result.scalar_one_or_none()

    if invite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found",
        )

    if invite.used_by is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an invite that has been used",
        )

    await db.delete(invite)
