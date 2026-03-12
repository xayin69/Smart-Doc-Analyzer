from collections import Counter
from app.core.prompt_factory import build_prompt
from app.core.task_types import TaskType
from app.core.llm_client import ask_llm


ALLOWED_LABELS = {"Positive", "Neutral", "Negative"}


def analyze_chunk_sentiment(chunk: str, adaptive_mode: bool = False) -> str:
    prompt = build_prompt(
        task=TaskType.SENTIMENT,
        text=chunk,
        adaptive_mode=adaptive_mode,
    )
    response = ask_llm(prompt, task=TaskType.SENTIMENT).strip().strip('"').strip("'")

    if response not in ALLOWED_LABELS:
        return "Neutral"

    return response


def analyze_document_sentiment(chunks: list[str], adaptive_mode: bool = False) -> str:
    sentiments = []

    for chunk in chunks:
        sentiment = analyze_chunk_sentiment(chunk, adaptive_mode=adaptive_mode)
        sentiments.append(sentiment)

    counts = Counter(sentiments)
    distribution = {
        "Positive": counts.get("Positive", 0),
        "Neutral": counts.get("Neutral", 0),
        "Negative": counts.get("Negative", 0),
    }
    overall = max(distribution, key=distribution.get)

    stats = {
        "distribution": distribution,
        "overall": overall,
    }
    return format_sentiment(stats)


def format_sentiment(stats: dict) -> str:
    distribution = stats.get("distribution", {})
    total = (
        distribution.get("Positive", 0)
        + distribution.get("Neutral", 0)
        + distribution.get("Negative", 0)
    )
    if total <= 0:
        total = 1

    pos = round((distribution.get("Positive", 0) / total) * 100)
    neu = round((distribution.get("Neutral", 0) / total) * 100)
    neg = round((distribution.get("Negative", 0) / total) * 100)
    overall = stats.get("overall", "Neutral")

    return (
        f"Overall sentiment: {overall}\n\n"
        "Breakdown:\n"
        f"- Positive: {pos}%\n"
        f"- Neutral: {neu}%\n"
        f"- Negative: {neg}%"
    )
