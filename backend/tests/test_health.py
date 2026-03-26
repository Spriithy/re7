import pytest

from app.core.config import settings


@pytest.mark.asyncio
async def test_health_ready_is_healthy_when_dependencies_work(client) -> None:
    response = await client.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "database": "ok",
        "uploads": "ok",
    }


@pytest.mark.asyncio
async def test_health_ready_fails_when_uploads_directory_is_missing(
    client,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
) -> None:
    missing_uploads_dir = tmp_path / "missing-uploads"
    monkeypatch.setattr(settings, "uploads_dir", missing_uploads_dir)

    response = await client.get("/health/ready")

    assert response.status_code == 503
    assert response.json()["uploads"] == "missing"


@pytest.mark.asyncio
async def test_health_ready_fails_when_database_is_unavailable(
    client,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class BrokenSessionFactory:
        def __call__(self):
            return self

        async def __aenter__(self):
            raise RuntimeError("db unavailable")

        async def __aexit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setattr("app.main.async_session_maker", BrokenSessionFactory())

    response = await client.get("/health/ready")

    assert response.status_code == 503
    assert response.json()["database"] == "error"
