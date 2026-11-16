# Testing & Quality Assurance Plan

## 1. Machine Learning Testing Suite
- **Invariance Testing**: Synonym substitution (e.g. replacing *"errors"* with *"mistakes"*) must not cause erratic probability shifts ($|\Delta P| \le 0.05$).
- **Directional Expectation Testing**: Adding filler words (e.g., *"Hey guys, today in this video..."*) must demonstrably decrease pacing and hook quality metrics.
- **Data Leakage Verification**: Automated test confirming `set(train_creators).intersection(set(test_creators)) == set()`.
- **Calibration Verification**: Brier Score evaluated on held-out test split must be $<0.18$.
- **Latency Benchmark**: Model feature extraction + inference must execute in $<50\text{ms}$ on CPU.

---

## 2. Backend & API Testing Suite (`pytest`)
- **Input Edge Cases**:
  - Empty strings, whitespace-only strings.
  - Exceedingly long strings ($>280$ characters).
  - Special characters, emojis, non-Latin scripts (must gracefully return unsupported language notice).
  - Identical Hook A & Hook B in comparison (must return `identical_hooks` status without bias).
- **Service Resilience**:
  - Test behavior when database is temporarily locked.
  - Test serialization and checksum verification on startup.

---

## 3. Frontend Testing Suite (`vitest` + React Testing Library)
- **A/B State Independence**: Modifying Hook A must not trigger re-render side effects in Hook B.
- **Pace Barometer Responsiveness**: Word counter and pacing badge must update in real-time as the user types ($<16\text{ms}$ frame time).
- **Graceful Error States**: Network disconnect, API error 500, or invalid inputs must present user-friendly actionable notices.

