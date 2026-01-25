import uuid
from pathlib import Path

from fastapi import UploadFile, HTTPException, status

from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_image(file: UploadFile) -> None:
    """Validate an uploaded image file."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nom de fichier manquant",
        )

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type de fichier non autorisé. Extensions acceptées: {', '.join(ALLOWED_EXTENSIONS)}",
        )


async def save_image(file: UploadFile, recipe_id: str) -> str:
    """
    Save an uploaded image to the uploads directory.
    Returns the relative path to the saved file.
    """
    validate_image(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fichier trop volumineux. Taille maximale: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    # Generate unique filename
    ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
    filename = f"{recipe_id}_{uuid.uuid4().hex[:8]}{ext}"

    # Create recipe images directory if needed
    images_dir = settings.uploads_dir / "recipes"
    images_dir.mkdir(parents=True, exist_ok=True)

    # Save file
    file_path = images_dir / filename
    file_path.write_bytes(content)

    # Return relative path from uploads directory
    return f"recipes/{filename}"


def delete_image(image_path: str) -> bool:
    """
    Delete an image file from the uploads directory.
    Returns True if file was deleted, False if it didn't exist.
    """
    if not image_path:
        return False

    full_path = settings.uploads_dir / image_path
    if full_path.exists():
        full_path.unlink()
        return True
    return False


def get_image_url(image_path: str | None) -> str | None:
    """
    Convert a relative image path to a full URL.
    Returns None if no image path is provided.
    """
    if not image_path:
        return None
    return f"/uploads/{image_path}"


async def save_user_avatar(file: UploadFile, user_id: str) -> str:
    """
    Save an uploaded avatar image to the uploads/avatars directory.
    Returns the relative path to the saved file.
    """
    validate_image(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fichier trop volumineux. Taille maximale: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    # Generate unique filename
    ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
    filename = f"{user_id}_{uuid.uuid4().hex[:8]}{ext}"

    # Create avatars directory if needed
    avatars_dir = settings.uploads_dir / "avatars"
    avatars_dir.mkdir(parents=True, exist_ok=True)

    # Save file
    file_path = avatars_dir / filename
    file_path.write_bytes(content)

    # Return relative path from uploads directory
    return f"avatars/{filename}"


def delete_user_avatar(avatar_path: str) -> bool:
    """
    Delete an avatar image file from the uploads directory.
    Returns True if file was deleted, False if it didn't exist.
    """
    return delete_image(avatar_path)
