import logging
from typing import List, Dict, Any, Optional
from database.supabase_client import get_supabase

logger = logging.getLogger(__name__)

# Data fetchers
def fetch_incidents() -> Optional[List[Dict[str, Any]]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("incidents").select("*").execute()
        return response.data
    except Exception as e:
        logger.warning(f"Supabase fetch_incidents failed: {e}")
        return None

def fetch_resources() -> Optional[List[Dict[str, Any]]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("resources").select("*").execute()
        return response.data
    except Exception as e:
        logger.warning(f"Supabase fetch_resources failed: {e}")
        return None

def fetch_zones() -> Optional[List[Dict[str, Any]]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("zones").select("*").execute()
        return response.data
    except Exception as e:
        logger.warning(f"Supabase fetch_zones failed: {e}")
        return None

def fetch_alerts() -> Optional[List[Dict[str, Any]]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("alerts").select("*").execute()
        return response.data
    except Exception as e:
        logger.warning(f"Supabase fetch_alerts failed: {e}")
        return None

# Mutations
def insert_incident(data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("incidents").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.warning(f"Supabase insert_incident failed: {e}")
        return None

def insert_alert(data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("alerts").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.warning(f"Supabase insert_alert failed: {e}")
        return None

def update_alert(alert_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("alerts").update(data).eq("id", alert_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.warning(f"Supabase update_alert failed: {e}")
        return None

def update_resource(resource_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("resources").update(data).eq("id", resource_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.warning(f"Supabase update_resource failed: {e}")
        return None

def update_incident(incident_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("incidents").update(data).eq("id", incident_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.warning(f"Supabase update_incident failed: {e}")
        return None

def insert_resources(resources: List[Dict[str, Any]]) -> Optional[List[Dict[str, Any]]]:
    supabase = get_supabase()
    if not supabase:
        return None
    try:
        response = supabase.table("resources").insert(resources).execute()
        return response.data
    except Exception as e:
        logger.warning(f"Supabase insert_resources failed: {e}")
        print(f"DEBUG ERROR insert_resources: {e}")
        return None

def release_resources_for_incident(incident_id: str) -> bool:
    supabase = get_supabase()
    if not supabase:
        return False
    import datetime
    try:
        now_str = datetime.datetime.utcnow().isoformat()
        
        # Match by assigned_incident_id directly as strings (or int if possible)
        # Assuming incident_id could be stored in assigned_incident_title or assigned_incident_id
        response = None
        if incident_id and str(incident_id).isdigit():
            response = supabase.table("resources").update({
                "status": "AVAILABLE",
                "assigned_incident_id": None,
                "assigned_incident_title": None
            }).eq("assigned_incident_id", int(incident_id)).execute()
        else:
            response = supabase.table("resources").update({
                "status": "AVAILABLE",
                "assigned_incident_id": None,
                "assigned_incident_title": None
            }).eq("assigned_incident_title", str(incident_id)).execute()
            
        print(f"Release response: {response}")
        return True
    except Exception as e:
        logger.warning(f"Supabase release_resources_for_incident failed: {e}")
        return False
