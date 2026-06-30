import re

NEGATIVE_WORDS = {
    "terrible", "horrible", "worst", "disgusting", "pathetic", "useless",
    "broken", "damaged", "destroyed", "dangerous", "illegal", "corrupt",
    "negligence", "ignored", "no response", "not working", "not available",
    "failed", "failure", "dead", "dying", "emergency", "urgent", "critical",
    "fraud", "bribe", "dirty", "filthy", "stinking", "unbearable", "poor",
    "bad", "awful", "shocking", "unacceptable", "outrageous", "disgusted",
    "frustrated", "angry", "upset", "problem", "issue", "complaint",
}

POSITIVE_WORDS = {
    "resolved", "fixed", "repaired", "working", "good", "great", "excellent",
    "helpful", "fast", "quick", "responsive", "clean", "improved", "better",
    "satisfied", "happy", "thank", "appreciate", "nice", "well done",
}


class SentimentAnalyzer:
    def analyze(self, text: str):
        words = set(re.findall(r'\b\w+\b', text.lower()))
        neg_score = len(words & NEGATIVE_WORDS)
        pos_score = len(words & POSITIVE_WORDS)

        total = neg_score + pos_score + 1
        if neg_score > pos_score:
            score = -(neg_score / total)
            return "Negative", score
        elif pos_score > neg_score:
            score = pos_score / total
            return "Positive", score
        else:
            return "Neutral", 0.0
