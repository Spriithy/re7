#!/usr/bin/env python3
"""Seed the database with bundled French recipes."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import async_session_maker
from app.seeds.french_recipes import seed_french_recipes


async def main() -> None:
    async with async_session_maker() as session:
        result = await seed_french_recipes(session)
        await session.commit()

    print(
        "Seeded bundled French recipes "
        f"(categories_created={result.created_categories}, "
        f"recipes_created={result.created_recipes}, "
        f"recipes_skipped={result.skipped_recipes})"
    )


if __name__ == "__main__":
    asyncio.run(main())
