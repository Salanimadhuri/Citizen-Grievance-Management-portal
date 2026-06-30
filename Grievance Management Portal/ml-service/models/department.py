import pickle
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

TRAINING_DATA = [
    ("water supply pipe leak borewell", "Water Department"),
    ("no water tap connection water board", "Water Department"),
    ("power cut electricity transformer street light", "Electricity Department"),
    ("voltage fluctuation electric pole wire", "Electricity Department"),
    ("pothole road accident traffic signal", "Roads & Infrastructure"),
    ("road construction footpath broken divider", "Roads & Infrastructure"),
    ("garbage sanitation sewage drain dirty", "Sanitation Department"),
    ("public toilet waste collection dustbin", "Sanitation Department"),
    ("hospital doctor medicine ambulance health", "Health Department"),
    ("vaccination disease outbreak food adulteration", "Health Department"),
    ("school teacher education scholarship mid day meal", "Education Department"),
    ("college university student exam result", "Education Department"),
    ("theft robbery police crime safety", "Police Department"),
    ("drug illegal activity suspicious criminal", "Police Department"),
    ("tree fallen park bench noise factory", "Municipal Corporation"),
    ("stray animal cattle encroachment unauthorized construction", "Municipal Corporation"),
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "department_model.pkl")


class DepartmentRecommender:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                self.pipeline = pickle.load(f)
        else:
            self.pipeline = self._train()

    def _train(self):
        texts, labels = zip(*TRAINING_DATA)
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=2000)),
            ("clf", LogisticRegression(max_iter=500, C=1.0, solver="lbfgs",
                                       multi_class="multinomial")),
        ])
        pipeline.fit(texts, labels)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(pipeline, f)
        return pipeline

    def recommend(self, text: str):
        proba = self.pipeline.predict_proba([text])[0]
        idx = int(np.argmax(proba))
        dept = self.pipeline.classes_[idx]
        return dept, float(proba[idx])
