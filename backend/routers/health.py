from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FoodVerse AI FastAPI Engine",
        "version": "1.0.0",
        "timestamp": time.time(),
        "modules": [
            "Food Recognition",
            "Nutritional Intelligence",
            "Food Freshness Detection",
            "Kitchen & Restaurant Hygiene",
            "Personalized Meal Planner"
        ]
    }
