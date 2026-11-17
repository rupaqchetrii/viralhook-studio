import React from 'react';
import { Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateSpokenTime, getPacingZone } from '../../utils/pacingCalculator';

export function PacingBarometer({ wordCount }) {
  const spokenSec = calculateSpokenTime(wordCount);
  const info = getPacingZone(spokenSec);

  // Normalize for a 5.0 second visual scale
  const progressPercent = Math.min(100, Math.round((spokenSec / 5.0) * 100));

  return (
    <div className="space-y-2.5 pt-1">
      {/* Header with tempo metric */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-violet-400" />
          <span>Spoken Pace (2.75 wps):</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span
            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
              spokenSec <= 3.0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : spokenSec <= 4.5
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {spokenSec.toFixed(1)}s
          </span>
          <span className="text-zinc-500 text-[11px]">/ 3.0s sweet spot</span>
        </div>
      </div>

      {/* Sleek Gradient Segmented Progress Bar */}
      <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/[0.08] p-[1px]">
        {/* 3.0s Threshold Marker */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/40 z-10 shadow-[0_0_8px_white]"
          style={{ left: '60%' }}
          title="3.0s Retention Cliff"
        />

        {/* Dynamic fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            spokenSec <= 3.0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : spokenSec <= 4.5
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-r from-rose-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Elegant zone pill tag */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] transition-all backdrop-blur-md ${
          info.zone === 'green'
            ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300'
            : info.zone === 'yellow'
            ? 'bg-amber-950/20 border-amber-500/25 text-amber-300'
            : 'bg-rose-950/20 border-rose-500/25 text-rose-300'
        }`}
      >
        {info.zone === 'green' ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="font-semibold">{info.label}:</span>
        <span className="text-zinc-400 truncate">{info.description}</span>
      </div>
    </div>
  );
}
