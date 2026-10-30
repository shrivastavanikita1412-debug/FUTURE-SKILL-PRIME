from fastapi import APIRouter, HTTPException
from backend.schemas.freshness_schema import FreshnessDetectionRequest, FreshnessDetectionResponse
from backend.services.freshness_service import evaluate_food_freshness

router = APIRouter()

@router.post("/detect", response_model=FreshnessDetectionResponse)
def detect_freshness(request: FreshnessDetectionRequest):
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image base64 payload is required")
    return evaluate_food_freshness(request.image_base64)
