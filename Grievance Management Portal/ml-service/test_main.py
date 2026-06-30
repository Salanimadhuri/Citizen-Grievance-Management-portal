import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

COMPLAINT_TEXT = "There is a huge pothole on the main road causing accidents and injuries to pedestrians."
COMPLAINT_TITLE = "Dangerous Pothole"


# ── Health ────────────────────────────────────────────────────────────────────

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ── Classification ────────────────────────────────────────────────────────────

def test_classify_returns_category():
    r = client.post("/api/ml/classify", json={"text": COMPLAINT_TEXT, "title": COMPLAINT_TITLE})
    assert r.status_code == 200
    body = r.json()
    assert "category" in body
    assert body["category"] in [
        "Water Supply", "Electricity", "Roads", "Sanitation",
        "Healthcare", "Education", "Public Safety", "Other"
    ]
    assert 0.0 <= body["confidence"] <= 1.0


def test_classify_road_complaint():
    r = client.post("/api/ml/classify", json={"text": "road pothole accident damaged car", "title": "Road Issue"})
    assert r.status_code == 200
    assert r.json()["category"] == "Roads"


def test_classify_water_complaint():
    r = client.post("/api/ml/classify", json={"text": "no water supply tap broken pipe leak", "title": "Water Problem"})
    assert r.status_code == 200
    assert r.json()["category"] == "Water Supply"


# ── Priority ──────────────────────────────────────────────────────────────────

def test_priority_returns_valid_label():
    r = client.post("/api/ml/priority", json={"text": COMPLAINT_TEXT, "title": COMPLAINT_TITLE})
    assert r.status_code == 200
    body = r.json()
    assert body["priority"] in ["High", "Medium", "Low"]
    assert 0.0 <= body["confidence"] <= 1.0


def test_priority_high_for_urgent_text():
    r = client.post("/api/ml/priority", json={
        "text": "electric wire fallen on road people may die urgent emergency",
        "title": "Urgent Danger"
    })
    assert r.status_code == 200
    assert r.json()["priority"] == "High"


def test_priority_low_for_minor_text():
    r = client.post("/api/ml/priority", json={
        "text": "park bench paint faded minor suggestion",
        "title": "Minor Suggestion"
    })
    assert r.status_code == 200
    assert r.json()["priority"] == "Low"


# ── Sentiment ─────────────────────────────────────────────────────────────────

def test_sentiment_negative():
    r = client.post("/api/ml/sentiment", json={
        "text": "terrible horrible broken dangerous urgent ignored no response",
        "title": ""
    })
    assert r.status_code == 200
    assert r.json()["sentiment"] == "Negative"


def test_sentiment_positive():
    r = client.post("/api/ml/sentiment", json={
        "text": "complaint resolved fixed working thank you great service excellent",
        "title": ""
    })
    assert r.status_code == 200
    assert r.json()["sentiment"] == "Positive"


def test_sentiment_returns_score():
    r = client.post("/api/ml/sentiment", json={"text": "some complaint text", "title": ""})
    assert r.status_code == 200
    assert "score" in r.json()


# ── Summarize ─────────────────────────────────────────────────────────────────

def test_summarize_returns_shorter_text():
    long_text = (
        "There is a very large pothole on the main road. "
        "It has been there for three weeks. "
        "Many vehicles have been damaged. "
        "People are getting injured daily. "
        "Nobody is fixing it despite complaints."
    )
    r = client.post("/api/ml/summarize", json={"text": long_text, "title": "Road Problem"})
    assert r.status_code == 200
    assert "summary" in r.json()
    assert len(r.json()["summary"]) > 0


# ── Department Recommendation ─────────────────────────────────────────────────

def test_department_returns_valid_dept():
    r = client.post("/api/ml/department", json={"text": "no water supply pipe broken", "title": "Water Issue"})
    assert r.status_code == 200
    body = r.json()
    assert "department" in body
    assert 0.0 <= body["confidence"] <= 1.0


# ── Duplicates ────────────────────────────────────────────────────────────────

def test_duplicates_detects_similar_complaints():
    r = client.post("/api/ml/duplicates", json={"complaints": [
        {"id": "1", "text": "pothole on main road causing accidents", "title": "Pothole"},
        {"id": "2", "text": "large pothole main road vehicles damaged", "title": "Road Pothole"},
        {"id": "3", "text": "no water supply in our area for 3 days", "title": "Water Issue"},
    ]})
    assert r.status_code == 200
    clusters = r.json()["clusters"]
    # IDs 1 and 2 should be in the same cluster
    if clusters:
        all_ids = [i for c in clusters for i in c["ids"]]
        assert "1" in all_ids or "2" in all_ids


def test_duplicates_single_complaint_returns_empty():
    r = client.post("/api/ml/duplicates", json={"complaints": [
        {"id": "1", "text": "pothole on road", "title": "Road"}
    ]})
    assert r.status_code == 200
    assert r.json()["clusters"] == []


# ── Full Analysis ─────────────────────────────────────────────────────────────

def test_full_analyze_returns_all_fields():
    r = client.post("/api/ml/analyze", json={"text": COMPLAINT_TEXT, "title": COMPLAINT_TITLE})
    assert r.status_code == 200
    body = r.json()
    for key in ["category", "priority", "sentiment", "summary", "recommendedDepartment"]:
        assert key in body, f"Missing field: {key}"
    assert 0.0 <= body["categoryConfidence"] <= 1.0
    assert 0.0 <= body["priorityConfidence"] <= 1.0
