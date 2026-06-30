from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List

SIMILARITY_THRESHOLD = 0.65


class DuplicateDetector:
    def find_duplicates(self, complaints) -> dict:
        texts = [f"{c.title} {c.text}".strip() for c in complaints]
        ids = [c.id for c in complaints]

        if len(texts) < 2:
            return {"clusters": []}

        vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000)
        tfidf_matrix = vectorizer.fit_transform(texts)
        sim_matrix = cosine_similarity(tfidf_matrix)

        visited = set()
        clusters = []

        for i in range(len(ids)):
            if i in visited:
                continue
            cluster_ids = [ids[i]]
            cluster_scores = []
            for j in range(i + 1, len(ids)):
                if j in visited:
                    continue
                score = float(sim_matrix[i][j])
                if score >= SIMILARITY_THRESHOLD:
                    cluster_ids.append(ids[j])
                    cluster_scores.append(round(score, 4))
                    visited.add(j)
            if len(cluster_ids) > 1:
                visited.add(i)
                clusters.append({
                    "ids": cluster_ids,
                    "similarity_scores": cluster_scores,
                })

        return {"clusters": clusters}
