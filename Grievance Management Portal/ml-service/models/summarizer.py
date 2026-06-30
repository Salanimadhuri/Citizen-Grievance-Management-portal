import re
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


class ComplaintSummarizer:
    def summarize(self, text: str, max_sentences: int = 2) -> str:
        sentences = re.split(r'(?<=[.!?])\s+', text.strip())
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

        if not sentences:
            return text[:200]
        if len(sentences) <= max_sentences:
            return " ".join(sentences)

        try:
            vectorizer = TfidfVectorizer()
            tfidf = vectorizer.fit_transform(sentences)
            scores = np.array(tfidf.sum(axis=1)).flatten()
            top_indices = sorted(
                np.argsort(scores)[-max_sentences:].tolist()
            )
            return " ".join(sentences[i] for i in top_indices)
        except Exception:
            return " ".join(sentences[:max_sentences])
