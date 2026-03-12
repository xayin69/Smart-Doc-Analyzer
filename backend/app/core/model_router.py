from app.core.task_types import TaskType
from app.core.model_registry import (
    LOCAL_TEXT_MODEL,
    LOCAL_VISION_MODEL,
    CLOUD_LARGE_MODEL,
    ModelConfig,
)


def select_model(
    *,
    task: TaskType,
    has_images: bool = False,
    force_cloud: bool = False,
) -> ModelConfig:
    """
    Decide which model to use based on task + input.
    """

    # 🔒 Cloud is OFF unless forced (future)
    if force_cloud:
        return CLOUD_LARGE_MODEL

    # 🖼️ Vision tasks
    if has_images:
        return LOCAL_VISION_MODEL

    # 🧠 Heavy reasoning tasks (future expansion)
    if task in {TaskType.QA}:
        return LOCAL_TEXT_MODEL

    # 📝 Default text tasks
    return LOCAL_TEXT_MODEL
