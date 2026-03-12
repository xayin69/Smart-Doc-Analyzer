from enum import Enum


class TaskType(str, Enum):
    SUMMARIZE_CHUNK = "summarize_chunk"
    SUMMARIZE_DOCUMENT = "summarize_document"
    QA = "qa"
    TRANSLATE = "translate"
    SENTIMENT = "sentiment"
    TOPIC_CLASSIFICATION = "topic_classification"
