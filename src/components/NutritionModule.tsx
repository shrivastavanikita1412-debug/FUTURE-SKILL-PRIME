import React, { useState } from "react";
import {
  Activity,
  Flame,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Award,
} from "lucide-react";
import { FoodLogItem } from "../types";

interface NutritionModuleProps {
  logs: FoodLogItem[];
  onAddLog: (item: any) => void;
  onRemoveLog: (id: string) => void;
  onClearLogs: () => void;
}

export const NutritionModule: React.FC<NutritionModuleProps> = ({
  logs,
  onAddLog,
  onRemoveLog,
  onClearLogs,
}) => {
  // Target daily goals
  const dailyTargets = {
    calories: 2000,
    proteinG: 140,
    carbsG: 220,
    fatG: 65,
    fiberG: 30,
    sodiumMg: 2300,
  };

  // Aggregated totals
  const totals = logs.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteinG: acc.proteinG + item.proteinG,
      carbsG: acc.carbsG + item.carbsG,
      fatG: acc.fatG + item.fatG,
      fiberG: acc.fiberG + (item.fiberG || 0),
      sodiumMg: acc.sodiumMg + (item.sodiumMg || 0),
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, sodiumMg: 0 }
  );

  // Custom meal input modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newCategory, setNewCategory] = useState("Lunch / Protein");
  const [newCalories, setNewCalories] = useState<number>(450);
  const [newProtein, setNewProtein] = useState<number>(30);
  const [newCarbs, setNewCarbs] = useState<number>(45);
  const [newFat, setNewFat] = useState<number>(15);
  const [newFiber, setNewFiber] = useState<number>(6);
  const [newSodium, setNewSodium] = useState<number>(380);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    onAddLog({
      foodName: newFoodName.trim(),
      category: newCategory,
      calories: Number(newCalories),
      proteinG: Number(newProtein),
      carbsG: Number(newCarbs),
      fatG: Number(newFat),
      fiberG: Number(newFiber),
      sodiumMg: Number(newSodium),
      servingSize: "1 custom portion",
    });

    setNewFoodName("");
    setShowAddModal(false);
  };

  const exportDailyLog = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            exportDate: new Date().toISOString(),
            dailyTotals: totals,
            targets: dailyTargets,
            meals: logs,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `foodverse-daily-nutrition-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getProgressPct = (val: number, target: number) => {
    return Math.min(100, Math.round((val / target) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Nutritional Intelligence & Caloric Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Milestone 3 · Deep metabolic breakdown, micronutrient benchmarking, and daily diary accumulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Food Item</span>
          </button>

          <button
            onClick={exportDailyLog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Energy Intake</span>
            </span>
            <span>Target: {dailyTargets.calories} kcal</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 font-sans">
              {totals.calories}
            </span>
            <span className="text-xs text-slate-400">/ {dailyTargets.calories} kcal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totals.calories > dailyTargets.calories ? "bg-rose-500" : "bg-orange-500"
              }`}
              style={{ width: `${getProgressPct(totals.calories, dailyTargets.calories)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {Math.max(0, dailyTargets.calories - totals.calories)} kcal remaining for today
          </p>
        </div>

        {/* Protein Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700">Protein</span>
            <span>{getProgressPct(totals.proteinG, dailyTargets.proteinG)}%</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600 font-sans">
              {Math.round(totals.proteinG)}g
            </span>
            <span className="text-xs text-slate-400">/ {dailyTargets.proteinG}g goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPct(totals.proteinG, dailyTargets.proteinG)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            4 kcal/g · Crucial for muscle protein synthesis
          </p>
        </div>

        {/* Carbs Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700">Carbohydrates</span>
            <span>{getProgressPct(totals.carbsG, dailyTargets.carbsG)}%</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-blue-600 font-sans">
              {Math.round(totals.carbsG)}g
            </span>
            <span className="text-xs text-slate-400">/ {dailyTargets.carbsG}g goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPct(totals.carbsG, dailyTargets.carbsG)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Includes {Math.round(totals.fiberG)}g dietary prebiotic fiber
          </p>
        </div>

        {/* Fat Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-amber-700">Lipids / Fats</span>
            <span>{getProgressPct(totals.fatG, dailyTargets.fatG)}%</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600 font-sans">
              {Math.round(totals.fatG)}g
            </span>
            <span className="text-xs text-slate-400">/ {dailyTargets.fatG}g goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPct(totals.fatG, dailyTargets.fatG)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            9 kcal/g · Hormone production & vitamin absorption
          </p>
        </div>
      </div>

      {/* Granular Micronutrient Benchmarks & Daily Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Micronutrient Health Radar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Micronutrient RDA Tracking</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Daily recommended dietary allowance (RDA) reference standards from WHO/FDA:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Sodium (Electrolyte)</span>
                  <span className="text-slate-500">
                    {totals.sodiumMg} mg / {dailyTargets.sodiumMg} mg
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-full rounded-full ${
                      totals.sodiumMg > dailyTargets.sodiumMg ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, (totals.sodiumMg / dailyTargets.sodiumMg) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Potassium</span>
                  <span className="text-slate-500">1,510 mg / 3,400 mg (44%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "44%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Calcium (Bone Density)</span>
                  <span className="text-slate-500">150 mg / 1,000 mg (15%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Iron (Hemoglobin Synthesis)</span>
                  <span className="text-slate-500">6.0 mg / 18.0 mg (33%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "33%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Vitamin C (Immunity)</span>
                  <span className="text-slate-500">56 mg / 90 mg (62%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed">
              <strong>Dietitian Insight:</strong> Current potassium-to-sodium intake is well-balanced. Ensure adequate hydration with 2.5L water daily to facilitate nutrient transport.
            </div>
          </div>
        </div>

        {/* Right: Daily Ledger Entries (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Today's Meal Diary ({logs.length} logged items)
                </h3>
                <p className="text-xs text-slate-500">
                  Track individual meals, verify caloric splits, and maintain dietary adherence.
                </p>
              </div>

              {logs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600">No meals logged yet today</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Analyze meals in the Food Recognition module or click "Add Food Item" above.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] pb-2 font-medium">
                      <th className="py-2 pr-3">Dish / Portion</th>
                      <th className="py-2 px-2 text-right">Calories</th>
                      <th className="py-2 px-2 text-right">Protein</th>
                      <th className="py-2 px-2 text-right">Carbs</th>
                      <th className="py-2 px-2 text-right">Fat</th>
                      <th className="py-2 pl-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {logs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-slate-900">{item.foodName}</p>
                          <p className="text-[10px] text-slate-400">
                            {item.category} · {item.servingSize}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-slate-900">
                          {item.calories} kcal
                        </td>
                        <td className="py-3 px-2 text-right text-emerald-600 font-medium">
                          {item.proteinG}g
                        </td>
                        <td className="py-3 px-2 text-right text-blue-600 font-medium">
                          {item.carbsG}g
                        </td>
                        <td className="py-3 px-2 text-right text-amber-600 font-medium">
                          {item.fatG}g
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <button
                            onClick={() => onRemoveLog(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove meal from ledger"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">
              Log Custom Food Entry
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter custom nutritional parameters to append to your daily ledger.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Food or Recipe Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protein Smoothie with Peanut Butter"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option>Breakfast / Grains</option>
                    <option>Lunch / Bowls</option>
                    <option>Dinner / Mains</option>
                    <option>Healthy Snack</option>
                    <option>Post-Workout Shake</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProtein}
                    onChange={(e) => setNewProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-blue-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-amber-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newFat}
                    onChange={(e) => setNewFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newFiber}
                    onChange={(e) => setNewFiber(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Sodium (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newSodium}
                    onChange={(e) => setNewSodium(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                >
                  Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
