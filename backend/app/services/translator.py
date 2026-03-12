from app.core.prompt_factory import build_prompt
from app.core.task_types import TaskType
from app.core.llm_client import ask_llm


def translate_chunk(text: str, target_language: str, adaptive_mode: bool = False) -> str:
    prompt = build_prompt(
        task=TaskType.TRANSLATE,
        text=text,
        target_language=target_language,
        adaptive_mode=adaptive_mode,
    )
    return ask_llm(prompt, task=TaskType.TRANSLATE)
