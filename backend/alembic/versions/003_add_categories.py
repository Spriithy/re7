"""Add categories

Revision ID: 003
Revises: 002
Create Date: 2025-01-24

"""
from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create categories table (without color field)
    op.create_table(
        "categories",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("icon_name", sa.String(50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"])

    # Seed default categories ordered by frequency (most common first)
    categories = [
        # Main courses - most frequent
        {
            "id": str(uuid.uuid4()),
            "name": "Viandes",
            "slug": "viandes",
            "icon_name": "viandes",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Poissons",
            "slug": "poissons",
            "icon_name": "poissons",
        },
        # Side dishes - very common
        {
            "id": str(uuid.uuid4()),
            "name": "Plats et accompagnements",
            "slug": "plats",
            "icon_name": "plats",
        },
        # Starters and soups - common
        {
            "id": str(uuid.uuid4()),
            "name": "Entrées",
            "slug": "entrees",
            "icon_name": "entrees",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Soupes & potages",
            "slug": "soupes-potages",
            "icon_name": "soupes-potages",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Salades",
            "slug": "salades",
            "icon_name": "salades",
        },
        # Sweets - moderate
        {
            "id": str(uuid.uuid4()),
            "name": "Desserts",
            "slug": "desserts",
            "icon_name": "desserts",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pâtisseries",
            "slug": "patisseries",
            "icon_name": "patisseries",
        },
        # Accessories - less frequent
        {
            "id": str(uuid.uuid4()),
            "name": "Sauces & condiments",
            "slug": "sauces-condiments",
            "icon_name": "sauces-condiments",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Boissons",
            "slug": "boissons",
            "icon_name": "boissons",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Petit-déjeuner",
            "slug": "petit-dejeuner",
            "icon_name": "petit-dejeuner",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Apéritifs et bouchées",
            "slug": "aperitifs",
            "icon_name": "aperitifs",
        },
    ]

    # Insert categories with current timestamp
    from datetime import datetime
    now = datetime.utcnow()

    for category in categories:
        op.execute(
            f"""
            INSERT INTO categories (id, name, slug, icon_name, created_at)
            VALUES ('{category['id']}', '{category['name']}', '{category['slug']}',
                    '{category['icon_name']}', '{now}')
            """
        )

    # Add category_id column to recipes table
    # Note: SQLite doesn't support adding foreign key constraints via ALTER TABLE
    # The foreign key relationship is defined in the SQLAlchemy models
    op.add_column(
        "recipes",
        sa.Column("category_id", sa.String(36), nullable=True),
    )

    # Create index for category_id
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
