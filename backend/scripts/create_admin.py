#!/usr/bin/env python3
"""Script to create the admin user."""
import asyncio
import argparse
import getpass
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.bootstrap import create_admin_user, get_existing_admin_username, missing_admin_env_vars
from app.core.database import async_session_maker


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create the Re7 admin user.")
    parser.add_argument("--username", help="Admin username. Falls back to ADMIN_USERNAME.")
    parser.add_argument("--password", help="Admin password. Falls back to ADMIN_PASSWORD.")
    parser.add_argument(
        "--non-interactive",
        action="store_true",
        help="Fail instead of prompting when credentials are missing.",
    )
    return parser.parse_args()


async def create_admin(
    *,
    username: str | None,
    password: str | None,
    non_interactive: bool,
) -> int:
    print("=== Re7 Admin Setup ===\n")

    resolved_username = username or os.getenv("ADMIN_USERNAME", "").strip()
    resolved_password = password or os.getenv("ADMIN_PASSWORD", "")

    if not resolved_username or not resolved_password:
        if non_interactive:
            provided_values = {
                "ADMIN_USERNAME": resolved_username,
                "ADMIN_PASSWORD": resolved_password,
            }
            missing = ", ".join(missing_admin_env_vars(provided_values))
            print(f"Missing required admin credentials: {missing}")
            return 1

        resolved_username = resolved_username or input("Enter admin username: ").strip()
        resolved_password = resolved_password or getpass.getpass("Enter admin password: ")
        password_confirm = getpass.getpass("Confirm password: ")
        if resolved_password != password_confirm:
            print("Passwords do not match.")
            return 1

    async with async_session_maker() as db:
        try:
            created = await create_admin_user(
                db,
                username=resolved_username,
                password=resolved_password,
            )
        except ValueError as exc:
            print(str(exc))
            return 1

        if not created:
            existing_username = await get_existing_admin_username(db)
            print(f"Admin user already exists: {existing_username}")
            print("Only one admin is allowed.")
            return 0

        print(f"\nAdmin user '{resolved_username}' created successfully!")
        return 0


if __name__ == "__main__":
    arguments = parse_args()
    raise SystemExit(
        asyncio.run(
            create_admin(
                username=arguments.username,
                password=arguments.password,
                non_interactive=arguments.non_interactive,
            )
        )
    )
