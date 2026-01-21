import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    # Relationships
    created_invites: Mapped[list["InviteLink"]] = relationship(
        "InviteLink",
        back_populates="created_by_user",
        foreign_keys="InviteLink.created_by",
    )
    used_invite: Mapped["InviteLink | None"] = relationship(
        "InviteLink",
        back_populates="used_by_user",
        foreign_keys="InviteLink.used_by",
        uselist=False,
    )
    recipes: Mapped[list["Recipe"]] = relationship(
        "Recipe",
        back_populates="author",
    )


# Import here to avoid circular imports
from app.models.invite import InviteLink  # noqa: E402, F401
from app.models.recipe import Recipe  # noqa: E402, F401
