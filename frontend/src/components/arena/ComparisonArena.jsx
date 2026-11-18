import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Zap, ShieldCheck, BarChart3, TrendingUp, Info, Cpu, Sparkles } from 'lucide-react';
import { MarginGuardBanner } from './MarginGuardBanner';
import { SignalsComparison } from './SignalsComparison';
import { SemanticRadarCard } from './SemanticRadarCard';
import { ExportBanner } from './ExportBanner';

export function ComparisonArena({ result, onOpenOutcome }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard, disclaimer, isMockModel } = result;

  const chartData = [
    {
      tier: 'Low Engagement',
      HookA: Math.round(hook_a.probabilities.low * 100),
      HookB: Math.round(hook_b.probabilities.low * 100),
    },
    {
      tier: 'Medium Engagement',
      HookA: Math.round(hook_a.probabilities.medium * 100),
      HookB: Math.round(hook_b.probabilities.medium * 100),
    },
    {
      tier: 'High Engagement (Viral)',
      HookA: Math.round(hook_a.probabilities.high * 100),
      HookB: Math.round(hook_b.probabilities.high * 100),
    },
  ];

  const isWinnerA = margin_guard.winner === 'HOOK_A';
  const isWinnerB = margin_guard.winner === 'HOOK_B';

  return (
    <div className="space-y-6 pt-4 animate-fade-in-up">
      {/* 1. Margin Guard Decision Support Banner */}
      <MarginGuardBanner marginGuard={margin_guard} />

      {/* Model Mode Indicator Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-2 text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span>Inference Engine:</span>
          <span className="font-semibold text-white">
            {isMockModel ? 'Heuristic Rules Fallback' : 'Trained Hybrid ML Model (TF-IDF + 24 Features)'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          Decision Margin: ΔP = {(margin_guard.delta_p * 100).toFixed(1)}% (Threshold: 8.0%)
        </div>
      </div>

      {/* 2. Side-by-Side Engagement & FNVM Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook A Metrics Card */}
        <div
          className={`glass-panel rounded-2xl p-6 border transition-all duration-300 ${
            isWinnerA
              ? 'border-violet-500/50 shadow-2xl shadow-violet-950/30'
              : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30">
                Hook A
              </span>
              <span className="text-xs text-zinc-400 truncate max-w-[200px]">"{hook_a.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Virality Multiplier: </span>
              <strong className="text-sm font-mono font-bold text-violet-400">{hook_a.fnvmScore}x</strong>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Low</div>
                <div className="text-base font-bold font-mono text-slate-300 mt-0.5">
                  {(hook_a.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-amber-500/80">Medium</div>
                <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                  {(hook_a.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 shadow-inner">
                <div className="text-[10px] uppercase font-bold text-emerald-400">High (Viral)</div>
                <div className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                  {(hook_a.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                Hook-to-Promise Match:
              </span>
              <span
                className={`font-semibold font-mono px-2 py-0.5 rounded-md ${
                  hook_a.clickbaitWarning
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {(hook_a.topicAlignment * 100).toFixed(0)}%
                {hook_a.clickbaitWarning && ' (⚠️ Clickbait Risk)'}
              </span>
            </div>
          </div>
        </div>

        {/* Hook B Metrics Card */}
        <div
          className={`glass-panel rounded-2xl p-6 border transition-all duration-300 ${
            isWinnerB
              ? 'border-cyan-500/50 shadow-2xl shadow-cyan-950/30'
              : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Hook B
              </span>
              <span className="text-xs text-zinc-400 truncate max-w-[200px]">"{hook_b.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Virality Multiplier: </span>
              <strong className="text-sm font-mono font-bold text-cyan-400">{hook_b.fnvmScore}x</strong>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Low</div>
                <div className="text-base font-bold font-mono text-slate-300 mt-0.5">
                  {(hook_b.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-amber-500/80">Medium</div>
                <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                  {(hook_b.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 shadow-inner">
                <div className="text-[10px] uppercase font-bold text-emerald-400">High (Viral)</div>
                <div className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                  {(hook_b.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Hook-to-Promise Match:
              </span>
              <span
                className={`font-semibold font-mono px-2 py-0.5 rounded-md ${
                  hook_b.clickbaitWarning
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {(hook_b.topicAlignment * 100).toFixed(0)}%
                {hook_b.clickbaitWarning && ' (⚠️ Clickbait Risk)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recharts Probability Distribution Bars */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] mb-5 gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Calibrated Engagement Tier Distribution
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            TF-IDF + 24 Psychological Features (P sum = 1.000)
          </span>
        </div>

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
                  backgroundColor: '#0F111D',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  boxShadow: '0 20px 30px -10px rgba(0,0,0,0.8)',
                }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="HookA" name="Hook A" fill="#818CF8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="HookB" name="Hook B" fill="#38BDF8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Dual-Tower 384-Dim Transformer Semantic Embedding Analysis */}
      <SemanticRadarCard hookA={hook_a.text} hookB={hook_b.text} />

      {/* 5. Day 2 Psycholinguistic Signals Breakdown */}
      <SignalsComparison hookA={hook_a} hookB={hook_b} />

      {/* 5. Day 3 Export & Share Banner */}
      <ExportBanner result={result} onOpenOutcome={onOpenOutcome} />

      {/* 6. Mandatory Ethical Disclaimer (Faculty Mentor Requirement) */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex items-start gap-3 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-zinc-200">Academic & Creator Disclaimer:</strong>{' '}
          {disclaimer ||
            'Notice: The predicted engagement class is only an estimate based on historical text patterns in the dataset. It cannot and does not guarantee that a video will go viral. Real-world performance depends heavily on visual delivery, topic relevance, timing, and platform recommendation algorithms.'}
        </p>
      </div>
    </div>
  );
}
