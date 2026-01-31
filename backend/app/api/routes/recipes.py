from math import ceil

from fastapi import APIRouter, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.api.deps import CurrentUser, DbSession
from app.core.database import normalize_text
from app.models.category import Category
from app.models.recipe import Ingredient, Recipe, RecipePrerequisite, Step
from app.schemas.recipe import (
    PrerequisiteResponse,
    RecipeCreate,
    RecipeListItem,
    RecipeListResponse,
    RecipeResponse,
    RecipeUpdate,
)
from app.services.image import delete_image, save_image

router = APIRouter()


def build_prerequisite_response(prereq: RecipePrerequisite) -> PrerequisiteResponse:
    """Build a prerequisite response with the prerequisite recipe title."""
    return PrerequisiteResponse(
        id=prereq.id,
        prerequisite_recipe_id=prereq.prerequisite_recipe_id,
        note=prereq.note,
        order=prereq.order,
        prerequisite_recipe_title=prereq.prerequisite_recipe.title
        if prereq.prerequisite_recipe
        else None,
    )


def build_recipe_response(recipe: Recipe) -> RecipeResponse:
    """Build a recipe response from a Recipe model."""
    return RecipeResponse(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        image_path=recipe.image_path,
        category=recipe.category,
        prep_time_minutes=recipe.prep_time_minutes,
        cook_time_minutes=recipe.cook_time_minutes,
        servings=recipe.servings,
        serving_unit=recipe.serving_unit,
        difficulty=recipe.difficulty,
        source=recipe.source,
        is_vegetarian=recipe.is_vegetarian,
        is_vegan=recipe.is_vegan,
        author=recipe.author,
        ingredients=recipe.ingredients,
        steps=recipe.steps,
        prerequisites=[build_prerequisite_response(p) for p in recipe.prerequisites],
        created_at=recipe.created_at,
        updated_at=recipe.updated_at,
    )


@router.post("", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    data: RecipeCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> RecipeResponse:
    """Create a new recipe."""
    # Validate category if provided
    if data.category_id:
        category = await db.get(Category, data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Catégorie non trouvée",
            )

    # Create the recipe
    recipe = Recipe(
        title=data.title,
        description=data.description,
        category_id=data.category_id,
        prep_time_minutes=data.prep_time_minutes,
        cook_time_minutes=data.cook_time_minutes,
        servings=data.servings,
        serving_unit=data.serving_unit,
        difficulty=data.difficulty,
        source=data.source,
        is_vegetarian=data.is_vegetarian,
        is_vegan=data.is_vegan,
        author_id=current_user.id,
    )
    db.add(recipe)
    await db.flush()  # Get the recipe ID

    # Add ingredients
    for i, ing_data in enumerate(data.ingredients):
        ingredient = Ingredient(
            recipe_id=recipe.id,
            quantity=ing_data.quantity,
            unit=ing_data.unit,
            name=ing_data.name,
            is_scalable=ing_data.is_scalable,
            order=i,
        )
        db.add(ingredient)

    # Add steps
    for i, step_data in enumerate(data.steps):
        step = Step(
            recipe_id=recipe.id,
            order=i,
            instruction=step_data.instruction,
            timer_minutes=step_data.timer_minutes,
            note=step_data.note,
        )
        db.add(step)

    # Add prerequisites
    for i, prereq_data in enumerate(data.prerequisites):
        # Verify the prerequisite recipe exists
        prereq_recipe = await db.get(Recipe, prereq_data.prerequisite_recipe_id)
        if not prereq_recipe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Recette prérequise non trouvée: {prereq_data.prerequisite_recipe_id}",
            )
        prereq = RecipePrerequisite(
            recipe_id=recipe.id,
            prerequisite_recipe_id=prereq_data.prerequisite_recipe_id,
            order=i,
            note=prereq_data.note,
        )
        db.add(prereq)

    await db.commit()

    # Reload with relationships
    result = await db.execute(
        select(Recipe)
        .options(
            selectinload(Recipe.author),
            selectinload(Recipe.category),
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.prerequisites).selectinload(
                RecipePrerequisite.prerequisite_recipe
            ),
        )
        .where(Recipe.id == recipe.id)
    )
    recipe = result.scalar_one()

    return build_recipe_response(recipe)


