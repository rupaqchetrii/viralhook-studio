import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateSpokenTime, getPacingZone } from '../../utils/pacingCalculator';

export function PacingBarometer({ wordCount }) {
  const spokenSec = calculateSpokenTime(wordCount);
  const info = getPacingZone(spokenSec);

  // Normalizing to a 5-second gauge
  const progressPercent = Math.min(100, Math.round((spokenSec / 5.0) * 100));

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>3s Spoken Delivery Barometer:</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono font-bold">
          <span className={info.color}>{spokenSec.toFixed(1)}s</span>
          <span className="text-[#64748B]">/ 3.0s target</span>
        </div>
      </div>

      {/* Progress track with 3s benchmark line */}
      <div className="relative h-2 w-full bg-[#11121B] rounded-full overflow-hidden border border-[#2e3152]/60">
        {/* 3s benchmark marker at 60% (3s / 5s) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#A78BFA]/80 z-10"
          style={{ left: '60%' }}
          title="3.0s Retention Cliff"
        />

        {/* Progress fill */}
        <div
          className={`h-full transition-all duration-200 rounded-full ${
            spokenSec <= 3.0
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              : spokenSec <= 4.5
              ? 'bg-gradient-to-r from-amber-500 to-amber-400'
              : 'bg-gradient-to-r from-rose-500 to-rose-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Zone status banner */}
      <div
        className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${info.bgColor} ${info.borderColor} ${info.color}`}
      >
        {info.zone === 'green' ? (
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="font-semibold">{info.label}</div>
          <div className="text-[11px] opacity-90 mt-0.5">{info.description}</div>
        </div>
      </div>
    </div>
  );
}
