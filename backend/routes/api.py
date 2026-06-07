from fastapi import APIRouter
from models.schemas import IncidentAnalyzeRequest, AlertGenerateRequest, ResourceDispatchRequest, IncidentStatusUpdateRequest, IncidentCreateRequest
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
@router.post("/resources/dispatch")
def dispatch_resource_api(request: ResourceDispatchRequest):
    resources = supabase_service.fetch_resources()
    if not resources:
        resources = get_resources()
    
    updated = False
    for res in resources:
        if str(res.get("id")) == str(request.id):
            res["status"] = "DEPLOYED"
            res["task"] = request.task
            res["location"] = request.location
            res["assignment"] = request.task
            incident_id_val = request.incident_id
            if request.incident_id and str(request.incident_id).isdigit():
                incident_id_val = int(request.incident_id)
                
            if request.incident_id:
                res["assigned_incident_id"] = incident_id_val
            updated = True
            
            # Update Supabase
            try:
                supabase_service.update_resource(str(res.get("id")), {
                    "status": "DEPLOYED",
                    "task": request.task,
                    "location": request.location,
                    "assignment": request.task,
                    "assigned_incident_id": incident_id_val,
                    "assigned_incident_title": request.task
                })
            except Exception:
                pass
                
            break
            
    if updated:
        # Save back to JSON as fallback persistence
        save_json("resources.json", resources)
        return {"status": "success", "message": f"Resource {request.id} dispatched"}
    return {"status": "error", "message": "Resource not found"}

@router.post("/incidents/create")
def create_incident_api(request: IncidentCreateRequest):
    new_inc = request.dict(exclude={"id"})
    
    created_inc = None
    try:
        created_inc = supabase_service.insert_incident({
            "title": request.title,
            "status": request.status,
            "severity": request.severity,
            "location": request.location,
            "description": "Generated via Report",
            "category": request.category
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
            resources = supabase_service.fetch_resources()
            if not resources:
                resources = get_resources()
                
            res_updated = False
            for res in resources:
                should_release = False
                
                if str(res.get("assigned_incident_id", "")) == str(request.id):
                    should_release = True
                elif res.get("status") != "Available":
                    # Fallback fuzzy match
                    task_str = str(res.get("task", "")).lower()
                    assign_str = str(res.get("assignment", "")).lower()
                    loc_str = str(res.get("location", "")).lower()
                    inc_id_str = str(request.id).lower()
                    
                    target_inc = next((i for i in incidents if str(i.get("id")) == str(request.id)), None)
                    if target_inc:
                        inc_loc = str(target_inc.get("location", target_inc.get("zone", ""))).lower()
                        inc_title = str(target_inc.get("title", "")).lower()
                        
                        if (inc_id_str in task_str or inc_id_str in assign_str or 
                            (inc_loc and (inc_loc in task_str or inc_loc in assign_str or inc_loc in loc_str)) or 
                            (inc_title and (inc_title in task_str or inc_title in assign_str))):
                            should_release = True
                        
                if should_release:
                    res["status"] = "AVAILABLE"
                    res["task"] = "Unassigned"
                    res["assignment"] = "Unassigned"
                    res["assigned_incident_id"] = None
                    res["assigned_incident_title"] = None
                    res_updated = True
                    
                    # Update Supabase
                    try:
                        supabase_service.update_resource(str(res.get("id")), {
                            "status": "AVAILABLE",
                            "task": "Unassigned",
                            "assignment": "Unassigned",
                            "assigned_incident_id": None,
                            "assigned_incident_title": None
                        })
                    except Exception:
                        pass
                        
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
