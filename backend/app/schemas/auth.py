from datetime import datetime

from pydantic import BaseModel, Field


class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    invite_token: str


class UserResponse(BaseModel):
    id: str
    username: str
    full_name: str | None
    avatar_url: str | None
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class TokenPayload(BaseModel):
    sub: str  # user id
    exp: datetime
    iat: datetime


class UserUpdateProfile(BaseModel):
    full_name: str | None = Field(None, max_length=100)


class UserChangePassword(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)


class InvitedUserResponse(BaseModel):
    id: str
    username: str
    full_name: str | None
    avatar_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
