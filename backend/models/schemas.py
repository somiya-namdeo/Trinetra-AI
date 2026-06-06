from pydantic import BaseModel
from typing import List

class IncidentAnalyzeRequest(BaseModel):
    report: str

class AlertGenerateRequest(BaseModel):
    incident_type: str
    location: str
    severity: str
