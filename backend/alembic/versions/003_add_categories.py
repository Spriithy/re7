"""Add categories with images, diet options, and recipe category link

Revision ID: 003
Revises: 002
Create Date: 2025-01-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import datetime
from app.seeds.default_categories import DEFAULT_CATEGORIES


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
    now = datetime.datetime.now(datetime.timezone.utc)

    for cat in DEFAULT_CATEGORIES:
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
