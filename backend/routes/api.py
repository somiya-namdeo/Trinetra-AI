from fastapi import APIRouter
from models.schemas import IncidentAnalyzeRequest, AlertGenerateRequest
from services import ai_service
from services.memory_ai import generate_memory_ai_insight
from services.data_loader import get_zones, get_incidents, get_resources, get_alerts, get_telemetry, get_patterns
from services.risk_engine import enrich_zones_with_risk

router = APIRouter()

# ---------------------------------------------------------
# Existing Working POST Endpoints (Gemini AI integrated)
# ---------------------------------------------------------
@router.post("/incidents/analyze")
def analyze_incident_api(request: IncidentAnalyzeRequest):
    return ai_service.analyze_incident(request.report)

@router.post("/alerts/generate")
def generate_alerts_api(request: AlertGenerateRequest):
    return ai_service.generate_alerts(
        request.incident_type,
        request.location,
        request.severity
    )

# ---------------------------------------------------------
# New Data-Driven GET Endpoints
# ---------------------------------------------------------
@router.get("/memory-ai/insight")
def memory_ai_insight_api():
    return generate_memory_ai_insight()

@router.get("/zones")
def get_zones_api():
    zones = get_zones()
    return enrich_zones_with_risk(zones)

@router.get("/incidents")
def get_incidents_api():
    return get_incidents()

@router.get("/resources")
def get_resources_api():
    return get_resources()

@router.get("/alerts")
def get_alerts_api():
    return get_alerts()

@router.get("/telemetry")
def get_telemetry_api():
    return get_telemetry()

@router.get("/patterns")
def get_patterns_api():
    return get_patterns()
