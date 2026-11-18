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
        <div className="flex items-center gap-1.5 font-semibold text-[#0D0C22]">
          <Clock className="w-3.5 h-3.5 text-[#EA4C89]" />
          <span>3s Spoken Delivery Barometer:</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono font-bold">
          <span className={info.zone === 'green' ? 'text-emerald-600' : info.zone === 'yellow' ? 'text-amber-600' : 'text-rose-600'}>
            {spokenSec.toFixed(1)}s
          </span>
          <span className="text-[#6E6D7A]">/ 3.0s target</span>
        </div>
      </div>

      {/* Progress track with 3s benchmark line */}
      <div className="relative h-2.5 w-full bg-[#F3F3F6] rounded-full overflow-hidden border border-[#E7E7E9]">
        {/* 3s benchmark marker at 60% (3s / 5s) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#0D0C22] z-10"
          style={{ left: '60%' }}
          title="3.0s Retention Cliff"
        />

        {/* Progress fill */}
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            spokenSec <= 3.0
              ? 'bg-emerald-500'
              : spokenSec <= 4.5
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Zone status banner */}
      <div
        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
          info.zone === 'green'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            : info.zone === 'yellow'
            ? 'bg-amber-50/70 border-amber-200 text-amber-800'
            : 'bg-rose-50/70 border-rose-200 text-rose-800'
        }`}
      >
        {info.zone === 'green' ? (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
        ) : (
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${info.zone === 'yellow' ? 'text-amber-600' : 'text-rose-600'}`} />
        )}
        <div>
          <div className="font-bold">{info.label}</div>
          <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{info.description}</div>
        </div>
      </div>
    </div>
  );
}
