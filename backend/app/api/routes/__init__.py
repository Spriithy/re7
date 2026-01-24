from fastapi import APIRouter

from app.api.routes import auth, categories, invites, recipes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(invites.router, prefix="/invites", tags=["invites"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
