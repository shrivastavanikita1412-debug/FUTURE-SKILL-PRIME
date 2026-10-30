"""
Personalized Meal Planner Service:
Generates custom macro-balanced nutrition plans and automated grocery lists.
"""

from typing import Dict, Any, List

def generate_custom_meal_plan(
    dietary_preference: str = "Balanced",
    calorie_target: int = 2000,
    protein_pct: float = 30.0,
    carbs_pct: float = 40.0,
    fat_pct: float = 30.0,
    allergies: List[str] = None,
    exclusions: List[str] = None,
    plan_duration: str = "1-day",
    goal: str = "Vitality & Performance"
) -> Dict[str, Any]:
    if allergies is None:
        allergies = []
    if exclusions is None:
        exclusions = []

    target_protein_g = round((calorie_target * (protein_pct / 100.0)) / 4.0)
    target_carbs_g = round((calorie_target * (carbs_pct / 100.0)) / 4.0)
    target_fat_g = round((calorie_target * (fat_pct / 100.0)) / 9.0)

    meals = [
        {
            "meal_type": "Breakfast",
            "title": f"Energizing {dietary_preference} Morning Power Bowl",
            "description": "High-fiber chia-infused organic oats with almond butter, wild berries, and organic seeds.",
            "calories": round(calorie_target * 0.28),
            "protein_g": round(target_protein_g * 0.28),
            "carbs_g": round(target_carbs_g * 0.35),
            "fat_g": round(target_fat_g * 0.22),
            "prep_time_minutes": 10,
            "recipe_steps": [
                "Combine rolled oats and unsweetened almond milk in a bowl.",
                "Stir in chia seeds and microwave on medium for 90 seconds.",
                "Top with fresh organic berries and a drizzle of raw almond butter."
            ],
            "suitable_alternative": "Poached eggs over mashed avocado on ancient whole grain toast."
        },
        {
            "meal_type": "Lunch",
            "title": f"Mediterranean Quinoa & Grilled Herb Protein Plate",
            "description": "Charred citrus chicken or marinated tempeh served over warm fluffy quinoa with cucumber and Kalamata tapenade.",
            "calories": round(calorie_target * 0.38),
            "protein_g": round(target_protein_g * 0.42),
            "carbs_g": round(target_carbs_g * 0.34),
            "fat_g": round(target_fat_g * 0.38),
            "prep_time_minutes": 18,
            "recipe_steps": [
                "Grill seasoned protein over medium-high heat for 6 minutes per side.",
                "Toss cooked quinoa with diced cucumbers, cherry tomatoes, and cold-pressed extra virgin olive oil.",
                "Slice protein and serve warm with a squeeze of fresh lemon juice."
            ],
            "suitable_alternative": "Pan-seared Atlantic salmon with wild rice pilaf and asparagus."
        },
        {
            "meal_type": "Dinner",
            "title": f"Fire-Roasted Harvest Bowl with Sesame Tahini Glaze",
            "description": "Roasted sweet potato wedges, crisp broccolini, and spiced chickpeas or cod drizzled with lemon-tahini sauce.",
            "calories": round(calorie_target * 0.34),
            "protein_g": round(target_protein_g * 0.30),
            "carbs_g": round(target_carbs_g * 0.31),
            "fat_g": round(target_fat_g * 0.40),
            "prep_time_minutes": 25,
            "recipe_steps": [
                "Toss vegetables and protein in avocado oil, cumin, smoked paprika, and sea salt.",
                "Roast at 400°F (205°C) for 22 minutes until edges are caramelized and tender.",
                "Whisk tahini, garlic, and lemon juice into a velvety sauce and drizzle generously."
            ],
            "suitable_alternative": "Ginger-tamari tofu stir fry with jasmine brown rice and baby bok choy."
        }
    ]

    days_count = 7 if plan_duration == "7-day" else 1
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    days = []
    for i in range(days_count):
        days.append({
            "day_name": f"Day {i + 1} ({day_names[i % 7]})",
            "total_calories": calorie_target,
            "total_protein_g": target_protein_g,
            "total_carbs_g": target_carbs_g,
            "total_fat_g": target_fat_g,
            "meals": meals
        })

    return {
        "plan_title": f"Custom {dietary_preference} Optimal Health Plan",
        "summary": f"Scientifically calibrated {plan_duration} nutrition blueprint delivering {calorie_target} kcal designed for {goal}. Balanced to ensure consistent energy, muscle recovery, and digestive wellness.",
        "daily_target_summary": {
            "target_calories": calorie_target,
            "protein_g": target_protein_g,
            "carbs_g": target_carbs_g,
            "fat_g": target_fat_g
        },
        "days": days,
        "grocery_shopping_list": [
            {"category": "Fresh Produce", "items": ["Organic Berries", "Baby Spinach & Arugula", "Persian Cucumbers", "Sweet Potatoes", "Broccolini", "Lemons"]},
            {"category": "Proteins", "items": ["Free-Range Chicken Breast / Tempeh", "Wild Caught Fish", "Organic Eggs"]},
            {"category": "Healthy Fats & Pantry", "items": ["Cold-Pressed Olive Oil", "Raw Almond Butter", "Rolled Oats", "Organic Quinoa", "Tahini Paste"]}
        ],
        "dietitian_tips": [
            "Prepare grains and proteins in bulk ahead of time to minimize daily cooking effort.",
            "Pair iron-rich greens with citrus fruits to enhance non-heme iron bioavailability."
        ]
    }
