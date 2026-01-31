"""Add categories with images, diet options, and recipe category link

Revision ID: 003
Revises: 002
Create Date: 2025-01-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create categories table with image_path
    op.create_table(
        "categories",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("icon_name", sa.String(50), nullable=False),
        sa.Column("image_path", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"])

    # Seed default categories with pre-downloaded images
    # UUIDs are hardcoded to match existing image files in uploads/categories/
    categories = [
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

    from datetime import datetime
    now = datetime.utcnow()

    for cat in categories:
        op.execute(
            sa.text(
                "INSERT INTO categories (id, name, slug, icon_name, image_path, created_at) "
                "VALUES (:id, :name, :slug, :icon_name, :image_path, :created_at)"
            ).bindparams(
                id=cat["id"],
                name=cat["name"],
                slug=cat["slug"],
                icon_name=cat["icon_name"],
                image_path=cat["image_path"],
                created_at=str(now),
            )
        )

    # Add category_id column to recipes table
    op.add_column(
        "recipes",
        sa.Column("category_id", sa.String(36), nullable=True),
    )
    op.create_index("ix_recipes_category_id", "recipes", ["category_id"])

    # Add diet option columns to recipes table
    op.add_column(
        "recipes",
        sa.Column("is_vegetarian", sa.Boolean(), nullable=False, server_default="0"),
    )
    op.add_column(
        "recipes",
        sa.Column("is_vegan", sa.Boolean(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_column("recipes", "is_vegan")
    op.drop_column("recipes", "is_vegetarian")
    op.drop_index("ix_recipes_category_id", "recipes")
    op.drop_column("recipes", "category_id")
    op.drop_table("categories")
