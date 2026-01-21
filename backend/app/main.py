from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.api.routes import api_router
from app.core.config import settings
from app.core.database import async_session_maker, create_tables
from app.core.security import get_password_hash
from app.models.user import User


async def seed_demo_user():
    """Create demo/demo123 account in non-production environments."""
    if settings.environment == "production":
        return

    async with async_session_maker() as session:
        result = await session.execute(select(User).where(User.username == "theo"))
        existing = result.scalar_one_or_none()

        if existing is None:
            theo_user = User(
                username="theo",
                password_hash=get_password_hash("theo123"),
                is_admin=True,
            )
            session.add(theo_user)
            await session.commit()
            print("Demo account created (theo/theo123)")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo user
    await create_tables()
    await seed_demo_user()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Mount uploads directory for serving images
app.mount("/uploads", StaticFiles(directory=str(settings.uploads_dir)), name="uploads")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
