from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import event
from unidecode import unidecode

from app.core.config import settings


def normalize_text(text: str | None) -> str:
    """
    Normalize text for accent-insensitive search.
    Uses unidecode for robust French character handling.
    Examples:
        "Crème brûlée" -> "creme brulee"
        "Bœuf Bourguignon" -> "boeuf bourguignon"
        "Café" -> "cafe"
    """
    if text is None:
        return ""
    # unidecode handles all Unicode characters including French ligatures
    normalized = unidecode(text)
    return normalized.lower()


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
)


# Enable WAL mode and optimized SQLite settings
@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    
    # Core settings (already present)
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    
    # Performance optimizations
    cursor.execute("PRAGMA busy_timeout=5000")  # Wait up to 5s if DB is locked
    cursor.execute("PRAGMA cache_size=-64000")  # 64MB cache (negative = pages, 25MB total)
    cursor.execute("PRAGMA temp_store=memory")  # Store temp tables in RAM
    cursor.execute("PRAGMA mmap_size=268435456")  # 256MB memory-mapped I/O
    
    cursor.close()
    # Register normalize_text function for accent-insensitive search
    dbapi_connection.create_function("normalize_text", 1, normalize_text)


async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
