/**
 * ViralHook Studio - API Service Client
 * Connects to FastAPI backend (`/api/v1/compare`).
 * Provides high-fidelity offline heuristic fallback if the backend service is offline.
 */

import { countWords, calculateSpokenTime, getPacingZone } from '../utils/pacingCalculator';
import { lintHook } from '../utils/linterRules';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * High-fidelity client-side heuristic inference engine used when FastAPI is unreachable
 * or running offline in local presentation mode.
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

  // Softmax-like calibrated probability distribution [Low, Medium, High]
  let pLow = Math.max(0.05, (1 - normScore) * 0.7);
  let pHigh = Math.max(0.05, normScore * 0.75);
  let pMed = Math.max(0.1, 1 - (pLow + pHigh));

  // Normalize to exactly 1.000
  const sum = pLow + pMed + pHigh;
  pLow = Math.round((pLow / sum) * 1000) / 1000;
  pMed = Math.round((pMed / sum) * 1000) / 1000;
  pHigh = Math.round((1 - (pLow + pMed)) * 1000) / 1000;

  // Calculate FNVM (Follower-Normalized Virality Multiplier)
  const fnvm = Math.round((pHigh * 3.8 + pMed * 1.5 + pLow * 0.4) * 10) / 10;

  // Hook-to-Promise semantic alignment (simple lexical overlap when offline)
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
    fnvmScore: fnvm,
    topicAlignment,
    clickbaitWarning,
    words,
    spokenTime,
    pacingZone: getPacingZone(spokenTime),
    linterFlags,
  };
}

export async function compareHooksAPI({ hookA, hookB, topic = '', platform = 'tiktok', niche = 'general' }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    const response = await fetch(`${API_BASE_URL}/api/v1/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hook_a: hookA,
        hook_b: hookB,
        topic_summary: topic,
        platform,
        niche,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { ...data, isOfflineFallback: false };
    }
    throw new Error(`API error: ${response.status}`);
  } catch (err) {
    // Graceful fallback to heuristic inference engine
    console.warn('FastAPI backend offline or unreachable. Falling back to local heuristic engine:', err.message);

    const resultA = runHeuristicInference(hookA, topic);
    const resultB = runHeuristicInference(hookB, topic);

    // Minimum Significant Margin (ΔP ≥ 0.08) for honest tie detection
    const pHighA = resultA.probabilities.high;
    const pHighB = resultB.probabilities.high;
    const deltaP = Math.round(Math.abs(pHighA - pHighB) * 1000) / 1000;
    const isDeadHeat = deltaP < 0.08;

    let winner = 'DEAD_HEAT';
    let summaryMessage = '';

    if (isDeadHeat) {
      winner = 'DEAD_HEAT';
      summaryMessage = `Statistical Dead-Heat (ΔP = ${(deltaP * 100).toFixed(1)}% < 8.0%). Both hooks show virtually equivalent engagement probability. Choose based on tone and production style.`;
    } else if (pHighA > pHighB) {
      winner = 'HOOK_A';
      summaryMessage = `Hook A statistically outperforms Hook B by ${(deltaP * 100).toFixed(1)}% higher virality probability.`;
    } else {
      winner = 'HOOK_B';
      summaryMessage = `Hook B statistically outperforms Hook A by ${(deltaP * 100).toFixed(1)}% higher virality probability.`;
    }

    return {
      timestamp: new Date().toISOString(),
      isOfflineFallback: true,
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
