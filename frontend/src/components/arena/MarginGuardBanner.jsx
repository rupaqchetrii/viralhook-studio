import React from 'react';
import { Scale, Trophy, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function MarginGuardBanner({ marginGuard }) {
  if (!marginGuard) return null;

  const { delta_p, is_dead_heat, winner, summary } = marginGuard;
  const deltaPercent = (delta_p * 100).toFixed(1);

  if (is_dead_heat) {
    return (
      <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50/70 shadow-sm relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-amber-900 text-base">Close Result (Similar Scores)</h4>
                <Badge variant="warning" size="xs">
                  Margin Guard: ΔP ≤ 8.0%
                </Badge>
              </div>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">{summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <div className="text-[11px] text-amber-700 uppercase font-mono font-bold">Score Margin</div>
              <div className="text-sm font-bold font-mono text-amber-900">ΔP = {deltaPercent}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white border border-amber-200 text-amber-800 text-xs font-semibold shadow-sm">
              Close Match Guard
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWinnerA = winner === 'HOOK_A';

  return (
    <div className="rounded-2xl p-5 border border-[#E7E7E9] bg-white shadow-sm relative overflow-hidden transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F7] border border-[#EA4C89]/20 flex items-center justify-center shrink-0 text-[#EA4C89]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#0D0C22] text-base">
                Leading Hook:{' '}
                <span className="text-[#EA4C89] font-extrabold">{isWinnerA ? 'Hook Option A' : 'Hook Option B'}</span>
              </h4>
              <Badge variant="accent" size="xs">
                ΔP &gt; 8.0%
              </Badge>
            </div>
            <p className="text-xs text-[#6E6D7A] mt-1 max-w-2xl leading-relaxed">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right">
            <div className="text-[11px] text-[#6E6D7A] uppercase font-mono font-bold">Score Margin</div>
            <div className="text-sm font-bold font-mono text-[#0D0C22]">ΔP = {deltaPercent}%</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#0D0C22] text-white text-xs font-semibold shadow-sm">
            Decisive Winner
          </div>
        </div>
      </div>
    </div>
  );
}
