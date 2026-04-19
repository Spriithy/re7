from app.core.config import settings
from app.services.bundled_uploads import sync_bundled_uploads


def test_sync_bundled_uploads_copies_missing_files(tmp_path, monkeypatch) -> None:
    bundled_uploads_dir = tmp_path / "bundled"
    uploads_dir = tmp_path / "uploads"
    bundled_file = bundled_uploads_dir / "categories" / "sample.jpg"

    bundled_file.parent.mkdir(parents=True, exist_ok=True)
    bundled_file.write_bytes(b"image-bytes")
    uploads_dir.mkdir(parents=True, exist_ok=True)

    monkeypatch.setattr(settings, "bundled_uploads_dir", bundled_uploads_dir)
    monkeypatch.setattr(settings, "uploads_dir", uploads_dir)

    copied_files = sync_bundled_uploads()

    assert copied_files == 1
    assert (uploads_dir / "categories" / "sample.jpg").read_bytes() == b"image-bytes"
