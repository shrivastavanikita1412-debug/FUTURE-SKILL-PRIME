export interface PredictionItem {
  label: string;
  probability: number;
}

export interface DetectedIngredient {
  name: string;
  estimatedPortion: string;
  confidence: number;
}

export interface Macronutrients {
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG?: number;
}

export interface Micronutrients {
  sodiumMg: number;
  potassiumMg: number;
  calciumMg: number;
  ironMg: number;
  vitaminCMg: number;
}

export interface NutritionData {
  servingSize: string;
  calories: number;
  macronutrients: Macronutrients;
  micronutrients: Micronutrients;
  glycemicIndexEstimated: string;
  healthScore: number;
}

export interface FoodClassificationResult {
  foodName: string;
  confidence: number;
  primaryCategory: string;
  cuisine: string;
  processingLevel: string;
  dietaryTags: string[];
  topPredictions: PredictionItem[];
  ingredientsDetected: DetectedIngredient[];
  nutrition: NutritionData;
  dietaryInsights: string[];
  allergenWarnings: string[];
}

export interface SpoilageIndicator {
  marker: string;
  severity: "None" | "Low" | "Medium" | "High";
  description: string;
}

export interface FreshnessResult {
  itemName: string;
  freshnessScore: number;
  freshnessStatus: string;
  confidence: number;
  estimatedShelfLife: string;
  spoilageIndicators: SpoilageIndicator[];
  visualObservations: string[];
  storageRecommendations: string[];
  consumptionSafetyVerdict: string;
  safetyAdvisory: string;
  modelLimitations: string;
}

export interface ChecklistItem {
  area: string;
  status: "Compliant" | "Minor Concern" | "Critical Violation";
  score: number;
  details: string;
}

export interface Violation {
  id: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  title: string;
  description: string;
  regulatoryReference: string;
}

export interface HygieneResult {
  complianceScore: number;
  grade: string;
  inspectionSummary: string;
  inspectedChecklist: ChecklistItem[];
  identifiedViolations: Violation[];
  correctiveActionPlan: string[];
  positiveFindings: string[];
}

export interface RecipeMeal {
  mealType: string;
  title: string;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMinutes: number;
  recipeSteps: string[];
  suitableAlternative: string;
}

export interface DayPlan {
  dayName: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  meals: RecipeMeal[];
}

export interface GroceryCategory {
  category: string;
  items: string[];
}

export interface MealPlanResult {
  planTitle: string;
  summary: string;
  dailyTargetSummary: {
    targetCalories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  days: DayPlan[];
  groceryShoppingList: GroceryCategory[];
  dietitianTips: string[];
}

export interface FoodLogItem {
  id: string;
  timestamp: string;
  foodName: string;
  category: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  servingSize: string;
}

export interface SystemTestCase {
  testId: string;
  milestone: string;
  name: string;
  status: "PASSED" | "FAILED";
  durationMs: number;
  details: string;
}

export interface SystemTestSuiteResponse {
  success: boolean;
  executionTimestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  totalDurationMs: number;
  tests: SystemTestCase[];
}
