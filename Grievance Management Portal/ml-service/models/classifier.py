import pickle
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

CATEGORIES = [
    "Water Supply", "Electricity", "Roads", "Sanitation",
    "Healthcare", "Education", "Public Safety", "Other"
]

TRAINING_DATA = [
    # Water Supply
    ("no water supply in my area for 3 days", "Water Supply"),
    ("water pipe is broken and leaking on main road", "Water Supply"),
    ("tap water has bad smell and color is yellow", "Water Supply"),
    ("water connection not provided despite paying fees", "Water Supply"),
    ("water pressure is very low in our building", "Water Supply"),
    ("borewell not working in our locality", "Water Supply"),
    ("water tank overflow causing road damage", "Water Supply"),
    # Electricity
    ("power cut for 12 hours no response from board", "Electricity"),
    ("street lights are not working since last week", "Electricity"),
    ("electric pole is tilted and dangerous", "Electricity"),
    ("transformer burnt in our colony", "Electricity"),
    ("electricity bill is too high incorrect reading", "Electricity"),
    ("frequent voltage fluctuation damaging appliances", "Electricity"),
    ("illegal electricity connection in neighbourhood", "Electricity"),
    # Roads
    ("huge pothole on the main road causing accidents", "Roads"),
    ("road is completely damaged after rain", "Roads"),
    ("no footpath for pedestrians on highway", "Roads"),
    ("speed breaker needed near school", "Roads"),
    ("road construction debris blocking traffic", "Roads"),
    ("traffic signal not working at busy junction", "Roads"),
    ("road divider broken vehicles crossing dangerously", "Roads"),
    # Sanitation
    ("garbage not collected for 5 days bad smell", "Sanitation"),
    ("open drain near school causing health issues", "Sanitation"),
    ("public toilet is very dirty no maintenance", "Sanitation"),
    ("stray dogs near garbage dump biting people", "Sanitation"),
    ("sewage overflow on street unhygienic conditions", "Sanitation"),
    ("no dustbin in the park", "Sanitation"),
    ("dead animal lying on road not removed", "Sanitation"),
    # Healthcare
    ("government hospital doctor absent during duty hours", "Healthcare"),
    ("medicines not available at primary health centre", "Healthcare"),
    ("ambulance not responding to emergency calls", "Healthcare"),
    ("mosquito breeding in stagnant water dengue risk", "Healthcare"),
    ("food adulteration in nearby restaurant", "Healthcare"),
    ("vaccination camp cancelled no information given", "Healthcare"),
    # Education
    ("school building is in very poor condition roof leaking", "Education"),
    ("teacher absent regularly affecting students", "Education"),
    ("mid day meal not provided to students", "Education"),
    ("no toilet facility in government school", "Education"),
    ("scholarship amount not distributed to students", "Education"),
    # Public Safety
    ("theft in our locality police not responding", "Public Safety"),
    ("drug dealing happening openly near park", "Public Safety"),
    ("eve teasing complaints police ignoring", "Public Safety"),
    ("suspicious activity in abandoned building", "Public Safety"),
    ("unauthorized construction blocking emergency access", "Public Safety"),
    # Other
    ("stray cattle on highway causing accidents", "Other"),
    ("loud noise from factory at night", "Other"),
    ("tree fallen on road after storm", "Other"),
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "classifier_model.pkl")


class ComplaintClassifier:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                self.pipeline = pickle.load(f)
        else:
            self.pipeline = self._train()

    def _train(self):
        texts, labels = zip(*TRAINING_DATA)
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=5000)),
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
        category = self.pipeline.classes_[idx]
        return category, float(proba[idx])
