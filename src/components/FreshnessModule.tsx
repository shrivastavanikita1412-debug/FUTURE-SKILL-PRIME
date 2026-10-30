import React, { useState, useRef } from "react";
import {
  Leaf,
  Upload,
  Camera,
  RefreshCw,
  AlertTriangle,
  Info,
  Thermometer,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { FreshnessResult } from "../types";

const FRESHNESS_PRESETS = [
  {
    id: "fresh_apple",
    name: "Crisp Gala Apples",
    state: "Peak Freshness",
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ripe_banana",
    name: "Golden Ripe Bananas",
    state: "Moderate Quality",
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "soft_strawberry",
    name: "Overripe Strawberries",
    state: "Borderline Decay",
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fresh_greens",
    name: "Turgid Leafy Greens",
    state: "Fresh Harvest",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
];

export const FreshnessModule: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(FRESHNESS_PRESETS[0].url);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<FreshnessResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFreshness = async () => {
    if (!selectedImage) return;

    try {
      setAnalyzing(true);
      setErrorMessage(null);

      let base64Payload = selectedImage;
      if (selectedImage.startsWith("http")) {
        base64Payload = await imageUrlToBase64(selectedImage);
      }

      const response = await fetch("/api/food/freshness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Payload,
          mimeType: "image/jpeg",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        throw new Error(resData.error || "Failed to parse freshness results");
      }
    } catch (err: any) {
      console.error("Freshness error:", err);
      setErrorMessage(err.message || "Failed to analyze freshness. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getTierColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
          Food Freshness & Spoilage Detection
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Milestone 4 · Assess organoleptic decay indicators, forecast shelf life, and enforce consumption safety.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Inspection Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Benchmark Samples (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Target Food Image</span>
            </h3>

            <div className="relative aspect-4/3 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Produce under freshness inspection"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Leaf className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select or upload a food item</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
              </button>
            </div>

            <button
              onClick={analyzeFreshness}
              disabled={analyzing || !selectedImage}
              className={`w-full mt-3 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                analyzing || !selectedImage
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Organoleptic Markers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluate Food Freshness & Spoilage</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Benchmark Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Produce Freshness Benchmarks
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FRESHNESS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                    selectedImage === preset.url
                      ? "border-emerald-500 bg-emerald-50/60 font-medium text-emerald-950"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-semibold truncate">{preset.name}</p>
                  <span className="text-[10px] text-slate-500">{preset.state}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Freshness Audit Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              {/* Primary Score & Verdict Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500">Produce Inspection Result</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-0.5">
                      {result.itemName}
                    </h3>
                  </div>

                  {/* Score Ring */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-slate-400 font-semibold">Freshness Score</p>
                      <p className="text-2xl font-black text-slate-900 font-sans">
                        {result.freshnessScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-lg border font-bold text-xs uppercase ${getTierColor(
                        result.freshnessScore
                      )}`}
                    >
                      {result.freshnessStatus}
                    </div>
                  </div>
                </div>

                {/* Consumption Verdict Banner */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">
                      Safety Verdict: {result.consumptionSafetyVerdict}
                    </span>
                    <p className="text-slate-600 mt-0.5">{result.safetyAdvisory}</p>
                  </div>
                </div>
              </div>

              {/* Shelf Life & Organoleptic Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shelf-Life Forecast */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Projected Shelf Life</span>
                  </h4>
                  <p className="text-sm font-bold text-slate-900 font-sans">
                    {result.estimatedShelfLife}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-700">Storage Protocol:</p>
                    {result.storageRecommendations.map((rec, i) => (
                      <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">·</span>
                        <span>{rec}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Spoilage Markers */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Organoleptic Decay Markers</span>
                  </h4>
                  <div className="space-y-2">
                    {result.spoilageIndicators.map((spoil, i) => (
                      <div key={i} className="text-xs p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-800">{spoil.marker}</span>
                          <span
                            className={`font-semibold ${
                              spoil.severity === "None"
                                ? "text-emerald-600"
                                : spoil.severity === "Low"
                                ? "text-blue-600"
                                : "text-amber-600"
                            }`}
                          >
                            {spoil.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{spoil.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Biological Model Limitations Disclosure */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Model Boundary & Biological Limitations</p>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      {result.modelLimitations}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 font-sans">
                Awaiting Produce Freshness Inspection
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select one of the produce benchmarks on the left or upload your own food item to detect surface decay, shelf-life indicators, and consumption safety.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
