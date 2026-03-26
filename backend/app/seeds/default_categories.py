from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category

DEFAULT_CATEGORIES = [
    {
        "id": "95ceb58e-e2dd-45fa-9b2a-c10de58f9452",
        "name": "Viandes",
        "slug": "viandes",
        "icon_name": "viandes",
        "image_path": "categories/95ceb58e-e2dd-45fa-9b2a-c10de58f9452_46c83d53.jpg",
    },
    {
        "id": "b8d6c918-c24a-401a-acbd-ab8fe696afb4",
        "name": "Poissons",
        "slug": "poissons",
        "icon_name": "poissons",
        "image_path": "categories/b8d6c918-c24a-401a-acbd-ab8fe696afb4_5ba6797b.jpg",
    },
    {
        "id": "923ade64-392b-41cb-b30e-174738340f54",
        "name": "Plats et accompagnements",
        "slug": "plats-accompagnements",
        "icon_name": "plats",
        "image_path": "categories/923ade64-392b-41cb-b30e-174738340f54_6a756a77.jpg",
    },
    {
        "id": "8a6e8257-7beb-491c-aa64-a179b155c007",
        "name": "Entrées",
        "slug": "entrees",
        "icon_name": "entrees",
        "image_path": "categories/8a6e8257-7beb-491c-aa64-a179b155c007_fa4e8a0a.jpg",
    },
    {
        "id": "ecb8e74b-42bb-43b9-b596-0584c24df331",
        "name": "Soupes & potages",
        "slug": "soupes-potages",
        "icon_name": "soupes-potages",
        "image_path": "categories/ecb8e74b-42bb-43b9-b596-0584c24df331_2d7d50b0.jpg",
    },
    {
        "id": "12812af0-8fd4-4db1-b60d-d88c92141087",
        "name": "Salades",
        "slug": "salades",
        "icon_name": "salades",
        "image_path": "categories/12812af0-8fd4-4db1-b60d-d88c92141087_9948b0c4.jpg",
    },
    {
        "id": "25465aec-78cc-4e7e-a58f-269a1ae29430",
        "name": "Desserts",
        "slug": "desserts",
        "icon_name": "desserts",
        "image_path": "categories/25465aec-78cc-4e7e-a58f-269a1ae29430_b6aeb205.jpg",
    },
    {
        "id": "376d9007-06e4-4dac-8986-c66c2c17c706",
        "name": "Pâtisseries",
        "slug": "patisseries",
        "icon_name": "patisseries",
        "image_path": "categories/376d9007-06e4-4dac-8986-c66c2c17c706_4b3bfa48.jpg",
    },
    {
        "id": "6e3a3917-0efc-4d66-9329-ccb5cf2ca85d",
        "name": "Sauces & condiments",
        "slug": "sauces-condiments",
        "icon_name": "sauces-condiments",
        "image_path": "categories/6e3a3917-0efc-4d66-9329-ccb5cf2ca85d_0bb4ff48.jpg",
    },
    {
        "id": "186564b2-b223-49a1-b475-53a04b3103fe",
        "name": "Boissons",
        "slug": "boissons",
        "icon_name": "boissons",
        "image_path": "categories/186564b2-b223-49a1-b475-53a04b3103fe_b66b3809.jpg",
    },
    {
        "id": "9f2522a4-428b-43e1-965a-97fbafc5b658",
        "name": "Petit-déjeuner",
        "slug": "petit-dejeuner",
        "icon_name": "petit-dejeuner",
        "image_path": "categories/9f2522a4-428b-43e1-965a-97fbafc5b658_82e2060e.jpg",
    },
    {
        "id": "6cd0108e-41ea-4707-8829-2d928fa163ab",
        "name": "Apéritifs et bouchées",
        "slug": "aperitifs",
        "icon_name": "aperitifs",
        "image_path": "categories/6cd0108e-41ea-4707-8829-2d928fa163ab_275e0c82.jpg",
    },
]


async def seed_default_categories(db: AsyncSession) -> int:
    result = await db.execute(select(Category.slug))
    existing_slugs = {slug for slug in result.scalars()}
    now = datetime.utcnow()
    created_count = 0

    for category in DEFAULT_CATEGORIES:
        if category["slug"] in existing_slugs:
            continue

        db.add(
            Category(
                id=category["id"],
                name=category["name"],
                slug=category["slug"],
                icon_name=category["icon_name"],
                image_path=category["image_path"],
                created_at=now,
            )
        )
        created_count += 1

    return created_count
