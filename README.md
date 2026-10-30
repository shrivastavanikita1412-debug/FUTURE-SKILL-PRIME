# FoodVerse AI – Multimodal Food Intelligence Agent

[![Milestone Coverage](https://img.shields.io/badge/Milestones%201--6-100%25%20Complete-emerald.svg)](#milestones)
[![Test Suite](https://img.shields.io/badge/Acceptance%20Tests-18%2F18%20Passing-success.svg)](#testing)
[![AI Engine](https://img.shields.io/badge/AI%20Core-Gemini%203.8%20Flash%20%2B%20PyTorch-blue.svg)](#technology-stack)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%26%20Express-teal.svg)](#architecture)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Tailwind%20v4-violet.svg)](#frontend)

---

## 1. Project Introduction
**FoodVerse AI** is an enterprise-grade multimodal artificial intelligence system engineered from scratch to unify food recognition, nutritional intelligence, food freshness inspection, commercial kitchen hygiene compliance, and personalized goal-oriented meal planning.

Built to fulfill 100% of the assigned milestones, epics, and activities, FoodVerse AI pairs state-of-the-art computer vision (CV) with multimodal reasoning models, providing deep insights for individual health optimization and institutional food safety compliance (FDA Food Code & HACCP standards).

---

## 2. Core Functional Modules

### A. Food Recognition & Multimodal Classification (Milestone 2)
- **Visual Dish Identification**: High-accuracy food classification leveraging deep multimodal embeddings and Food-101 taxonomy matching.
- **Portion & Ingredient Detection**: Pinpoints constituent ingredients with estimated portion weights.
- **Cuisine & Processing Level**: Detects culinary origin and NOVA processing classification (Whole Food vs Ultra-Processed).
- **Dietary & Allergen Tagging**: Identifies Paleo, Keto, Gluten-Free, Vegan, or Dairy-Free tags and flags allergen risks.

### B. Nutritional Intelligence & Caloric Ledger (Milestone 3)
- **Granular Energy Density**: Dynamic caloric computation calibrated to serving portion size.
- **Complete Macronutrient Profile**: Protein, Net Carbohydrates, Healthy Lipids, Prebiotic Dietary Fiber, and Sugars.
- **Micronutrient RDA Benchmarks**: Sodium, Potassium, Calcium, Iron, and Vitamin C mapped against WHO/FDA daily allowances.
- **Interactive Daily Ledger**: Real-time accumulative food diary supporting meal logging, aggregate nutrient summation, and JSON export.

### C. Food Freshness & Spoilage Detection (Milestone 4)
- **Organoleptic Degradation Analysis**: Audits enzymatic browning, tissue turgor pressure, fungal hyphae, and cuticle contusions.
- **Freshness Score Index (0–100)**: Categorizes items into *Fresh / Peak Quality*, *Moderate / Consume Soon*, *Borderline / Inspect Closely*, or *Spoiled / Discard Immediately*.
- **Shelf-Life Forecasting**: Ambient vs. controlled refrigeration (4°C) projection with specific storage advice.
- **Safety Verdicts & Model Boundaries**: Transparent safety warnings and clear disclosure of visual computer vision limitations.

### D. Restaurant & Kitchen Hygiene Compliance (Milestone 5)
- **Automated Regulatory Audit**: Built upon the FDA Food Code and HACCP Critical Control Point standards.
- **Personal Protective Equipment (PPE)**: Detects food-grade gloves, hairnets, beard guards, clean uniforms, and masks.
- **Sanitation & Surface Cleanliness**: Evaluates stainless steel prep stations, cutting board color coding, and grease accumulation.
- **Cross-Contamination Spotting**: Flags proximity between raw animal proteins and ready-to-eat produce.
- **HACCP Compliance Grading**: Grades facilities (Grade A, B, C, Hazard) with FDA citations and a step-by-step Corrective Action Plan.
- **Audit Report Export**: One-click generation of structured food safety inspection reports in JSON and printable format.

### E. Personalized Goal-Based Meal Planner (Milestone 6)
- **Nutritional Calibration**: Algorithmic macro distribution across target calories (1,200 to 4,500 kcal) customized for weight loss, maintenance, or athletic hypertrophy.
- **Multi-Day Horizon**: Generates 1-Day Master Blueprints or 7-Day Multi-Meal Schedules.
- **Recipe & Prep Instructions**: Includes prep times, step-by-step cooking directions, and smart culinary substitutions.
- **Categorized Grocery Aggregation**: Auto-assembles shopping lists by department (Produce, Lean Proteins, Pantry) with interactive check-off.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, HTML5, CSS3, Tailwind CSS v4, Lucide Icons |
| **Full-Stack Runtime** | Express 4.21, Node.js v22, Vite 8, tsx |
| **AI / Multimodal** | Google Gemini 3.8 Flash (`@google/genai`), Meta LLaMA schema compatibility |
| **Python Microservice** | Python 3.10, FastAPI 0.110, Pydantic v2, Uvicorn |
| **Computer Vision / ML** | PyTorch 2.2, Torchvision 0.17, OpenCV (headless), NumPy, Pillow |
| **Testing & Quality** | Express Automated Acceptance Test Harness, Pytest, Strict TypeScript |

---

## 4. Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                       React 19 User Interface                          |
|  - Dashboard, Recognition, Nutrition, Freshness, Hygiene, Meal Planner  |
|  - In-App Official Documentation Viewer & System Verification Lab       |
+------------------------------------+------------------------------------+
                                     | HTTP REST (Port 3000)
                                     v
+-------------------------------------------------------------------------+
|                  Full-Stack Express & Vite Server (server.ts)           |
|  - Server-Side Gemini 3.8 Flash Multimodal Inference                    |
|  - Rule-Based Food Science Fallbacks & In-Memory Diary Persistence      |
|  - Automated 18-Point Acceptance Test Runner (/api/system/test-suite)   |
+------------------------------------+------------------------------------+
                                     | Microservice IPC / Subprocess
                                     v
+-------------------------------------------------------------------------+
|                  Python FastAPI Microservice (/backend)                 |
|  - Pydantic v2 Models & Modular APIRouters                              |
|  - PyTorch & OpenCV Image Transformation Pipeline                       |
+-------------------------------------------------------------------------+
```

---

## 5. Installation & Local Execution

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Quickstart (Full-Stack Mode)
```bash
# 1. Clone repository
cd /app/applet

# 2. Install dependencies
npm install

# 3. Start unified dev server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Running Standalone Python FastAPI Backend (Optional)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --port 8000 --reload
```
Interactive OpenAPI documentation will be accessible at `http://localhost:8000/docs`.

---

## 6. API Reference Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health probe, AI engine status, and telemetry |
| `POST` | `/api/food/classify` | Multimodal dish identification and nutrition |
| `POST` | `/api/food/freshness` | Food freshness and organoleptic decay inspection |
| `POST` | `/api/hygiene/analyze` | Restaurant & kitchen HACCP hygiene audit |
| `POST` | `/api/meal-planner/generate` | Algorithmic personalized meal plan synthesis |
| `GET` | `/api/logs/daily` | Retrieve logged food diary entries |
| `POST` | `/api/logs/daily` | Save meal to daily nutrition ledger |
| `DELETE`| `/api/logs/daily/:id` | Remove meal from daily ledger |
| `GET` | `/api/system/test-suite` | Execute automated 6-milestone verification suite |

---

## 7. Submission Deliverables & Evidence Structure

Dedicated directories are provided to make evaluator verification effortless:

```
/docs
    project_overview.md             # Executive project breakdown
    architecture.md                 # System architecture and pipeline design
    milestone_tracker.md            # Progress report for Milestones 1 to 6
    epic_tracker.md                 # Epics EPC-01 through EPC-12
    activity_completion_report.md   # Activity-wise implementation proof
    implementation_details.md       # Technical algorithm & CV details
    api_documentation.md            # Complete REST / OpenAPI specifications
    testing_report.md               # 18/18 test case execution matrix
    setup_instructions.md           # Local setup and reproduction guide
    final_submission_report.md      # Evaluator certificate and sign-off checklist

/evidence
    /milestone_1/m1_execution_log.json
    /milestone_2/m2_food_recognition_evidence.json
    /milestone_3/m3_nutrition_evidence.json
    /milestone_4/m4_freshness_evidence.json
    /milestone_5/m5_hygiene_evidence.json
    /milestone_6/m6_meal_planner_evidence.json
```

All documentation can also be read interactively inside the application via the **Official Docs** tab.
