import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

def get_mock_incident_analysis(report: str = ""):
    report_lower = report.lower()
    
    if any(word in report_lower for word in ["water", "पानी", "station", "supply", "unavailable", "depleted"]):
        return {
            "category": "Water Supply Failure",
            "location": "Station 2" if "station 2" in report_lower else "Unknown Water Station",
            "severity": "High",
            "priority_score": 82,
            "recommended_resources": ["Water Supply Unit", "Volunteer Team", "Security Unit"],
            "recommended_action": "Deploy backup water supply, guide crowd to nearest hydration point, and monitor heat-related symptoms.",
            "estimated_response_time": "6 minutes"
        }
        
    if any(word in report_lower for word in ["crowd", "rush", "bottleneck", "queue"]):
        return {
            "category": "Crowd Surge Risk",
            "location": "North Gate" if "north gate" in report_lower else "Unknown Sector",
            "severity": "High",
            "priority_score": 89,
            "recommended_resources": ["Security Unit", "Volunteer Team", "Drone Unit"],
            "recommended_action": "Deploy security to manage crowd flow, open secondary exits, and use PA system to guide visitors.",
            "estimated_response_time": "3 minutes"
        }
        
    if any(word in report_lower for word in ["fire", "smoke", "overheating"]):
        return {
            "category": "Fire Hazard",
            "location": "Food Court" if "food court" in report_lower else "Unknown Sector",
            "severity": "Critical",
            "priority_score": 95,
            "recommended_resources": ["Fire Unit", "Medical Team", "Security Unit"],
            "recommended_action": "Evacuate immediate area, dispatch fire suppression unit, and setup triage.",
            "estimated_response_time": "2 minutes"
        }
        
    if any(word in report_lower for word in ["lost child", "missing"]):
        return {
            "category": "Lost Child",
            "location": "Zone C" if "zone c" in report_lower else "Unknown Sector",
            "severity": "Medium",
            "priority_score": 75,
            "recommended_resources": ["Security Unit", "Volunteer Team"],
            "recommended_action": "Broadcast description to all ground units, secure exit gates, and escort parents to control room.",
            "estimated_response_time": "4 minutes"
        }
        
    return {
        "category": "Medical Emergency",
        "location": "Gate 7",
        "severity": "High",
        "priority_score": 87,
        "recommended_resources": ["Ambulance A2", "Medical Team Bravo", "Security Unit S1"],
        "recommended_action": "Clear the crowd, dispatch medical team, and secure the area.",
        "estimated_response_time": "4 minutes"
    }

def get_mock_alert_generation(incident_type: str, location: str, severity: str):
    inc_lower = incident_type.lower()
    
    if "heat stress" in inc_lower:
        return {
            "english": f"URGENT — Heat stress risk detected in {location}. Please move calmly toward shaded hydration points. Free drinking water and medical assistance are available nearby.",
            "hindi": f"तत्काल सूचना — {location} में हीट स्ट्रेस का खतरा पाया गया है। कृपया शांतिपूर्वक छायादार जल केंद्रों की ओर जाएं। पीने का पानी और चिकित्सा सहायता पास में उपलब्ध है।"
        }
    if "fire" in inc_lower:
        return {
            "english": f"URGENT — Fire hazard reported near {location}. Please move away from the affected area and follow emergency staff instructions.",
            "hindi": f"तत्काल सूचना — {location} के पास आग का खतरा बताया गया है। कृपया प्रभावित क्षेत्र से दूर जाएं और आपातकालीन कर्मचारियों के निर्देशों का पालन करें।"
        }
    if "crowd" in inc_lower:
        return {
            "english": f"ATTENTION — Crowd congestion detected near {location}. Please use alternate entry and exit routes as directed by staff.",
            "hindi": f"ध्यान दें — {location} के पास भीड़भाड़ पाई गई है। कृपया कर्मचारियों द्वारा बताए गए वैकल्पिक प्रवेश और निकास मार्गों का उपयोग करें।"
        }
    if "lost child" in inc_lower:
        return {
            "english": f"NOTICE — A lost child case has been reported near {location}. Please remain calm and report any information to the nearest help desk.",
            "hindi": f"सूचना — {location} के पास एक खोए हुए बच्चे की सूचना मिली है। कृपया शांत रहें और कोई भी जानकारी निकटतम सहायता केंद्र पर दें।"
        }
        
    return {
        "english": f"ATTENTION: High crowd density near {location}. Please use East Entry or Gate 4B. Emergency services are active.",
        "hindi": f"ध्यान दें: {location} के पास भारी भीड़ है। कृपया पूर्वी प्रवेश द्वार या गेट 4B का उपयोग करें।"
    }

def analyze_incident(report: str):
    if not model:
        return get_mock_incident_analysis(report)
    
    prompt = f"""
    Analyze the following emergency report and extract details into a strictly formatted JSON.
    Report: "{report}"
    
    Required JSON schema:
    {{
        "category": "string",
        "location": "string",
        "severity": "string",
        "priority_score": integer,
        "recommended_resources": ["string"],
        "recommended_action": "string",
        "estimated_response_time": "string"
    }}
    Return ONLY JSON. Do not include markdown blocks.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3]
        elif text.startswith('```'):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return get_mock_incident_analysis(report)

def generate_alerts(incident_type: str, location: str, severity: str):
    if not model:
        return get_mock_alert_generation(incident_type, location, severity)
    
    prompt = f"""
    Generate an emergency public broadcast message for the following incident.
    Incident: {incident_type}
    Location: {location}
    Severity: {severity}
    
    Provide the message in English and Hindi as a strictly formatted JSON.
    Required JSON schema:
    {{
        "english": "string",
        "hindi": "string"
    }}
    Return ONLY JSON. Do not include markdown blocks.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3]
        elif text.startswith('```'):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return get_mock_alert_generation(incident_type, location, severity)
