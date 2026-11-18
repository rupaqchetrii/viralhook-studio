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
    const text = hook.text || '';
    const spoken = hook.spokenTime || 2.5;
    return [
      {
        label: 'Direct Address',
        value: /\b(you|your|you're)\b/i.test(text) ? 'Personal address' : 'No direct address',
        impact: /\b(you|your|you're)\b/i.test(text) ? 'positive' : 'negative',
        tip: 'Direct personal address boosts viewer connection.',
      },
      {
        label: 'Curiosity Trigger',
        value: /\b(secret|mistake|why|how|stop|never|nobody)\b/i.test(text) ? 'Curiosity loop' : 'No open loop',
        impact: /\b(secret|mistake|why|how|stop|never|nobody)\b/i.test(text) ? 'positive' : 'negative',
        tip: 'Curiosity words trigger the brain to seek closure.',
      },
      {
        label: 'Specificity / Numbers',
        value: /\d+/.test(text) ? 'Concrete digit' : 'No numbers',
        impact: /\d+/.test(text) ? 'positive' : 'neutral',
        tip: 'Numbers signal a quantifiable promise.',
      },
      {
        label: 'Speaking Window',
        value: spoken <= 3.0 ? `${spoken.toFixed(1)}s (sweet spot)` : `${spoken.toFixed(1)}s`,
        impact: spoken <= 3.0 ? 'positive' : 'neutral',
        tip: 'Aim for under 3.0 seconds to prevent early drop-off.',
      },
    ];
  };

  const signalsA = getSignals(hookA, analysisA);
  const signalsB = getSignals(hookB, analysisB);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#EA4C89]" />
          <h3 className="text-sm font-bold text-[#0D0C22]">
            Psycholinguistic Feature Signals Breakdown (Day 2)
          </h3>
        </div>
        <span className="text-xs text-[#6E6D7A] font-medium hidden sm:inline">
          Fine-grained linguistic comparison
        </span>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hook A Signals */}
          <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E9]">
              <span className="text-xs font-bold text-[#0D0C22]">Hook Option A Signals</span>
              <Badge variant="dark" size="xs">Variant A</Badge>
            </div>
            <div className="space-y-2">
              {signalsA.map((sig, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-[#E7E7E9] flex items-center justify-between text-xs shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-[#0D0C22]">{sig.label}</div>
                    <div className="text-[11px] text-[#6E6D7A] mt-0.5">{sig.tip}</div>
                  </div>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded-full text-[11px] shrink-0 ml-2 ${
                      sig.impact === 'positive'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sig.impact === 'negative'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9]'
                    }`}
                  >
                    {sig.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hook B Signals */}
          <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E9]">
              <span className="text-xs font-bold text-[#EA4C89]">Hook Option B Signals</span>
              <Badge variant="accent" size="xs">Variant B</Badge>
            </div>
            <div className="space-y-2">
              {signalsB.map((sig, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-[#E7E7E9] flex items-center justify-between text-xs shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-[#0D0C22]">{sig.label}</div>
                    <div className="text-[11px] text-[#6E6D7A] mt-0.5">{sig.tip}</div>
                  </div>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded-full text-[11px] shrink-0 ml-2 ${
                      sig.impact === 'positive'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sig.impact === 'negative'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9]'
                    }`}
                  >
                    {sig.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
