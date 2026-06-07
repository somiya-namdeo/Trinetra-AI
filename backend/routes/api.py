from fastapi import APIRouter
from models.schemas import (
    IncidentAnalyzeRequest, 
    AlertGenerateRequest, 
    AlertSaveRequest,
    ResourceDispatchRequest, 
    IncidentStatusUpdateRequest, 
    IncidentCreateRequest
)
from services import ai_service
from services.memory_ai import generate_memory_ai_insight
from services.data_loader import get_zones, get_incidents, get_resources, get_alerts, get_telemetry, get_patterns, save_json
from services.risk_engine import enrich_zones_with_risk
from services import supabase_service

router = APIRouter()

# ---------------------------------------------------------
# Existing Working POST Endpoints (Gemini AI integrated)
# ---------------------------------------------------------
@router.post("/incidents/analyze")
def analyze_incident_api(request: IncidentAnalyzeRequest):
    result = ai_service.analyze_incident(request.report)
    
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
            inserted = supabase_service.insert_alert({
                "title": f"Alert: {request.incident_type}",
                "english_message": result.get("english", ""),
                "hindi_message": result.get("hindi", ""),
                "status": "DRAFT",
                "severity": request.severity,
                "location": request.location
            })
            if inserted and "id" in inserted:
                result["id"] = inserted["id"]
        except Exception:
            pass

    return result

@router.post("/alerts/save")
def save_alert_api(request: AlertSaveRequest):
    import datetime
    data = {
        "title": request.title,
        "english_message": request.english_message,
        "hindi_message": request.hindi_message,
        "incident_id": request.incident_id,
        "channels": request.channels,
        "status": request.status,
        "reach": request.reach
    }
    
    if request.status == "BROADCASTED":
        data["broadcast_at"] = datetime.datetime.utcnow().isoformat()
        
    data["updated_at"] = datetime.datetime.utcnow().isoformat()
    
    saved_alert = None
    if request.id:
        saved_alert = supabase_service.update_alert(request.id, data)
    else:
        saved_alert = supabase_service.insert_alert(data)
        
    return {"status": "success", "alert": saved_alert}

# ---------------------------------------------------------
# New Data-Driven GET Endpoints (Supabase with JSON fallback)
# ---------------------------------------------------------
@router.post("/resources/seed")
def seed_resources_api():
    existing = supabase_service.fetch_resources()
    if existing and len(existing) >= 20:
        return {"success": True, "message": "Resources already seeded"}
        
    existing_names = [res.get("name") for res in (existing or []) if res.get("name")]
        
    import datetime
    now_str = datetime.datetime.utcnow().isoformat()
    
    seed_data = []
    
    # Ambulances (10 units)
    amb_locations = ["Medical Camp", "Gate 7", "Zone A", "Gate 3", "Food Court", "Medical Camp", "Zone C", "North Gate", "Water Station", "Parking Area"]
    amb_status = ["AVAILABLE", "AVAILABLE", "AVAILABLE", "DEPLOYED", "BUSY", "AVAILABLE", "AVAILABLE", "AVAILABLE", "AVAILABLE", "AVAILABLE"]
    for i in range(10):
        seed_data.append({
            "name": f"Ambulance {i+1:02d}",
            "type": "Ambulance",
            "status": amb_status[i],
            "location": amb_locations[i]
        })
        
    # Medical Teams (8 units)
    med_locations = ["Medical Camp", "Gate 7", "Zone A", "Food Court", "North Gate", "Water Station", "Medical Camp", "Zone C"]
    for i in range(8):
        seed_data.append({
            "name": f"Medical Team {i+1:02d}",
            "type": "Medical Team",
            "status": "AVAILABLE",
            "location": med_locations[i]
        })
        
    # Security Units (12 units)
    sec_status = ["AVAILABLE"] * 10 + ["DEPLOYED", "BUSY"]
    for i in range(12):
        seed_data.append({
            "name": f"Security Unit {i+1:02d}",
            "type": "Security Unit",
            "status": sec_status[i],
            "location": "Control Center"
        })
        
    # Fire Units (4 units)
    for i in range(4):
        seed_data.append({
            "name": f"Fire Unit {i+1:02d}",
            "type": "Fire Unit",
            "status": "AVAILABLE",
            "location": "Fire Station"
        })
        
    # Volunteer Teams (8 units)
    for i in range(8):
        seed_data.append({
            "name": f"Volunteer Team {i+1:02d}",
            "type": "Volunteer Team",
            "status": "AVAILABLE",
            "location": "Volunteer Camp"
        })
        
    # Drone Units (2 units)
    for i in range(2):
        seed_data.append({
            "name": f"Drone Unit {i+1:02d}",
            "type": "Drone Unit",
            "status": "AVAILABLE",
            "location": "Control Center"
        })
        
    # Water Tankers (4 units)
    for i in range(4):
        seed_data.append({
            "name": f"Water Tanker {i+1:02d}",
            "type": "Water Tanker",
            "status": "AVAILABLE",
            "location": "Water Station"
        })
        
    # Command Vehicles (2 units)
    for i in range(2):
        seed_data.append({
            "name": f"Command Vehicle {i+1:02d}",
            "type": "Command Vehicle",
            "status": "AVAILABLE",
            "location": "Control Center"
        })
        
    to_insert = [item for item in seed_data if item["name"] not in existing_names]
    
    if len(to_insert) > 0:
        result = supabase_service.insert_resources(to_insert)
        if result:
            return {"success": True, "message": f"Resources seeded successfully ({len(to_insert)} added)"}
        return {"success": False, "message": "Failed to seed resources"}
    return {"success": True, "message": "Resources already seeded"}

