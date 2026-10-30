from typing import List, Optional
from pydantic import BaseModel, Field

class MacroDistribution(BaseModel):
    protein_pct: float = 30.0
    carbs_pct: float = 40.0
    fat_pct: float = 30.0

class MealItem(BaseModel):
    meal_type: str  # Breakfast, Lunch, Dinner, Snack
    title: str
    description: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    prep_time_minutes: int
    recipe_steps: List[str]
    suitable_alternative: str

class DayPlan(BaseModel):
    day_name: str
    total_calories: int
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    meals: List[MealItem]

class GroceryCategory(BaseModel):
    category: str
    items: List[str]

class MealPlanRequest(BaseModel):
    dietary_preference: Optional[str] = "Balanced"
    calorie_target: Optional[int] = 2000
    macro_distribution: Optional[MacroDistribution] = None
    allergies: Optional[List[str]] = []
    exclusions: Optional[List[str]] = []
    meals_per_day: Optional[int] = 3
    plan_duration: Optional[str] = "1-day"  # 1-day or 7-day
    goal: Optional[str] = "Maintenance & Vitality"

class MealPlanResponse(BaseModel):
    plan_title: str
    summary: str
    daily_target_summary: dict
    days: List[DayPlan]
    grocery_shopping_list: List[GroceryCategory]
    dietitian_tips: List[str]
