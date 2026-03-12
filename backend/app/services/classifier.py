import json
import re
from collections import Counter
from typing import Dict, List

from app.core.prompt_factory import build_prompt
from app.core.task_types import TaskType
from app.core.llm_client import ask_llm


def _parse_topic(raw: str) -> str:
    cleaned = raw.strip()
    cleaned = re.sub(r"^```(?:json)?|```$", "", cleaned, flags=re.IGNORECASE).strip()

    try:
        data = json.loads(cleaned)
        topic = data.get("topic")
        if isinstance(topic, str) and topic.strip():
            return topic.strip()
    except json.JSONDecodeError:
        pass

    return "General"


def classify_chunk_topic(chunk: str, adaptive_mode: bool = False) -> str:
    prompt = build_prompt(
        task=TaskType.TOPIC_CLASSIFICATION,
        text=chunk,
        adaptive_mode=adaptive_mode,
    )
    raw = ask_llm(prompt, task=TaskType.TOPIC_CLASSIFICATION)
    return _parse_topic(raw)


def classify_document(chunks: List[str], adaptive_mode: bool = False) -> str:
    counter = Counter()

    for chunk in chunks:
        topic = classify_chunk_topic(chunk, adaptive_mode=adaptive_mode)
        counter[topic] += 1

    total = sum(counter.values())
    if total <= 0:
        return "Overall topic: General\n\nBreakdown:\n- General: 100%"

    distribution: Dict[str, float] = {
        topic: count / total for topic, count in counter.items()
    }
    return format_topic_classification(distribution)


def format_topic_classification(distribution: Dict[str, float]) -> str:
    if not distribution:
        return "Overall topic: General\n\nBreakdown:\n- General: 100%"

    sorted_items = sorted(distribution.items(), key=lambda item: item[1], reverse=True)
    overall_topic = sorted_items[0][0]

    lines = [
        f"Overall topic: {overall_topic}",
        "",
        "Breakdown:",
    ]

    for topic, ratio in sorted_items:
        lines.append(f"- {topic}: {round(ratio * 100)}%")

    return "\n".join(lines)
