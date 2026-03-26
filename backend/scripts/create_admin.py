#!/usr/bin/env python3
"""Script to create the admin user."""
import asyncio
import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.core.database import async_session_maker
from app.core.security import get_password_hash
from app.models.user import User


async def create_admin():
    print("=== Re7 Admin Setup ===\n")

    async with async_session_maker() as db:
        result = await db.execute(select(User).where(User.is_admin.is_(True)))
        existing_admin = result.scalar_one_or_none()

        if existing_admin:
            print(f"Admin user already exists: {existing_admin.username}")
            print("Only one admin is allowed.")
            return

        username = input("Enter admin username: ").strip()
        if len(username) < 3:
            print("Username must be at least 3 characters.")
            return

        password = getpass.getpass("Enter admin password: ")
        if len(password) < 6:
            print("Password must be at least 6 characters.")
            return

        password_confirm = getpass.getpass("Confirm password: ")
        if password != password_confirm:
            print("Passwords do not match.")
            return

        admin = User(
            username=username,
            password_hash=get_password_hash(password),
            is_admin=True,
        )
        db.add(admin)
        await db.commit()

        print(f"\nAdmin user '{username}' created successfully!")


if __name__ == "__main__":
    asyncio.run(create_admin())
