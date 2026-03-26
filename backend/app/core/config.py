import json
from pathlib import Path
from typing import Annotated, Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


def parse_str_list(value: Any) -> list[str]:
    if value is None:
        return []

    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]

    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return []

        if stripped.startswith("["):
            parsed = json.loads(stripped)
            if not isinstance(parsed, list):
                raise ValueError("Expected a JSON array")
            return [str(item).strip() for item in parsed if str(item).strip()]

        return [item.strip() for item in stripped.split(",") if item.strip()]

    raise ValueError("Expected a list or string")


class Settings(BaseSettings):
    # App
    app_name: str = "Re7"
    debug: bool = False
    environment: str = "development"  # "development" or "production"
    backend_port: int = 8000

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/re7.db"

    # Security
    secret_key: str = "change-this-in-production-use-a-real-secret-key"
    algorithm: str = "HS256"
    access_token_expire_days: int = 365  # 1 year
    workos_client_id: str = ""
    workos_api_key: str = ""

    # Paths
    base_dir: Path = Path(__file__).resolve().parent.parent.parent
    app_public_origin: str = "http://localhost:3000"
    api_public_origin: str = "http://localhost:8000"
    uploads_dir: Path = base_dir / "uploads"

    # CORS
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]
    trusted_hosts: Annotated[list[str], NoDecode] = ["localhost", "127.0.0.1"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("cors_origins", "trusted_hosts", mode="before")
    @classmethod
    def validate_string_list(cls, value: Any) -> list[str]:
        return parse_str_list(value)


settings = Settings()

# Ensure uploads directory exists
settings.uploads_dir.mkdir(parents=True, exist_ok=True)
