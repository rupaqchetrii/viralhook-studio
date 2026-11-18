import React from 'react';
import { Sparkles, MessageSquare, Search, Hash, AlertOctagon, Zap, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export function SignalsComparison({ hookA, hookB }) {
  if (!hookA || !hookB) return null;

  const analysisA = hookA.analysis;
  const analysisB = hookB.analysis;

  const getSignalList = (hook, analysis) => {
    if (analysis && analysis.signals) {
      return analysis.signals;
    }
    const text = hook.text || '';
    const spoken = hook.spokenTime || 2.5;
    return [
      {
        label: 'Direct Address',
        icon: MessageSquare,
        active: /\b(you|your|you're)\b/i.test(text),
        detail: /\b(you|your|you're)\b/i.test(text) ? 'Personal "you/your" used' : 'No personal address',
        impact: /\b(you|your|you're)\b/i.test(text) ? 'positive' : 'negative',
      },
      {
        label: 'Curiosity Loop',
        icon: Search,
        active: /\b(secret|mistake|why|how|stop|never|nobody|hack)\b/i.test(text),
        detail: /\b(secret|mistake|why|how|stop|never|nobody|hack)\b/i.test(text) ? 'Intrigue gap detected' : 'Standard phrasing',
        impact: /\b(secret|mistake|why|how|stop|never|nobody|hack)\b/i.test(text) ? 'positive' : 'negative',
      },
      {
        label: 'Specificity & Digits',
        icon: Hash,
        active: /\d+/.test(text),
        detail: /\d+/.test(text) ? 'Concrete numbers present' : 'No numbers found',
        impact: /\d+/.test(text) ? 'positive' : 'neutral',
      },
      {
        label: 'Loss Aversion',
        icon: AlertOctagon,
        active: /\b(stop|never|mistake|wrong|ruin|avoid)\b/i.test(text),
        detail: /\b(stop|never|mistake|wrong|ruin|avoid)\b/i.test(text) ? 'Loss-aversion frame' : 'Neutral framing',
        impact: /\b(stop|never|mistake|wrong|ruin|avoid)\b/i.test(text) ? 'positive' : 'neutral',
      },
      {
        label: 'Delivery Window',
        icon: Clock,
        active: spoken <= 3.0,
        detail: `${spoken.toFixed(1)}s (${spoken <= 3.0 ? 'Optimal' : 'Needs trim'})`,
        impact: spoken <= 3.0 ? 'positive' : 'negative',
      },
      {
        label: 'Readability Ease',
        icon: BookOpen,
        active: true,
        detail: `Grade ${analysis?.readability_grade || '5.5'} (Optimal 4-7)`,
        impact: 'positive',
      },
    ];
  };

  const signalsA = getSignalList(hookA, analysisA);
  const signalsB = getSignalList(hookB, analysisB);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] mb-6 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Psycholinguistic Signal Matrix
            </h3>
            <p className="text-xs text-zinc-400">Side-by-side linguistic breakdown & retention mechanics</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400" /> Hook A
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Hook B
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook A Card */}
        <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-violet-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30">
              Hook A Signals
            </span>
            <span className="text-xs text-zinc-400 truncate max-w-[200px]">"{hookA.text}"</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {signalsA.map((sig, idx) => {
              const Icon = sig.icon || Sparkles;
              const isPos = sig.impact === 'positive';
              const isNeg = sig.impact === 'negative';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-1.5 transition-all ${
                    isPos
                      ? 'bg-emerald-950/20 border-emerald-500/20'
                      : isNeg
                      ? 'bg-rose-950/20 border-rose-500/20'
                      : 'bg-black/30 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5 text-[11px]">
                      <Icon className="w-3.5 h-3.5 text-violet-400" />
                      {sig.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold font-mono ${
                        isPos
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isNeg
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-white/[0.05] text-zinc-400'
                      }`}
                    >
                      {isPos ? 'Active' : isNeg ? 'Missing' : 'Fair'}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-[11px] truncate">{sig.detail || sig.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hook B Card */}
        <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-cyan-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Hook B Signals
            </span>
            <span className="text-xs text-zinc-400 truncate max-w-[200px]">"{hookB.text}"</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {signalsB.map((sig, idx) => {
              const Icon = sig.icon || Sparkles;
              const isPos = sig.impact === 'positive';
              const isNeg = sig.impact === 'negative';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-1.5 transition-all ${
                    isPos
                      ? 'bg-emerald-950/20 border-emerald-500/20'
                      : isNeg
                      ? 'bg-rose-950/20 border-rose-500/20'
                      : 'bg-black/30 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5 text-[11px]">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      {sig.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold font-mono ${
                        isPos
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isNeg
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-white/[0.05] text-zinc-400'
                      }`}
                    >
                      {isPos ? 'Active' : isNeg ? 'Missing' : 'Fair'}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-[11px] truncate">{sig.detail || sig.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
