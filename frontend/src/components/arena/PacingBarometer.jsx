import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { calculateSpokenTime } from '../../utils/pacingCalculator';

export function PacingBarometer({ wordCount }) {
  const spokenSec = calculateSpokenTime(wordCount);

  // Normalize to 5-second gauge
  const progressPercent = Math.min(100, Math.round((spokenSec / 5.0) * 100));

  if (wordCount === 0) {
    return (
      <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 px-1">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Spoken delivery time</span>
        </span>
        <span className="font-mono">0.0s · 3s target</span>
      </div>
    );
  }

  const isGreen = spokenSec <= 3.0;
  const isYellow = spokenSec > 3.0 && spokenSec <= 4.5;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Spoken delivery pace</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <strong className={isGreen ? 'text-emerald-400' : isYellow ? 'text-amber-400' : 'text-rose-400'}>
            ~{spokenSec.toFixed(1)}s
          </strong>
          <span className="text-[#64748B]">/ 3.0s sweet spot</span>
        </div>
      </div>

      {/* Sleek pacing track with 3-second retention line */}
      <div className="relative h-1.5 w-full bg-[#181924] rounded-full overflow-hidden border border-[#262838]">
        {/* 3s optimal mark */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
          style={{ left: '60%' }}
          title="3.0s viewer retention window"
        />

        {/* Progress Fill */}
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isGreen
              ? 'bg-emerald-400'
              : isYellow
              ? 'bg-amber-400'
              : 'bg-rose-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Natural, human feedback note */}
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
          isGreen
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            : isYellow
            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
        }`}
      >
        {isGreen ? (
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
        ) : isYellow ? (
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
        )}
        <span className="text-[11px] leading-tight">
          {isGreen
            ? 'Punchy & fast — easily delivered before the viewer can swipe away.'
            : isYellow
            ? 'Slightly long. Try trimming 2–3 words to keep it under 3 seconds.'
            : 'Too long for an opening line. High risk of viewers swiping before the payoff.'}
        </span>
      </div>
    </div>
  );
}
