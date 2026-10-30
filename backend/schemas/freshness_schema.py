from typing import List, Optional
from pydantic import BaseModel, Field

class SpoilageIndicator(BaseModel):
    marker: str
    severity: str  # "None", "Low", "Medium", "High"
    description: str

class FreshnessDetectionRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"

class FreshnessDetectionResponse(BaseModel):
    item_name: str
    freshness_score: int = Field(ge=0, le=100)
    freshness_status: str
    confidence: float
    estimated_shelf_life: str
    spoilage_indicators: List[SpoilageIndicator]
    visual_observations: List[str]
    storage_recommendations: List[str]
    consumption_safety_verdict: str
    safety_advisory: str
    model_limitations: str
