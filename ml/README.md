# ViralHook Studio — Machine Learning & NLP Subsystem
**Domain Lead:** Tanvir (`tanwir90`)  
**Assessment Window:** 16–20 November 2026 (Day 1: 16 Nov)

---

## 1. Subsystem Overview
The ML & NLP subsystem of ViralHook Studio provides CPU-optimized, sub-50ms inference for short-form video opening hooks (0–5 seconds). It combines:
1. **Dense Semantic Tower**: 384-dimensional sentence embeddings (`all-MiniLM-L6-v2`) capturing context and curiosity mechanics.
2. **Sparse & Structural Tower**: Sublinear word/character TF-IDF (1–3 n-grams) fused with **24 psycholinguistic features**.
3. **Calibrated Classifier**: Calibrated probabilities for `Low`, `Medium`, and `High` virality tiers summing strictly to $1.000 \pm 0.001$.
4. **Hook-to-Promise Consistency Checker**: Semantic cosine similarity between the hook and the video topic summary ($<0.40$ flags clickbait).

---

## 2. Directory Structure
```
1st project/
├── data/
│   ├── raw/                       # Audio files and raw scraped records
│   └── processed/
│       └── tm_hic_dataset.csv     # Tri-Modal Hook Corpus (3,000 records)
├── ml/
│   ├── __init__.py
│   ├── feature_extractor.py       # 24 psycholinguistic & structural features
│   ├── data_pipeline.py          # TM-HIC dataset generator & FNVM processor
│   ├── whisper_extractor.py       # 0–5s spoken transcript audio extractor
│   ├── dual_tower_model.py        # Dense + Sparse architecture & training (Day 2)
│   └── consistency_checker.py     # Hook-to-promise cosine alignment (Day 2)
├── models/                        # Serialized .joblib artifacts & checksums
├── tests/
│   ├── test_feature_extractor.py  # Unit tests for 24 features & pacing zones
│   └── test_data_pipeline.py      # Unit tests for dataset schema & FNVM
└── requirements.txt               # Pinned dependencies
```

---

## 3. The 24 Psycholinguistic Features
Defined and computed in `ml/feature_extractor.py`:

| No. | Feature Name | Description / Formula |
|---|---|---|
| 1 | `duration_seconds` | Estimated spoken duration: $\text{words} / 2.75\,\text{wps}$ |
| 2 | `word_count` | Number of words in hook |
| 3 | `char_count` | Total character count |
| 4 | `avg_word_length` | Average characters per word |
| 5 | `syllable_count` | Total phonetic syllables |
| 6 | `syllable_density` | Syllables per word |
| 7 | `pacing_zone_is_green` | Binary flag ($1$ if $t \le 3.0\text{s}$, else $0$) |
| 8 | `pacing_zone_is_red` | Binary flag ($1$ if $t > 4.5\text{s}$, else $0$) |
| 9 | `flesch_reading_ease` | Standard Flesch Reading Ease score ($0\text{--}100$) |
| 10 | `flesch_kincaid_grade` | Grade reading level |
| 11 | `direct_address_count` | Frequency of `you`, `your`, `u`, `ur` |
| 12 | `has_direct_address` | Binary indicator of audience direct address |
| 13 | `curiosity_gap_score` | Pattern matches for psychological curiosity loops |
| 14 | `has_curiosity_gap` | Binary flag for curiosity opening |
| 15 | `is_question` | Binary flag (starts with question word or ends with `?`) |
| 16 | `question_count` | Total `?` characters |
| 17 | `exclamation_count` | Total `!` characters |
| 18 | `ellipsis_count` | Count of trailing/cliffhanger ellipses |
| 19 | `has_ellipsis` | Binary flag for suspense cliffhangers |
| 20 | `has_digit` | Presence of concrete numbers (e.g., `#1`, `3 steps`) |
| 21 | `digit_count` | Total numerical digits |
| 22 | `has_superlative` | Extreme adjectives (`best`, `worst`, `fastest`) |
| 23 | `has_negative_hook` | Loss aversion words (`stop`, `never`, `mistake`, `ruin`) |
| 24 | `power_words_count` | High-converting trigger words (`secret`, `hack`, `banned`) |

---

## 4. Target Metric: Follower-Normalized Virality Multiplier (FNVM)
Removes creator popularity bias by benchmarking against follower baseline:
$$\text{FNVM} = \frac{\text{views} + 2 \times \text{shares} + 0.5 \times \text{likes}}{\text{follower\_count} + 1000}$$

* **Low Tier**: $\text{FNVM} < 1.0$
* **Medium Tier**: $1.0 \le \text{FNVM} < 5.0$
* **High Tier**: $\text{FNVM} \ge 5.0$

---

## 5. Verification & Testing
Run unit tests at any time:
```bash
python -m unittest discover tests/
```
All tests validate mathematical boundaries, empty input handling, and data contracts.
