from typing import List, Optional
from pydantic import BaseModel, Field

class ChecklistItem(BaseModel):
    area: str
    status: str  # Compliant, Minor Concern, Critical Violation
    score: int
    details: str

class Violation(BaseModel):
    id: str
    severity: str  # Low, Medium, High, Critical
    title: str
    description: str
    regulatory_reference: str

class HygieneInspectionRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"
    facility_type: Optional[str] = "Commercial Kitchen"

class HygieneInspectionResponse(BaseModel):
    compliance_score: int = Field(ge=0, le=100)
    grade: str
    inspection_summary: str
    inspected_checklist: List[ChecklistItem]
    identified_violations: List[Violation]
    corrective_action_plan: List[str]
    positive_findings: List[str]
