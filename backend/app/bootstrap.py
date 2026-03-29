from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User


async def get_existing_admin_username(session: AsyncSession) -> str | None:
    result = await session.execute(select(User).where(User.is_admin.is_(True)))
    existing_admin = result.scalar_one_or_none()
    if existing_admin is None:
        return None
    return existing_admin.username


async def create_admin_user(
    session: AsyncSession,
    *,
    username: str,
    password: str,
) -> bool:
    normalized_username = username.strip()
    if len(normalized_username) < 3:
        raise ValueError("Username must be at least 3 characters.")
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters.")

    existing_admin_username = await get_existing_admin_username(session)
    if existing_admin_username is not None:
        return False

    admin = User(
        username=normalized_username,
        password_hash=get_password_hash(password),
        is_admin=True,
    )
    session.add(admin)
    await session.commit()
    return True


def missing_admin_env_vars(env: dict[str, str], *, required: Sequence[str] | None = None) -> list[str]:
    variable_names = required or ("ADMIN_USERNAME", "ADMIN_PASSWORD")
    return [name for name in variable_names if not env.get(name, "").strip()]
