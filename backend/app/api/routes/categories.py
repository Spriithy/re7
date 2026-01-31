from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import CurrentAdmin, DbSession
from app.models.category import Category
from app.models.recipe import Recipe
from app.schemas.category import (
    CategoryResponse,
    CategoryCreate,
    CategoryUpdate,
    slugify,
)
from app.services.image import save_category_image, delete_category_image

router = APIRouter()


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[Category]:
    """
    Get all categories ordered by creation date.
    Public endpoint - no authentication required.
    """
    result = await db.execute(select(Category).order_by(Category.created_at))
    categories = result.scalars().all()
    return list(categories)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    admin: CurrentAdmin,
    db: DbSession,
) -> Category:
    """
    Create a new category.
    Admin only.
    """
    # Generate slug from name
    slug = slugify(data.name)

    # Check if name or slug already exists
    existing = await db.execute(
        select(Category).where(
            (Category.name == data.name) | (Category.slug == slug)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Une catégorie avec ce nom existe déjà",
        )

    category = Category(
        name=data.name,
        slug=slug,
        icon_name=data.icon_name,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    db: DbSession,
) -> Category:
    """
    Get a single category by ID.
    Public endpoint.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    data: CategoryUpdate,
    admin: CurrentAdmin,
    db: DbSession,
) -> Category:
    """
    Update a category.
    Admin only.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )

    # Update fields if provided
    if data.name is not None:
        new_slug = slugify(data.name)
        # Check if name or slug already exists (excluding current category)
        existing = await db.execute(
            select(Category).where(
                ((Category.name == data.name) | (Category.slug == new_slug))
                & (Category.id != category_id)
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Une catégorie avec ce nom existe déjà",
            )
        category.name = data.name
        category.slug = new_slug

    if data.icon_name is not None:
        category.icon_name = data.icon_name

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    admin: CurrentAdmin,
    db: DbSession,
) -> None:
    """
    Delete a category.
    Recipes in this category will become uncategorized.
    Admin only.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )

    # Delete category image if exists
    if category.image_path:
        delete_category_image(category.image_path)

    # Set category_id to NULL for all recipes in this category
    await db.execute(
        Recipe.__table__.update()
        .where(Recipe.category_id == category_id)
        .values(category_id=None)
    )

    await db.delete(category)
    await db.commit()


@router.post("/{category_id}/image", response_model=CategoryResponse)
async def upload_category_image(
    category_id: str,
    admin: CurrentAdmin,
    db: DbSession,
    file: UploadFile = File(...),
) -> Category:
    """
    Upload an image for a category.
    Admin only.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )

    # Delete old image if exists
    if category.image_path:
        delete_category_image(category.image_path)

    # Save new image
    image_path = await save_category_image(file, category_id)
    category.image_path = image_path

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/{category_id}/image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_image_endpoint(
    category_id: str,
    admin: CurrentAdmin,
    db: DbSession,
) -> None:
    """
    Delete the image for a category.
    Admin only.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )

    if category.image_path:
        delete_category_image(category.image_path)
        category.image_path = None
        await db.commit()


@router.get("/{category_id}/recipes/count")
async def get_category_recipe_count(
    category_id: str,
    db: DbSession,
) -> dict[str, int]:
    """
    Get the number of recipes in a category.
    Useful for delete confirmation.
    Public endpoint.
    """
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie non trouvée",
        )

    count_result = await db.execute(
        select(func.count()).select_from(Recipe).where(Recipe.category_id == category_id)
    )
    count = count_result.scalar() or 0

    return {"count": count}
