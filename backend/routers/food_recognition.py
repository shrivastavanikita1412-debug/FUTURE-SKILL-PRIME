from fastapi import APIRouter, HTTPException
from backend.schemas.food_schema import FoodClassificationRequest, FoodClassificationResponse
from backend.services.vision_service import analyze_food_image

router = APIRouter()

@router.post("/classify", response_model=FoodClassificationResponse)
def classify_food(request: FoodClassificationRequest):
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image base64 payload is required")
    result = analyze_food_image(request.image_base64)
    return result
