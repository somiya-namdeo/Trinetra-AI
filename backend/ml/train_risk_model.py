import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# This model is trained on simulated event telemetry for hackathon demonstration.

# Set up paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "telemetry.json")
MODEL_DIR = os.path.join(BASE_DIR, "ml", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "risk_features.json")

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

def generate_synthetic_risk_score(df):
    """
    risk_score = 0.35 * crowd_density
    + 0.25 * normalized temperature
    + 0.20 * normalized queue_length
    + 0.15 * normalized medical_reports_count
    + 0.05 * normalized security_reports_count
    Cap score at 100.
    """
    # Simple min-max normalization function for a series
    def normalize(series):
        if series.max() == series.min():
            return np.zeros(len(series))
        return (series - series.min()) / (series.max() - series.min()) * 100

    # Ensure crowd density is treated as a percentage 0-100 if not already
    df['normalized_temperature'] = normalize(df.get('temperature', pd.Series(np.zeros(len(df)))))
    df['normalized_queue_length'] = normalize(df.get('queue_length', pd.Series(np.zeros(len(df)))))
    df['normalized_medical'] = normalize(df.get('medical_reports_count', pd.Series(np.zeros(len(df)))))
    df['normalized_security'] = normalize(df.get('security_reports_count', pd.Series(np.zeros(len(df)))))

    # Assumes crowd_density is roughly 0-100 scale. If it's a raw number, we'd normalize it too.
    # In our dummy data, crowd_density is usually 0-100%.
    score = (
        0.35 * df.get('crowd_density', 0) +
        0.25 * df['normalized_temperature'] +
        0.20 * df['normalized_queue_length'] +
        0.15 * df['normalized_medical'] +
        0.05 * df['normalized_security']
    )
    
    return np.clip(score, 0, 100)

def train_model():
    print(f"Loading data from {DATA_PATH}...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return

    with open(DATA_PATH, 'r') as f:
        data = json.load(f)

    if not data:
        print("Error: Telemetry data is empty.")
        return

    df = pd.DataFrame(data)

    # Required Features
    features = [
        'crowd_density', 
        'temperature', 
        'humidity', 
        'queue_length', 
        'water_station_pressure', 
        'medical_reports_count', 
        'security_reports_count'
    ]

    # Ensure all features exist in DF, fill missing with 0
    for f in features:
        if f not in df.columns:
            df[f] = 0

    # Generate target if missing
    if 'risk_score' not in df.columns:
        print("Generating synthetic risk_score target...")
        df['risk_score'] = generate_synthetic_risk_score(df)

    X = df[features]
    y = df['risk_score']

    # Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)

    # Save artifacts
    joblib.dump(model, MODEL_PATH)
    with open(FEATURES_PATH, 'w') as f:
        json.dump(features, f)

    print("==================================")
    print("Training Summary")
    print("==================================")
    print(f"Total rows trained on: {len(X_train)}")
    print(f"Feature Names: {features}")
    print(f"R2 Score: {r2:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.4f}")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Features saved to: {FEATURES_PATH}")
    print("==================================")

if __name__ == "__main__":
    train_model()
