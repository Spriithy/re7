import gzip
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

from app.core.config import settings
from scripts.backup import cleanup_old_backups, run_backup


def create_sqlite_db(path: Path) -> None:
    connection = sqlite3.connect(path)
    try:
        connection.execute("CREATE TABLE example (id INTEGER PRIMARY KEY, value TEXT)")
        connection.execute("INSERT INTO example (value) VALUES ('hello')")
        connection.commit()
    finally:
        connection.close()


def touch(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"test")


def test_backup_creates_database_and_uploads_artifacts(
    monkeypatch,
    tmp_path: Path,
) -> None:
    database_path = tmp_path / "data" / "re7.db"
    database_path.parent.mkdir(parents=True, exist_ok=True)
    create_sqlite_db(database_path)

    uploads_dir = tmp_path / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    (uploads_dir / "recipes").mkdir()
    (uploads_dir / "recipes" / "dish.txt").write_text("soup", encoding="utf-8")

    backup_dir = tmp_path / "backups"
    monkeypatch.setattr(settings, "backup_dir", backup_dir)
    monkeypatch.setattr(settings, "uploads_dir", uploads_dir)
    monkeypatch.setattr(settings, "sqlite_database_path", database_path)

    run_backup()

    today = datetime.now().strftime("%Y-%m-%d")
    db_backup = backup_dir / f"re7_{today}.db.gz"
    uploads_backup = backup_dir / f"re7_uploads_{today}.tar.gz"

    assert db_backup.exists()
    assert uploads_backup.exists()

    with gzip.open(db_backup, "rb") as handle:
        assert handle.read(16)


def test_backup_cleanup_keeps_recent_and_monthly_artifacts(tmp_path: Path) -> None:
    current_date = datetime(2026, 3, 26)
    recent = tmp_path / "re7_2026-03-25.db.gz"
    old_daily = tmp_path / "re7_2026-03-10.db.gz"
    monthly = tmp_path / "re7_2026-02-28.db.gz"

    touch(recent)
    touch(old_daily)
    touch(monthly)

    cleanup_old_backups(tmp_path, "re7_", ".db.gz", current_date)

    assert recent.exists()
    assert not old_daily.exists()
    assert monthly.exists()
