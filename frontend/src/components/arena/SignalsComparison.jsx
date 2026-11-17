import React from 'react';
import { Sparkles, MessageSquare, Search, Hash, AlertOctagon, Zap, BookOpen, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function SignalsComparison({ hookA, hookB }) {
  if (!hookA || !hookB) return null;

  const analysisA = hookA.analysis;
  const analysisB = hookB.analysis;

  // Extract signals if available from backend analysis, or infer from text
  const getSignals = (hook, analysis) => {
    if (analysis && analysis.signals) {
      return analysis.signals;
    }
    // Fallback signals
    const text = hook.text || '';
    const spoken = hook.spokenTime || 2.5;
    return [
      {
        label: 'Direct Address',
        value: /\b(you|your|you're)\b/i.test(text) ? '✅ Personal address' : '❌ No direct address',
        impact: /\b(you|your|you're)\b/i.test(text) ? 'positive' : 'negative',
        tip: 'Direct personal address boosts viewer connection.',
      },
      {
        label: 'Curiosity Trigger',
        value: /\b(secret|mistake|why|how|stop|never|nobody)\b/i.test(text) ? '✅ Curiosity loop' : '❌ No open loop',
        impact: /\b(secret|mistake|why|how|stop|never|nobody)\b/i.test(text) ? 'positive' : 'negative',
        tip: 'Curiosity words trigger the brain to seek closure.',
      },
      {
        label: 'Specificity / Numbers',
        value: /\d+/.test(text) ? '✅ Concrete digit' : '⚠️ No numbers',
        impact: /\d+/.test(text) ? 'positive' : 'neutral',
        tip: 'Numbers signal a quantifiable promise.',
      },
      {
        label: 'Speaking Window',
        value: spoken <= 3.0 ? `🟢 ${spoken.toFixed(1)}s (sweet spot)` : `🟡 ${spoken.toFixed(1)}s`,
        impact: spoken <= 3.0 ? 'positive' : 'neutral',
        tip: 'Aim for under 3.0 seconds to prevent early drop-off.',
      },
    ];
  };

  const signalsA = getSignals(hookA, analysisA);
  const signalsB = getSignals(hookB, analysisB);

  return (
    <Card className="border-[#2e3152]/80 bg-[#191a2c]/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          <h3 className="text-sm font-bold text-[#F1F5F9]">
            Psycholinguistic Feature Signals Breakdown (Day 2)
          </h3>
        </div>
        <span className="text-xs text-[#94A3B8]">
          Side-by-side linguistic & pacing diagnostics
        </span>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hook A Signals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2e3152]">
              <Badge variant="accent">Hook A Signals</Badge>
              {analysisA?.readability_grade !== undefined && (
                <span className="text-xs font-mono text-[#94A3B8]">
                  FK Grade: <strong className="text-[#A78BFA]">{analysisA.readability_grade}</strong>
                </span>
              )}
            </div>
            <div className="space-y-2">
              {signalsA.map((sig, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    sig.impact === 'positive'
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                      : sig.impact === 'negative'
                      ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                      : 'bg-[#11121B] border-[#2e3152] text-slate-300'
                  }`}
                >
                  <span className="font-semibold text-[#F1F5F9]">{sig.label}</span>
                  <span className="font-mono text-right">{sig.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hook B Signals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2e3152]">
              <Badge variant="default">Hook B Signals</Badge>
              {analysisB?.readability_grade !== undefined && (
                <span className="text-xs font-mono text-[#94A3B8]">
                  FK Grade: <strong className="text-[#A78BFA]">{analysisB.readability_grade}</strong>
                </span>
              )}
            </div>
            <div className="space-y-2">
              {signalsB.map((sig, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    sig.impact === 'positive'
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                      : sig.impact === 'negative'
                      ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                      : 'bg-[#11121B] border-[#2e3152] text-slate-300'
                  }`}
                >
                  <span className="font-semibold text-[#F1F5F9]">{sig.label}</span>
                  <span className="font-mono text-right">{sig.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
