import os
import json
import logging
import numpy as np
import pandas as pd
import joblib

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "risk_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "ml", "models", "risk_features.json")

model = None
features = None

def _load_model():
    global model, features
    if model is None and os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            with open(FEATURES_PATH, 'r') as f:
                features = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            model = None

# Attempt initial load
_load_model()

def get_risk_level(score: float) -> str:
    if score <= 30:
        return "Low"
    elif score <= 60:
        return "Moderate"
    elif score <= 80:
        return "High"
    return "Critical"

def predict_zone_risk(zone_data: dict) -> dict:
    """
    Predicts the risk score using ML model.
    If the model fails or is unavailable, falls back to the rule-based engine.
    """
    # Import locally to avoid circular dependencies if risk_engine imports this
    from services.risk_engine import calculate_zone_risk

    rule_base = calculate_zone_risk(zone_data)
    rule_score = rule_base["risk_score"]
    
    _load_model()
    
    if model is None or features is None:
        return {
            "ml_risk_score": rule_score,
            "ml_risk_level": rule_base["risk_level"],
            "model_used": False,
            "risk_source": "Rule-Based"
        }

    try:
        # Prepare feature vector
        row = {}
        for f in features:
            row[f] = float(zone_data.get(f, 0))
            
        df = pd.DataFrame([row])
        prediction = float(model.predict(df)[0])
        ml_score = round(min(prediction, 100.0), 1)
        ml_level = get_risk_level(ml_score)
        
        return {
            "ml_risk_score": ml_score,
            "ml_risk_level": ml_level,
            "model_used": True,
            "risk_source": "ML"
        }
    except Exception as e:
        logger.error(f"ML Prediction failed: {e}")
        return {
            "ml_risk_score": rule_score,
            "ml_risk_level": rule_base["risk_level"],
            "model_used": False,
            "risk_source": "Rule-Based"
        }
