from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.user_identity import UserIdentity

WORKOS_PROVIDER = "workos"


async def get_user_by_identity(
    db: AsyncSession,
    *,
    provider: str,
    provider_user_id: str,
) -> User | None:
    result = await db.execute(
        select(User)
        .join(UserIdentity, UserIdentity.user_id == User.id)
        .where(
            UserIdentity.provider == provider,
            UserIdentity.provider_user_id == provider_user_id,
        )
    )
    return result.scalar_one_or_none()


async def get_identity_for_user(
    db: AsyncSession,
    *,
    user_id: str,
    provider: str,
) -> UserIdentity | None:
    result = await db.execute(
        select(UserIdentity).where(
            UserIdentity.user_id == user_id,
            UserIdentity.provider == provider,
        )
    )
    return result.scalar_one_or_none()


async def link_user_identity(
    db: AsyncSession,
    *,
    user: User,
    provider: str,
    provider_user_id: str,
    provider_email: str | None,
) -> UserIdentity:
    identity = UserIdentity(
        user_id=user.id,
        provider=provider,
        provider_user_id=provider_user_id,
        provider_email=provider_email,
    )
    db.add(identity)
    await db.flush()
    await db.refresh(identity)
    return identity
