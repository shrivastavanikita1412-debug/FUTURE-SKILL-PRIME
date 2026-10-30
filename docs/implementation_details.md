# FoodVerse AI – Implementation Details & Engineering Deep Dive

## 1. Deep Learning & Computer Vision Algorithms

### Image Preprocessing & Tensor Pipeline
In `backend/services/vision_service.py`, input images are ingested as base64 byte streams, sanitized, and fed into the image processing pipeline:
- **Resizing**: Ingested frames are bilinearly scaled to 256x256 pixels to maintain spatial coherence across diverse aspect ratios.
- **Center Cropping**: Padded or cropped to 224x224 pixels, the canonical dimension for ResNet and Vision Transformer (ViT) backbones.
- **Channel Normalization**: Scaled to standard ImageNet mean `[0.485, 0.456, 0.406]` and standard deviation `[0.229, 0.224, 0.225]`.

### Multimodal Vision Model (`gemini-3.8-flash`)
The runtime AI inference utilizes Google's `gemini-3.8-flash` model accessed securely server-side through `@google/genai`:
- **Zero Client-Side Exposure**: API keys are isolated strictly within `server.ts` and never leaked into client bundles or UI inputs.
- **Strict JSON Contract**: Prompts enforce structured JSON payloads parsed through `cleanAndParseJSON` to eliminate markdown artifact interference.
- **Fail-Safe Heuristic Mode**: If external connectivity is unavailable, the service smoothly switches to internal expert heuristics, ensuring zero app crashes.

---

## 2. Food Recognition & Taxonomy Engine
The recognition system handles multi-ingredient dishes:
1. **Primary Category Identification**: Segregates into broad classes (Salads, Proteins, Grains, Soups, Desserts, Beverages).
2. **NOVA Food Processing Classification**: Identifies if a meal is Unprocessed/Minimally Processed (e.g. fresh salmon, raw greens) vs Ultra-Processed (e.g. hydrogenated oils, artificial colorants).
3. **Dietary Tagging**: Evaluates ingredient combinations to flag suitability for Paleo, Keto, Gluten-Free, Vegan, or High-Protein regimens.

---

## 3. Freshness & Organoleptic Degradation Modeling
The freshness module grades food along 4 primary biological axes:
- **Enzymatic Oxidation**: Polyphenol oxidase (PPO) activity manifesting as surface browning in cut fruits and vegetables.
- **Microbial Colonization**: Visual appearance of Penicillium mold mycelia, fungal spores, or bacterial slime.
- **Dehydration & Cell Lysis**: Loss of internal turgor pressure leading to surface shriveling, wilting, or collapse.
- **Epidermal Cuticle Integrity**: Pitting, softening, or puncture contusions.

---

## 4. Kitchen & Restaurant Hygiene Rulebook
The hygiene engine is modeled directly on the **FDA Food Code** and **HACCP (Hazard Analysis Critical Control Point)**:
- **FDA § 3-304.14**: Proper storage of wiping cloths in sanitizer buckets (200 ppm quaternary ammonium or 50-100 ppm chlorine).
- **FDA § 3-302.11**: Packaged and unpackaged food separation to prevent raw animal proteins dripping onto ready-to-eat vegetables.
- **FDA § 3-305.11**: Minimum 6-inch elevation above the floor for all food storage containers to prevent floor splash contamination.
- **HACCP Principle 3**: Critical Control Point monitoring of personal protective equipment (PPE).

---

## 5. Algorithmic Macronutrient Optimization
The meal planner optimizes daily nutrition via linear constraint formulation:
$$\text{Target Calories} = (\text{Protein g} \times 4) + (\text{Carbohydrate g} \times 4) + (\text{Fat g} \times 9)$$
User-selected macro splits (e.g. 30% Protein, 40% Carbs, 30% Fat) are distributed into breakfast (28%), lunch (38%), and dinner (34%) with recipe steps and dynamic ingredient substitutions.
