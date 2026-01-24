from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.category import CategoryResponse


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


# Ingredient schemas
class IngredientBase(BaseModel):
    quantity: Decimal | None = None
    unit: str | None = None
    name: str = Field(..., min_length=1, max_length=200)
    is_scalable: bool = True


class IngredientCreate(IngredientBase):
    pass


class IngredientResponse(IngredientBase):
    id: str
    order: int

    model_config = {"from_attributes": True}


# Step schemas
class StepBase(BaseModel):
    instruction: str = Field(..., min_length=1)
    timer_minutes: int | None = Field(None, ge=1)
    note: str | None = None


class StepCreate(StepBase):
    pass


class StepResponse(StepBase):
    id: str
    order: int

    model_config = {"from_attributes": True}


# Prerequisite schemas
class PrerequisiteBase(BaseModel):
    prerequisite_recipe_id: str
    note: str | None = None


class PrerequisiteCreate(PrerequisiteBase):
    pass


class PrerequisiteResponse(PrerequisiteBase):
    id: str
    order: int
    prerequisite_recipe_title: str | None = None

    model_config = {"from_attributes": True}


# Author schema (minimal user info for recipe responses)
class RecipeAuthor(BaseModel):
    id: str
    username: str

    model_config = {"from_attributes": True}


# Recipe schemas
class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    prep_time_minutes: int | None = Field(None, ge=1)
    cook_time_minutes: int | None = Field(None, ge=1)
    servings: int = Field(4, ge=1)
    serving_unit: str | None = Field(None, max_length=50)
    difficulty: Difficulty = Difficulty.medium
    source: str | None = Field(None, max_length=500)
    is_vegetarian: bool = False
    is_vegan: bool = False


class RecipeCreate(RecipeBase):
    category_id: str | None = None
    ingredients: list[IngredientCreate] = Field(default_factory=list)
    steps: list[StepCreate] = Field(default_factory=list)
    prerequisites: list[PrerequisiteCreate] = Field(default_factory=list)


class RecipeUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    category_id: str | None = None
    prep_time_minutes: int | None = Field(None, ge=1)
    cook_time_minutes: int | None = Field(None, ge=1)
    servings: int | None = Field(None, ge=1)
    serving_unit: str | None = Field(None, max_length=50)
    difficulty: Difficulty | None = None
    source: str | None = Field(None, max_length=500)
    is_vegetarian: bool | None = None
    is_vegan: bool | None = None
    ingredients: list[IngredientCreate] | None = None
    steps: list[StepCreate] | None = None
    prerequisites: list[PrerequisiteCreate] | None = None


class RecipeResponse(RecipeBase):
    id: str
    image_path: str | None
    category: CategoryResponse | None
    author: RecipeAuthor
    ingredients: list[IngredientResponse]
    steps: list[StepResponse]
    prerequisites: list[PrerequisiteResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RecipeListItem(BaseModel):
    id: str
    title: str
    description: str | None
    image_path: str | None
    category: CategoryResponse | None
    prep_time_minutes: int | None
    cook_time_minutes: int | None
    servings: int
    serving_unit: str | None
    difficulty: Difficulty
    is_vegetarian: bool
    is_vegan: bool
    author: RecipeAuthor
    created_at: datetime

    model_config = {"from_attributes": True}


class RecipeListResponse(BaseModel):
    items: list[RecipeListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
