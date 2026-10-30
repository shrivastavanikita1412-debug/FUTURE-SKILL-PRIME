from fastapi import APIRouter
from backend.schemas.meal_plan_schema import MealPlanRequest, MealPlanResponse
from backend.services.meal_planner_service import generate_custom_meal_plan

router = APIRouter()

@router.post("/generate", response_model=MealPlanResponse)
def create_meal_plan(request: MealPlanRequest):
    macro = request.macro_distribution
    p_pct = macro.protein_pct if macro else 30.0
    c_pct = macro.carbs_pct if macro else 40.0
    f_pct = macro.fat_pct if macro else 30.0

    return generate_custom_meal_plan(
        dietary_preference=request.dietary_preference or "Balanced",
        calorie_target=request.calorie_target or 2000,
        protein_pct=p_pct,
        carbs_pct=c_pct,
        fat_pct=f_pct,
        allergies=request.allergies or [],
        exclusions=request.exclusions or [],
        plan_duration=request.plan_duration or "1-day",
        goal=request.goal or "Vitality & Performance"
    )
