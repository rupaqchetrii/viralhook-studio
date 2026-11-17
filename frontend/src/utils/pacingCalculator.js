/**
 * ViralHook Studio - Spoken Delivery Pacing Calculator
 * Based on conversational speech tempo benchmark: 2.75 words per second (wps).
 * Target hook window: first 1 to 5 seconds, ideally ≤ 3.0 seconds for maximum retention.
 */

export const CONVERSATIONAL_TEMPO_WPS = 2.75;

export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const matches = text.trim().match(/\b[\w'-]+\b/g);
  return matches ? matches.length : 0;
}

export function countCharacters(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.length;
}

export function calculateSpokenTime(wordCount) {
  if (!wordCount || wordCount <= 0) return 0;
  const rawSeconds = wordCount / CONVERSATIONAL_TEMPO_WPS;
  return Math.round(rawSeconds * 10) / 10; // Round to 1 decimal place
}

export function getPacingZone(spokenSeconds) {
  if (spokenSeconds === 0) {
    return {
      zone: 'empty',
      label: 'No input',
      color: 'text-slate-500',
      bgColor: 'bg-slate-800',
      borderColor: 'border-slate-700',
      description: 'Type an opening line to measure spoken duration.',
    };
  }
  if (spokenSeconds <= 3.0) {
    return {
      zone: 'green',
      label: 'Optimal Hook Pacing (≤ 3.0s)',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/30',
      progressColor: 'bg-emerald-500',
      description: 'Punchy and fast. Fits within the critical viewer swipe window.',
    };
  }
  if (spokenSeconds <= 4.5) {
    return {
      zone: 'yellow',
      label: 'Moderate Duration (3.1s – 4.5s)',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/30',
      progressColor: 'bg-amber-500',
      description: 'Approaching the retention cliff. Consider trimming filler words.',
    };
  }
  return {
    zone: 'red',
    label: 'Overlength Warning (> 4.5s)',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/30',
    progressColor: 'bg-rose-500',
    description: 'High swipe-away risk. Viewers will likely drop before you finish.',
  };
}

/**
 * Extract notable question words, action verbs, and psychological triggers (FR-06).
 */
export const NOTABLE_WORD_CATEGORIES = [
  { category: 'Question', color: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/20', words: ['why', 'how', 'what', 'when', 'who', 'where', 'which'] },
  { category: 'Action', color: 'border-rose-500/30 text-rose-300 bg-rose-950/20', words: ['stop', "don't", 'dont', 'never', 'watch', 'avoid', 'quit', 'start', 'try'] },
  { category: 'Curiosity', color: 'border-purple-500/30 text-purple-300 bg-purple-950/20', words: ['secret', 'mistake', 'mistakes', 'truth', 'hack', 'hidden', 'trick', 'reason', 'nobody'] },
  { category: 'Direct Address', color: 'border-amber-500/30 text-amber-300 bg-amber-950/20', words: ['you', 'your', 'yours', 'yourself'] },
];

export function extractNotableWords(text) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const tokens = lower.match(/\b[\w'-]+\b/g) || [];
  const tokenSet = new Set(tokens);
  const found = [];

  NOTABLE_WORD_CATEGORIES.forEach(({ category, color, words }) => {
    words.forEach((w) => {
      if (tokenSet.has(w)) {
        found.push({ word: w, category, color });
      }
    });
  });

  return found;
}

