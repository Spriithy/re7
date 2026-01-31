import re
import unicodedata
from datetime import datetime
from pydantic import BaseModel, field_validator


def slugify(text: str) -> str:
    """
    Convert a French text to a URL-friendly slug.
    Examples:
        "Entrées" -> "entrees"
        "Soupes & Potages" -> "soupes-potages"
        "Petit-déjeuner" -> "petit-dejeuner"
    """
    # Normalize unicode characters (é -> e, etc.)
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special chars with hyphens
    text = re.sub(r"[^a-z0-9]+", "-", text)
    # Remove leading/trailing hyphens
    text = text.strip("-")
    return text


class CategoryBase(BaseModel):
    name: str
    slug: str
    icon_name: str


class CategoryCreate(BaseModel):
    name: str
    icon_name: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Le nom de la catégorie ne peut pas être vide")
        return v.strip()


class CategoryUpdate(BaseModel):
    name: str | None = None
    icon_name: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Le nom de la catégorie ne peut pas être vide")
        return v.strip() if v else None


class CategoryResponse(CategoryBase):
    id: str
    image_path: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
