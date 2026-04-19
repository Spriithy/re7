import logging
import shutil
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)


def sync_bundled_uploads() -> int:
    source_root = settings.bundled_uploads_dir
    destination_root = settings.uploads_dir

    if not source_root.exists() or not source_root.is_dir():
        return 0

    try:
        if source_root.resolve() == destination_root.resolve():
            return 0
    except FileNotFoundError:
        # The destination may not exist yet; the startup flow creates it first.
        pass

    copied_files = 0

    for source_path in source_root.rglob("*"):
        if not source_path.is_file():
            continue

        relative_path = source_path.relative_to(source_root)
        destination_path = destination_root / relative_path

        if destination_path.exists():
            continue

        destination_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_path, destination_path)
        copied_files += 1

    if copied_files > 0:
        logger.info(
            "bundled_uploads_synced",
            extra={
                "copied_files": copied_files,
                "source": str(source_root),
                "destination": str(destination_root),
            },
        )

    return copied_files
