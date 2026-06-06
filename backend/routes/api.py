from fastapi import APIRouter
from models.schemas import IncidentAnalyzeRequest, AlertGenerateRequest
from services import ai_service

router = APIRouter()

@router.post("/incidents/analyze")
def analyze_incident_api(request: IncidentAnalyzeRequest):
    return ai_service.analyze_incident(request.report)

@router.get("/memory-ai/insight")
def memory_ai_insight_api():
    return {
        "pattern_detected": "Potential Heat Stress Cluster",
        "confidence": 87,
        "predicted_escalation": "8-12 minutes",
        "linked_signals": [
            "Water Station #3 Failure",
            "Queue Length Spike at Zone A",
            "Three Medical Incidents in 11 minutes",
            "High Temperature Index"
        ],
        "reasoning_trace": [
            "Detected water station telemetry failure at 14:08.",
            "Correlated queue length spike of 187% above baseline.",
            "Detected three medical incidents in the same zone.",
            "Matched historical pattern of heat-stress escalation.",
            "Recommended preventive action cascade."
        ],
        "preventive_actions": [
            "Deploy mobile hydration unit to Zone A",
            "Open backup water station B-12",
            "Broadcast hydration alert in Hindi and English",
            "Pre-position Medical Team Bravo",
            "Reroute incoming crowd through shaded corridor C-2"
        ]
    }

@router.post("/alerts/generate")
def generate_alerts_api(request: AlertGenerateRequest):
    return ai_service.generate_alerts(
        request.incident_type,
        request.location,
        request.severity
    )

@router.get("/resources")
def get_resources_api():
    return [
        { "id": "AMB-01", "name": "Ambulance 01", "type": "Medical", "status": "Deployed", "location": "Gate 7", "eta": "On site" },
        { "id": "AMB-02", "name": "Ambulance 02", "type": "Medical", "status": "Available", "location": "Base", "eta": "3 min" },
        { "id": "MED-01", "name": "Medical Team Alpha", "type": "Medical", "status": "Deployed", "location": "Zone A", "eta": "On site" },
        { "id": "MED-02", "name": "Medical Team Bravo", "type": "Medical", "status": "Available", "location": "Zone B", "eta": "4 min" },
        { "id": "SEC-01", "name": "Security Unit 01", "type": "Security", "status": "Deployed", "location": "North Gate", "eta": "On site" },
        { "id": "SEC-02", "name": "Security Unit 02", "type": "Security", "status": "Available", "location": "Gate 7", "eta": "2 min" }
    ]
