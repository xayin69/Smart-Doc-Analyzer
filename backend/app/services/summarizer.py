from typing import List
from app.core.prompt_factory import build_prompt
from app.core.task_types import TaskType
from app.core.llm_client import ask_llm


def summarize_chunk(text: str, adaptive_mode: bool = False) -> str:
    prompt = build_prompt(
        task=TaskType.SUMMARIZE_CHUNK,
        text=text,
        adaptive_mode=adaptive_mode,
    )
    response = ask_llm(prompt, task=TaskType.SUMMARIZE_CHUNK)
    return response


def summarize_document(chunks: List[str], adaptive_mode: bool = False) -> str:
    chunk_summaries = []

    for chunk in chunks:
        chunk_summaries.append(summarize_chunk(chunk, adaptive_mode=adaptive_mode))

    final_prompt = build_prompt(
        task=TaskType.SUMMARIZE_DOCUMENT,
        chunk=chunk_summaries,
        adaptive_mode=adaptive_mode,
    )
    response = ask_llm(final_prompt, task=TaskType.SUMMARIZE_DOCUMENT).strip()

    return response
