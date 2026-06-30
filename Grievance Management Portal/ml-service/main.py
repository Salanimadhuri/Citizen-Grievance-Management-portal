from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pickle
import os
import re

from models.classifier import ComplaintClassifier
from models.priority import PriorityPredictor
from models.sentiment import SentimentAnalyzer
from models.duplicate import DuplicateDetector
from models.summarizer import ComplaintSummarizer
from models.department import DepartmentRecommender

app = FastAPI(
    title="Grievance Portal ML Service",
    description="AI/ML microservice for Smart Citizen Grievance Management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup
classifier = ComplaintClassifier()
priority_predictor = PriorityPredictor()
sentiment_analyzer = SentimentAnalyzer()
duplicate_detector = DuplicateDetector()
summarizer = ComplaintSummarizer()
dept_recommender = DepartmentRecommender()


# ── Request / Response schemas ────────────────────────────────────────────────

class ComplaintText(BaseModel):
    text: str
    title: Optional[str] = ""

class BatchComplaint(BaseModel):
    id: str
    text: str
    title: Optional[str] = ""

class BatchRequest(BaseModel):
    complaints: List[BatchComplaint]

class AnalyzeRequest(BaseModel):
    text: str
    title: Optional[str] = ""
    existing_complaints: Optional[List[BatchComplaint]] = []


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ml-service"}


@app.post("/api/ml/classify")
def classify(req: ComplaintText):
    """Predict complaint category from text."""
    combined = f"{req.title} {req.text}".strip()
    category, confidence = classifier.predict(combined)
    return {"category": category, "confidence": round(confidence, 4)}


@app.post("/api/ml/priority")
def predict_priority(req: ComplaintText):
    """Predict complaint priority (High / Medium / Low)."""
    combined = f"{req.title} {req.text}".strip()
    priority, confidence = priority_predictor.predict(combined)
    return {"priority": priority, "confidence": round(confidence, 4)}


@app.post("/api/ml/sentiment")
def analyze_sentiment(req: ComplaintText):
    """Classify sentiment: Positive / Neutral / Negative."""
    combined = f"{req.title} {req.text}".strip()
    sentiment, score = sentiment_analyzer.analyze(combined)
    return {"sentiment": sentiment, "score": round(score, 4)}


@app.post("/api/ml/summarize")
def summarize(req: ComplaintText):
    """Generate a short summary of the complaint."""
    combined = f"{req.title} {req.text}".strip()
    summary = summarizer.summarize(combined)
    return {"summary": summary}


@app.post("/api/ml/department")
def recommend_department(req: ComplaintText):
    """Recommend the responsible department."""
    combined = f"{req.title} {req.text}".strip()
    department, confidence = dept_recommender.recommend(combined)
    return {"department": department, "confidence": round(confidence, 4)}


@app.post("/api/ml/duplicates")
def detect_duplicates(req: BatchRequest):
    """Detect duplicate complaints using cosine similarity on embeddings."""
    if len(req.complaints) < 2:
        return {"clusters": [], "duplicates": []}
    clusters = duplicate_detector.find_duplicates(req.complaints)
    return {"clusters": clusters}


@app.post("/api/ml/analyze")
def full_analysis(req: AnalyzeRequest):
    """Run all ML models on a single complaint and return combined results."""
    combined = f"{req.title} {req.text}".strip()

    category, cat_conf = classifier.predict(combined)
    priority, pri_conf = priority_predictor.predict(combined)
    sentiment, sent_score = sentiment_analyzer.analyze(combined)
    summary = summarizer.summarize(combined)
    department, dept_conf = dept_recommender.recommend(combined)

    duplicates = []
    if req.existing_complaints:
        all_complaints = req.existing_complaints + [
            BatchComplaint(id="__new__", text=req.text, title=req.title)
        ]
        result = duplicate_detector.find_duplicates(all_complaints)
        for cluster in result.get("clusters", []):
            if "__new__" in cluster.get("ids", []):
                duplicates = [i for i in cluster["ids"] if i != "__new__"]

    return {
        "category": category,
        "categoryConfidence": round(cat_conf, 4),
        "priority": priority,
        "priorityConfidence": round(pri_conf, 4),
        "sentiment": sentiment,
        "sentimentScore": round(sent_score, 4),
        "summary": summary,
        "recommendedDepartment": department,
        "departmentConfidence": round(dept_conf, 4),
        "possibleDuplicates": duplicates,
    }
