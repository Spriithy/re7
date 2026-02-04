import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    Boolean,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.category import Category


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Recipe(Base):
    __tablename__ = "recipes"

    # Indexes for frequently queried columns
    __table_args__ = (
        Index("idx_recipe_author", "author_id"),
        Index("idx_recipe_category", "category_id"),
        Index("idx_recipe_created", "created_at"),
        Index("idx_recipe_vegetarian", "is_vegetarian"),
        Index("idx_recipe_vegan", "is_vegan"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    prep_time_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cook_time_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    servings: Mapped[int] = mapped_column(Integer, nullable=False, default=4)
    serving_unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    difficulty: Mapped[Difficulty] = mapped_column(
        SQLEnum(Difficulty),
        nullable=False,
        default=Difficulty.medium,
    )
    source: Mapped[str | None] = mapped_column(String(500), nullable=True)
    author_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id"),
        nullable=False,
    )
    category_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
    )
    is_vegetarian: Mapped[bool] = mapped_column(Boolean, default=False)
    is_vegan: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationships
    author: Mapped["User"] = relationship("User", back_populates="recipes")
    category: Mapped["Category | None"] = relationship(
        "Category",
        back_populates="recipes",
    )
    ingredients: Mapped[list["Ingredient"]] = relationship(
        "Ingredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="Ingredient.order",
    )
    steps: Mapped[list["Step"]] = relationship(
        "Step",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="Step.order",
    )
    # Recipes this recipe requires as prerequisites
    prerequisites: Mapped[list["RecipePrerequisite"]] = relationship(
        "RecipePrerequisite",
        foreign_keys="RecipePrerequisite.recipe_id",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipePrerequisite.order",
    )
    # Recipes that require this recipe as a prerequisite
    required_by: Mapped[list["RecipePrerequisite"]] = relationship(
        "RecipePrerequisite",
        foreign_keys="RecipePrerequisite.prerequisite_recipe_id",
        back_populates="prerequisite_recipe",
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    recipe_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    quantity: Mapped[Decimal | None] = mapped_column(Numeric(10, 3), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    is_scalable: Mapped[bool] = mapped_column(Boolean, default=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Relationships
    recipe: Mapped["Recipe"] = relationship("Recipe", back_populates="ingredients")


class Step(Base):
    __tablename__ = "steps"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    recipe_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    instruction: Mapped[str] = mapped_column(Text, nullable=False)
    timer_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    recipe: Mapped["Recipe"] = relationship("Recipe", back_populates="steps")


class RecipePrerequisite(Base):
    __tablename__ = "recipe_prerequisites"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    recipe_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    prerequisite_recipe_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        foreign_keys=[recipe_id],
        back_populates="prerequisites",
    )
    prerequisite_recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        foreign_keys=[prerequisite_recipe_id],
        back_populates="required_by",
    )
