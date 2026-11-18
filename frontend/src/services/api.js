/**
 * ViralHook Studio - API Service Client (Day 2 & Day 3 Full Implementation)
 * Connects directly to FastAPI backend endpoints:
 * - POST /api/compare
 * - POST /api/analyze
 * Provides high-fidelity offline heuristic fallback if backend service is unreachable.
 */

import { countWords, calculateSpokenTime, getPacingZone } from '../utils/pacingCalculator';
import { lintHook } from '../utils/linterRules';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.origin.includes(':8000')
    ? window.location.origin
    : 'http://127.0.0.1:8000');

/**
 * High-fidelity client-side heuristic inference engine used when FastAPI is offline.
 */
function runHeuristicInference(text, topic = '') {
  const words = countWords(text);
  const spokenTime = calculateSpokenTime(words);
  const linterFlags = lintHook(text);

  let score = 50; // Base score out of 100

  // 1. Pacing impact
  if (spokenTime >= 1.5 && spokenTime <= 3.2) {
    score += 15;
  } else if (spokenTime > 4.5) {
    score -= 20;
  } else if (spokenTime < 1.0) {
    score -= 10;
  }

  // 2. Linter flags impact
  linterFlags.forEach((flag) => {
    if (flag.severity === 'red') score -= 18;
    if (flag.severity === 'yellow') score -= 8;
    if (flag.severity === 'green') score += 14;
  });

  // 3. Question / Curiosity trigger
  if (/\?/.test(text)) score += 8;

  // 4. Digits check
  if (/\d+/.test(text)) score += 6;

  // Clamp score between 5 and 95
  const clampedScore = Math.max(5, Math.min(95, score));
  const normScore = clampedScore / 100;

  let pLow = Math.max(0.05, (1 - normScore) * 0.7);
  let pHigh = Math.max(0.05, normScore * 0.75);
  let pMed = Math.max(0.1, 1 - (pLow + pHigh));

  const sum = pLow + pMed + pHigh;
  pLow = Math.round((pLow / sum) * 1000) / 1000;
  pMed = Math.round((pMed / sum) * 1000) / 1000;
  pHigh = Math.round((1 - (pLow + pMed)) * 1000) / 1000;

  const fnvm = Math.round((pHigh * 3.8 + pMed * 1.5 + pLow * 0.4) * 10) / 10;

  let topicAlignment = 0.85;
  let clickbaitWarning = false;
  if (topic.trim().length > 0) {
    const topicWords = topic.toLowerCase().match(/\b\w+\b/g) || [];
    const hookWords = text.toLowerCase().match(/\b\w+\b/g) || [];
    const common = hookWords.filter((w) => topicWords.includes(w) && w.length > 3);
    if (common.length === 0 && topicWords.length > 2) {
      topicAlignment = 0.32;
      clickbaitWarning = true;
    } else {
      topicAlignment = Math.min(0.96, 0.45 + common.length * 0.18);
    }
  }

  return {
    probabilities: { low: pLow, medium: pMed, high: pHigh },
    predictedClass: pHigh >= pMed && pHigh >= pLow ? 'High' : pMed >= pLow ? 'Medium' : 'Low',
    fnvmScore: fnvm,
    topicAlignment,
    clickbaitWarning,
    words,
    spokenTime,
    pacingZone: getPacingZone(spokenTime),
    linterFlags,
    signals: [
      { label: 'Direct Address', value: /\b(you|your)\b/i.test(text) ? '✅ Present' : '❌ Absent', impact: /\b(you|your)\b/i.test(text) ? 'positive' : 'negative' },
      { label: 'Curiosity Loop', value: /\b(secret|mistake|why|how|stop)\b/i.test(text) ? '✅ Detected' : '❌ None', impact: /\b(secret|mistake|why|how|stop)\b/i.test(text) ? 'positive' : 'negative' },
      { label: 'Specificity', value: /\d+/.test(text) ? '✅ Number used' : '⚠️ No numbers', impact: /\d+/.test(text) ? 'positive' : 'neutral' },
      { label: 'Pacing Window', value: spokenTime <= 3.0 ? '🟢 Sweet spot' : '🟡 Review pace', impact: spokenTime <= 3.0 ? 'positive' : 'neutral' },
    ],
  };
}

