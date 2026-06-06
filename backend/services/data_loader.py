import json
import logging
from pathlib import Path

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base path for the data directory
DATA_DIR = Path(__file__).parent.parent / "data"

def load_json(file_name: str):
    file_path = DATA_DIR / file_name
    if not file_path.exists():
        logger.warning(f"File not found: {file_path}")
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if data is not None else []
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {file_path}: {e}")
        return []
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        return []

def save_json(file_name: str, data):
    file_path = DATA_DIR / file_name
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving {file_path}: {e}")

def get_zones():
    return load_json("zones.json")

def get_telemetry():
    return load_json("telemetry.json")

def get_resources():
    return load_json("resources.json")

def get_incidents():
    return load_json("incidents.json")

def get_alerts():
    return load_json("alerts.json")

def get_patterns():
    return load_json("historical_patterns.json")
