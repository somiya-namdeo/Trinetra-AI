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

def extract_location(report_lower: str) -> str:
    if "gate 3" in report_lower: return "Gate 3"
    if "gate 4" in report_lower: return "Gate 4"
    if "gate 7" in report_lower: return "Gate 7"
    if "zone a" in report_lower: return "Zone A"
    if "food court" in report_lower: return "Food Court"
    if "north gate" in report_lower: return "North Gate"
    return "Unknown Sector"

def get_mock_incident_analysis(report: str = ""):
    report_lower = report.lower()
    loc = extract_location(report_lower)
    
    # Medical keywords (High priority)
    medical_keywords = ["collapsed", "unconscious", "medical", "fainted", "breathing", "heart", "injury", "bleeding", "elderly", "not responding", "patient", "heat stroke"]
    if any(word in report_lower for word in medical_keywords):
        return {
            "category": "Medical Emergency",
            "location": loc,
            "severity": "High",
            "priority_score": 90,
            "recommended_resources": ["Ambulance", "Medical Team", "Security Unit"],
            "recommended_action": "Clear a 4m radius around the victim immediately and dispatch nearest medical unit.",
            "estimated_response_time": "4 minutes"
        }

    # Crowd keywords
    crowd_keywords = ["shouting", "running", "panic", "stampede", "pushing", "crowd surge", "overcrowding", "heavy crowd", "crowd gathering"]
    if any(word in report_lower for word in crowd_keywords):
        return {
            "category": "Crowd Surge Risk",
            "location": loc,
            "severity": "High",
            "priority_score": 85,
            "recommended_resources": ["Security Unit", "Volunteer Team", "Drone Unit"],
            "recommended_action": "Deploy security to manage crowd flow, open secondary exits, and use PA system to guide visitors.",
            "estimated_response_time": "3 minutes"
        }

    # Security keywords
    security_keywords = ["suspicious", "unattended bag", "bag", "package", "threat", "weapon", "fight", "violence", "security issue"]
    if any(word in report_lower for word in security_keywords):
        return {
            "category": "Security Threat",
            "location": loc,
            "severity": "High",
            "priority_score": 90,
            "recommended_resources": ["Security Unit", "Drone Unit", "Police Response Team"],
            "recommended_action": "Secure the area, isolate the suspicious object, notify security command, and redirect nearby crowd flow.",
            "estimated_response_time": "3 minutes"
        }
    
    # Fire keywords
    fire_keywords = ["fire", "smoke", "burning", "flames", "explosion"]
    if any(word in report_lower for word in fire_keywords):
        return {
            "category": "Fire Hazard",
            "location": loc,
            "severity": "Critical",
            "priority_score": 95,
            "recommended_resources": ["Fire Unit", "Medical Team", "Security Unit"],
            "recommended_action": "Evacuate immediate area, dispatch fire suppression unit, and setup triage.",
            "estimated_response_time": "2 minutes"
        }
        
    # Lost Person keywords
    lost_keywords = ["child lost", "lost child", "missing child", "child missing", "separated child"]
    if any(word in report_lower for word in lost_keywords):
        return {
            "category": "Lost Person",
            "location": loc,
            "severity": "High",
            "priority_score": 80,
            "recommended_resources": ["Volunteer Team", "Child Recovery Unit", "Security Unit"],
            "recommended_action": "Activate child reunification protocol and notify nearby volunteers.",
            "estimated_response_time": "4 minutes"
        }

    # Water failure (existing fallback)
    if any(word in report_lower for word in ["water", "पानी", "station", "supply", "unavailable", "depleted"]):
        return {
            "category": "Water Supply Failure",
            "location": loc,
            "severity": "High",
            "priority_score": 82,
            "recommended_resources": ["Water Supply Unit", "Volunteer Team", "Security Unit"],
            "recommended_action": "Deploy backup water supply, guide crowd to nearest hydration point, and monitor heat-related symptoms.",
            "estimated_response_time": "6 minutes"
        }
        
    return {
        "category": "General Incident",
        "location": loc,
        "severity": "Medium",
        "priority_score": 50,
        "recommended_resources": ["Security Unit", "Volunteer Team"],
        "recommended_action": "Investigate the reported incident and provide updates to the command center.",
        "estimated_response_time": "5 minutes"
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

def post_process_incident(result, report: str):
    report_lower = report.lower()
    
    # Priority Score Logic for Medical Emergency
    if result.get("category") == "Medical Emergency":
        score = 80
        if any(w in report_lower for w in ["unconscious", "not responding", "collapsed", "fainted"]):
            score += 10
        if any(w in report_lower for w in ["elderly", "child", "pregnant", "injured"]):
            score += 5
        if any(w in report_lower for w in ["crowd", "gathering", "rush", "panic"]):
            score += 5
            
        loc_lower = str(result.get("location", "")).lower()
        if any(w in loc_lower for w in ["gate", "main corridor", "food court", "riverfront"]):
            score += 5
            
        score = min(100, score)
        result["priority_score"] = score

    # Severity Mapping for all incidents
    score = result.get("priority_score", 50)
    if score >= 85:
        result["severity"] = "Critical"
    elif score >= 70:
        result["severity"] = "High"
    elif score >= 50:
        result["severity"] = "Medium"
    else:
        result["severity"] = "Low"
        
    return result

def analyze_incident(report: str):
    if not model:
        return post_process_incident(get_mock_incident_analysis(report), report)
    
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
        return post_process_incident(json.loads(text), report)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return post_process_incident(get_mock_incident_analysis(report), report)

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