@router.post("/resources/dispatch")
def dispatch_resource_api(request: ResourceDispatchRequest):
    print(f"Backend request received: {request.dict()}")
    resources = supabase_service.fetch_resources()
    if not resources:
        resources = get_resources()
    
    updated = False
    for res in resources:
        if str(res.get("id")) == str(request.resource_id):
            res["status"] = "DEPLOYED"
            res["location"] = request.location
            incident_id_val = request.incident_id
            if request.incident_id and str(request.incident_id).isdigit():
                incident_id_val = int(request.incident_id)
                
            if request.incident_id:
                res["assigned_incident_id"] = incident_id_val
                res["assigned_incident_title"] = request.incident_title
            updated = True
            
            # Update Supabase
            try:
                payload = {
                    "status": "DEPLOYED",
                    "location": request.location,
                    "assigned_incident_id": incident_id_val,
                    "assigned_incident_title": request.incident_title
                }
                response = supabase_service.update_resource(str(res.get("id")), payload)
                print(f"Dispatch response: {response}")
            except Exception as e:
                print(f"Dispatch error: {e}")
                
            break
            
    if updated:
        # Save back to JSON as fallback persistence
        save_json("resources.json", resources)
        return {"status": "success", "message": f"Resource {request.resource_id} dispatched"}
    return {"status": "error", "message": "Resource not found"}

@router.post("/incidents/create")
def create_incident_api(request: IncidentCreateRequest):
    new_inc = request.dict(exclude={"id"})
    
    created_inc = None
    try:
        created_inc = supabase_service.insert_incident({
            "incident_id": request.incident_id,
            "title": request.title,
            "status": request.status,
            "severity": request.severity,
            "location": request.location,
            "zone": request.zone,
            "description": request.description,
            "category": request.category,
            "priority_score": request.priority_score,
            "recommended_resources": request.recommended_resources,
            "recommended_action": request.recommended_action
        })
    except Exception:
        pass
        
    if created_inc and "id" in created_inc:
        new_inc["id"] = created_inc["id"]
    else:
        import time
        new_inc["id"] = int(time.time() * 1000)
        
    incidents = supabase_service.fetch_incidents()
    if not incidents:
        incidents = get_incidents()
        
    incidents.insert(0, new_inc)
    save_json("incidents.json", incidents)
    return {"status": "success", "incident": new_inc}

@router.post("/incidents/update_status")
def update_incident_status_api(request: IncidentStatusUpdateRequest):
    import datetime
    incidents = supabase_service.fetch_incidents()
    if not incidents:
        incidents = get_incidents()
        
    updated = False
    updated_inc = None
    now_str = datetime.datetime.now().isoformat() + "Z"
    
    for inc in incidents:
        if str(inc.get("id")) == str(request.id):
            inc["status"] = request.status
            if request.status == "RESOURCES_ASSIGNED":
                inc["resources_assigned_at"] = now_str
            elif request.status == "IN_PROGRESS":
                inc["in_progress_at"] = now_str
            elif request.status == "CONTAINED":
                inc["contained_at"] = now_str
            elif request.status == "RESOLVED":
                inc["resolved_at"] = now_str
            updated = True
            updated_inc = inc
            break
            
    if updated:
        save_json("incidents.json", incidents)
        
        supabase_warning = None
        # Update Supabase if connected
        try:
            update_data = { "status": request.status }
            if request.status == "RESOURCES_ASSIGNED":
                update_data["resources_assigned_at"] = now_str
            elif request.status == "IN_PROGRESS":
                update_data["in_progress_at"] = now_str
            elif request.status == "CONTAINED":
                update_data["contained_at"] = now_str
            elif request.status == "RESOLVED":
                update_data["resolved_at"] = now_str
            
            sb = supabase_service.get_supabase()
            if sb:
                sb_res = supabase_service.update_incident(request.id, update_data)
                if not sb_res:
                    check_res = sb.table("incidents").select("status").eq("id", request.id).execute()
                    if check_res.data and check_res.data[0].get("status") != request.status:
                        return {"success": False, "message": "Supabase update failed. Status still ACTIVE."}
        except Exception as e:
            return {"success": False, "message": f"Supabase update failed: {str(e)}"}
        
        # Free resources if RESOLVED
        if request.status == "RESOLVED":
            # Attempt Supabase native release first
            supabase_service.release_resources_for_incident(str(request.id))
            
            # Fallback for local JSON
            resources = supabase_service.fetch_resources()
            if not resources:
                resources = get_resources()
                
            res_updated = False
            for res in resources:
                should_release = False
                if str(res.get("assigned_incident_id", "")) == str(request.id) or str(res.get("assignment", "")) == str(request.id):
                    should_release = True
                        
                if should_release:
                    res["status"] = "AVAILABLE"
                    res["task"] = None
                    res["assignment"] = None
                    res["assigned_incident_id"] = None
                    res["assigned_incident_title"] = None
                    res_updated = True
                        
            if res_updated:
                save_json("resources.json", resources)

        res_payload = {
            "success": True, 
            "message": "Incident status updated", 
            "incident": updated_inc
        }
        return res_payload
    return {"success": False, "message": "Incident not found"}
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
