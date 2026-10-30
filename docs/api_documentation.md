# FoodVerse AI – API Documentation & REST Contracts

Base URL: `http://localhost:3000/api` (Full-Stack Engine) or `http://localhost:8000/api` (FastAPI Microservice)

---

### 1. Health & Readiness Probe
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Description**: Returns microservice status, active AI engine, and enabled intelligence modules.
- **Response (200 OK)**:
```json
{
  "status": "online",
  "service": "FoodVerse AI Multimodal Core",
  "version": "2.4.0",
  "hasApiKey": true,
  "aiEngine": "gemini-3.8-flash (multimodal active)",
  "supportedModules": [
    "food_recognition_and_classification",
    "nutritional_intelligence",
    "food_freshness_detection",
    "kitchen_hygiene_safety_compliance",
    "personalized_meal_planner"
  ],
  "timestamp": "2026-10-30T06:05:00.000Z"
}
```

---

### 2. Food Recognition & Classification
- **Method**: `POST`
- **Endpoint**: `/api/food/classify`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "mimeType": "image/jpeg"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "foodName": "Mediterranean Salmon & Avocado Quinoa Salad",
    "confidence": 0.96,
    "primaryCategory": "Salad / Healthy Mains",
    "cuisine": "Mediterranean",
    "processingLevel": "Minimally Processed",
    "dietaryTags": ["High-Protein", "Keto-Friendly", "Gluten-Free"],
    "topPredictions": [
      {"label": "Grilled Salmon Salad", "probability": 0.96},
      {"label": "Avocado Greens Bowl", "probability": 0.84}
    ],
    "ingredientsDetected": [
      {"name": "Wild Salmon", "estimatedPortion": "150g", "confidence": 0.95}
    ],
    "nutrition": {
      "servingSize": "1 bowl (380g)",
      "calories": 485,
      "macronutrients": {
        "proteinG": 38.0,
        "carbsG": 12.5,
        "fatG": 32.0,
        "fiberG": 7.2,
        "sugarG": 4.1
      },
      "micronutrients": {
        "sodiumMg": 420,
        "potassiumMg": 890,
        "calciumMg": 65,
        "ironMg": 2.8,
        "vitaminCMg": 34
      },
      "glycemicIndexEstimated": "Low (<35)",
      "healthScore": 94
    },
    "dietaryInsights": ["Optimal protein-to-carb balance supporting muscle repair."],
    "allergenWarnings": ["Contains Fish (Salmon)."]
  },
  "engine": "gemini-3.8-flash"
}
```

---

### 3. Food Freshness & Spoilage Detection
- **Method**: `POST`
- **Endpoint**: `/api/food/freshness`
- **Request Body**:
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "mimeType": "image/jpeg"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "itemName": "Fresh Gala Apples",
    "freshnessScore": 92,
    "freshnessStatus": "Fresh / Peak Quality",
    "confidence": 0.95,
    "estimatedShelfLife": "7-10 days refrigerated",
    "spoilageIndicators": [
      {
        "marker": "Skin Turgor & Firmness",
        "severity": "None",
        "description": "Smooth, taut skin without pitting."
      }
    ],
    "visualObservations": ["Uniform pigmentation and firm calyx structure."],
    "storageRecommendations": ["Keep refrigerated in crisper drawer between 1°C and 4°C."],
    "consumptionSafetyVerdict": "Safe to Consume",
    "safetyAdvisory": "Wash thoroughly before eating.",
    "modelLimitations": "Visual AI inspects exterior surface only."
  }
}
```

---

### 4. Commercial Kitchen & Restaurant Hygiene Inspection
- **Method**: `POST`
- **Endpoint**: `/api/hygiene/analyze`
- **Request Body**:
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "mimeType": "image/jpeg",
  "facilityType": "Commercial Kitchen"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "complianceScore": 89,
    "grade": "Grade B (80-89)",
    "inspectionSummary": "Kitchen demonstrates strong sanitation standards with minor cloth storage issues.",
    "inspectedChecklist": [
      {
        "area": "PPE & Staff Hygiene",
        "status": "Compliant",
        "score": 95,
        "details": "Nitrile gloves and hair restraints verified."
      }
    ],
    "identifiedViolations": [
      {
        "id": "VIO-01",
        "severity": "Low",
        "title": "Sanitizer Cloth Wet Storage",
        "description": "Cloth rested on tabletop rather than submerged in quat bucket.",
        "regulatoryReference": "FDA Food Code § 3-304.14(B)"
      }
    ],
    "correctiveActionPlan": [
      "Submerge all wiping cloths in designated sanitizer solution buckets."
    ],
    "positiveFindings": [
      "100% hair restraint compliance."
    ]
  }
}
```

---

### 5. Personalized Meal Planner
- **Method**: `POST`
- **Endpoint**: `/api/meal-planner/generate`
- **Request Body**:
```json
{
  "dietaryPreference": "Mediterranean",
  "calorieTarget": 2200,
  "macroDistribution": { "proteinPct": 30, "carbsPct": 45, "fatPct": 25 },
  "allergies": ["Peanuts", "Shellfish"],
  "exclusions": ["Pork"],
  "planDuration": "7-day",
  "goal": "Lean Muscle & Cardiovascular Vitality"
}
```

---

### 6. Daily Nutritional Ledger Endpoints
- `GET /api/logs/daily` -> Retrieve current food log entries
- `POST /api/logs/daily` -> Append meal entry
- `DELETE /api/logs/daily/:id` -> Remove meal entry

---

### 7. Automated Acceptance Test Runner
- `GET /api/system/test-suite` -> Triggers full test suite across all 6 milestones
