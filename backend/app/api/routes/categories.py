from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse

router = APIRouter()


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[Category]:
    """
    Get all categories ordered by frequency (insertion order).
    Public endpoint - no authentication required.
    """
    from sqlalchemy import select

    result = await db.execute(select(Category).order_by(Category.created_at))
    categories = result.scalars().all()
    return list(categories)
