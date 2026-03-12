from app.core.task_types import TaskType
from typing import List

def build_prompt(
    task: TaskType,
    *,
    text: str | None = None,
    chunk: List[str] | None = None,
    question: str | None = None,
    target_language: str | None = None,
    adaptive_mode: bool = False,
) -> str:
    """
    Central factory for all prompts.
    """
    if adaptive_mode:
        print("ADAPTIVE MODE ACTIVE")

    if task == TaskType.SUMMARIZE_CHUNK:
        return summarize_chunk(text, adaptive_mode=adaptive_mode)

    if task == TaskType.SUMMARIZE_DOCUMENT:
        return summarize_document(chunk, adaptive_mode=adaptive_mode)

    if task == TaskType.QA:
        return build_rag_prompt(chunk, question, adaptive_mode=adaptive_mode)

    if task == TaskType.TRANSLATE:
        return translate_chunk(text, target_language, adaptive_mode=adaptive_mode)

    if task == TaskType.SENTIMENT:
        return analyze_chunk_sentiment(text, adaptive_mode=adaptive_mode)

    if task == TaskType.TOPIC_CLASSIFICATION:
        return build_classification_prompt(text, adaptive_mode=adaptive_mode)

    raise ValueError(f"Unsupported task: {task}")



def summarize_chunk(text: str, adaptive_mode: bool = False) -> str:
    adaptive_line = (
        "- Adaptive mode is ON: prioritize strict faithfulness and conservative wording.\n"
        if adaptive_mode
        else ""
    )
    prompt = f"""
You are a professional document analyst. Your task is to produce a clear, accurate, well-written summary of the text below.

Requirements:
- Use only the information explicitly present in the text.
- Do not introduce external facts, interpretations, or assumptions. If a small amount of bridging is needed for readability, keep it minimal and clearly implied by the text.
- Preserve the author's intent, key ideas, and important details.
- Maintain a neutral, academic tone. Avoid hype, opinion, or marketing language.
- Prefer precise wording over vague phrasing.
- Do not include headings, bullet points, or citations unless they appear in the text.
- Do NOT wrap output in quotes, triple quotes, markdown, or code fences.
{adaptive_line}

Text to summarize:
{text}
"""
    return prompt


def summarize_document(chunks: List[str], adaptive_mode: bool = False) -> str:
    # `chunks` here are already chunk summaries produced by summarize_chunk().
    combined_summaries = "\n\n".join(chunks)

    final_prompt = f"""
You are an expert at summarizing long documents. Produce a single, coherent summary of the entire document based ONLY on the chunk summaries below.

Requirements:
- Integrate related ideas and remove repetition.
- Preserve the document's logical flow and the author's intent.
- Keep it concise but informative; include essential context and key details.
- Do not introduce any information not present in the chunk summaries.
- Maintain a neutral, professional, academic tone.
- Output a single paragraph unless the source text clearly uses sections.
- Do NOT wrap output in quotes, triple quotes, markdown, or code fences.

Chunk summaries:
{combined_summaries}
""".strip()

    return final_prompt


def build_rag_prompt(chunk: List[str], question: str, adaptive_mode: bool = False) -> str:
    context = "\n\n".join(chunk)
    adaptive_line = (
        '- Adaptive mode is ON: avoid speculation and prefer "not enough context" when uncertain.\n'
        if adaptive_mode
        else ""
    )

    prompt = f"""
You are a helpful assistant answering questions about a document using the provided context.

Rules:
- Prefer the context as the primary source.
- If the context is sufficient, answer using only the context.
- If the context is incomplete, you may add external information to provide a correct and helpful answer.
- When adding external information, clearly label it with "External info:" and keep it brief.
- If the question is ambiguous, ask a short clarifying question.
- Be clear, concise, and accurate.
- Do NOT wrap output in quotes, triple quotes, markdown, or code fences.
{adaptive_line}

Context:
{context}

User Question:
{question}

Answer:
""".strip()
    return prompt
     




def translate_chunk(text: str, target_language: str, adaptive_mode: bool = False) -> str:
    normalized_target = target_language.strip().lower()
    arabic_focus = (
        "arab" in normalized_target
        or "???" in normalized_target
        or "???????" in normalized_target
        or normalized_target == "ar"
    )

    arabic_guidelines = ""
    if arabic_focus:
        arabic_guidelines = """
Arabic focus:
- Use Modern Standard Arabic unless the text clearly requires a specific dialect.
- Translate by meaning and context; avoid word-for-word calques.
- Ensure correct gender/number/definiteness agreement and verb conjugation.
- Use natural Arabic word order and appropriate prepositions/connectors.
- Keep names/brands/proper nouns in their common Arabic forms or the original if standard.
- Preserve numbers, units, and technical terms as-is unless a standard Arabic term is widely used.
- Avoid adding diacritics unless present in the source.
- Use Arabic punctuation where appropriate (? ? ?) with proper spacing.
"""

    prompt = f"""
You are a professional translator.

Translate the following text into {target_language}.
Priorities: accurate meaning, natural grammar, correct terminology, and faithful tone/register.
Use context to resolve ambiguity and avoid literal word-for-word translation.
Preserve formatting, line breaks, lists, numbers, units, and punctuation.
Do NOT summarize.
Do NOT explain.
Return ONLY the translated text.
Do NOT wrap output in quotes, triple quotes, markdown, or code fences.
{"Adaptive mode is ON: prioritize literal faithfulness over stylistic rephrasing." if adaptive_mode else ""}
{arabic_guidelines}
TEXT:
{text}
""".strip()
    return prompt



def analyze_chunk_sentiment(chunk: str, adaptive_mode: bool = False) -> str:
    adaptive_line = (
        "- Adaptive mode is ON: if sentiment is mixed or uncertain, return Neutral.\n"
        if adaptive_mode
        else ""
    )
    prompt = f"""
You are a sentiment analysis system.

Classify the sentiment of the following text as ONE of:
- Positive
- Neutral
- Negative
{adaptive_line}

Text:
{chunk}

Return ONLY the label.
Do NOT wrap output in quotes, markdown, or code fences.
""".strip()
    return prompt



def build_classification_prompt(chunk: str, adaptive_mode: bool = False) -> str:
    prompt = f"""
Classify the following text into ONE high-level topic.

Allowed topics:
Technology, Science, Health, Finance, Education, Legal, Personal, Food, General, politics, sports, entertainment, travel, lifestyle, environment, history, art, culture
, business, psychology, philosophy, religion, fashion, automotive, real estate, agriculture, energy, aerospace, military, cybersecurity, AI/ML, data science, social media, marketing,
frustration, humor, relationships, parenting, hobbies, pets, nature, space, transportation, economics, law, ethics, linguistics, literature, music, film, gaming,
wellness, fitness, nutrition, mental health, self-improvement, productivity, remote work, entrepreneurship, startups, leadership, management, career development,
sustainability, climate change, social justice, human rights, diversity, quality of life, urban planning, architecture, design, innovation, future trends, movies, TV, celebrities, universities, schools, research, gadgets, games, animals, nature, 
pepole, kids, cars, past, universe, space, art, writing, books, language, music, love, lonlyness etc..
Rules:
- Choose the BEST single topic
- Do NOT explain
- Output JSON only
- If unsure, use "General"
{"- Adaptive mode is ON: be conservative and choose General if confidence is low." if adaptive_mode else ""}

Text:
{chunk}

Output:
{{ "topic": "Technology" }}
""".strip()
    return prompt

