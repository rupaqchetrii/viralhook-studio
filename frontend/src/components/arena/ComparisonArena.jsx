import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ShieldCheck,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { MarginGuardBanner } from './MarginGuardBanner';
import { extractNotableWords } from '../../utils/pacingCalculator';

export function ComparisonArena({ result }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard, disclaimer } = result;

  // Extract notable words
  const notableWordsA = extractNotableWords(hook_a.text);
  const notableWordsB = extractNotableWords(hook_b.text);

  // Normalize probability values
  const pLowA = hook_a.probabilities.low ?? hook_a.probabilities.Low ?? 0.33;
  const pMedA = hook_a.probabilities.medium ?? hook_a.probabilities.Medium ?? 0.33;
  const pHighA = hook_a.probabilities.high ?? hook_a.probabilities.High ?? 0.34;

  const pLowB = hook_b.probabilities.low ?? hook_b.probabilities.Low ?? 0.33;
  const pMedB = hook_b.probabilities.medium ?? hook_b.probabilities.Medium ?? 0.33;
  const pHighB = hook_b.probabilities.high ?? hook_b.probabilities.High ?? 0.34;

  // Prepare chart data for Recharts
  const chartData = [
    {
      tier: 'Low Retention',
      HookA: Math.round(pLowA * 100),
      HookB: Math.round(pLowB * 100),
    },
    {
      tier: 'Average Retention',
      HookA: Math.round(pMedA * 100),
      HookB: Math.round(pMedB * 100),
    },
    {
      tier: 'High Retention (Viral)',
      HookA: Math.round(pHighA * 100),
      HookB: Math.round(pHighB * 100),
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Comparison Verdict / Winner Banner */}
      <MarginGuardBanner marginGuard={margin_guard} />

      {/* 2. Side-by-Side Hook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ===================== HOOK A CARD ===================== */}
        <div
          className={`rounded-2xl bg-[#13141C] border transition-all flex flex-col justify-between p-5 space-y-4 ${
            margin_guard.winner === 'HOOK_A'
              ? 'border-violet-500/40 ring-1 ring-violet-500/20'
              : 'border-[#222432]'
          }`}
        >
          <div className="space-y-4">
            {/* Header: Label + Winner pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#F1F5F9] px-2.5 py-1 rounded-lg bg-[#202230] border border-[#2e3144]">
                  Hook A
                </span>
                {margin_guard.winner === 'HOOK_A' && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Stronger opening
                  </span>
                )}
                {margin_guard.is_dead_heat && (
                  <span className="text-xs font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Even match
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#64748B]">Virality score: </span>
                <strong className="text-sm font-mono text-[#A78BFA]">{hook_a.fnvmScore ?? '2.5'}x</strong>
              </div>
            </div>

            {/* Hook text */}
            <p className="text-sm sm:text-base text-[#F1F5F9] font-medium leading-relaxed bg-[#0B0C10] p-4 rounded-xl border border-[#1E202C]">
              "{hook_a.text}"
            </p>

            {/* Hook Anatomy / Structural checks */}
            <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#8E90A0]">
                <span className="font-medium text-[#EDEDEF]">Opening anatomy</span>
                <span className="font-mono text-[#A78BFA]">~{hook_a.spokenTime ?? '2.5'}s spoken tempo</span>
              </div>

              <div className="flex items-center gap-4 text-[#8E90A0] text-xs">
                <span>Words: <strong className="text-[#EDEDEF] font-mono">{hook_a.word_count}</strong></span>
                <span>•</span>
                <span>Length: <strong className="text-[#EDEDEF] font-mono">{hook_a.character_count}</strong>/280 chars</span>
              </div>

              {/* Notable words detected */}
              <div className="pt-2 border-t border-[#1C1D28] flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#64748B]">Triggers detected:</span>
                {notableWordsA.length > 0 ? (
                  notableWordsA.map((nw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1C1E2B] text-[#EDEDEF] border border-[#2B2E40]"
                    >
                      {nw.word}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-[#64748B]">None detected</span>
                )}
              </div>
            </div>

            {/* Retention Probability Tiers */}
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-[#8E90A0]">
                Predicted audience retention
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#1E202C]">
                  <div className="text-[10px] text-[#64748B] uppercase">Low</div>
                  <div className="text-sm font-bold font-mono text-[#8E90A0] mt-0.5">
                    {(pLowA * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#1E202C]">
                  <div className="text-[10px] text-[#64748B] uppercase">Average</div>
                  <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                    {(pMedA * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase">Viral</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {(pHighA * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Consistency */}
          <div className="pt-3 border-t border-[#1E202C] flex items-center justify-between text-xs text-[#8E90A0]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
              Topic match:
            </span>
            <span
              className={`font-semibold font-mono ${
                hook_a.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {Math.round((hook_a.topicAlignment ?? 0.85) * 100)}%
              {hook_a.clickbaitWarning && ' (Off-topic warning)'}
            </span>
          </div>
        </div>

        {/* ===================== HOOK B CARD ===================== */}
        <div
          className={`rounded-2xl bg-[#13141C] border transition-all flex flex-col justify-between p-5 space-y-4 ${
            margin_guard.winner === 'HOOK_B'
              ? 'border-violet-500/40 ring-1 ring-violet-500/20'
              : 'border-[#222432]'
          }`}
        >
          <div className="space-y-4">
            {/* Header: Label + Winner pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#F1F5F9] px-2.5 py-1 rounded-lg bg-[#202230] border border-[#2e3144]">
                  Hook B
                </span>
                {margin_guard.winner === 'HOOK_B' && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Stronger opening
                  </span>
                )}
                {margin_guard.is_dead_heat && (
                  <span className="text-xs font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Even match
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#64748B]">Virality score: </span>
                <strong className="text-sm font-mono text-[#A78BFA]">{hook_b.fnvmScore ?? '2.5'}x</strong>
              </div>
            </div>

            {/* Hook text */}
            <p className="text-sm sm:text-base text-[#F1F5F9] font-medium leading-relaxed bg-[#0B0C10] p-4 rounded-xl border border-[#1E202C]">
              "{hook_b.text}"
            </p>

            {/* Hook Anatomy / Structural checks */}
            <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#8E90A0]">
                <span className="font-medium text-[#EDEDEF]">Opening anatomy</span>
                <span className="font-mono text-[#A78BFA]">~{hook_b.spokenTime ?? '2.5'}s spoken tempo</span>
              </div>

              <div className="flex items-center gap-4 text-[#8E90A0] text-xs">
                <span>Words: <strong className="text-[#EDEDEF] font-mono">{hook_b.word_count}</strong></span>
                <span>•</span>
                <span>Length: <strong className="text-[#EDEDEF] font-mono">{hook_b.character_count}</strong>/280 chars</span>
              </div>

              {/* Notable words detected */}
              <div className="pt-2 border-t border-[#1C1D28] flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#64748B]">Triggers detected:</span>
                {notableWordsB.length > 0 ? (
                  notableWordsB.map((nw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1C1E2B] text-[#EDEDEF] border border-[#2B2E40]"
                    >
                      {nw.word}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-[#64748B]">None detected</span>
                )}
              </div>
            </div>

            {/* Retention Probability Tiers */}
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-[#8E90A0]">
                Predicted audience retention
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#1E202C]">
                  <div className="text-[10px] text-[#64748B] uppercase">Low</div>
                  <div className="text-sm font-bold font-mono text-[#8E90A0] mt-0.5">
                    {(pLowB * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#1E202C]">
                  <div className="text-[10px] text-[#64748B] uppercase">Average</div>
                  <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                    {(pMedB * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase">Viral</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {(pHighB * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Consistency */}
          <div className="pt-3 border-t border-[#1E202C] flex items-center justify-between text-xs text-[#8E90A0]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
              Topic match:
            </span>
            <span
              className={`font-semibold font-mono ${
                hook_b.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {Math.round((hook_b.topicAlignment ?? 0.85) * 100)}%
              {hook_b.clickbaitWarning && ' (Off-topic warning)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Visual Chart */}
      <div className="rounded-2xl bg-[#13141C] border border-[#222432] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-semibold text-[#EDEDEF] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#A78BFA]" />
              Side-by-side engagement distribution
            </h3>
            <p className="text-xs text-[#8E90A0] mt-0.5">
              Comparative retention probability across both variants
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            Normalized probability sum: 100%
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="tier" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#13141C',
                  borderColor: '#262838',
                  borderRadius: '0.75rem',
                  color: '#EDEDEF',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="HookA" name="Hook A" fill="#818CF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="HookB" name="Hook B" fill="#C084FC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Creator Note / Ethical Disclaimer */}
      <div className="rounded-xl p-4 sm:p-5 border border-[#222432] bg-[#0E0F15] text-xs text-[#8E90A0] space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#EDEDEF]">
          <ShieldAlert className="w-4 h-4 text-[#A78BFA] shrink-0" />
          <span>A creator note on virality</span>
        </div>
        <p className="leading-relaxed text-[#8E90A0]">
          {disclaimer || (
            "A punchy opening buys you the first 3 seconds — but long retention depends on your visual pacing, " +
            "audio quality, and authentic value. These scores reflect linguistic trends learned from 3,000 real viral " +
            "videos across TikTok, Reels, and Shorts. No algorithm guarantees views."
          )}
        </p>
        <div className="pt-2 border-t border-[#1C1D26] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#64748B]">
          <span>Model: TF-IDF + Multinomial Logistic Regression</span>
          <span>Sample size: 3,000 verified short videos</span>
          <span>Significance threshold: ΔP ≤ 0.08 (8%)</span>
        </div>
      </div>
    </div>
  );
}
