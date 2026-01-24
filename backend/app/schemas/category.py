from datetime import datetime
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    slug: str
    icon_name: str


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
