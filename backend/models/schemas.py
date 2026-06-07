from pydantic import BaseModel
from typing import List, Optional, Union, Any

class IncidentAnalyzeRequest(BaseModel):
    report: str

class AlertGenerateRequest(BaseModel):
    incident_type: str
    location: str
    severity: str

class AlertSaveRequest(BaseModel):
    id: Optional[Any] = None
    title: Optional[str] = None
    english_message: Optional[str] = None
    hindi_message: Optional[str] = None
    status: Optional[str] = "DRAFT"
    channels: Optional[List[str]] = []
    incident_id: Optional[Any] = None
    reach: Optional[str] = None
    broadcast_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ResourceDispatchRequest(BaseModel):
    resource_id: Union[str, int]
    location: str
    incident_id: Optional[Union[str, int]] = None
    incident_title: Optional[str] = None

class IncidentStatusUpdateRequest(BaseModel):
    id: Union[str, int]
    status: str

class IncidentCreateRequest(BaseModel):
    id: Optional[Union[str, int]] = None
    incident_id: Optional[str] = None
    title: str
    severity: str
    status: str
    location: str
    zone: Optional[str] = None
    description: Optional[str] = ""
    category: str
    created_at: str
    priority_score: Optional[int] = 50
    recommended_resources: Optional[List[str]] = []
    recommended_action: Optional[str] = ""
    estimated_response_time: Optional[str] = ""
