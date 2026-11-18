import React from 'react';
import { calculateSpokenTime, getPacingZone } from '../../utils/pacingCalculator';

// ── SVG Radial Gauge ──────────────────────────────────────────────────────────
function RadialGauge({ percent, zone }) {
  const R = 36;
  const C = 2 * Math.PI * R;        // circumference ≈ 226
  const fillColor =
    zone === 'green'  ? '#10B981' :
    zone === 'yellow' ? '#F59E0B' :
    zone === 'red'    ? '#EF4444' : '#E7E7E9';

  const offset = C - (percent / 100) * C;

  return (
    <svg viewBox="0 0 88 88" className="w-20 h-20 -rotate-90" aria-hidden>
      {/* Track */}
      <circle cx="44" cy="44" r={R} fill="none" stroke="#F3F3F6" strokeWidth="8" />
      {/* 3s target marker at 60% */}
      <circle
        cx="44" cy="44" r={R}
        fill="none"
        stroke="#0D0C22"
        strokeWidth="2.5"
        strokeDasharray={`2 ${C - 2}`}
        strokeDashoffset={-(C * 0.6 - 1)}
        strokeLinecap="round"
      />
      {/* Animated fill */}
      <circle
        cx="44" cy="44" r={R}
        fill="none"
        stroke={fillColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1), stroke 0.3s' }}
      />
    </svg>
  );
}

// ── Segmented bar (3 zones: 0-3s | 3-4.5s | 4.5s+) ───────────────────────────
function SegmentedBar({ spokenSec }) {
  const zones = [
    { label: '≤ 3.0s', max: 3.0,  color: 'bg-emerald-500', light: 'bg-emerald-100' },
    { label: '3–4.5s', max: 4.5,  color: 'bg-amber-400',   light: 'bg-amber-100'   },
    { label: '> 4.5s', max: 6.0,  color: 'bg-rose-500',    light: 'bg-rose-100'    },
  ];

  return (
    <div className="flex gap-1 w-full h-2.5 rounded-full overflow-hidden">
      {zones.map((z, i) => {
        const start = i === 0 ? 0 : zones[i - 1].max;
        const filled = Math.max(0, Math.min(spokenSec - start, z.max - start));
        const pct = ((filled) / (z.max - start)) * 100;
        return (
          <div key={z.label} className={`flex-1 relative rounded-sm overflow-hidden ${z.light}`}>
            <div
              className={`${z.color} h-full rounded-sm transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PacingBarometer({ wordCount }) {
  const spokenSec      = calculateSpokenTime(wordCount);
  const info           = getPacingZone(spokenSec);
  const gaugePercent   = Math.min(100, (spokenSec / 6.0) * 100);
  const isEmpty        = wordCount === 0 || spokenSec === 0;

  const timeColor =
    info.zone === 'green'  ? 'text-emerald-600' :
    info.zone === 'yellow' ? 'text-amber-500'   :
    info.zone === 'red'    ? 'text-rose-600'     : 'text-[#9E9EA7]';

  const badgeBg =
    info.zone === 'green'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    info.zone === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-200'       :
    info.zone === 'red'    ? 'bg-rose-50 text-rose-700 border-rose-200'           :
                             'bg-[#F8F7F4] text-[#9E9EA7] border-[#E7E7E9]';

  return (
    <div className="rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] p-4 space-y-3">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#6E6D7A]">
          Spoken Pace
        </span>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
          {info.label}
        </span>
      </div>

      {/* ── Gauge + Stats row ── */}
      <div className="flex items-center gap-4">

        {/* Radial gauge */}
        <div className="relative shrink-0">
          <RadialGauge percent={isEmpty ? 0 : gaugePercent} zone={info.zone} />
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-base font-black font-mono leading-none ${timeColor}`}>
              {isEmpty ? '—' : `${spokenSec.toFixed(1)}`}
            </span>
            <span className="text-[9px] text-[#9E9EA7] font-semibold">secs</span>
          </div>
        </div>

        {/* Right-side metric cards */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            { label: 'Words',   value: isEmpty ? '—' : wordCount,              sub: '/ 280 max' },
            { label: 'Target',  value: '≤ 3.0s',                               sub: 'sweet spot' },
            { label: 'Tempo',   value: '2.75',                                 sub: 'wps rate'   },
            { label: 'Status',  value: isEmpty ? 'Empty' : info.zone === 'green' ? '✓ Good' : info.zone === 'yellow' ? '⚡ Fair' : '✗ Long',
              sub: 'delivery', bold: true },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-[#E7E7E9] rounded-xl p-2.5 text-center">
              <div className={`text-sm font-black font-mono ${
                m.label === 'Status'
                  ? info.zone === 'green' ? 'text-emerald-600' : info.zone === 'yellow' ? 'text-amber-500' : isEmpty ? 'text-[#9E9EA7]' : 'text-rose-600'
                  : 'text-[#0D0C22]'
              }`}>
                {m.value}
              </div>
              <div className="text-[9px] text-[#9E9EA7] font-semibold uppercase tracking-wide mt-0.5">
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Segmented zone bar ── */}
      <div className="space-y-1.5">
        <SegmentedBar spokenSec={isEmpty ? 0 : spokenSec} />
        <div className="flex justify-between text-[9px] font-bold text-[#9E9EA7] uppercase tracking-wide">
          <span className="text-emerald-600">0 – 3s ✓</span>
          <span className="text-amber-500">3 – 4.5s ⚡</span>
          <span className="text-rose-500">4.5s+ ✗</span>
        </div>
      </div>

    </div>
  );
}
