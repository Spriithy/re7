import logging
import os
import uuid
from contextlib import asynccontextmanager

from alembic.config import Config
from alembic.script import ScriptDirectory
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.api.routes import api_router
from app.core.config import settings
from app.core.database import async_session_maker, create_tables
from app.seeds.default_categories import seed_default_categories
from app.services.bundled_uploads import sync_bundled_uploads

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)


async def seed_default_data() -> None:
    async with async_session_maker() as session:
        created_categories = await seed_default_categories(session)
        if created_categories > 0:
            await session.commit()
            logger.info("seed_default_categories_created", extra={"count": created_categories})


def ensure_uploads_directory() -> None:
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    if not settings.uploads_dir.exists() or not settings.uploads_dir.is_dir():
        raise RuntimeError(f"Uploads directory is unavailable: {settings.uploads_dir}")
    if not os.access(settings.uploads_dir, os.W_OK):
        raise RuntimeError(f"Uploads directory is not writable: {settings.uploads_dir}")


async def verify_schema_state() -> None:
    if settings.should_bootstrap_schema:
        await create_tables()
        return

    script = ScriptDirectory.from_config(Config(str(settings.base_dir / "alembic.ini")))
    expected_revision = script.get_current_head()

    async with async_session_maker() as session:
        try:
            result = await session.execute(text("SELECT version_num FROM alembic_version"))
        except Exception as exc:
            raise RuntimeError(
                "Database schema is not initialized. Run `alembic upgrade head` before starting the app."
            ) from exc

        current_revision = result.scalar_one_or_none()
        if current_revision != expected_revision:
            raise RuntimeError(
                f"Database schema is out of date: current={current_revision!r}, expected={expected_revision!r}. "
                "Run `alembic upgrade head` before starting the app."
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "app_starting",
        extra={
            "environment": settings.environment,
            "app_public_origin": settings.app_public_origin,
            "api_public_origin": settings.api_public_origin,
        },
    )
    ensure_uploads_directory()
    sync_bundled_uploads()
    await verify_schema_state()

    if settings.should_seed_default_categories:
        await seed_default_data()

    logger.info("app_started")
    yield
    logger.info("app_stopped")


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

if settings.trusted_hosts:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.trusted_hosts,
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_logging(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    logger.info(
        "http_request",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
        },
    )
    return response


app.include_router(api_router, prefix="/api")
app.mount("/uploads", StaticFiles(directory=str(settings.uploads_dir)), name="uploads")


@app.get("/health/live")
async def health_live() -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "live"})


@app.get("/health/ready")
async def health_ready() -> JSONResponse:
    database_status = "ok"
    uploads_status = "ok"
    status_code = 200

    try:
        async with async_session_maker() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        database_status = "error"
        status_code = 503

    if not settings.uploads_dir.exists() or not settings.uploads_dir.is_dir():
        uploads_status = "missing"
        status_code = 503
    elif not os.access(settings.uploads_dir, os.W_OK):
        uploads_status = "not_writable"
        status_code = 503

    return JSONResponse(
        {
            "status": "ok" if status_code == 200 else "error",
            "database": database_status,
            "uploads": uploads_status,
        },
        status_code=status_code,
    )
