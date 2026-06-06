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
    critical_zones = []
    for zone in zones:
        risk = calculate_zone_risk(zone)
        if risk["risk_score"] >= 80:
            enriched_zone = dict(zone)
            enriched_zone["risk_score"] = risk["risk_score"]
            enriched_zone["risk_level"] = risk["risk_level"]
            critical_zones.append(enriched_zone)
    return critical_zones

def enrich_zones_with_risk(zones: list) -> list:
    """
    Adds calculated risk_score and risk_level to every zone object in the list.
    """
    enriched = []
    for zone in zones:
        enriched_zone = dict(zone)
        risk = calculate_zone_risk(enriched_zone)
        enriched_zone["risk_score"] = risk["risk_score"]
        enriched_zone["risk_level"] = risk["risk_level"]
        enriched.append(enriched_zone)
    return enriched

def detect_emergency_patterns():
    # Placeholder for future pattern detection logic
    return []

def generate_memory_ai_insight():
    # Placeholder for future AI insight generation
    return {}
