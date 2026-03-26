from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.api.routes import api_router
from app.core.config import settings
from app.core.database import async_session_maker, create_tables
from app.core.security import get_password_hash
from app.models.user import User
from app.seeds.default_categories import seed_default_categories


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


async def seed_default_data():
    async with async_session_maker() as session:
        created_categories = await seed_default_categories(session)
        if created_categories > 0:
            await session.commit()
            print(f"Seeded {created_categories} default categories")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo user
    await create_tables()
    await seed_default_data()
    await seed_demo_user()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

if settings.trusted_hosts:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.trusted_hosts,
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
