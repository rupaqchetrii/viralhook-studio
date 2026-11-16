# ViralHook Studio — Project Overview & Architecture Blueprint

## Executive Summary
ViralHook Studio is a high-performance creator intelligence platform designed to optimize the first 1–5 seconds of short-form video content (TikTok, Instagram Reels, YouTube Shorts). By combining modern Natural Language Processing (NLP), dual-tower machine learning, psychological language analysis, and honest statistical decision support, ViralHook Studio helps creators scientifically test and refine video opening lines before recording.

## Core Philosophy
1. **Explainable Insights Over Black-Box Scores**: Break down decisions into curiosity gaps, pacing, specificity, and semantic strength rather than an arbitrary composite number.
2. **Tri-Modal Data Integrity**: Clearly differentiate spoken audio transcripts from on-screen video text and post captions.
3. **Statistical Honesty**: Provide confidence intervals and tie-detection so statistical noise is never branded as a "guaranteed winner".
4. **Creator Workflow Centricity**: Integrate a 3-second spoken pace barometer, one-click quick-fixes, and post-publication empirical feedback loops.

## System Topology
```
                      ┌──────────────────────────────────────┐
                      │    React + Vite Client (Tailwind)    │
                      │  - A/B Battle Arena & Pace Meter     │
                      │  - Interactive Quick-Fix Linter      │
                      │  - Creator Library & Feedback Loop   │
                      └──────────────────┬───────────────────┘
                                         │ JSON over REST
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        FastAPI Backend Service       │
                      │  - Input Validation (Pydantic v2)    │
                      │  - Linter & Archetype Classifier     │
                      │  - Dual-Tower ML Inference Engine    │
                      │  - SQLite / PostgreSQL Persistence   │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│     Dense Embedding Service     │             │    Feature Extraction Engine    │
│  - all-MiniLM-L6-v2 (384 dims)  │             │  - Sublinear TF-IDF (1-3 grams) │
│  - Semantic intent & tone       │             │  - 24 Psycholinguistic metrics  │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

