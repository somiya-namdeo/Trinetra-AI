import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("C:/Users/namde/OneDrive/Desktop/Trinetra-AI/backend/.env")

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

try:
    # Fetch first resource
    res = supabase.table("resources").select("*").limit(1).execute()
    if res.data:
        r_id = res.data[0]['id']
        print(f"Testing update on resource {r_id}")
        update_res = supabase.table("resources").update({
            "assigned_incident_id": 9999,
            "assigned_incident_title": "Test Title"
        }).eq("id", r_id).execute()
        print("Update successful:", update_res.data)
    else:
        print("No resources found")
except Exception as e:
    print("Error:", e)
