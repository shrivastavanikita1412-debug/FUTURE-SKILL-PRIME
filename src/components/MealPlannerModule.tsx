import React, { useState } from "react";
import {
  CalendarDays,
  Utensils,
  RefreshCw,
  ShoppingBag,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { MealPlanResult } from "../types";

export const MealPlannerModule: React.FC = () => {
  const [dietaryPreference, setDietaryPreference] = useState("Mediterranean");
  const [calorieTarget, setCalorieTarget] = useState(2200);
  const [proteinPct, setProteinPct] = useState(30);
  const [carbsPct, setCarbsPct] = useState(45);
  const [fatPct, setFatPct] = useState(25);
  const [planDuration, setPlanDuration] = useState<"1-day" | "7-day">("7-day");
  const [goal, setGoal] = useState("Muscle Maintenance & Cardiovascular Vitality");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<MealPlanResult | null>(null);
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [groceryChecks, setGroceryChecks] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ALLERGY_OPTIONS = [
    "Dairy / Lactose",
    "Gluten / Wheat",
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Soy",
    "Eggs",
    "Fish",
  ];

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      setErrorMessage(null);

      const response = await fetch("/api/meal-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dietaryPreference,
          calorieTarget,
          macroDistribution: {
            proteinPct,
            carbsPct,
            fatPct,
          },
          allergies: selectedAllergies,
          planDuration,
          goal,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setPlanResult(resData.data);
        setExpandedDay(0);
      } else {
        throw new Error(resData.error || "Failed to generate meal plan");
      }
    } catch (err: any) {
      console.error("Meal planning error:", err);
      setErrorMessage(err.message || "Failed to generate meal plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleGroceryItem = (item: string) => {
    setGroceryChecks((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const exportPlan = () => {
    if (!planResult) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(planResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `foodverse-meal-plan-${planDuration}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Personalized Goal-Based Meal Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Milestone 6 · Calibrate calories, macronutrient ratios, dietary restrictions, and recipes with automated grocery lists.
          </p>
        </div>

        {planResult && (
          <button
            onClick={exportPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan JSON</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Planning Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Planning Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>Nutritional Calibration Parameters</span>
            </h3>

            {/* Dietary Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary Pattern
              </label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option>Mediterranean (Heart-Healthy & Longevity)</option>
                <option>Balanced Omnivore (High Energy)</option>
                <option>Plant-Based / Vegan</option>
                <option>Ketogenic (Low Carb, High Healthy Fats)</option>
                <option>High-Protein Athletic / Bodybuilding</option>
                <option>Diabetic-Friendly (Low Glycemic)</option>
              </select>
            </div>

            {/* Calorie Target Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Daily Calorie Target</span>
                <span className="font-bold text-emerald-700">{calorieTarget} kcal</span>
              </div>
              <input
                type="range"
                min="1400"
                max="3600"
                step="50"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1,400 kcal (Deficit)</span>
                <span>2,200 kcal (Maintenance)</span>
                <span>3,600 kcal (Surplus)</span>
              </div>
            </div>

            {/* Macro Ratio Sliders */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700">Macronutrient Distribution Split</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">Protein</span>
                  <p className="font-bold text-emerald-800">{proteinPct}%</p>
                  <p className="text-[10px] text-slate-500">
                    {Math.round((calorieTarget * (proteinPct / 100)) / 4)}g
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded border border-blue-100">
                  <span className="text-[10px] text-blue-700 font-semibold uppercase">Carbs</span>
                  <p className="font-bold text-blue-800">{carbsPct}%</p>
                  <p className="text-[10px] text-slate-500">
                    {Math.round((calorieTarget * (carbsPct / 100)) / 4)}g
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-100">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase">Fat</span>
                  <p className="font-bold text-amber-800">{fatPct}%</p>
                  <p className="text-[10px] text-slate-500">
                    {Math.round((calorieTarget * (fatPct / 100)) / 9)}g
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Duration Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Plan Duration Horizon
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlanDuration("1-day")}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    planDuration === "1-day"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  1-Day Master Blueprint
                </button>
                <button
                  type="button"
                  onClick={() => setPlanDuration("7-day")}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    planDuration === "7-day"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  7-Day Multi-Meal Plan
                </button>
              </div>
            </div>

            {/* Allergy & Intolerance Exclusion Pills */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Allergen & Sensitivity Exclusions
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGY_OPTIONS.map((allergy) => {
                  const isSelected = selectedAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-rose-100 text-rose-800 font-semibold border border-rose-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {isSelected ? `✕ ${allergy}` : `+ ${allergy}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate CTA */}
            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                generating
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Culinary Plan & Recipes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Personalized Meal Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Meal Plan Itinerary & Grocery List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {planResult ? (
            <div className="space-y-4">
              {/* Plan Overview Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {planDuration.toUpperCase()} PROTOCOL
                  </span>
                  <span className="text-xs text-slate-500">
                    Daily Goal: {planResult.dailyTargetSummary.targetCalories} kcal
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans mt-2">
                  {planResult.planTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {planResult.summary}
                </p>

                {/* Macro Target Summary Strip */}
                <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-50 rounded-lg border border-slate-100 mt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Daily Energy</span>
                    <p className="font-bold text-slate-900">{planResult.dailyTargetSummary.targetCalories} kcal</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Protein</span>
                    <p className="font-bold text-emerald-600">{planResult.dailyTargetSummary.proteinG}g</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Carbs</span>
                    <p className="font-bold text-blue-600">{planResult.dailyTargetSummary.carbsG}g</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Fat</span>
                    <p className="font-bold text-amber-600">{planResult.dailyTargetSummary.fatG}g</p>
                  </div>
                </div>
              </div>

              {/* Day Schedules Accordion */}
              <div className="space-y-3">
                {planResult.days.map((day, dIdx) => {
                  const isExpanded = expandedDay === dIdx;
                  return (
                    <div
                      key={dIdx}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? -1 : dIdx)}
                        className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-sm text-slate-900 font-sans">
                            {day.dayName}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">
                            ({day.meals.length} meals · {day.totalCalories} kcal)
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 space-y-3 divide-y divide-slate-100">
                          {day.meals.map((meal, mIdx) => (
                            <div key={mIdx} className={mIdx > 0 ? "pt-3" : ""}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                  {meal.mealType}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{meal.prepTimeMinutes} mins prep</span>
                                </span>
                              </div>

                              <h4 className="font-bold text-sm text-slate-900 mt-1">
                                {meal.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {meal.description}
                              </p>

                              {/* Recipe Steps */}
                              <div className="mt-2 p-2.5 rounded bg-slate-50 border border-slate-100 text-xs">
                                <p className="font-semibold text-slate-700 text-[11px] mb-1">Culinary Steps:</p>
                                <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[11px]">
                                  {meal.recipeSteps.map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                  ))}
                                </ol>
                              </div>

                              {/* Suitable Alternative */}
                              <p className="text-[11px] text-slate-500 mt-2 italic">
                                <strong>Smart Swap:</strong> {meal.suitableAlternative}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Categorized Grocery Shopping List */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 font-sans mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Categorized Grocery Shopping List</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {planResult.groceryShoppingList.map((cat, cIdx) => (
                    <div key={cIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-bold text-xs text-slate-800 mb-2 uppercase tracking-wide">
                        {cat.category}
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {cat.items.map((item, iIdx) => {
                          const isChecked = Boolean(groceryChecks[item]);
                          return (
                            <li
                              key={iIdx}
                              onClick={() => toggleGroceryItem(item)}
                              className={`flex items-start gap-1.5 cursor-pointer transition-colors ${
                                isChecked ? "line-through text-slate-400" : "hover:text-slate-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="mt-0.5 rounded accent-emerald-600 cursor-pointer"
                              />
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 font-sans">
                Awaiting Meal Plan Generation
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure your dietary preference, calorie targets, macro splits, and allergen exclusions on the left, then click "Generate Personalized Meal Plan".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
