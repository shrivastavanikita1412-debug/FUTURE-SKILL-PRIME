import React from "react";
import { Sparkles, ShieldCheck, Cpu, Terminal, Download } from "lucide-react";

interface HeaderProps {
  activeModule: string;
  onNavigateToDocs: () => void;
  onNavigateToTests: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToDocs,
  onNavigateToTests,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                FoodVerse <span className="text-emerald-600">AI</span>
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Multimodal Food Intelligence & Kitchen Safety Agent
            </p>
          </div>
        </div>

        {/* System telemetry & quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">gemini-3.8-flash</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400">·</span>
            <span>PyTorch & OpenCV Engine</span>
          </div>

          <a
            href="/api/download-zip"
            download="FoodVerse-AI-Complete-Project.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Download Entire Project as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>

          <button
            onClick={onNavigateToTests}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Execute Automated Acceptance Tests"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verification</span>
          </button>

          <button
            onClick={onNavigateToDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Read Official Assignment Docs"
          >
            <Terminal className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Docs Hub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
