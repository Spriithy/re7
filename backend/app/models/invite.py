import secrets
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def generate_invite_token() -> str:
    return secrets.token_urlsafe(32)


class InviteLink(Base):
    __tablename__ = "invite_links"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        index=True,
        default=generate_invite_token,
    )
    created_by: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id"),
    )
    used_by: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    # Relationships
    created_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="created_invites",
        foreign_keys=[created_by],
    )
    used_by_user: Mapped["User | None"] = relationship(
        "User",
        back_populates="used_invite",
        foreign_keys=[used_by],
    )

    @property
    def is_valid(self) -> bool:
        return self.used_by is None and datetime.utcnow() < self.expires_at


from app.models.user import User  # noqa: E402, F401
