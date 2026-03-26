from datetime import datetime, timedelta

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.invite import InviteLink
from app.models.session import Session
from app.models.user import User


async def create_user(
    session_factory: async_sessionmaker[AsyncSession],
    username: str,
    password: str,
    *,
    is_admin: bool = False,
) -> User:
    async with session_factory() as session:
        user = User(
            username=username,
            password_hash=get_password_hash(password),
            is_admin=is_admin,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


async def create_invite(
    session_factory: async_sessionmaker[AsyncSession],
    *,
    created_by: str,
) -> InviteLink:
    async with session_factory() as session:
        invite = InviteLink(
            created_by=created_by,
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
        session.add(invite)
        await session.commit()
        await session.refresh(invite)
        return invite


@pytest.mark.asyncio
async def test_register_sets_cookies_and_logout_clears_them(
    client,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    admin = await create_user(session_factory, "admin", "secret123", is_admin=True)
    invite = await create_invite(session_factory, created_by=admin.id)

    response = await client.post(
        "/api/auth/register",
        json={
            "username": "marie",
            "password": "secret123",
            "invite_token": invite.token,
        },
    )

    assert response.status_code == 201
    assert response.json()["user"]["username"] == "marie"
    assert settings.access_cookie_name in response.cookies
    assert settings.refresh_cookie_name in response.cookies
    access_cookie = response.cookies.get(settings.access_cookie_name)
    refresh_cookie = response.cookies.get(settings.refresh_cookie_name)

    me_response = await client.get(
        "/api/auth/me",
        cookies={settings.access_cookie_name: access_cookie},
    )
    assert me_response.status_code == 200
    assert me_response.json()["username"] == "marie"

    logout_response = await client.post(
        "/api/auth/logout",
        cookies={settings.refresh_cookie_name: refresh_cookie},
    )
    assert logout_response.status_code == 204

    post_logout_me = await client.get("/api/auth/me")
    assert post_logout_me.status_code == 401


@pytest.mark.asyncio
async def test_refresh_rotates_session_and_revokes_old_cookie(
    client,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    await create_user(session_factory, "theo", "secret123")

    login_response = await client.post(
        "/api/auth/login",
        json={"username": "theo", "password": "secret123"},
    )
    assert login_response.status_code == 200
    client.cookies.update(login_response.cookies)

    old_refresh_cookie = login_response.cookies.get(settings.refresh_cookie_name)
    assert old_refresh_cookie is not None

    refresh_response = await client.post("/api/auth/refresh")
    assert refresh_response.status_code == 200
    assert refresh_response.cookies.get(settings.refresh_cookie_name) is not None

    async with session_factory() as session:
        result = await session.execute(select(Session))
        sessions = result.scalars().all()
        assert len(sessions) == 2
        assert sum(1 for item in sessions if item.revoked_at is not None) == 1

    client.cookies.clear()
    client.cookies.set(settings.refresh_cookie_name, old_refresh_cookie)

    stale_refresh_response = await client.post("/api/auth/refresh")
    assert stale_refresh_response.status_code == 401
