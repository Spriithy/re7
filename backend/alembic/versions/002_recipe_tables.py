"""Recipe tables

Revision ID: 002
Revises: 001
Create Date: 2025-01-21

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create recipes table
    op.create_table(
        "recipes",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_path", sa.String(500), nullable=True),
        sa.Column("prep_time_minutes", sa.Integer(), nullable=True),
        sa.Column("cook_time_minutes", sa.Integer(), nullable=True),
        sa.Column("servings", sa.Integer(), nullable=False, default=4),
        sa.Column("serving_unit", sa.String(50), nullable=True),
        sa.Column(
            "difficulty",
            sa.Enum("easy", "medium", "hard", name="difficulty"),
            nullable=False,
            default="medium",
        ),
        sa.Column("source", sa.String(500), nullable=True),
        sa.Column("author_id", sa.String(36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_recipes_author_id", "recipes", ["author_id"])
    op.create_index("ix_recipes_title", "recipes", ["title"])

    # Create ingredients table
    op.create_table(
        "ingredients",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "recipe_id",
            sa.String(36),
            sa.ForeignKey("recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("quantity", sa.Numeric(10, 3), nullable=True),
        sa.Column("unit", sa.String(50), nullable=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("is_scalable", sa.Boolean(), default=True, nullable=False),
        sa.Column("order", sa.Integer(), nullable=False, default=0),
    )
    op.create_index("ix_ingredients_recipe_id", "ingredients", ["recipe_id"])

    # Create steps table
    op.create_table(
        "steps",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "recipe_id",
            sa.String(36),
            sa.ForeignKey("recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("instruction", sa.Text(), nullable=False),
        sa.Column("timer_minutes", sa.Integer(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
    )
    op.create_index("ix_steps_recipe_id", "steps", ["recipe_id"])

    # Create recipe_prerequisites junction table
    op.create_table(
        "recipe_prerequisites",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "recipe_id",
            sa.String(36),
            sa.ForeignKey("recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "prerequisite_recipe_id",
            sa.String(36),
            sa.ForeignKey("recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("order", sa.Integer(), nullable=False, default=0),
        sa.Column("note", sa.Text(), nullable=True),
    )
    op.create_index("ix_recipe_prerequisites_recipe_id", "recipe_prerequisites", ["recipe_id"])
    op.create_index(
        "ix_recipe_prerequisites_prerequisite_recipe_id",
        "recipe_prerequisites",
        ["prerequisite_recipe_id"],
    )


def downgrade() -> None:
    op.drop_table("recipe_prerequisites")
    op.drop_table("steps")
    op.drop_table("ingredients")
    op.drop_table("recipes")
    op.execute("DROP TYPE IF EXISTS difficulty")
