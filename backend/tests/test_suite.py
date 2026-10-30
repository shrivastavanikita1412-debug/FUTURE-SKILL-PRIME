from backend.services.vision_service import analyze_food_image
from backend.services.nutrition_service import calculate_nutrition_profile
from backend.services.freshness_service import evaluate_food_freshness
from backend.services.hygiene_service import audit_facility_hygiene
from backend.services.meal_planner_service import generate_custom_meal_plan

def test_food_classification():
    dummy_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    res = analyze_food_image(dummy_base64)
    assert res["food_name"] is not None
    assert res["confidence"] >= 0.0 and res["confidence"] <= 1.0
    assert len(res["top_predictions"]) >= 1

def test_nutrition_profile():
    res = calculate_nutrition_profile("Salmon Salad")
    assert res["nutrition"]["calories"] > 0
    assert res["nutrition"]["macronutrients"]["protein_g"] > 0
    assert res["nutrition"]["health_score"] >= 0 and res["nutrition"]["health_score"] <= 100

def test_freshness_detection():
    dummy_base64 = "dummy"
    res = evaluate_food_freshness(dummy_base64)
    assert res["freshness_score"] >= 0 and res["freshness_score"] <= 100
    assert "Safe" in res["consumption_safety_verdict"] or "Discard" in res["consumption_safety_verdict"]
    assert "model_limitations" in res

def test_hygiene_audit():
    dummy_base64 = "dummy"
    res = audit_facility_hygiene(dummy_base64, "Commercial Kitchen")
    assert res["compliance_score"] >= 0 and res["compliance_score"] <= 100
    assert len(res["inspected_checklist"]) >= 3
    assert len(res["corrective_action_plan"]) >= 1

def test_meal_planner():
    res = generate_custom_meal_plan(
        dietary_preference="Mediterranean",
        calorie_target=2200,
        protein_pct=30.0,
        carbs_pct=40.0,
        fat_pct=30.0,
        plan_duration="7-day"
    )
    assert len(res["days"]) == 7
    assert res["daily_target_summary"]["target_calories"] == 2200
    assert len(res["grocery_shopping_list"]) >= 1