@router.get("", response_model=RecipeListResponse)
async def list_recipes(
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    author_id: str | None = Query(None),
    category_id: str | None = Query(None),
    is_vegetarian: bool | None = Query(None),
    is_vegan: bool | None = Query(None),
) -> RecipeListResponse:
    """List recipes with pagination."""
    # Base query
    query = select(Recipe).options(
        selectinload(Recipe.author),
        selectinload(Recipe.category),
    )

    # Apply filters (accent-insensitive search using normalize_text SQL function)
    if search:
        normalized_search = normalize_text(search)
        query = query.where(
            func.normalize_text(Recipe.title).contains(normalized_search)
        )
    if author_id:
        query = query.where(Recipe.author_id == author_id)
    if category_id:
        query = query.where(Recipe.category_id == category_id)
    if is_vegetarian is not None:
        query = query.where(Recipe.is_vegetarian == is_vegetarian)
    if is_vegan is not None:
        query = query.where(Recipe.is_vegan == is_vegan)

    # Count total
    count_query = select(func.count(Recipe.id))
    if search:
        count_query = count_query.where(
            func.normalize_text(Recipe.title).contains(normalized_search)
        )
    if author_id:
        count_query = count_query.where(Recipe.author_id == author_id)
    if category_id:
        count_query = count_query.where(Recipe.category_id == category_id)
    if is_vegetarian is not None:
        count_query = count_query.where(Recipe.is_vegetarian == is_vegetarian)
    if is_vegan is not None:
        count_query = count_query.where(Recipe.is_vegan == is_vegan)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(Recipe.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    recipes = result.scalars().all()

    return RecipeListResponse(
        items=[
            RecipeListItem(
                id=r.id,
                title=r.title,
                description=r.description,
                image_path=r.image_path,
                category=r.category,
                prep_time_minutes=r.prep_time_minutes,
                cook_time_minutes=r.cook_time_minutes,
                servings=r.servings,
                serving_unit=r.serving_unit,
                difficulty=r.difficulty,
                is_vegetarian=r.is_vegetarian,
                is_vegan=r.is_vegan,
                author=r.author,
                created_at=r.created_at,
            )
            for r in recipes
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    db: DbSession,
) -> RecipeResponse:
    """Get a single recipe by ID."""
    result = await db.execute(
        select(Recipe)
        .options(
            selectinload(Recipe.author),
            selectinload(Recipe.category),
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.prerequisites).selectinload(
                RecipePrerequisite.prerequisite_recipe
            ),
        )
        .where(Recipe.id == recipe_id)
    )
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée",
        )

    return build_recipe_response(recipe)


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    data: RecipeUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> RecipeResponse:
    """Update a recipe. Only the author can update."""
    result = await db.execute(
        select(Recipe)
        .options(
            selectinload(Recipe.author),
            selectinload(Recipe.category),
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.prerequisites).selectinload(
                RecipePrerequisite.prerequisite_recipe
            ),
        )
        .where(Recipe.id == recipe_id)
    )
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée",
        )

    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres recettes",
        )

    # Validate category if provided
    update_data = data.model_dump(exclude_unset=True)
    if "category_id" in update_data and update_data["category_id"] is not None:
        category = await db.get(Category, update_data["category_id"])
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Catégorie non trouvée",
            )

    # Update basic fields
    for field in [
        "title",
        "description",
        "category_id",
        "prep_time_minutes",
        "cook_time_minutes",
        "servings",
        "serving_unit",
        "difficulty",
        "source",
        "is_vegetarian",
        "is_vegan",
    ]:
        if field in update_data:
            setattr(recipe, field, update_data[field])

    # Update ingredients if provided
    if data.ingredients is not None:
        # Delete existing ingredients
        for ing in recipe.ingredients:
            await db.delete(ing)

        # Add new ingredients
        for i, ing_data in enumerate(data.ingredients):
            ingredient = Ingredient(
                recipe_id=recipe.id,
                quantity=ing_data.quantity,
                unit=ing_data.unit,
                name=ing_data.name,
                is_scalable=ing_data.is_scalable,
                order=i,
            )
            db.add(ingredient)

    # Update steps if provided
    if data.steps is not None:
        # Delete existing steps
        for step in recipe.steps:
            await db.delete(step)

        # Add new steps
        for i, step_data in enumerate(data.steps):
            step = Step(
                recipe_id=recipe.id,
                order=i,
                instruction=step_data.instruction,
                timer_minutes=step_data.timer_minutes,
                note=step_data.note,
            )
            db.add(step)

    # Update prerequisites if provided
    if data.prerequisites is not None:
        # Delete existing prerequisites
        for prereq in recipe.prerequisites:
            await db.delete(prereq)

        # Add new prerequisites
        for i, prereq_data in enumerate(data.prerequisites):
            # Verify the prerequisite recipe exists
            prereq_recipe = await db.get(Recipe, prereq_data.prerequisite_recipe_id)
            if not prereq_recipe:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Recette prérequise non trouvée: {prereq_data.prerequisite_recipe_id}",
                )
            prereq = RecipePrerequisite(
                recipe_id=recipe.id,
                prerequisite_recipe_id=prereq_data.prerequisite_recipe_id,
                order=i,
                note=prereq_data.note,
            )
            db.add(prereq)

    await db.commit()

    # Reload with relationships
    result = await db.execute(
        select(Recipe)
        .options(
            selectinload(Recipe.author),
            selectinload(Recipe.category),
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.prerequisites).selectinload(
                RecipePrerequisite.prerequisite_recipe
            ),
        )
        .where(Recipe.id == recipe.id)
    )
    recipe = result.scalar_one()

    return build_recipe_response(recipe)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    db: DbSession,
    current_user: CurrentUser,
) -> None:
    """Delete a recipe. Only the author can delete."""
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée",
        )

    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez supprimer que vos propres recettes",
        )

    # Delete image if exists
    if recipe.image_path:
        delete_image(recipe.image_path)

    await db.delete(recipe)
    await db.commit()


@router.post("/{recipe_id}/image", response_model=RecipeResponse)
async def upload_recipe_image(
    recipe_id: str,
    file: UploadFile,
    db: DbSession,
    current_user: CurrentUser,
) -> RecipeResponse:
    """Upload an image for a recipe. Only the author can upload."""
    result = await db.execute(
        select(Recipe)
        .options(
            selectinload(Recipe.author),
            selectinload(Recipe.category),
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.prerequisites).selectinload(
                RecipePrerequisite.prerequisite_recipe
            ),
        )
        .where(Recipe.id == recipe_id)
    )
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée",
        )

    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres recettes",
        )

    # Delete old image if exists
    if recipe.image_path:
        delete_image(recipe.image_path)

    # Save new image
    image_path = await save_image(file, recipe_id)
    recipe.image_path = image_path

    await db.commit()

    return build_recipe_response(recipe)


@router.delete("/{recipe_id}/image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe_image(
    recipe_id: str,
    db: DbSession,
    current_user: CurrentUser,
) -> None:
    """Delete the image for a recipe. Only the author can delete."""
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée",
        )

    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres recettes",
        )

    if recipe.image_path:
        delete_image(recipe.image_path)
        recipe.image_path = None
        await db.commit()
