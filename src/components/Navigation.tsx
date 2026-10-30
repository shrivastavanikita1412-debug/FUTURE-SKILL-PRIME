import React from "react";
import {
  LayoutDashboard,
  ScanEye,
  Activity,
  Leaf,
  ShieldAlert,
  CalendarDays,
  FileCheck2,
  BookOpen,
} from "lucide-react";

export type NavTabId =
  | "dashboard"
  | "recognition"
  | "nutrition"
  | "freshness"
  | "hygiene"
  | "meal_planner"
  | "verification"
  | "documentation";

interface NavigationProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "recognition", label: "Food Recognition", icon: ScanEye },
    { id: "nutrition", label: "Nutritional Intelligence", icon: Activity },
    { id: "freshness", label: "Freshness Detection", icon: Leaf },
    { id: "hygiene", label: "Kitchen Hygiene Audit", icon: ShieldAlert },
    { id: "meal_planner", label: "Meal Planner", icon: CalendarDays },
    { id: "verification", label: "System Verification", icon: FileCheck2 },
    { id: "documentation", label: "Official Docs", icon: BookOpen },
  ] as const;

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as NavTabId)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
