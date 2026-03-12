from fastapi import APIRouter
from app.core.model_registry import (
    LOCAL_TEXT_MODEL,
    LOCAL_VISION_MODEL,
    CLOUD_LARGE_MODEL,
)

router = APIRouter()


@router.get("/models")
def get_models():
    return [
        {
            "name": LOCAL_TEXT_MODEL.name,
            "supports_vision": LOCAL_TEXT_MODEL.supports_vision,
            "local": LOCAL_TEXT_MODEL.local,
        },
        {
            "name": LOCAL_VISION_MODEL.name,
            "supports_vision": LOCAL_VISION_MODEL.supports_vision,
            "local": LOCAL_VISION_MODEL.local,
        },
        {
            "name": CLOUD_LARGE_MODEL.name,
            "supports_vision": CLOUD_LARGE_MODEL.supports_vision,
            "local": CLOUD_LARGE_MODEL.local,
        },
    ]
