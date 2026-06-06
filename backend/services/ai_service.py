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

def get_mock_incident_analysis():
    return {
        "category": "Medical Emergency",
        "location": "Gate 7",
        "severity": "High",
        "priority_score": 87,
        "recommended_resources": ["Ambulance A2", "Medical Team Bravo", "Security Unit S1"],
        "recommended_action": "Clear the crowd, dispatch medical team, and secure the area.",
        "estimated_response_time": "4 minutes"
    }

def get_mock_alert_generation():
    return {
        "english": "ATTENTION: High crowd density near North Gate. Please use East Entry or Gate 4B. Emergency services are active.",
        "hindi": "ध्यान दें: उत्तरी गेट के पास भारी भीड़ है। कृपया पूर्वी प्रवेश द्वार या गेट 4B का उपयोग करें।"
    }

def analyze_incident(report: str):
    if not model:
        return get_mock_incident_analysis()
    
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
        return get_mock_incident_analysis()

def generate_alerts(incident_type: str, location: str, severity: str):
    if not model:
        return get_mock_alert_generation()
    
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
        return get_mock_alert_generation()
