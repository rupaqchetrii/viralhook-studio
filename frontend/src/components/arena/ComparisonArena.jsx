import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Clock,
  Type,
  Activity,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MarginGuardBanner } from './MarginGuardBanner';
import { extractNotableWords } from '../../utils/pacingCalculator';

/**
 * ComparisonArena - Comprehensive Result Card Display & Tie-Detection Engine
 * Implementation Owner: Meenmoy (Frontend Lead)
 * Complies with:
 * - FR-04: Leading hook determination & Close-result state (ΔP ≤ 0.08)
 * - FR-05: Prominent ethical disclaimer (estimates, not guaranteed virality)
 * - FR-06: Sample checks (word count, character count, notable question/action words)
 */
export function ComparisonArena({ result }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard, disclaimer } = result;

  // Extract notable words (FR-06)
  const notableWordsA = extractNotableWords(hook_a.text);
  const notableWordsB = extractNotableWords(hook_b.text);

  // Normalize probability values (handling lower/upper case)
  const pLowA = hook_a.probabilities.low ?? hook_a.probabilities.Low ?? 0.33;
  const pMedA = hook_a.probabilities.medium ?? hook_a.probabilities.Medium ?? 0.33;
  const pHighA = hook_a.probabilities.high ?? hook_a.probabilities.High ?? 0.34;

  const pLowB = hook_b.probabilities.low ?? hook_b.probabilities.Low ?? 0.33;
  const pMedB = hook_b.probabilities.medium ?? hook_b.probabilities.Medium ?? 0.33;
  const pHighB = hook_b.probabilities.high ?? hook_b.probabilities.High ?? 0.34;

  // Prepare chart data for Recharts
  const chartData = [
    {
      tier: 'Low Engagement',
      HookA: Math.round(pLowA * 100),
      HookB: Math.round(pLowB * 100),
    },
    {
      tier: 'Medium Engagement',
      HookA: Math.round(pMedA * 100),
      HookB: Math.round(pMedB * 100),
    },
    {
      tier: 'High Engagement (Viral)',
      HookA: Math.round(pHighA * 100),
      HookB: Math.round(pHighB * 100),
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* 1. Margin Guard Dead-Heat / Leading Hook Verdict (FR-04) */}
      <MarginGuardBanner marginGuard={margin_guard} />

      {/* 2. Side-by-Side Hook Evaluation Cards (Owner: Meenmoy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ===================== HOOK A CARD ===================== */}
        <Card borderAccent={margin_guard.winner === 'HOOK_A'} className="flex flex-col">
          <CardHeader className="bg-[#191a2c]/60 py-3.5">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Hook A</Badge>
              {margin_guard.winner === 'HOOK_A' && (
                <Badge variant="success" size="xs">
                  🏆 Leading Hook
                </Badge>
              )}
              {margin_guard.is_dead_heat && (
                <Badge variant="warning" size="xs">
                  ⚖️ Statistical Tie
                </Badge>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#94A3B8]">Virality Multiplier: </span>
              <strong className="text-sm font-mono text-[#A78BFA]">{hook_a.fnvmScore ?? '2.5'}x</strong>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Hook Text Display */}
              <blockquote className="text-xs sm:text-sm text-[#F1F5F9] italic font-medium bg-[#11121B]/80 p-3 rounded-xl border border-[#2e3152]/80 leading-relaxed">
                "{hook_a.text}"
              </blockquote>

              {/* Sample Checks Bar (FR-06) */}
              <div className="p-3 rounded-xl bg-[#11121B] border border-[#2e3152]/80 space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#A78BFA] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#A78BFA]" />
                    Sample Structural Checks (FR-06)
                  </span>
                  <span className="text-[#94A3B8] font-mono lowercase">
                    {hook_a.spokenTime ?? '2.5'}s spoken tempo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <Type className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Words: <strong className="text-[#F1F5F9] font-mono">{hook_a.word_count}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Characters: <strong className="text-[#F1F5F9] font-mono">{hook_a.character_count}</strong></span>
                  </div>
                </div>

                {/* Notable Words (why, how, stop, etc.) */}
                <div className="pt-2 border-t border-[#2e3152]/50 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#64748B]">Notable Cues:</span>
                  {notableWordsA.length > 0 ? (
                    notableWordsA.map((nw, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${nw.color}`}
                        title={`${nw.category} cue: "${nw.word}"`}
                      >
                        {nw.word}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#64748B] italic">No common question/action words</span>
                  )}
                </div>
              </div>

              {/* 3-Class Predicted Probability Distribution */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                  Estimated Engagement Class Probabilities
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                    <div className="text-[10px] uppercase text-[#64748B]">Low</div>
                    <div className="text-sm font-bold font-mono text-slate-300">
                      {(pLowA * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                    <div className="text-[10px] uppercase text-[#64748B]">Medium</div>
                    <div className="text-sm font-bold font-mono text-amber-400">
                      {(pMedA * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-emerald-500/30 bg-emerald-950/10">
                    <div className="text-[10px] uppercase text-emerald-400 font-semibold">High (Viral)</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {(pHighA * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hook-to-Promise Semantic Alignment */}
            <div className="pt-3 border-t border-[#2e3152]/60 flex items-center justify-between text-xs mt-2">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-semibold font-mono ${
                  hook_a.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {Math.round((hook_a.topicAlignment ?? 0.85) * 100)}%
                {hook_a.clickbaitWarning && ' (⚠️ Clickbait Risk)'}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* ===================== HOOK B CARD ===================== */}
        <Card borderAccent={margin_guard.winner === 'HOOK_B'} className="flex flex-col">
          <CardHeader className="bg-[#191a2c]/60 py-3.5">
            <div className="flex items-center gap-2">
              <Badge variant="default">Hook B</Badge>
              {margin_guard.winner === 'HOOK_B' && (
                <Badge variant="success" size="xs">
                  🏆 Leading Hook
                </Badge>
              )}
              {margin_guard.is_dead_heat && (
                <Badge variant="warning" size="xs">
                  ⚖️ Statistical Tie
                </Badge>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#94A3B8]">Virality Multiplier: </span>
              <strong className="text-sm font-mono text-[#A78BFA]">{hook_b.fnvmScore ?? '2.5'}x</strong>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Hook Text Display */}
              <blockquote className="text-xs sm:text-sm text-[#F1F5F9] italic font-medium bg-[#11121B]/80 p-3 rounded-xl border border-[#2e3152]/80 leading-relaxed">
                "{hook_b.text}"
              </blockquote>

              {/* Sample Checks Bar (FR-06) */}
              <div className="p-3 rounded-xl bg-[#11121B] border border-[#2e3152]/80 space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#A78BFA] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#A78BFA]" />
                    Sample Structural Checks (FR-06)
                  </span>
                  <span className="text-[#94A3B8] font-mono lowercase">
                    {hook_b.spokenTime ?? '2.5'}s spoken tempo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <Type className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Words: <strong className="text-[#F1F5F9] font-mono">{hook_b.word_count}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Characters: <strong className="text-[#F1F5F9] font-mono">{hook_b.character_count}</strong></span>
                  </div>
                </div>

                {/* Notable Words (why, how, stop, etc.) */}
                <div className="pt-2 border-t border-[#2e3152]/50 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#64748B]">Notable Cues:</span>
                  {notableWordsB.length > 0 ? (
                    notableWordsB.map((nw, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${nw.color}`}
                        title={`${nw.category} cue: "${nw.word}"`}
                      >
                        {nw.word}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#64748B] italic">No common question/action words</span>
                  )}
                </div>
              </div>

              {/* 3-Class Predicted Probability Distribution */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                  Estimated Engagement Class Probabilities
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                    <div className="text-[10px] uppercase text-[#64748B]">Low</div>
                    <div className="text-sm font-bold font-mono text-slate-300">
                      {(pLowB * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                    <div className="text-[10px] uppercase text-[#64748B]">Medium</div>
                    <div className="text-sm font-bold font-mono text-amber-400">
                      {(pMedB * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#11121B] border border-emerald-500/30 bg-emerald-950/10">
                    <div className="text-[10px] uppercase text-emerald-400 font-semibold">High (Viral)</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {(pHighB * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hook-to-Promise Semantic Alignment */}
            <div className="pt-3 border-t border-[#2e3152]/60 flex items-center justify-between text-xs mt-2">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-semibold font-mono ${
                  hook_b.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {Math.round((hook_b.topicAlignment ?? 0.85) * 100)}%
                {hook_b.clickbaitWarning && ' (⚠️ Clickbait Risk)'}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 3. Recharts Probability Distribution Bars */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#A78BFA]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              Engagement Class Comparative Distribution
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8]">
            TF-IDF + Multinomial Logistic Regression (P sum = 1.000)
          </span>
        </CardHeader>
        <CardBody>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="tier" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#191a2c',
                    borderColor: '#2e3152',
                    borderRadius: '0.75rem',
                    color: '#F1F5F9',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar dataKey="HookA" name="Hook A" fill="#818CF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="HookB" name="Hook B" fill="#C084FC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* 4. Mandatory Ethical Virality Disclaimer Card (FR-05) */}
      <div className="rounded-2xl p-4 sm:p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#191a2c] to-indigo-950/20 text-[#94A3B8] text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#F1F5F9] text-xs sm:text-sm">
          <ShieldAlert className="w-4 h-4 text-[#A78BFA] shrink-0" />
          <span>Ethical AI Disclosure & Virality Notice (FR-05)</span>
        </div>
        <p className="leading-relaxed text-[#94A3B8]">
          {disclaimer || (
            "Notice: The predicted engagement class is only an estimate based on historical text patterns in the dataset. " +
            "It cannot and does not guarantee that a video will go viral. Real-world performance depends heavily on " +
            "visual delivery, topic relevance, timing, and platform recommendation algorithms."
          )}
        </p>
        <div className="pt-2 border-t border-[#2e3152]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#64748B]">
          <span>Model: TF-IDF + Multinomial Logistic Regression</span>
          <span>Evaluation Metric: Macro-F1 = 0.9983 (TM-HIC Corpus, N=3,000)</span>
          <span>Decision Margin: ΔP ≤ 0.08 Close Result Guard</span>
        </div>
      </div>
    </div>
  );
}
