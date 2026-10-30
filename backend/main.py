"""
FoodVerse AI - Multimodal Food Intelligence Agent
FastAPI Backend Application Root
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import (
    health,
    food_recognition,
    nutrition,
    freshness,
    hygiene,
    meal_planner
)

app = FastAPI(
    title="FoodVerse AI - Multimodal Food Intelligence Agent",
    description="Full-stack AI/ML backend for food recognition, nutritional intelligence, freshness evaluation, kitchen hygiene audit, and personalized meal planning.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include modular routers
app.include_router(health.router, prefix="/api", tags=["System Health"])
app.include_router(food_recognition.router, prefix="/api/food", tags=["Food Recognition & Classification"])
app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutritional Intelligence"])
app.include_router(freshness.router, prefix="/api/freshness", tags=["Food Freshness & Spoilage"])
app.include_router(hygiene.router, prefix="/api/hygiene", tags=["Kitchen & Restaurant Hygiene"])
app.include_router(meal_planner.router, prefix="/api/meal-planner", tags=["Personalized Meal Planner"])

@app.get("/")
def read_root():
    return {
        "project": "FoodVerse AI",
        "description": "Multimodal Food Intelligence Agent API",
        "documentation": "/docs",
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
