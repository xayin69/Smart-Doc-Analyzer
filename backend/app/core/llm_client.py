import requests
from enum import Enum
from typing import Optional
from app.core.task_types import TaskType
from app.core.model_router import select_model

# ===============================
# LLM MODE
# ===============================

class LLMMode(str, Enum):
    LOCAL = "local"
    CLOUD = "cloud"


LLM_MODE = LLMMode.LOCAL  # 🔒 default


# ===============================
# OLLAMA
# ===============================

OLLAMA_URL = "http://localhost:11434/api/generate"


# ===============================
# PUBLIC ENTRY POINT
# ===============================

def ask_llm(
    prompt: str,
    *,
    task: Optional[TaskType] = None,
    has_images: bool = False,
    forced_model_name: Optional[str] = None, 
) -> str:
    """
    Unified LLM entry point.
    """

    if LLM_MODE == LLMMode.LOCAL:
        return _ask_local_llm(prompt, task=task, has_images=has_images)

    if LLM_MODE == LLMMode.CLOUD:
        return _ask_cloud_llm(prompt)

    raise ValueError("Invalid LLM mode")


# ===============================
# LOCAL (OLLAMA)
# ===============================

def _ask_local_llm(
    prompt: str,
    *,
    task: Optional[TaskType],
    has_images: bool,
    forced_model_name: Optional[str] = None, 
) -> str:
    # 🔀 Select model ONLY if task is provided
    if forced_model_name:
        model_name = forced_model_name
    if task:
        model = select_model(task=task, has_images=has_images)
        model_name = model.name
    else:
        # backward compatibility
        model_name = "kwangsuklee/gemma-3-12b-it-Q4_K_M:latest"

    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=300)
    response.raise_for_status()

    return response.json()["response"].strip()


# ===============================
# CLOUD (FUTURE)
# ===============================

def _ask_cloud_llm(prompt: str) -> str:
    raise NotImplementedError("Cloud LLM not wired yet")
