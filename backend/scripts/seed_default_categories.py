#!/usr/bin/env python3
"""Seed the default categories into an already-migrated database."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import async_session_maker
from app.seeds.default_categories import seed_default_categories


async def main() -> None:
    async with async_session_maker() as session:
        created = await seed_default_categories(session)
        if created:
            await session.commit()
        print(f"Seeded {created} default categories")


if __name__ == "__main__":
    asyncio.run(main())
