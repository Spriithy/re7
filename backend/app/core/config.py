from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "Re7"
    debug: bool = False
    environment: str = "development"  # "development" or "production"

    # Database
    database_url: str = "sqlite+aiosqlite:///./re7.db"

    # Security
    secret_key: str = "change-this-in-production-use-a-real-secret-key"
    algorithm: str = "HS256"
    access_token_expire_days: int = 365  # 1 year

    # Paths
    base_dir: Path = Path(__file__).resolve().parent.parent.parent
    uploads_dir: Path = base_dir / "uploads"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()

# Ensure uploads directory exists
settings.uploads_dir.mkdir(parents=True, exist_ok=True)
