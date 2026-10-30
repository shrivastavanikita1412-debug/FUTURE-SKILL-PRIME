# FoodVerse AI – Setup & Local Execution Instructions

## 1. Prerequisites
- **Node.js**: Version 18.0.0 or higher (Node 20+ recommended)
- **npm**: Version 9.0.0 or higher
- **Python**: Version 3.9+ (Optional for running standalone FastAPI microservice)
- **Google Gemini API Key**: Injected automatically in AI Studio via Settings > Secrets panel

---

## 2. Quickstart (Unified Full-Stack Mode)

### Step 1: Clone or Navigate to Project Root
```bash
cd /app/applet
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is present in `.env` if testing outside AI Studio.

### Step 4: Launch Dev Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`. Both the React user interface and Express REST backend endpoints are live.

---

## 3. Running the Python FastAPI Microservice (Optional)

If running the Python AI/ML microservice independently:

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create and Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Start FastAPI Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive OpenAPI documentation will be accessible at `http://localhost:8000/docs`.

### Step 5: Run Automated Tests
```bash
pytest backend/tests/ -v
```

---

## 4. Production Build & Deployment
To verify production readiness:
```bash
npm run build
npm start
```
This compiles the Vite production asset bundle into `/dist` and serves it via `server.ts`.
