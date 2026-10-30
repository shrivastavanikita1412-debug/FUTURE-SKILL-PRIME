import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Utensils,
  PlusCircle,
  Layers,
  Sparkles,
  ScanEye,
} from "lucide-react";
import { FoodClassificationResult } from "../types";

// High-resolution royalty-free Unsplash samples for immediate testing
const SAMPLE_PRESETS = [
  {
    id: "salmon_bowl",
    name: "Grilled Salmon Quinoa Bowl",
    tag: "High Protein",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "avocado_toast",
    name: "Avocado Toast & Poached Egg",
    tag: "Healthy Fats",
    url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "berry_bowl",
    name: "Antioxidant Acai Berry Bowl",
    tag: "Plant-Based",
    url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chicken_salad",
    name: "Mediterranean Herb Chicken Salad",
    tag: "Keto Friendly",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  },
];

interface FoodRecognitionModuleProps {
  onAddToLog: (item: any) => void;
  onNavigateToNutrition: () => void;
}

export const FoodRecognitionModule: React.FC<FoodRecognitionModuleProps> = ({
  onAddToLog,
  onNavigateToNutrition,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_PRESETS[0].url);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<FoodClassificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedToast, setLoggedToast] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Convert image URL to Base64
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
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage("Image exceeds 15MB limit. Please select a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setErrorMessage("Could not access camera. Please check browser permissions or upload a file.");
    }
  };

  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedImage(dataUrl);
        setResult(null);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setAnalyzing(true);
      setErrorMessage(null);
      setLoggedToast(false);

      let base64Payload = selectedImage;
      if (selectedImage.startsWith("http")) {
        base64Payload = await imageUrlToBase64(selectedImage);
      }

      const response = await fetch("/api/food/classify", {
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
        throw new Error(resData.error || "Failed to parse recognition results");
      }
    } catch (err: any) {
      console.error("Recognition error:", err);
      setErrorMessage(err.message || "Network error while analyzing image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogMeal = () => {
    if (!result) return;
    onAddToLog({
      foodName: result.foodName,
      category: result.primaryCategory,
      calories: result.nutrition.calories,
      proteinG: result.nutrition.macronutrients.proteinG,
      carbsG: result.nutrition.macronutrients.carbsG,
      fatG: result.nutrition.macronutrients.fatG,
      fiberG: result.nutrition.macronutrients.fiberG,
      sodiumMg: result.nutrition.micronutrients.sodiumMg,
      servingSize: result.nutrition.servingSize,
    });
    setLoggedToast(true);
    setTimeout(() => setLoggedToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Food Recognition & Classification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Milestone 2 · Ingest food imagery to identify dishes, culinary taxonomy, and constituent portions.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Analysis Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {loggedToast && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Meal successfully saved to your Daily Nutrition Ledger!</span>
          </div>
          <button
            onClick={onNavigateToNutrition}
            className="text-emerald-700 underline font-medium hover:text-emerald-900 cursor-pointer text-xs"
          >
            View Ledger →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ingestion & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Image Ingestion & Capture</span>
            </h3>

            {/* Camera Viewfinder or Image Preview */}
            <div className="relative aspect-4/3 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">
                    <button
                      onClick={captureCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Food under analysis"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Utensils className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select or upload an image to begin</p>
                </div>
              )}
            </div>

            {/* Input Actions */}
            <div className="grid grid-cols-2 gap-2 mt-3">
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
                <span>Upload File</span>
              </button>

              <button
                onClick={startCamera}
                className="py-2 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Use Camera</span>
              </button>
            </div>

            {/* Run Analysis CTA */}
            <button
              onClick={analyzeImage}
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
                  <span>Processing Multimodal Vision Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Multimodal Food Recognition</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Sample Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Verified Benchmark Samples
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
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
                  <span className="text-[10px] text-slate-500">{preset.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              {/* Primary Classified Dish Banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>{result.primaryCategory}</span>
                      <span>·</span>
                      <span>{result.cuisine} Cuisine</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{result.processingLevel}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                      {result.foodName}
                    </h3>
                  </div>

                  {/* Confidence Badge */}
                  <div className="text-right sm:shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{Math.round(result.confidence * 100)}% Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {result.dietaryTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Predictions & Detected Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top-3 Candidates */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Top Predicted Candidates</span>
                  </h4>
                  <div className="space-y-2.5">
                    {result.topPredictions.map((pred, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate">{pred.label}</span>
                          <span className="font-semibold text-slate-900 ml-2">
                            {Math.round(pred.probability * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${pred.probability * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constituent Ingredients */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identified Ingredients</span>
                  </h4>
                  <div className="space-y-2">
                    {result.ingredientsDetected.map((ing, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 border border-slate-100"
                      >
                        <span className="font-medium text-slate-800">{ing.name}</span>
                        <span className="text-slate-500">{ing.estimatedPortion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition Snapshot Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 font-sans">
                      Nutritional Profile Summary
                    </h4>
                    <span className="text-xs text-slate-500">
                      ({result.nutrition.servingSize})
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Health Score {result.nutrition.healthScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Calories</p>
                    <p className="text-lg font-bold text-slate-900 font-sans">
                      {result.nutrition.calories}
                    </p>
                    <p className="text-[10px] text-slate-400">kcal</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Protein</p>
                    <p className="text-lg font-bold text-emerald-600 font-sans">
                      {result.nutrition.macronutrients.proteinG}g
                    </p>
                    <p className="text-[10px] text-slate-400">4 kcal/g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Carbs</p>
                    <p className="text-lg font-bold text-blue-600 font-sans">
                      {result.nutrition.macronutrients.carbsG}g
                    </p>
                    <p className="text-[10px] text-slate-400">4 kcal/g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Fat</p>
                    <p className="text-lg font-bold text-amber-600 font-sans">
                      {result.nutrition.macronutrients.fatG}g
                    </p>
                    <p className="text-[10px] text-slate-400">9 kcal/g</p>
                  </div>
                </div>

                {/* Allergen & Dietary Insights */}
                {result.allergenWarnings && result.allergenWarnings.length > 0 && (
                  <div className="text-xs text-slate-600 space-y-1 mb-4">
                    <p className="font-semibold text-slate-700">Allergen Flags:</p>
                    <ul className="list-disc list-inside text-slate-500">
                      {result.allergenWarnings.map((al, idx) => (
                        <li key={idx}>{al}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogMeal}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Save to Daily Nutrition Ledger</span>
                  </button>

                  <button
                    onClick={onNavigateToNutrition}
                    className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Full Nutrition Breakdown →</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <ScanEye className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 font-sans">
                Awaiting Food Image Analysis
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Upload a meal photo, take a picture with your camera, or select one of the verified benchmark dishes on the left, then click "Run Multimodal Food Recognition".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
