/**
 * ViralHook Studio - Phrase Linter Rules & Drop-In Quick Fixes
 * Implements acceptance conditions for FR-03:
 * E.g., 'In this video I will show you' flags warning and offers 'Here is how to'.
 */

export const LINTER_RULES = [
  // RED: Weak filler openings, YouTube-style intros, swipe-away triggers
  {
    id: 'intro_filler_video',
    pattern: /\b(?:in this video (?:i will|i'm going to|we will|we are going to) (?:show you|tell you|explain))\b/i,
    severity: 'red',
    tag: 'Weak Intro Cliché',
    message: 'Passive introductory filler wastes precious opening retention seconds.',
    suggestion: 'Here is how to',
    applyFix: (text) =>
      text.replace(
        /\b(?:in this video (?:i will|i'm going to|we will|we are going to) (?:show you|tell you|explain))\b/gi,
        'Here is how to'
      ),
  },
  {
    id: 'intro_hey_guys',
    pattern: /\b(?:hey guys|what's up guys|hello everyone|hi guys)\b/i,
    severity: 'red',
    tag: 'Low-Retention Greeting',
    message: 'Generic greetings cause up to 60% immediate swipe-off on short-form feeds.',
    suggestion: 'Start directly with the core problem or shocking insight',
    applyFix: (text) =>
      text.replace(/\b(?:hey guys[!,.]*|what's up guys[!,.]*|hello everyone[!,.]*|hi guys[!,.]*)\b/gi, '').trim(),
  },
  {
    id: 'subscribe_plea',
    pattern: /\b(?:don't forget to like|subscribe for more|hit the follow button|follow for part 2)\b/i,
    severity: 'red',
    tag: 'Premature Call to Action',
    message: 'Asking for follows/likes before delivering value immediately turns viewers away.',
    suggestion: 'Remove premature CTA from first 5 seconds',
    applyFix: (text) =>
      text.replace(/\b(?:don't forget to like|subscribe for more|hit the follow button|follow for part 2)[!,.]*\b/gi, '').trim(),
  },
  {
    id: 'today_i_want',
    pattern: /\b(?:today i want to talk about|so today i'm talking about)\b/i,
    severity: 'red',
    tag: 'Slow Warm-Up',
    message: 'Self-centered warmup. Flip the focus directly onto the viewer.',
    suggestion: 'This one mistake is costing you',
    applyFix: (text) =>
      text.replace(/\b(?:today i want to talk about|so today i'm talking about)\b/gi, 'This will change how you view'),
  },

  // YELLOW: Needs context, vague claims, or mild clickbait without payoff
  {
    id: 'vague_secret',
    pattern: /\b(?:secret hack|one simple trick|the best trick)\b/i,
    severity: 'yellow',
    tag: 'Vague Hyperbole',
    message: 'Overused marketing buzzwords trigger viewer skepticism.',
    suggestion: 'the exact strategy used to',
    applyFix: (text) =>
      text.replace(/\b(?:secret hack|one simple trick|the best trick)\b/gi, 'the exact method to'),
  },
  {
    id: 'passive_you_wont_believe',
    pattern: /\b(?:you won't believe|you will never believe)\b/i,
    severity: 'yellow',
    tag: 'Tired Curiosity Loop',
    message: 'Often penalized as low-credibility clickbait unless backed by immediate proof.',
    suggestion: 'Most people don’t know that',
    applyFix: (text) =>
      text.replace(/\b(?:you won't believe|you will never believe)\b/gi, 'Most people don’t know that'),
  },
  {
    id: 'generic_wait_until_end',
    pattern: /\b(?:wait until the end|watch till the end)\b/i,
    severity: 'yellow',
    tag: 'Forced Retention Plea',
    message: 'Telling viewers to wait signals the early content is boring.',
    suggestion: 'Highlight the immediate payoff upfront',
    applyFix: (text) =>
      text.replace(/\b(?:wait until the end|watch till the end)[!,.]*\b/gi, '').trim(),
  },

  // GREEN: Strong linguistic triggers (Curiosity gap, Direct Address, Negative framing, Numbers)
  {
    id: 'power_negative_warning',
    pattern: /\b(?:stop doing|stop making|never do|avoid this mistake|don't do this)\b/i,
    severity: 'green',
    tag: 'Loss Aversion / Power Warning',
    message: 'High psychological tension: viewers are 2x more motivated to avoid loss.',
  },
  {
    id: 'power_direct_address',
    pattern: /\b(?:if you (?:are|have|still|want)|you are probably|your biggest)\b/i,
    severity: 'green',
    tag: 'Direct Address',
    message: 'Speaks directly to the viewer’s personal identity or pain point.',
  },
  {
    id: 'power_quantified_curiosity',
    pattern: /\b(?:\d+\s+(?:ways|reasons|mistakes|rules|steps|things|secrets))\b/i,
    severity: 'green',
    tag: 'Specific Cognitive Hook',
    message: 'Numbers provide clear cognitive structure and set measurable expectations.',
  },
];

/**
 * Scans text against all active linter rules
 */
export function lintHook(text) {
  if (!text || typeof text !== 'string') return [];

  const findings = [];
  for (const rule of LINTER_RULES) {
    if (rule.pattern.test(text)) {
      findings.push({
        id: rule.id,
        severity: rule.severity,
        tag: rule.tag,
        message: rule.message,
        suggestion: rule.suggestion || null,
        canAutoFix: typeof rule.applyFix === 'function',
        applyFix: rule.applyFix || null,
      });
    }
  }
  return findings;
}
