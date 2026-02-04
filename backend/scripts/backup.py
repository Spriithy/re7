#!/usr/bin/env python3
"""
SQLite database backup script for Re7.

Features:
- Creates compressed backups with VACUUM optimization
- Retains last 7 days of daily backups
- Retains last backup of each month
- Can be run manually or via cron/systemd timer

Usage:
    python scripts/backup.py
    
Cron setup (daily at 2 AM):
    0 2 * * * cd /path/to/backend && /path/to/python scripts/backup.py
"""

import gzip
import logging
import sqlite3
import sys
from datetime import datetime, timedelta
from pathlib import Path
from shutil import copy2

# Configuration
DB_FILE = Path("re7.db")
BACKUP_DIR = Path("backups")
DAILY_RETENTION_DAYS = 7

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


def ensure_backup_dir() -> Path:
    """Ensure backup directory exists."""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    return BACKUP_DIR


def create_vacuumed_backup(source_db: Path, backup_path: Path) -> None:
    """
    Create a backup with VACUUM optimization.
    VACUUM rebuilds the database, removing fragmentation and reducing size.
    """
    logger.info(f"Creating vacuumed backup: {backup_path}")
    
    # Connect to source database and create vacuumed copy
    conn = sqlite3.connect(str(source_db))
    try:
        # VACUUM INTO creates a fresh, optimized copy
        conn.execute(f"VACUUM INTO '{backup_path}'")
        conn.close()
        logger.info(f"Backup created successfully (size: {backup_path.stat().st_size / 1024:.1f} KB)")
    except Exception as e:
        conn.close()
        if backup_path.exists():
            backup_path.unlink()
        raise RuntimeError(f"Failed to create backup: {e}")


def compress_backup(backup_path: Path) -> Path:
    """Compress backup file using gzip."""
    compressed_path = backup_path.with_suffix(".db.gz")
    logger.info(f"Compressing backup to: {compressed_path}")
    
    with open(backup_path, "rb") as f_in:
        with gzip.open(compressed_path, "wb", compresslevel=6) as f_out:
            f_out.writelines(f_in)
    
    # Remove uncompressed backup
    backup_path.unlink()
    
    original_size = backup_path.stat().st_size if backup_path.exists() else 0
    compressed_size = compressed_path.stat().st_size
    ratio = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0
    
    logger.info(
        f"Compressed: {original_size / 1024:.1f} KB → {compressed_size / 1024:.1f} KB "
        f"({ratio:.1f}% reduction)"
    )
    
    return compressed_path


def is_monthly_backup(backup_date: datetime) -> bool:
    """Check if this is the last day of the month."""
    # Get the last day of this month
    if backup_date.month == 12:
        last_day = backup_date.replace(year=backup_date.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        last_day = backup_date.replace(month=backup_date.month + 1, day=1) - timedelta(days=1)
    
    return backup_date.day == last_day.day


def cleanup_old_backups(backup_dir: Path, current_date: datetime) -> None:
    """
    Clean up old backups based on retention policy:
    - Keep last 7 days
    - Keep last backup of each month
    """
    logger.info("Cleaning up old backups...")
    
    backup_pattern = "re7_*.db.gz"
    all_backups = sorted(backup_dir.glob(backup_pattern))
    
    if not all_backups:
        logger.info("No existing backups to clean up")
        return
    
    # Parse backup dates and categorize
    daily_cutoff = current_date - timedelta(days=DAILY_RETENTION_DAYS)
    
    backups_to_delete = []
    monthly_backups = {}  # year_month -> backup_path
    
    for backup_path in all_backups:
        # Parse date from filename: re7_YYYY-MM-DD.db.gz
        try:
            date_str = backup_path.stem.replace(".db", "").replace("re7_", "")
            backup_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            logger.warning(f"Skipping malformed backup filename: {backup_path.name}")
            continue
        
        # Check if it's a monthly backup (last day of month)
        if is_monthly_backup(backup_date):
            month_key = backup_date.strftime("%Y-%m")
            # Keep only the most recent backup for each month
            if month_key not in monthly_backups:
                monthly_backups[month_key] = backup_path
            else:
                # Compare and keep the newer one
                existing_date = datetime.strptime(
                    monthly_backups[month_key].stem.replace(".db", "").replace("re7_", ""),
                    "%Y-%m-%d"
                )
                if backup_date > existing_date:
                    backups_to_delete.append(monthly_backups[month_key])
                    monthly_backups[month_key] = backup_path
                else:
                    backups_to_delete.append(backup_path)
        elif backup_date < daily_cutoff:
            # Older than 7 days and not a monthly backup
            backups_to_delete.append(backup_path)
    
    # Delete old backups
    deleted_count = 0
    for backup_path in backups_to_delete:
        try:
            backup_path.unlink()
            logger.info(f"Deleted old backup: {backup_path.name}")
            deleted_count += 1
        except Exception as e:
            logger.error(f"Failed to delete {backup_path.name}: {e}")
    
    logger.info(f"Cleanup complete. Deleted {deleted_count} old backups, kept {len(all_backups) - deleted_count}")


def run_backup() -> None:
    """Main backup routine."""
    current_date = datetime.now()
    date_str = current_date.strftime("%Y-%m-%d")
    
    logger.info(f"Starting backup process for {date_str}")
    
    # Check source database exists
    if not DB_FILE.exists():
        logger.error(f"Database file not found: {DB_FILE}")
        sys.exit(1)
    
    # Ensure backup directory
    backup_dir = ensure_backup_dir()
    
    # Create backup filename
    backup_filename = f"re7_{date_str}.db"
    backup_path = backup_dir / backup_filename
    
    # Skip if backup already exists for today
    compressed_path = backup_path.with_suffix(".db.gz")
    if compressed_path.exists():
        logger.info(f"Backup already exists for today: {compressed_path.name}")
        cleanup_old_backups(backup_dir, current_date)
        logger.info("Backup process completed (skipped creation)")
        return
    
    try:
        # Create vacuumed backup
        create_vacuumed_backup(DB_FILE, backup_path)
        
        # Compress the backup
        compress_backup(backup_path)
        
        # Clean up old backups
        cleanup_old_backups(backup_dir, current_date)
        
        logger.info("Backup process completed successfully")
        
    except Exception as e:
        logger.error(f"Backup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    run_backup()
