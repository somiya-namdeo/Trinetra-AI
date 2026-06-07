from pydantic import BaseModel
from typing import List

class IncidentAnalyzeRequest(BaseModel):
    report: str

class AlertGenerateRequest(BaseModel):
    incident_type: str
    location: str
    severity: str

from typing import Optional, Union

class ResourceDispatchRequest(BaseModel):
    id: str
    task: str
    location: str
    incident_id: Optional[str] = None

class IncidentStatusUpdateRequest(BaseModel):
    id: Union[str, int]
    status: str

class IncidentCreateRequest(BaseModel):
    id: Optional[Union[str, int]] = None
    title: str
    severity: str
    status: str
    location: str
    category: str
    created_at: str
    priority_score: Optional[int] = 50
    recommended_resources: Optional[List[str]] = []
    recommended_action: Optional[str] = ""
    estimated_response_time: Optional[str] = ""
