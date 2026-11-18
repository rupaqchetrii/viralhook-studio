import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Trophy, Minus, Info, Shield, Sparkles } from 'lucide-react';
import { SignalsComparison } from './SignalsComparison';
import { SemanticRadarCard } from './SemanticRadarCard';
import { ExportBanner } from './ExportBanner';

/* ── Custom label inside donut ────────────────────────────────────── */
function DonutLabel({ cx, cy, viral, isWinner, isDead }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx} dy="-14"
        fontSize="28" fontWeight="900" fontFamily="monospace"
        fill={isWinner && !isDead ? '#10B981' : '#0D0C22'}
      >
        {viral}%
      </tspan>
      <tspan
        x={cx} dy="22"
        fontSize="10" fontWeight="700"
        fill="#6E6D7A" letterSpacing="0.08em"
      >
        VIRAL CHANCE
      </tspan>
    </text>
  );
}

/* ── Custom tooltip ───────────────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1A1A2E] border border-[#E7E7E9] dark:border-white/10 rounded-2xl shadow-xl px-4 py-3 text-xs">
      <p className="font-black text-[#0D0C22] dark:text-white mb-1">{payload[0].name}</p>
      <p className="font-mono font-bold text-[#EA4C89]">{payload[0].value}%</p>
    </div>
  );
}

export function ComparisonArena({ result, onOpenOutcome }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard, disclaimer } = result;

  const aHigh   = Math.round(hook_a.probabilities.high   * 100);
  const aMed    = Math.round(hook_a.probabilities.medium * 100);
  const aLow    = Math.round(hook_a.probabilities.low    * 100);
  const bHigh   = Math.round(hook_b.probabilities.high   * 100);
  const bMed    = Math.round(hook_b.probabilities.medium * 100);
  const bLow    = Math.round(hook_b.probabilities.low    * 100);

  const isDead    = margin_guard.is_dead_heat;
  const winnerA   = !isDead && margin_guard.winner === 'HOOK_A';
  const winnerB   = !isDead && margin_guard.winner === 'HOOK_B';
  const deltaStr  = (margin_guard.delta_p * 100).toFixed(1);

  /* Donut slices: Viral (green) | Medium (amber) | Low (slate) */
  const SLICE_COLORS = ['#10B981', '#F59E0B', '#E7E7E9'];

  const dataA = [
    { name: '🔥 Viral',  value: aHigh },
    { name: '⚡ Medium', value: aMed  },
    { name: '📉 Low',    value: aLow  },
  ];
  const dataB = [
    { name: '🔥 Viral',  value: bHigh },
    { name: '⚡ Medium', value: bMed  },
    { name: '📉 Low',    value: bLow  },
  ];

  return (
    <div className="space-y-6 pt-4 animate-winner-reveal">

      {/* ══ WINNER HERO CARD ════════════════════════════════════════════ */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 relative overflow-hidden transition-all duration-500 shadow-xl ${
        isDead
          ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border-amber-400 ring-4 ring-amber-400/20 shadow-[0_12px_45px_rgba(245,158,11,0.18)]'
          : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-400 ring-4 ring-emerald-400/20 shadow-[0_16px_50px_rgba(16,185,129,0.18)]'
      }`}>
        {/* Decorative background glow */}
        <div className={`absolute -top-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-35 pointer-events-none ${
          isDead ? 'bg-amber-300' : 'bg-emerald-400'
        }`} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isDead
                ? 'bg-amber-100 border-2 border-amber-300'
                : 'bg-emerald-100 border-2 border-emerald-300 animate-float'
            }`}>
              {isDead
                ? <Minus className="w-7 h-7 text-amber-600" />
                : <Trophy className="w-7 h-7 text-emerald-600" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-xs font-black uppercase tracking-widest ${isDead ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isDead ? '⚖️ MarginGuard Statistical Tie' : '🏆 High-Probability Winner'}
                </p>
                {!isDead && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-200 text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>ML Selected</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0D0C22] tracking-tight">
                {isDead
                  ? 'Close Result (Dead Heat)'
                  : winnerA ? 'Hook Option A Leads' : 'Hook Option B Leads'
                }
              </h2>
              <p className="text-xs text-[#6E6D7A] mt-1 max-w-md leading-relaxed font-medium">
                {isDead
                  ? `Both hooks are within ΔP = ${deltaStr}% (≤ 8% Margin Guard). Difference is within statistical noise. Safe to test both in live traffic.`
                  : `${winnerA ? 'Hook A' : 'Hook B'} achieves a ${winnerA ? aHigh : bHigh}% viral chance vs ${winnerA ? bHigh : aHigh}% — leading by ΔP = ${deltaStr}%.`
                }
              </p>
            </div>
          </div>

          {/* Delta badge */}
          <div className={`text-center px-6 py-3.5 rounded-2xl border-2 shrink-0 shadow-sm ${
            isDead
              ? 'bg-amber-50 border-amber-300'
              : 'bg-white border-emerald-300'
          }`}>
            <div className={`text-3xl sm:text-4xl font-black font-mono ${isDead ? 'text-amber-700' : 'text-emerald-700'}`}>
              {deltaStr}%
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A] mt-0.5">
              Margin ΔP
            </div>
          </div>
        </div>
      </div>

      {/* ══ DUAL DONUT PIE CHARTS ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Hook Option A', data: dataA, viral: aHigh, isWinner: winnerA, hook: hook_a, colorKey: '#0D0C22' },
          { label: 'Hook Option B', data: dataB, viral: bHigh, isWinner: winnerB, hook: hook_b, colorKey: '#EA4C89' },
        ].map(({ label, data, viral, isWinner, hook, colorKey }) => (
          <div
            key={label}
            className={`bg-white rounded-3xl border-2 p-6 shadow-sm tactile-hover transition-all duration-300 relative overflow-hidden ${
              isWinner && !isDead
                ? 'border-emerald-400 shadow-[0_12px_40px_rgba(16,185,129,0.18)] ring-2 ring-emerald-400/30'
                : 'border-[#E7E7E9] hover:border-[#0D0C22]/40'
            }`}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ background: colorKey }}
                />
                <span className="text-sm font-black text-[#0D0C22]">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {isWinner && !isDead && (
                  <span className="text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-sm">
                    <Trophy className="w-3 h-3 text-emerald-700" />
                    <span>Top Pick</span>
                  </span>
                )}
                {isDead && (
                  <span className="text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    ⚖️ Dead Heat
                  </span>
                )}
              </div>
            </div>

            {/* Hook text preview */}
            <p className="text-xs text-[#6E6D7A] italic mb-4 line-clamp-2 leading-relaxed border-l-2 border-[#E7E7E9] pl-3">
              "{hook.text}"
            </p>

            {/* Donut Chart */}
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={(props) =>
                      props.cx === undefined ? null : (
                        <DonutLabel
                          cx={props.cx}
                          cy={props.cy}
                          viral={viral}
                          isWinner={isWinner}
                          isDead={isDead}
                        />
                      )
                    }
                  >
                    {data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={SLICE_COLORS[i]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: '🔥 Viral',  val: `${viral}%`,    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                { label: '⚡ Medium', val: `${data[1].value}%`, bg: 'bg-amber-50 border-amber-200 text-amber-800' },
                { label: '📉 Low',    val: `${data[2].value}%`, bg: 'bg-[#F8F7F4] border-[#E7E7E9] text-[#6E6D7A]' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-2 text-center ${s.bg}`}>
                  <div className="text-sm font-black font-mono">{s.val}</div>
                  <div className="text-[10px] font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ══ SIMPLE ALIGNMENT STRIP ══════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-[#E7E7E9] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FDF2F7] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#EA4C89]" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0D0C22]">Hook-to-Promise Topic Alignment</p>
            <p className="text-[11px] text-[#6E6D7A]">Validates hook against video topic to avoid clickbait penalty</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[
            { label: 'Hook A', pct: (hook_a.topicAlignment * 100).toFixed(0), warn: hook_a.clickbaitWarning },
            { label: 'Hook B', pct: (hook_b.topicAlignment * 100).toFixed(0), warn: hook_b.clickbaitWarning },
          ].map((h) => (
            <div
              key={h.label}
              className={`text-center px-4 py-2 rounded-xl border font-mono font-black text-sm shadow-sm ${
                h.warn
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {h.pct}%
              <div className="text-[9px] font-bold uppercase tracking-wide text-[#9E9EA7] mt-0.5">{h.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Dual-Tower 384-Dim Transformer Semantic Embedding Analysis */}
      {SemanticRadarCard && <SemanticRadarCard hookA={hook_a.text} hookB={hook_b.text} />}

      {/* ══ SIGNALS + EXPORT ════════════════════════════════════════════ */}
      <SignalsComparison hookA={hook_a} hookB={hook_b} />
      {/* 5. Day 3 Export & Share Banner */}
      <ExportBanner result={result} onOpenOutcome={onOpenOutcome} />

      {/* Disclaimer */}
      {disclaimer && (
        <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] flex items-start gap-3 text-xs text-[#6E6D7A]">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      )}
    </div>
  );
}
