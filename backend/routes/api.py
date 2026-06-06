from fastapi import APIRouter
from models.schemas import IncidentAnalyzeRequest, AlertGenerateRequest
from services import ai_service
from services.memory_ai import generate_memory_ai_insight
from services.data_loader import get_zones, get_incidents, get_resources, get_alerts, get_telemetry, get_patterns
from services.risk_engine import enrich_zones_with_risk
from services import supabase_service

router = APIRouter()

# ---------------------------------------------------------
# Existing Working POST Endpoints (Gemini AI integrated)
# ---------------------------------------------------------
@router.post("/incidents/analyze")
def analyze_incident_api(request: IncidentAnalyzeRequest):
    result = ai_service.analyze_incident(request.report)
    
    # Attempt to insert into Supabase asynchronously/safely
    if result and not result.get("error"):
        try:
            # We are inserting the analyzed incident.
            # Convert result into DB schema if necessary, or just store raw.
            # In a real app we'd map fields perfectly. Here we just try raw.
            # We wrap in try-except so it doesn't break the return.
            supabase_service.insert_incident({
                "title": result.get("category", "Analysis"),
                "status": "Active",
                "severity": result.get("severity", "Medium"),
                "location": "Sector 7",
                "description": request.report
            })
        except Exception:
            pass

    return result

@router.post("/alerts/generate")
def generate_alerts_api(request: AlertGenerateRequest):
    result = ai_service.generate_alerts(
        request.incident_type,
        request.location,
        request.severity
    )
    
    if result and not result.get("error"):
        try:
            supabase_service.insert_alert({
                "title": f"Alert: {request.incident_type}",
                "message": result.get("english", ""),
                "hindi_message": result.get("hindi", ""),
                "status": "DRAFT",
                "severity": request.severity,
                "location": request.location
            })
        except Exception:
            pass

    return result

# ---------------------------------------------------------
# New Data-Driven GET Endpoints (Supabase with JSON fallback)
# ---------------------------------------------------------
@router.get("/memory-ai/insight")
def memory_ai_insight_api():
    return generate_memory_ai_insight()

@router.get("/zones")
def get_zones_api():
    zones = supabase_service.fetch_zones()
    if not zones:
        zones = get_zones()
    return enrich_zones_with_risk(zones)

@router.get("/incidents")
def get_incidents_api():
    incidents = supabase_service.fetch_incidents()
    if not incidents:
        incidents = get_incidents()
    return incidents

@router.get("/resources")
def get_resources_api():
    resources = supabase_service.fetch_resources()
    if not resources:
        resources = get_resources()
    return resources

@router.get("/alerts")
def get_alerts_api():
    alerts = supabase_service.fetch_alerts()
    if not alerts:
        alerts = get_alerts()
    return alerts

@router.get("/telemetry")
def get_telemetry_api():
    return get_telemetry()

@router.get("/patterns")
def get_patterns_api():
    return get_patterns()
