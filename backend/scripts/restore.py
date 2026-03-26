#!/usr/bin/env python3
"""Restore a backup pair into the configured database and uploads paths."""

import argparse
import gzip
import logging
import shutil
import sys
import tarfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def restore_database(db_backup: Path) -> None:
    settings.sqlite_database_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = settings.sqlite_database_path.with_suffix(".restore")
    with gzip.open(db_backup, "rb") as source, temp_path.open("wb") as target:
        shutil.copyfileobj(source, target)
    temp_path.replace(settings.sqlite_database_path)
    logger.info("restore_database_completed source=%s", db_backup)


def restore_uploads(uploads_backup: Path) -> None:
    if settings.uploads_dir.exists():
        shutil.rmtree(settings.uploads_dir)
    settings.uploads_dir.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(uploads_backup, "r:gz") as archive:
        archive.extractall(settings.uploads_dir.parent)
    logger.info("restore_uploads_completed source=%s", uploads_backup)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-backup", type=Path)
    parser.add_argument("--uploads-backup", type=Path)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    if args.db_backup is None and args.uploads_backup is None:
        raise SystemExit("Provide --db-backup, --uploads-backup, or both.")
    if args.db_backup is not None:
        restore_database(args.db_backup)
    if args.uploads_backup is not None:
        restore_uploads(args.uploads_backup)
