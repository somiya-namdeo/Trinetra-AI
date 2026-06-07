def calculate_zone_risk(zone: dict) -> dict:
    """
    Calculates a live risk score for a single zone based on metrics.
    
    Inputs used:
    - crowd_density
    - temperature 
    - queue_length
    - medical_incidents_last_15_min
    - security_alerts
    """
    crowd_density = float(zone.get("crowd_density", 0))
    temperature = float(zone.get("temperature", 25))
    queue_length = float(zone.get("queue_length", 0))
    medical_incidents = float(zone.get("medical_incidents_last_15_min", 0))
    security_alerts = float(zone.get("security_alerts", 0))

    score_crowd = 0.35 * crowd_density
    score_temp = 0.25 * min((temperature / 50.0) * 100, 100)
    score_queue = 0.20 * min((queue_length / 500.0) * 100, 100)
    score_med = 0.15 * min((medical_incidents / 10.0) * 100, 100)
    score_sec = 0.05 * min((security_alerts / 10.0) * 100, 100)

    total_score = score_crowd + score_temp + score_queue + score_med + score_sec
    total_score = min(total_score, 100.0)

    if total_score <= 30:
        level = "Low"
    elif total_score <= 60:
        level = "Moderate"
    elif total_score <= 80:
        level = "High"
    else:
        level = "Critical"

    return {
        "risk_score": round(total_score, 1),
        "risk_level": level
    }

def get_critical_zones(zones: list) -> list:
    """
    Evaluates a list of zones and returns only those with a risk_score >= 80.
    """
    enriched_all = enrich_zones_with_risk(zones)
    critical_zones = [z for z in enriched_all if max(z.get("risk_score", 0), z.get("ml_risk_score", 0)) >= 80]
    return critical_zones

def enrich_zones_with_risk(zones: list) -> list:
    """
    Adds calculated risk_score and risk_level to every zone object in the list.
    Also injects ML-based predictions for comparison.
    """
    # Import ml_service here to prevent circular imports
    from services.ml_service import predict_zone_risk
    
    enriched = []
    for zone in zones:
        enriched_zone = dict(zone)
        # 1. Base rule engine
        risk = calculate_zone_risk(enriched_zone)
        enriched_zone["risk_score"] = risk["risk_score"]
        
        # 2. ML Prediction engine
        ml_risk = predict_zone_risk(enriched_zone)
        enriched_zone["ml_risk_score"] = ml_risk["ml_risk_score"]
        enriched_zone["ml_risk_level"] = ml_risk["ml_risk_level"]
        enriched_zone["model_used"] = ml_risk["model_used"]
        enriched_zone["risk_source"] = ml_risk["risk_source"]
        
        # 3. Final primary level logic (Use ML if available, else rules)
        if enriched_zone["model_used"]:
            enriched_zone["risk_level"] = enriched_zone["ml_risk_level"]
        else:
            enriched_zone["risk_level"] = risk["risk_level"]
            
        enriched.append(enriched_zone)
    return enriched

def detect_emergency_patterns():
    # Placeholder for future pattern detection logic
    return []

def generate_memory_ai_insight():
    # Placeholder for future AI insight generation
    return {}
