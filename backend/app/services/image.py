import asyncio
import io
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image

from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_DIMENSION = 1920  # Max width or height
JPEG_QUALITY = 85  # Quality for JPEG compression
MAX_AVATAR_DIMENSION = 400  # Avatar images are smaller


def validate_image(file: UploadFile) -> str:
    """Validate an uploaded image file and return the extension."""
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

    return ext


def process_image(content: bytes, max_dimension: int = MAX_DIMENSION, force_jpeg: bool = True) -> bytes:
    """
    Process an image: resize if needed, convert to optimal format, compress.
    Returns the processed image bytes.
    """
    try:
        with Image.open(io.BytesIO(content)) as img:
            # Convert RGBA to RGB for JPEG
            if force_jpeg and img.mode in ("RGBA", "P"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # Resize if image is too large
            width, height = img.size
            if width > max_dimension or height > max_dimension:
                ratio = min(max_dimension / width, max_dimension / height)
                new_size = (int(width * ratio), int(height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)

            # Save to bytes with compression
            output = io.BytesIO()
            img.save(output, format="JPEG", quality=JPEG_QUALITY, optimize=True)
            return output.getvalue()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors du traitement de l'image: {str(e)}",
        ) from e


def validate_image_dimensions(content: bytes) -> tuple[int, int]:
    """Validate image dimensions and return (width, height)."""
    try:
        with Image.open(io.BytesIO(content)) as img:
            return img.size
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format d'image invalide: {str(e)}",
        ) from e


async def save_image(file: UploadFile, recipe_id: str) -> str:
    """
    Save an uploaded image to the uploads directory with optimization.
    Returns the relative path to the saved file.
    """
    ext = validate_image(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fichier trop volumineux. Taille maximale: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    # Process image (resize, compress, convert to JPEG)
    processed_content = await asyncio.to_thread(process_image, content, MAX_DIMENSION, True)

    # Generate unique filename (always .jpg after processing)
    filename = f"{recipe_id}_{uuid.uuid4().hex[:8]}.jpg"

    # Create recipe images directory if needed
    images_dir = settings.uploads_dir / "recipes"
    await asyncio.to_thread(images_dir.mkdir, parents=True, exist_ok=True)

    # Save file asynchronously
    file_path = images_dir / filename
    await asyncio.to_thread(file_path.write_bytes, processed_content)

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
    Save an uploaded avatar image to the uploads/avatars directory with optimization.
    Returns the relative path to the saved file.
    """
    ext = validate_image(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fichier trop volumineux. Taille maximale: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    # Process avatar (smaller max dimension)
    processed_content = await asyncio.to_thread(process_image, content, MAX_AVATAR_DIMENSION, True)

    # Generate unique filename (always .jpg after processing)
    filename = f"{user_id}_{uuid.uuid4().hex[:8]}.jpg"

    # Create avatars directory if needed
    avatars_dir = settings.uploads_dir / "avatars"
    await asyncio.to_thread(avatars_dir.mkdir, parents=True, exist_ok=True)

    # Save file asynchronously
    file_path = avatars_dir / filename
    await asyncio.to_thread(file_path.write_bytes, processed_content)

    # Return relative path from uploads directory
    return f"avatars/{filename}"


def delete_user_avatar(avatar_path: str) -> bool:
    """
    Delete an avatar image file from the uploads directory.
    Returns True if file was deleted, False if it didn't exist.
    """
    return delete_image(avatar_path)


async def save_category_image(file: UploadFile, category_id: str) -> str:
    """
    Save an uploaded image for a category to the uploads/categories directory with optimization.
    Returns the relative path to the saved file.
    """
    ext = validate_image(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fichier trop volumineux. Taille maximale: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    # Process image (same as recipe images)
    processed_content = await asyncio.to_thread(process_image, content, MAX_DIMENSION, True)

    # Generate unique filename (always .jpg after processing)
    filename = f"{category_id}_{uuid.uuid4().hex[:8]}.jpg"

    # Create categories directory if needed
    categories_dir = settings.uploads_dir / "categories"
    await asyncio.to_thread(categories_dir.mkdir, parents=True, exist_ok=True)

    # Save file asynchronously
    file_path = categories_dir / filename
    await asyncio.to_thread(file_path.write_bytes, processed_content)

    # Return relative path from uploads directory
    return f"categories/{filename}"


def delete_category_image(image_path: str) -> bool:
    """
    Delete a category image file from the uploads directory.
    Returns True if file was deleted, False if it didn't exist.
    """
    return delete_image(image_path)
