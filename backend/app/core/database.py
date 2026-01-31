import unicodedata
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import event

from app.core.config import settings


def normalize_text(text: str | None) -> str:
    """
    Normalize text for accent-insensitive search.
    Removes accents and converts to lowercase.
    Examples:
        "Crème brûlée" -> "creme brulee"
        "Bœuf Bourguignon" -> "boeuf bourguignon"
    """
    if text is None:
        return ""
    # Handle French ligatures that don't decompose with NFKD
    text = text.replace("œ", "oe").replace("Œ", "OE")
    text = text.replace("æ", "ae").replace("Æ", "AE")
    # Normalize unicode characters (é -> e, etc.)
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    return text.lower()


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
)


# Enable WAL mode for SQLite and register custom functions
@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.execute("PRAGMA foreign_keys=ON")
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
