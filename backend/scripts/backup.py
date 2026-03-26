#!/usr/bin/env python3
"""Backup the SQLite database and uploads directory."""

import gzip
import logging
import shutil
import sqlite3
import sys
import tarfile
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings

DAILY_RETENTION_DAYS = 7
BACKUP_PREFIXES = ("re7_", "re7_uploads_")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def ensure_backup_dir() -> Path:
    settings.backup_dir.mkdir(parents=True, exist_ok=True)
    return settings.backup_dir


def is_monthly_backup(backup_date: datetime) -> bool:
    if backup_date.month == 12:
        next_month = backup_date.replace(year=backup_date.year + 1, month=1, day=1)
    else:
        next_month = backup_date.replace(month=backup_date.month + 1, day=1)
    return backup_date.day == (next_month - timedelta(days=1)).day


def parse_backup_date(artifact: Path, prefix: str, suffix: str) -> datetime | None:
    name = artifact.name
    if not name.startswith(prefix) or not name.endswith(suffix):
        return None
    date_str = name.removeprefix(prefix).removesuffix(suffix)
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return None


def cleanup_old_backups(backup_dir: Path, prefix: str, suffix: str, current_date: datetime) -> None:
    artifacts = sorted(backup_dir.glob(f"{prefix}*{suffix}"))
    if not artifacts:
        return

    daily_cutoff = current_date - timedelta(days=DAILY_RETENTION_DAYS)
    monthly_kept: dict[str, Path] = {}
    to_delete: list[Path] = []

    for artifact in artifacts:
        backup_date = parse_backup_date(artifact, prefix, suffix)
        if backup_date is None:
            logger.warning("backup_cleanup_skip_malformed name=%s", artifact.name)
            continue

        if backup_date >= daily_cutoff:
            continue

        if is_monthly_backup(backup_date):
            month_key = backup_date.strftime("%Y-%m")
            existing = monthly_kept.get(month_key)
            if existing is None:
                monthly_kept[month_key] = artifact
            else:
                existing_date = parse_backup_date(existing, prefix, suffix)
                if existing_date is not None and backup_date > existing_date:
                    to_delete.append(existing)
                    monthly_kept[month_key] = artifact
                else:
                    to_delete.append(artifact)
            continue

        to_delete.append(artifact)

    for artifact in to_delete:
        artifact.unlink(missing_ok=True)
        logger.info("backup_cleanup_deleted name=%s", artifact.name)


def create_database_backup(output_path: Path) -> None:
    source_db = settings.sqlite_database_path
    if not source_db.exists():
        raise RuntimeError(f"Database file not found: {source_db}")

    temp_db_path = output_path.with_suffix(".db")
    conn = sqlite3.connect(str(source_db))
    try:
        conn.execute(f"VACUUM INTO '{temp_db_path}'")
    finally:
        conn.close()

    with temp_db_path.open("rb") as source, gzip.open(output_path, "wb", compresslevel=6) as target:
        shutil.copyfileobj(source, target)
    temp_db_path.unlink(missing_ok=True)


def create_uploads_backup(output_path: Path) -> None:
    if not settings.uploads_dir.exists():
        raise RuntimeError(f"Uploads directory not found: {settings.uploads_dir}")

    with tarfile.open(output_path, "w:gz") as archive:
        archive.add(settings.uploads_dir, arcname="uploads")


def run_backup() -> None:
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    backup_dir = ensure_backup_dir()
    db_output = backup_dir / f"re7_{date_str}.db.gz"
    uploads_output = backup_dir / f"re7_uploads_{date_str}.tar.gz"

    if db_output.exists() and uploads_output.exists():
        logger.info("backup_skip_existing date=%s", date_str)
    else:
        create_database_backup(db_output)
        create_uploads_backup(uploads_output)
        logger.info(
            "backup_completed date=%s db=%s uploads=%s",
            date_str,
            db_output,
            uploads_output,
        )

    cleanup_old_backups(backup_dir, "re7_", ".db.gz", now)
    cleanup_old_backups(backup_dir, "re7_uploads_", ".tar.gz", now)


if __name__ == "__main__":
    try:
        run_backup()
    except Exception as exc:
        logger.exception("backup_failed error=%s", exc)
        sys.exit(1)
