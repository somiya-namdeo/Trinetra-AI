import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure minimal logging
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

_supabase_client: Client | None = None

def get_supabase() -> Client | None:
    """
    Returns the Supabase client if configured, otherwise returns None.
    This ensures the app never crashes if Supabase is unavailable.
    """
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client

    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("Supabase credentials (SUPABASE_URL, SUPABASE_KEY) not found in environment. Falling back to local data.")
        return None

    try:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None
