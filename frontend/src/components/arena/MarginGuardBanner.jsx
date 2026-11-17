import React from 'react';
import { Scale, Trophy } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function MarginGuardBanner({ marginGuard }) {
  if (!marginGuard) return null;

  const { delta_p, is_dead_heat, winner, summary } = marginGuard;
  const deltaPercent = (delta_p * 100).toFixed(1);

  if (is_dead_heat) {
    return (
      <div className="rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#202238] to-amber-950/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-amber-300 text-base">Statistical Dead-Heat Declared</h4>
                <Badge variant="warning" size="xs">
                  Margin Guard: ΔP &lt; 8.0%
                </Badge>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">{summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <div className="text-[11px] text-[#64748B] uppercase font-mono">Margin Difference</div>
              <div className="text-sm font-bold font-mono text-amber-400">ΔP = {deltaPercent}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              No Deceptive Winner
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWinnerA = winner === 'HOOK_A';

  return (
    <div className="rounded-2xl p-5 border border-[#A78BFA]/40 bg-gradient-to-r from-[#A78BFA]/15 via-[#202238] to-[#9065f7]/15 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 border border-[#A78BFA]/30 flex items-center justify-center shrink-0 text-[#A78BFA]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#F1F5F9] text-base">
                Clear Stat Winner:{' '}
                <span className="text-[#A78BFA]">{isWinnerA ? 'Hook A' : 'Hook B'}</span>
              </h4>
              <Badge variant="accent" size="xs">
                ΔP ≥ 8.0%
              </Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right">
            <div className="text-[11px] text-[#64748B] uppercase font-mono">Significant Delta</div>
            <div className="text-sm font-bold font-mono text-[#A78BFA]">ΔP = {deltaPercent}%</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#A78BFA]/20 border border-[#A78BFA]/40 text-[#F1F5F9] text-xs font-bold">
            {isWinnerA ? '🏆 Hook A Recommended' : '🏆 Hook B Recommended'}
          </div>
        </div>
      </div>
    </div>
  );
}
