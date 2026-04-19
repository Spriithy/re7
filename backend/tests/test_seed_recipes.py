import pytest
from sqlalchemy import func, select

from app.models.category import Category
from app.models.recipe import Recipe
from app.models.user import User
from app.seeds.default_categories import DEFAULT_CATEGORIES
from app.seeds.french_recipes import FRENCH_RECIPES, seed_french_recipes


@pytest.mark.asyncio
async def test_seed_french_recipes_seeds_categories_and_is_idempotent(session_factory) -> None:
    async with session_factory() as session:
        session.add(
            User(
                username="admin",
                password_hash="not-used-in-tests",
                is_admin=True,
            )
        )
        await session.commit()

    async with session_factory() as session:
        first_result = await seed_french_recipes(session)
        await session.commit()

    assert first_result.created_categories == len(DEFAULT_CATEGORIES)
    assert first_result.created_recipes == len(FRENCH_RECIPES)
    assert first_result.skipped_recipes == 0

    async with session_factory() as session:
        recipe_count = await session.scalar(select(func.count(Recipe.id)))
        category_count = await session.scalar(select(func.count(Category.id)))
        salade_nicoise = await session.scalar(
            select(Recipe).where(Recipe.title == "Salade niçoise")
        )

    assert recipe_count == len(FRENCH_RECIPES)
    assert category_count == len(DEFAULT_CATEGORIES)
    assert salade_nicoise is not None
    assert salade_nicoise.source == "https://www.cuisinenicoise.fr/salade-nicoise/"

    async with session_factory() as session:
        second_result = await seed_french_recipes(session)
        await session.commit()

    assert second_result.created_categories == 0
    assert second_result.created_recipes == 0
    assert second_result.skipped_recipes == len(FRENCH_RECIPES)


@pytest.mark.asyncio
async def test_seed_french_recipes_requires_admin_user(session_factory) -> None:
    async with session_factory() as session:
        with pytest.raises(ValueError, match="admin user"):
            await seed_french_recipes(session)
