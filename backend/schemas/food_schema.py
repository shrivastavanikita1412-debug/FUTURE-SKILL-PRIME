from typing import List, Optional
from pydantic import BaseModel, Field

class PredictionItem(BaseModel):
    label: str
    probability: float

class DetectedIngredient(BaseModel):
    name: str
    estimated_portion: str
    confidence: float

class FoodClassificationRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"

class FoodClassificationResponse(BaseModel):
    food_name: str
    confidence: float = Field(ge=0.0, le=1.0)
    primary_category: str
    cuisine: str
    processing_level: str
    dietary_tags: List[str]
    top_predictions: List[PredictionItem]
    ingredients_detected: List[DetectedIngredient]
