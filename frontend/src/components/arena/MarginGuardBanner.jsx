import React from 'react';
import { Scale, Trophy, Sparkles } from 'lucide-react';

export function MarginGuardBanner({ marginGuard }) {
  if (!marginGuard) return null;

  const { delta_p, is_dead_heat, winner, summary } = marginGuard;
  const deltaPercent = (delta_p * 100).toFixed(1);

  if (is_dead_heat) {
    return (
      <div className="rounded-xl p-4 sm:p-5 border border-amber-500/30 bg-[#161722] shadow-sm relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-amber-200 text-sm sm:text-base">
                  It's a tie — both openings have virtually identical impact
                </h4>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ΔP = {deltaPercent}% (&lt; 8% threshold)
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-2xl">
                {summary || (
                  "Both hooks show comparable estimated retention. Neither has a distinct statistical edge. " +
                  "Choose whichever one feels more authentic in your natural voice on camera."
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end md:self-center">
            <div className="px-3 py-1.5 rounded-lg bg-[#202230] border border-[#2e3144] text-[#EDEDEF] text-xs font-medium">
              Pick your personal favorite
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWinnerA = winner === 'HOOK_A';

  return (
    <div className="rounded-xl p-4 sm:p-5 border border-violet-500/30 bg-[#161722] shadow-sm relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-[#F1F5F9] text-sm sm:text-base">
                <span className="text-[#A78BFA] font-bold">{isWinnerA ? 'Hook A' : 'Hook B'}</span> has the stronger opening
              </h4>
              <span className="text-[10px] uppercase font-mono font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                +{deltaPercent}% lead
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-2xl">
              {summary}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-end md:self-center">
          <div className="px-3.5 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-200 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Recommended variant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