/**
 * Execute Hook A vs Hook B Comparison via backend API or fallback
 */
export async function compareHooksAPI({ hookA, hookB, topic = '', platform = 'tiktok', niche = 'general' }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    // 1. Primary Compare Call
    const response = await fetch(`${API_BASE_URL}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hook_a: hookA,
        hook_b: hookB,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      // Optional: also fetch deep feature signals from /api/analyze in parallel
      let analysisA = null;
      let analysisB = null;
      try {
        const [resA, resB] = await Promise.all([
          fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hook: hookA }),
          }),
          fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hook: hookB }),
          }),
        ]);
        if (resA.ok) analysisA = await resA.json();
        if (resB.ok) analysisB = await resB.json();
      } catch (e) {
        // analyze endpoint failure is non-fatal
      }

      // Map backend probabilities to frontend contract
      const pLowA = Number(data.hook_a.probabilities?.Low || 0.33);
      const pMedA = Number(data.hook_a.probabilities?.Medium || 0.33);
      const pHighA = Number(data.hook_a.probabilities?.High || 0.34);

      const pLowB = Number(data.hook_b.probabilities?.Low || 0.33);
      const pMedB = Number(data.hook_b.probabilities?.Medium || 0.33);
      const pHighB = Number(data.hook_b.probabilities?.High || 0.34);

      const fnvmA = Math.round((pHighA * 4.2 + pMedA * 1.5 + pLowA * 0.3) * 10) / 10;
      const fnvmB = Math.round((pHighB * 4.2 + pMedB * 1.5 + pLowB * 0.3) * 10) / 10;

      // Determine winner representation
      let winner = 'DEAD_HEAT';
      if (!data.is_close_result) {
        winner = data.leading_hook === 'A' ? 'HOOK_A' : 'HOOK_B';
      }

      // Calculate simple topic alignment
      let topicAlignmentA = 0.88;
      let clickbaitWarningA = false;
      let topicAlignmentB = 0.88;
      let clickbaitWarningB = false;

      if (topic.trim().length > 0) {
        const topicWords = topic.toLowerCase().match(/\b\w+\b/g) || [];
        const checkWords = (t) => t.toLowerCase().match(/\b\w+\b/g) || [];
        const matchA = checkWords(hookA).filter((w) => topicWords.includes(w) && w.length > 3);
        const matchB = checkWords(hookB).filter((w) => topicWords.includes(w) && w.length > 3);

        if (matchA.length === 0 && topicWords.length > 2) {
          topicAlignmentA = 0.35;
          clickbaitWarningA = true;
        } else {
          topicAlignmentA = Math.min(0.98, 0.45 + matchA.length * 0.18);
        }

        if (matchB.length === 0 && topicWords.length > 2) {
          topicAlignmentB = 0.35;
          clickbaitWarningB = true;
        } else {
          topicAlignmentB = Math.min(0.98, 0.45 + matchB.length * 0.18);
        }
      }

      const spokenTimeA = calculateSpokenTime(data.hook_a.word_count);
      const spokenTimeB = calculateSpokenTime(data.hook_b.word_count);

      return {
        timestamp: new Date().toISOString(),
        isOfflineFallback: false,
        isMockModel: Boolean(data.is_mock_model),
        disclaimer: data.disclaimer,
        hook_a: {
          text: hookA,
          predictedClass: data.hook_a.predicted_class,
          probabilities: { low: pLowA, medium: pMedA, high: pHighA },
          fnvmScore: fnvmA,
          topicAlignment: topicAlignmentA,
          clickbaitWarning: clickbaitWarningA,
          words: data.hook_a.word_count,
          spokenTime: spokenTimeA,
          pacingZone: getPacingZone(spokenTimeA),
          linterFlags: lintHook(hookA),
          analysis: analysisA,
        },
        hook_b: {
          text: hookB,
          predictedClass: data.hook_b.predicted_class,
          probabilities: { low: pLowB, medium: pMedB, high: pHighB },
          fnvmScore: fnvmB,
          topicAlignment: topicAlignmentB,
          clickbaitWarning: clickbaitWarningB,
          words: data.hook_b.word_count,
          spokenTime: spokenTimeB,
          pacingZone: getPacingZone(spokenTimeB),
          linterFlags: lintHook(hookB),
          analysis: analysisB,
        },
        margin_guard: {
          delta_p: Number(data.score_difference),
          is_dead_heat: Boolean(data.is_close_result),
          threshold: 0.08,
          winner,
          summary: data.explanation,
        },
      };
    }

    throw new Error(`API response status: ${response.status}`);
  } catch (err) {
    console.warn('FastAPI backend offline or unreachable. Using offline heuristic engine:', err.message);

    const resultA = runHeuristicInference(hookA, topic);
    const resultB = runHeuristicInference(hookB, topic);

    const pHighA = resultA.probabilities.high;
    const pHighB = resultB.probabilities.high;
    const deltaP = Math.round(Math.abs(pHighA - pHighB) * 1000) / 1000;
    const isDeadHeat = deltaP <= 0.08;

    let winner = 'DEAD_HEAT';
    let summaryMessage = '';

    if (isDeadHeat) {
      winner = 'DEAD_HEAT';
      summaryMessage = `Close result (ΔP = ${(deltaP * 100).toFixed(1)}% ≤ 8.0%). Both hooks show similar estimated potential. Neither has a distinct statistical advantage. Choose the one that best fits your video delivery.`;
    } else if (pHighA > pHighB) {
      winner = 'HOOK_A';
      summaryMessage = `Hook A leads with an estimated ${(pHighA * 100).toFixed(0)}% chance of high engagement vs ${(pHighB * 100).toFixed(0)}% for Hook B (+${(deltaP * 100).toFixed(1)}% lead).`;
    } else {
      winner = 'HOOK_B';
      summaryMessage = `Hook B leads with an estimated ${(pHighB * 100).toFixed(0)}% chance of high engagement vs ${(pHighA * 100).toFixed(0)}% for Hook A (+${(deltaP * 100).toFixed(1)}% lead).`;
    }

    return {
      timestamp: new Date().toISOString(),
      isOfflineFallback: true,
      isMockModel: true,
      disclaimer: 'Notice: Result is an estimate based on historical data, not a guarantee of virality.',
      hook_a: {
        text: hookA,
        ...resultA,
      },
      hook_b: {
        text: hookB,
        ...resultB,
      },
      margin_guard: {
        delta_p: deltaP,
        is_dead_heat: isDeadHeat,
        threshold: 0.08,
        winner,
        summary: summaryMessage,
      },
    };
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
  return { status: 'offline' };
}

/**
 * ---------------------------------------------------------------------------
 * SQLite Hook Library Endpoints (Day 3 Feature - FR-08)
 * ---------------------------------------------------------------------------
 */

export async function saveComparisonToDatabase(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/library/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`Failed to save: ${res.statusText}`);
  } catch (err) {
    console.warn('Database save failed, using local persistence only:', err.message);
    return { status: 'local_fallback', error: err.message };
  }
}

export async function fetchLibraryFromDatabase(limit = 50) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/library/?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (err) {
    console.warn('Failed to fetch from SQLite library:', err.message);
  }
  return [];
}

export async function deleteLibraryItemFromDatabase(itemId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/library/${itemId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to delete from SQLite library:', err.message);
  }
  return null;
}

/**
 * ---------------------------------------------------------------------------
 * 48-Hour Performance Tracker Endpoints (Day 3 Feature - FR-08)
 * ---------------------------------------------------------------------------
 */

export async function recordPerformanceOutcome(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/library/performance/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`Failed to record performance: ${res.statusText}`);
  } catch (err) {
    console.warn('Backend performance recording failed:', err.message);
    return { status: 'local_fallback', error: err.message };
  }
}

export async function fetchPerformanceHistory(libraryId = null) {
  try {
    const query = libraryId ? `?library_id=${libraryId}` : '';
    const res = await fetch(`${API_BASE_URL}/api/library/performance/all${query}`);
    if (res.ok) {
      const data = await res.json();
      return data.records || [];
    }
  } catch (err) {
    console.warn('Failed to fetch performance records:', err.message);
  }
  return [];
}

/**
 * ---------------------------------------------------------------------------
 * Hook Remix Lab API (Day 3 Feature)
 * ---------------------------------------------------------------------------
 */

export async function fetchAIRemixes(hookText) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/remix/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hook: hookText }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.variants || [];
    }
  } catch (err) {
    console.warn('AI Remix API offline, using local archetypes:', err.message);
  }
  return null;
}

