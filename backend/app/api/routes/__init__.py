from fastapi import APIRouter

from app.api.routes import auth, invites

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(invites.router, prefix="/invites", tags=["invites"])
