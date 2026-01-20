from datetime import datetime

from pydantic import BaseModel, Field


class InviteCreate(BaseModel):
    expires_in_days: int = Field(default=7, ge=1, le=30)


class InviteResponse(BaseModel):
    id: str
    token: str
    expires_at: datetime
    created_at: datetime
    is_used: bool

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_used(cls, invite) -> "InviteResponse":
        return cls(
            id=invite.id,
            token=invite.token,
            expires_at=invite.expires_at,
            created_at=invite.created_at,
            is_used=invite.used_by is not None,
        )
