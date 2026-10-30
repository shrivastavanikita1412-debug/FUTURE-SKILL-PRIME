from typing import List, Optional
from pydantic import BaseModel, Field

class Macronutrients(BaseModel):
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: Optional[float] = 0.0

class Micronutrients(BaseModel):
    sodium_mg: float
    potassium_mg: float
    calcium_mg: float
    iron_mg: float
    vitamin_c_mg: float

class NutritionDetail(BaseModel):
    serving_size: str
    calories: int
    macronutrients: Macronutrients
    micronutrients: Micronutrients
    glycemic_index_estimated: str
    health_score: int = Field(ge=0, le=100)

class NutritionalIntelligenceResponse(BaseModel):
    food_name: str
    nutrition: NutritionDetail
    dietary_insights: List[str]
    allergen_warnings: List[str]
