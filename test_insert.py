import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.supabase_service import get_supabase
import datetime

supabase = get_supabase()
if not supabase:
    print("Could not connect to Supabase.")
    sys.exit(1)

seed_data = [{
    "name": "Ambulance 01",
    "type": "Ambulance",
    "status": "AVAILABLE",
    "location": "Medical Camp"
}]

try:
    print("Attempting to insert...")
    response = supabase.table("resources").insert(seed_data).execute()
    print("Insert response:", response)
except Exception as e:
    print("Insert failed with error:", e)
