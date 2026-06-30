import pickle
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

TRAINING_DATA = [
    # High priority
    ("electric wire fallen on road people may die", "High"),
    ("serious accident happened pothole caused injury", "High"),
    ("hospital staff not present emergency patient dying", "High"),
    ("gas leak near residential area urgent evacuation", "High"),
    ("water contamination causing severe illness hospitalization", "High"),
    ("transformer exploded fire started near homes", "High"),
    ("sewage overflow flooding entering homes", "High"),
    ("criminal activity shooting near school children", "High"),
    ("bridge crack dangerous for heavy vehicles collapse risk", "High"),
    ("no water supply for 5 days critical emergency", "High"),
    # Medium priority
    ("pothole on road causing minor inconvenience", "Medium"),
    ("street light not working since 3 days", "Medium"),
    ("garbage not collected for 2 days", "Medium"),
    ("water pressure low but water available", "Medium"),
    ("power cut for few hours", "Medium"),
    ("teacher absent for 2 days", "Medium"),
    ("public toilet dirty needs cleaning", "Medium"),
    ("drainage blocked needs clearing", "Medium"),
    ("road bump broken needs repair", "Medium"),
    ("dog barking at night disturbing sleep", "Medium"),
    # Low priority
    ("park bench is broken needs replacement", "Low"),
    ("footpath tiles loose minor issue", "Low"),
    ("garbage bin full can be emptied tomorrow", "Low"),
    ("paint faded on government building", "Low"),
    ("slight water discoloration but usable", "Low"),
    ("suggestion to add more streetlights", "Low"),
    ("information about new scheme required", "Low"),
    ("signboard needs update on road", "Low"),
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "priority_model.pkl")


class PriorityPredictor:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                self.pipeline = pickle.load(f)
        else:
            self.pipeline = self._train()

    def _train(self):
        texts, labels = zip(*TRAINING_DATA)
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=3000)),
            ("clf", LogisticRegression(max_iter=1000, C=1.0, solver="lbfgs",
                                       multi_class="multinomial")),
        ])
        pipeline.fit(texts, labels)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(pipeline, f)
        return pipeline

    def predict(self, text: str):
        proba = self.pipeline.predict_proba([text])[0]
        idx = int(np.argmax(proba))
        priority = self.pipeline.classes_[idx]
        return priority, float(proba[idx])
