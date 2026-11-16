# Machine Learning & NLP Methodology

## 1. Dual-Tower Model Architecture

Short hooks (5–15 words) fail under isolated TF-IDF models due to vocabulary sparsity. ViralHook Studio deploys a **Hybrid Dual-Tower Architecture**:

### Tower 1: Dense Semantic Tower
- **Model**: `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors).
- **Inference Profile**: Lightweight (~80MB), CPU inference $<15\text{ms}$.
- **Function**: Captures conceptual similarity, tone, intent, and synonyms (e.g. recognizing that *"mistakes you make"* and *"errors you commit"* share identical meaning).

### Tower 2: Sparse & Psycholinguistic Feature Tower
- **Sparse Component**: Sublinear TF-IDF (1–3 word n-grams) capturing high-signal viral keywords and internet idioms.
- **Engineered Psycholinguistic Features (24 Dimensions)**:
  - **Pacing & Timing**: Character count, word count, estimated speaking duration ($T = \text{words} / 2.75$), syllable density.
  - **Psychological Triggers**: Direct address index (`you`, `your`), open curiosity loop detection, negative urgency markers, time brevity markers.
  - **Information Specificity**: Concrete noun ratio, numeric digits, named entities.
  - **Cognitive Load**: Flesch-Kincaid Grade Level (optimized for Grade 4–6 readability).
  - **Clickbait Safeguard**: Over-promising superlative penalty (`best ever`, `insane`, `unbelievable`).

### Fusion & Classification
- Concatenation: $\mathbf{x}_{\text{fused}} = [\mathbf{e}_{\text{dense}} \,\|\, \mathbf{x}_{\text{sparse}} \,\|\, \mathbf{f}_{\text{engineered}}]$.
- Classifier: Calibrated LightGBM or L1-Regularized Logistic Regression.
- Calibration: Isotonic Regression on validation holdouts ensuring predicted probabilities reflect true empirical base rates.

---

## 2. Target Formulation & Mitigating Confounders

### Follower-Normalized Virality Multiplier (FNVM)
Raw views conflate creator audience size with hook efficacy. We evaluate hooks against creator baseline performance:
$$\text{FNVM} = \frac{\text{Post Views}}{\text{Median Creator Views (last 10 posts)}}$$

- **High Engagement**: $\text{FNVM} \ge 3.0$ (Video broke algorithmic barrier)
- **Medium Engagement**: $0.8 \le \text{FNVM} < 3.0$ (Typical baseline performance)
- **Low Engagement**: $\text{FNVM} < 0.8$ (Underperformed baseline)

### Weighted Engagement Quality (WEQ)
Reflects short-form algorithm weighting (saves and shares are prioritized over passive likes):
$$\text{WEQ} = \frac{\text{Likes} + 3 \times \text{Comments} + 5 \times \text{Saves} + 7 \times \text{Shares}}{\text{Views} + 100}$$

---

## 3. Data Splitting & Leakage Controls
- **GroupKFold by `creator_id`**: Prevents the model from memorizing specific creators or delivery styles.
- **Temporal Split**: Past data forms the training set; future data forms the test set.
- **Leakage Prevention**: All tokenizers, vectorizers, and scalar normalizers are fitted exclusively on training splits.
- **Primary Metric**: **Macro-F1** across all classes, accompanied by **PR-AUC (High Class)**, **Log-Loss**, and **Brier Score**.

