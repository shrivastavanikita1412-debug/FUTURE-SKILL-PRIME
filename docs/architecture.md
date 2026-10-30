# FoodVerse AI – System Architecture & Technical Specifications

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (React 19 + Vite)                          |
|  - Modern Dashboard UI (Tailwind CSS v4, Lucide Icons, Plus Jakarta & Outfit)    |
|  - Real-time Webcam & Image File Upload Pipeline (Base64 / Canvas Stream)         |
|  - Interactive Nutritional Visualizers (Macro Rings, RDA Bars, Diary Tracker)     |
|  - Inspection Compliance Report Exporter (JSON / Formatted Audit PDF)             |
|  - System Verification Workbench & Interactive Documentation Hub                  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (Port 3000)
                                           v
+-----------------------------------------------------------------------------------+
|                        FULL-STACK APPLICATION SERVER (server.ts)                  |
|  - Express REST Engine (CORS, 50MB Payload Handling, Strict Input Validation)     |
|  - Vite Middleware Hot Injection (Unified Development & Production Serving)       |
|  - Server-Side Gemini 3.8 Flash Multimodal AI Integration (GoogleGenAI Client)     |
|  - Food Recognition, Freshness, Hygiene, & Meal Planner Endpoints                |
|  - In-Memory Nutrition Diary Store with LocalStorage Synchronization             |
|  - Automated System Acceptance Test Runner (/api/system/test-suite)               |
+------------------------------------------+----------------------------------------+
                                           | Microservice RPC / Internal Bridge
                                           v
+-----------------------------------------------------------------------------------+
|                      PYTHON FASTAPI & AI/ML ENGINE (/backend)                     |
|  - FastAPI 0.110 Async Framework (Modular APIRouters, Pydantic v2 Models)         |
|  - Computer Vision Preprocessing: OpenCV (CLAHE, BGR2RGB, Resizing)               |
|  - Deep Learning Pipeline: PyTorch & Torchvision (Tensor Normalization 224x224)   |
|  - Rule-Based Food Science & HACCP Regulation Engine (FDA Food Code Citations)    |
|  - Automated Pytest Test Suite (/backend/tests/)                                  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure Breakdown

```
/
├── .env.example                       # Environment configuration template
├── index.html                         # SPA Entrypoint with SEO tags & Google Fonts
├── metadata.json                      # AI Studio Applet capabilities declaration
├── package.json                       # Node dependencies & execution scripts
├── server.ts                          # Express server + Gemini Multimodal Bridge
├── tsconfig.json                      # TypeScript strict compiler options
├── vite.config.ts                     # Vite build configuration with Tailwind v4
│
├── backend/                           # Python FastAPI AI/ML microservice
│   ├── main.py                        # FastAPI entrypoint & router assembly
│   ├── requirements.txt               # Python package dependencies
│   ├── Dockerfile                     # Production container configuration
│   ├── routers/                       # Modular REST API endpoints
│   │   ├── health.py                  # System health & telemetry
│   │   ├── food_recognition.py        # Food classification router
│   │   ├── nutrition.py               # Nutritional profile router
│   │   ├── freshness.py               # Spoilage & decay router
│   │   ├── hygiene.py                 # Kitchen sanitation & PPE router
│   │   └── meal_planner.py            # Meal planner router
│   ├── schemas/                       # Pydantic data validation schemas
│   │   ├── food_schema.py             # Food classification request/response
│   │   ├── nutrition_schema.py        # Nutritional values & RDA models
│   │   ├── freshness_schema.py        # Decay markers & shelf life models
│   │   ├── hygiene_schema.py          # PPE checklist & violation models
│   │   └── meal_plan_schema.py        # Meal plan, day plan, grocery models
│   └── services/                      # Core AI/ML business logic & algorithms
│       ├── vision_service.py          # PyTorch & OpenCV pipeline
│       ├── nutrition_service.py       # Nutritional profile generator
│       ├── freshness_service.py       # Spoilage evaluation engine
│       ├── hygiene_service.py         # HACCP & FDA hygiene auditor
│       └── meal_planner_service.py    # Caloric & macro balancer
│
├── docs/                              # Official Assignment Submission Documentation
│   ├── project_overview.md            # System overview & scope
│   ├── architecture.md                # Architectural design & data flow
│   ├── milestone_tracker.md           # Milestone progression tracker
│   ├── epic_tracker.md                # Epics & feature breakdown
│   ├── activity_completion_report.md  # Activity-wise completion report
│   ├── implementation_details.md      # Algorithm & codebase deep dive
│   ├── api_documentation.md           # Full OpenAPI / REST contract
│   ├── testing_report.md              # Test execution log & verification results
│   ├── setup_instructions.md          # Local run & deployment instructions
│   └── final_submission_report.md     # Final evaluator sign-off checklist
│
├── evidence/                          # Execution artifacts & milestone proof
│   ├── milestone_1/                   # Env setup & architecture verification
│   ├── milestone_2/                   # Food recognition test logs
│   ├── milestone_3/                   # Nutrition breakdown test logs
│   ├── milestone_4/                   # Freshness classification test logs
│   ├── milestone_5/                   # Hygiene audit test logs
│   └── milestone_6/                   # Meal plan & system verification logs
│
└── src/                               # Frontend React Application
    ├── main.tsx                       # React DOM mount point
    ├── index.css                      # Tailwind CSS v4 styling & typography
    ├── App.tsx                        # Master layout, navigation & state manager
    ├── components/                    # Modular UI components
    │   ├── Header.tsx                 # Brand bar, system status indicator
    │   ├── Navigation.tsx             # Module tabs & responsive menu
    │   ├── FoodRecognitionModule.tsx  # Vision upload, prediction cards, tags
    │   ├── NutritionModule.tsx        # Calorie gauge, macro bars, daily diary
    │   ├── FreshnessModule.tsx        # Decay index, spoilage markers, storage tips
    │   ├── HygieneModule.tsx          # PPE auditor, violations, corrective steps
    │   ├── MealPlannerModule.tsx      # Calorie/diet selector, multi-day meal schedule
    │   ├── DocumentationViewer.tsx    # Live in-app Markdown documentation viewer
    │   └── SystemVerificationLab.tsx  # Automated test runner & evidence exporter
    └── types/                         # Shared TypeScript interfaces
        └── index.ts                   # Core data models
```

---

## 3. Data Flow Pipelines

### Food Recognition & Nutrition Pipeline:
1. User captures image via webcam or selects image/sample preset.
2. Client converts image to compressed Base64 data URL.
3. Payload sent via `POST /api/food/classify` to Express server.
4. Server constructs structured multimodal prompt with schema enforcement.
5. Gemini 3.8 Flash evaluates visual features and outputs validated JSON.
6. Frontend parses response into interactive cards: Top 3 predictions, Macro distribution chart, Micronutrient RDA bars, and Dietary tags.
7. User can log entry to Daily Nutrition Ledger with 1 click.

### Kitchen Hygiene Compliance Pipeline:
1. User uploads commercial kitchen or workstation snapshot.
2. Server executes HACCP inspection audit checking:
   - PPE coverage (Gloves, hair restraints, aprons).
   - Stainless surface sanitation and debris.
   - Cross-contamination hazards (raw poultry near vegetables).
   - Chemical placement and dry food elevation (>6 inches).
3. System computes compliance score (0–100) and letter grade (A, B, C, Hazard).
4. System maps findings to FDA Food Code violations and provides immediate corrective actions.
5. User can download structured compliance audit report for inspector sign-off.
