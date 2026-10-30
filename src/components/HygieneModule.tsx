import React, { useState, useRef } from "react";
import {
  ShieldAlert,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
  FileText,
  Sparkles,
} from "lucide-react";
import { HygieneResult } from "../types";

const HYGIENE_PRESETS = [
  {
    id: "clean_prep_line",
    name: "Commercial Stainless Prep Station",
    context: "Commercial Kitchen",
    url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bakery_station",
    name: "Artisan Bakery Prep Area",
    context: "Bakery / Flour Station",
    url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "buffet_line",
    name: "Restaurant Service Line",
    context: "Service Line",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
];

export const HygieneModule: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(HYGIENE_PRESETS[0].url);
  const [facilityType, setFacilityType] = useState<string>("Commercial Kitchen");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<HygieneResult | null>(null);
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

  const auditHygiene = async () => {
    if (!selectedImage) return;

    try {
      setAnalyzing(true);
      setErrorMessage(null);

      let base64Payload = selectedImage;
      if (selectedImage.startsWith("http")) {
        base64Payload = await imageUrlToBase64(selectedImage);
      }

      const response = await fetch("/api/hygiene/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Payload,
          mimeType: "image/jpeg",
          facilityType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        throw new Error(resData.error || "Failed to parse hygiene audit results");
      }
    } catch (err: any) {
      console.error("Hygiene audit error:", err);
      setErrorMessage(err.message || "Failed to audit hygiene compliance. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const exportAuditReport = () => {
    if (!result) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            auditId: "AUDIT-" + Date.now(),
            auditTimestamp: new Date().toISOString(),
            facilityType,
            complianceScore: result.complianceScore,
            grade: result.grade,
            inspectionChecklist: result.inspectedChecklist,
            violations: result.identifiedViolations,
            correctiveActionPlan: result.correctiveActionPlan,
            positiveFindings: result.positiveFindings,
            inspectorSignOff: "FoodVerse AI HACCP Certified Engine",
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hygiene-audit-report-${Date.now()}.json`);
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
            Restaurant & Kitchen Hygiene Compliance Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Milestone 5 · Audit PPE, surface sanitization, cross-contamination, and FDA Food Code compliance.
          </p>
        </div>

        {result && (
          <button
            onClick={exportAuditReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Audit PDF/JSON</span>
          </button>
        )}
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
        {/* Left: Input & Facility Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Inspection Target & Facility Context</span>
            </h3>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facility Category
              </label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option>Commercial Kitchen (Hot Line & Prep)</option>
                <option>Bakery & Confectionery Station</option>
                <option>Cold Pantry & Salad Bar</option>
                <option>Meat & Seafood Butchery</option>
                <option>Dishwashing & Warewashing Zone</option>
              </select>
            </div>

            <div className="relative aspect-4/3 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Kitchen facility under hygiene audit"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Building className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select or upload a facility photo</p>
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
                <span>Upload Kitchen Image</span>
              </button>
            </div>

            <button
              onClick={auditHygiene}
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
                  <span>Executing HACCP & FDA Compliance Audit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Audit Kitchen & Restaurant Hygiene</span>
                </>
              )}
            </button>
          </div>

          {/* Benchmark Facilities Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Facility Environment Benchmarks
            </p>
            <div className="space-y-2">
              {HYGIENE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setFacilityType(preset.context);
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedImage === preset.url
                      ? "border-emerald-500 bg-emerald-50/60 font-medium text-emerald-950"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="font-semibold">{preset.name}</span>
                  <span className="text-[10px] text-slate-500">{preset.context}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Audit Report Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              {/* Executive Compliance Score Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500">{facilityType} Inspection</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-0.5">
                      Compliance Rating: {result.grade}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-slate-400 font-semibold">Compliance Index</p>
                      <p className="text-2xl font-black text-slate-900 font-sans">
                        {result.complianceScore}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {result.inspectionSummary}
                </p>
              </div>

              {/* 5-Point Inspection Checklist Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5-Point Regulatory Compliance Checklist</span>
                </h4>
                <div className="space-y-2.5">
                  {result.inspectedChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{item.area}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "Compliant"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Minor Concern"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.status} ({item.score}%)
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Violations & Corrective Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Violations */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Identified Infractions ({result.identifiedViolations.length})</span>
                  </h4>
                  {result.identifiedViolations.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-medium py-3">
                      Zero regulatory infractions detected!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {result.identifiedViolations.map((vio, i) => (
                        <div key={i} className="p-2 rounded bg-rose-50/60 border border-rose-200 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-rose-900">{vio.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                              {vio.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{vio.description}</p>
                          <p className="text-[10px] font-mono text-rose-700 mt-1">
                            Ref: {vio.regulatoryReference}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Corrective Action Plan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Corrective Action Protocol</span>
                  </h4>
                  <div className="space-y-2">
                    {result.correctiveActionPlan.map((action, i) => (
                      <div key={i} className="text-xs p-2 rounded bg-slate-50 border border-slate-100 flex items-start gap-2">
                        <span className="font-bold text-emerald-600 shrink-0">{i + 1}.</span>
                        <span className="text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 font-sans">
                Awaiting Kitchen Hygiene Audit
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select one of the commercial prep station benchmarks or upload an image of your kitchen work zone to evaluate PPE compliance, sanitation, and regulatory safety scores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
