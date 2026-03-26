import json
import os
from functools import cached_property
from pathlib import Path
from typing import Annotated, Any
from urllib.parse import urlparse

from pydantic import field_validator, model_validator
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
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30
    access_cookie_name: str = "re7_access"
    refresh_cookie_name: str = "re7_refresh"
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    cookie_domain: str | None = None
    workos_client_id: str = ""
    workos_api_key: str = ""

    # Paths
    base_dir: Path = Path(__file__).resolve().parent.parent.parent
    app_public_origin: str = "http://localhost:3000"
    api_public_origin: str = "http://localhost:8000"
    uploads_dir: Path = base_dir / "uploads"
    backup_dir: Path = base_dir / "backups"
    seed_default_categories_on_startup: bool = False

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

    @field_validator("cookie_samesite")
    @classmethod
    def validate_cookie_samesite(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in {"lax", "strict", "none"}:
            raise ValueError("cookie_samesite must be one of: lax, strict, none")
        return normalized

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        if self.environment != "production":
            return self

        if self.secret_key == "change-this-in-production-use-a-real-secret-key":
            raise ValueError("SECRET_KEY must be set in production")

        if not self.cookie_secure:
            raise ValueError("COOKIE_SECURE must be true in production")

        if not self.cors_origins:
            raise ValueError("CORS_ORIGINS must not be empty in production")

        if not self.trusted_hosts:
            raise ValueError("TRUSTED_HOSTS must not be empty in production")

        app_origin = self.app_public_origin.lower()
        api_origin = self.api_public_origin.lower()
        if not app_origin.startswith("https://"):
            raise ValueError("APP_PUBLIC_ORIGIN must use HTTPS in production")
        if not api_origin.startswith("https://"):
            raise ValueError("API_PUBLIC_ORIGIN must use HTTPS in production")

        return self

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @cached_property
    def sqlite_database_path(self) -> Path:
        parsed = urlparse(self.database_url)

        if parsed.scheme not in {"sqlite+aiosqlite", "sqlite"}:
            raise ValueError("Only SQLite database URLs are supported")

        if not parsed.path:
            raise ValueError("DATABASE_URL is missing a database path")

        raw_path = parsed.path
        if raw_path.startswith("///"):
            raw_path = raw_path[2:]

        db_path = Path(raw_path)
        if not db_path.is_absolute():
            db_path = (self.base_dir / db_path).resolve()
        return db_path

    @property
    def should_bootstrap_schema(self) -> bool:
        return not self.is_production and os.getenv("AUTO_CREATE_SCHEMA", "true").lower() == "true"

    @property
    def should_seed_default_categories(self) -> bool:
        if self.seed_default_categories_on_startup:
            return True
        return not self.is_production

    @property
    def cookie_path(self) -> str:
        return "/"

    @property
    def refresh_cookie_path(self) -> str:
        return "/api/auth"


settings = Settings()
