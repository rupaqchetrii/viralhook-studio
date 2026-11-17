import React from 'react';
import { Scale, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export function MarginGuardBanner({ marginGuard }) {
  if (!marginGuard) return null;

  const { delta_p, is_dead_heat, winner, summary } = marginGuard;
  const deltaPercent = (delta_p * 100).toFixed(1);

  if (is_dead_heat) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/[0.02] to-transparent shadow-2xl shadow-amber-950/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-lg shadow-amber-500/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h4 className="font-extrabold text-amber-300 text-lg tracking-tight">
                  Close Result (Similar Estimated Potential)
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Margin Guard: ΔP ≤ 8.0%
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1.5 max-w-2xl leading-relaxed">{summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Score Delta</div>
              <div className="text-base font-extrabold font-mono text-amber-400">ΔP = {deltaPercent}%</div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
              Close Match Guard
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWinnerA = winner === 'HOOK_A';

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 glass-panel border border-violet-500/40 bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent shadow-2xl shadow-violet-950/30">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 text-violet-300 shadow-lg shadow-violet-500/20">
            <Trophy className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="font-extrabold text-white text-lg tracking-tight">
                Recommended Winner:{' '}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                  {isWinnerA ? 'Hook A' : 'Hook B'}
                </span>
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Significant Lead: ΔP &gt; 8.0%
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1.5 max-w-2xl leading-relaxed">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Engagement Lead</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">+{deltaPercent}%</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25">
            {isWinnerA ? '🏆 Hook A Leads' : '🏆 Hook B Leads'}
          </div>
        </div>
      </div>
    </div>
  );
}
