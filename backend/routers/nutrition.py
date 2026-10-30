from fastapi import APIRouter
from backend.schemas.nutrition_schema import NutritionalIntelligenceResponse
from backend.services.nutrition_service import calculate_nutrition_profile

router = APIRouter()

@router.get("/analyze", response_model=NutritionalIntelligenceResponse)
def get_nutrition_analysis(food_name: str = "Grilled Salmon Bowl"):
    return calculate_nutrition_profile(food_name)
