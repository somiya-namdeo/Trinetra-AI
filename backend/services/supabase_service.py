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
