from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ModelConfig:
    name: str
    provider: str          # "ollama" | "cloud"
    supports_vision: bool
    max_context: int       # tokens (approx)
    local: bool


# 🔒 Default local models
LOCAL_TEXT_MODEL = ModelConfig(
    name="kwangsuklee/gemma-3-12b-it-Q4_K_M:latest",
    provider="ollama",
    supports_vision=False,
    max_context=8192,
    local=True,
)

LOCAL_VISION_MODEL = ModelConfig(
    name="qwen3-vl:8b",
    provider="ollama",
    supports_vision=True,
    max_context=8192,
    local=True,
)

# 🌩️ Cloud placeholders (OFF for now)
CLOUD_LARGE_MODEL = ModelConfig(
    name="gpt-oss:120b-cloud",
    provider="cloud",
    supports_vision=False,
    max_context=128000,
    local=False,
)
