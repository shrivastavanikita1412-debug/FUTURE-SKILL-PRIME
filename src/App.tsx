import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation, NavTabId } from "./components/Navigation";
import { DashboardOverview } from "./components/DashboardOverview";
import { FoodRecognitionModule } from "./components/FoodRecognitionModule";
import { NutritionModule } from "./components/NutritionModule";
import { FreshnessModule } from "./components/FreshnessModule";
import { HygieneModule } from "./components/HygieneModule";
import { MealPlannerModule } from "./components/MealPlannerModule";
import { DocumentationViewer } from "./components/DocumentationViewer";
import { SystemVerificationLab } from "./components/SystemVerificationLab";
import { FoodLogItem } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTabId>("dashboard");
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      foodName: "Avocado Toast with Poached Egg",
      category: "Breakfast / Healthy Grains",
      calories: 380,
      proteinG: 16,
      carbsG: 34,
      fatG: 22,
      fiberG: 9,
      sodiumMg: 420,
      servingSize: "1 plate (2 slices)",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      foodName: "Mediterranean Quinoa Bowl with Salmon",
      category: "Lunch / Bowls",
      calories: 520,
      proteinG: 42,
      carbsG: 48,
      fatG: 18,
      fiberG: 8,
      sodiumMg: 580,
      servingSize: "1 large bowl (380g)",
    },
  ]);

  // Sync logs with server API on startup
  useEffect(() => {
    fetch("/api/logs/daily")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.logs && data.logs.length > 0) {
          setFoodLogs(data.logs);
        }
      })
      .catch((err) => console.log("Initial logs fetch error (using memory state):", err));
  }, []);

  const handleAddLog = async (item: any) => {
    try {
      const response = await fetch("/api/logs/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.logs) {
          setFoodLogs(data.logs);
          return;
        }
      }
    } catch (err) {
      console.warn("Server log sync error, falling back to local state");
    }

    // Local state fallback
    const newEntry: FoodLogItem = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      foodName: item.foodName,
      category: item.category || "General Meal",
      calories: Number(item.calories || 0),
      proteinG: Number(item.proteinG || 0),
      carbsG: Number(item.carbsG || 0),
      fatG: Number(item.fatG || 0),
      fiberG: Number(item.fiberG || 0),
      sodiumMg: Number(item.sodiumMg || 0),
      servingSize: item.servingSize || "1 portion",
    };
    setFoodLogs((prev) => [newEntry, ...prev]);
  };

  const handleRemoveLog = async (id: string) => {
    try {
      await fetch(`/api/logs/daily/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete request error");
    }
    setFoodLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearLogs = () => {
    setFoodLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Universal Top Header */}
      <Header
        activeModule={currentTab}
        onNavigateToDocs={() => setCurrentTab("documentation")}
        onNavigateToTests={() => setCurrentTab("verification")}
      />

      {/* Module Navigation Tabs */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === "dashboard" && (
          <DashboardOverview
            onNavigate={(tab) => setCurrentTab(tab)}
            logsCount={foodLogs.length}
          />
        )}

        {currentTab === "recognition" && (
          <FoodRecognitionModule
            onAddToLog={handleAddLog}
            onNavigateToNutrition={() => setCurrentTab("nutrition")}
          />
        )}

        {currentTab === "nutrition" && (
          <NutritionModule
            logs={foodLogs}
            onAddLog={handleAddLog}
            onRemoveLog={handleRemoveLog}
            onClearLogs={handleClearLogs}
          />
        )}

        {currentTab === "freshness" && <FreshnessModule />}

        {currentTab === "hygiene" && <HygieneModule />}

        {currentTab === "meal_planner" && <MealPlannerModule />}

        {currentTab === "verification" && <SystemVerificationLab />}

        {currentTab === "documentation" && <DocumentationViewer />}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FoodVerse AI</span>
            <span>·</span>
            <span>Multimodal Food Intelligence & Kitchen Safety Agent</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI & Express</span>
            <span>·</span>
            <span>PyTorch & OpenCV</span>
            <span>·</span>
            <span>Gemini 3.8 Flash</span>
            <span>·</span>
            <span>React 19 & Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
