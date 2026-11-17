# 🚀 ViralHook Studio

### Creator A/B Hook Lab & Virality Predictor

**Turn your opening lines into smarter creative decisions.**

ViralHook Studio is an AI-powered creator intelligence platform designed to help social media creators analyse, compare and optimise video opening hooks. By combining Natural Language Processing (NLP), Machine Learning and psychological language analysis, the platform helps identify potentially engaging hooks and make more informed content decisions.

---

## 🎯 Problem Statement

The first few seconds of a short-form video play an important role in capturing audience attention. Even high-quality content can struggle if its opening fails to interest viewers.

ViralHook Studio aims to solve this challenge through intelligent hook analysis, side-by-side comparisons and data-driven engagement predictions.

## ✨ Key Features

- ⚔️ **A/B Hook Battle Arena** – Compare two opening hooks side by side.
- 🧠 **Psychological Trigger Analysis** – Identify curiosity, emotional appeal, specificity and other linguistic signals.
- ✍️ **Smart Hook Linter** – Highlight potentially powerful, weak and context-dependent words.
- 📊 **Engagement Predictor** – Estimate engagement categories using a Machine Learning model.
- 🔄 **Hook Remix Lab** – Explore alternative ways to improve opening lines.
- 📚 **Hook Library** – Save, organise and revisit previous hooks.
- 📈 **Performance Tracker** – Compare predictions with actual content performance.

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| NLP | TF-IDF, Text Preprocessing |
| Database | SQLite |
| Data Analysis | Pandas, NumPy, Jupyter Notebook |

## 🤖 Machine Learning Approach

The initial ML pipeline is designed around:

1. Text preprocessing and cleaning.
2. TF-IDF feature extraction using N-grams.
3. Linguistic and psychological feature engineering.
4. Multiclass Logistic Regression.
5. L1 regularisation for feature selection.
6. Model evaluation using Macro-F1, Log-Loss and other relevant metrics.

**Note:** Predictions are estimates based on historical data, not guarantees of virality.

## 🏗️ Project Status

✅ **3-Day Sprint Complete (16–18 Nov 2026)**
- **Day 1**: Architecture setup, health checks, prediction gateway, Pydantic v2 schemas.
- **Day 2**: 8-feature psycholinguistic explainer, 13-rule hook linter, `/api/analyze` endpoint.
- **Day 3**: Trained hybrid TF-IDF + 24-feature Logistic Regression model (Macro-F1: 0.9977), full E2E & edge-case test suite (60/60 tests passing), close-result decision guard.

### 🧪 Running the Tests
```bash
# Backend & E2E Tests (49 tests)
pytest backend/tests/ -v

# ML Data Pipeline & Feature Extractor Tests (11 tests)
pytest tests/ -v
```

### 🚀 Running the App
```bash
# Start backend server (serves API & single-page UI at http://127.0.0.1:8000)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

## 👥 Team

**ViralHook Studio — Core Development Team**

- **Rupak** — Project Lead / Architecture, Git Hygiene (`.gitignore`), Documentation (`docs/`), Backend Integration
- **Tanvir** — Machine Learning & NLP Pipeline Lead (Dual-Tower ML, Whisper, Calibration)
- **Aditya** — Backend API & Database Lead (FastAPI, SQLite, Schemas, Linter Rules)
- **Samina** — Frontend Lead / UI System & Architecture (React, Vite, Tailwind, Zustand)
- **Meenmoy** — Frontend Lead / Battle Arena & Visualizations (A/B Arena, Pace Meter, Linter UI)

## 🎯 Our Vision

To make content creation more intelligent by combining creativity, psychology and machine learning — helping creators understand not just *what* makes a hook interesting, but *why* it might work.

---

**Built with creativity, curiosity and code. 💜**

*ViralHook Studio | Creator Intelligence, Reimagined.*
