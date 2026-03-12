from typing import List
from app.core.prompt_factory import build_prompt
from app.core.task_types import TaskType
from app.core.llm_client import ask_llm


def run_rag(chunk: List[str], question: str, adaptive_mode: bool = False) -> str:
    """
    RAG = prompt building + LLM reasoning
    """

    prompt = build_prompt(
        task=TaskType.QA,
        chunk=chunk,
        question=question,
        adaptive_mode=adaptive_mode,
    )

    return ask_llm(prompt, task=TaskType.QA)
