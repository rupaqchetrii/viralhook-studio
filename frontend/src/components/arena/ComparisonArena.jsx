import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import { Zap, ShieldCheck, AlertCircle, BarChart3, TrendingUp, Layers, Info, Cpu } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MarginGuardBanner } from './MarginGuardBanner';
import { SignalsComparison } from './SignalsComparison';
import { ExportBanner } from './ExportBanner';

export function ComparisonArena({ result }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard, disclaimer, isMockModel } = result;

  // Prepare chart data for Recharts
  const chartData = [
    {
      tier: 'Low',
      HookA: Math.round(hook_a.probabilities.low * 100),
      HookB: Math.round(hook_b.probabilities.low * 100),
    },
    {
      tier: 'Medium',
      HookA: Math.round(hook_a.probabilities.medium * 100),
      HookB: Math.round(hook_b.probabilities.medium * 100),
    },
    {
      tier: 'High (Viral)',
      HookA: Math.round(hook_a.probabilities.high * 100),
      HookB: Math.round(hook_b.probabilities.high * 100),
    },
  ];

  return (
    <div className="space-y-8 pt-4">
      {/* 1. Margin Guard Decision Support Banner */}
      <MarginGuardBanner marginGuard={margin_guard} />

      {/* Model Mode Indicator Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-2 gap-2 text-[#6E6D7A]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#EA4C89]" />
          <span>Inference Engine:</span>
          <span className="font-bold text-[#0D0C22]">
            {isMockModel ? 'Heuristic Rules Fallback' : 'Trained Hybrid ML Model (TF-IDF + 24 Features)'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#6E6D7A] bg-[#F8F7F4] border border-[#E7E7E9] px-3 py-1 rounded-full">
          Decision Margin: ΔP = {(margin_guard.delta_p * 100).toFixed(1)}% (Threshold: 8.0%)
        </div>
      </div>

      {/* 2. Side-by-Side Engagement & FNVM Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hook A Metrics Card */}
        <Card borderAccent={margin_guard.winner === 'HOOK_A'}>
          <CardHeader className="bg-[#F8F7F4]/60 border-b border-[#E7E7E9]">
            <div className="flex items-center gap-2.5">
              <Badge variant="dark">Hook A</Badge>
              <span className="text-xs text-[#6E6D7A] font-medium truncate max-w-[200px]">"{hook_a.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6E6D7A]">FNVM Score: </span>
              <strong className="text-sm font-mono text-[#0D0C22]">{hook_a.fnvmScore}x</strong>
            </div>
          </CardHeader>
          <CardBody className="space-y-5 p-6">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                <div className="text-[10px] uppercase font-bold text-[#6E6D7A]">Low</div>
                <div className="text-sm font-bold font-mono text-[#0D0C22] mt-0.5">
                  {(hook_a.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                <div className="text-[10px] uppercase font-bold text-[#6E6D7A]">Medium</div>
                <div className="text-sm font-bold font-mono text-amber-600 mt-0.5">
                  {(hook_a.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] uppercase text-emerald-700 font-bold">High (Viral)</div>
                <div className="text-base font-extrabold font-mono text-emerald-700 mt-0.5">
                  {(hook_a.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-3 border-t border-[#E7E7E9] flex items-center justify-between text-xs">
              <span className="text-[#6E6D7A] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#EA4C89]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded-full text-[11px] ${
                  hook_a.clickbaitWarning ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {(hook_a.topicAlignment * 100).toFixed(0)}% match
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Hook B Metrics Card */}
        <Card borderAccent={margin_guard.winner === 'HOOK_B'}>
          <CardHeader className="bg-[#F8F7F4]/60 border-b border-[#E7E7E9]">
            <div className="flex items-center gap-2.5">
              <Badge variant="accent">Hook B</Badge>
              <span className="text-xs text-[#6E6D7A] font-medium truncate max-w-[200px]">"{hook_b.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6E6D7A]">FNVM Score: </span>
              <strong className="text-sm font-mono text-[#EA4C89]">{hook_b.fnvmScore}x</strong>
            </div>
          </CardHeader>
          <CardBody className="space-y-5 p-6">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                <div className="text-[10px] uppercase font-bold text-[#6E6D7A]">Low</div>
                <div className="text-sm font-bold font-mono text-[#0D0C22] mt-0.5">
                  {(hook_b.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                <div className="text-[10px] uppercase font-bold text-[#6E6D7A]">Medium</div>
                <div className="text-sm font-bold font-mono text-amber-600 mt-0.5">
                  {(hook_b.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] uppercase text-emerald-700 font-bold">High (Viral)</div>
                <div className="text-base font-extrabold font-mono text-emerald-700 mt-0.5">
                  {(hook_b.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-3 border-t border-[#E7E7E9] flex items-center justify-between text-xs">
              <span className="text-[#6E6D7A] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#EA4C89]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded-full text-[11px] ${
                  hook_b.clickbaitWarning ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {(hook_b.topicAlignment * 100).toFixed(0)}% match
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 3. Recharts Probability Bar Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#EA4C89]" />
            <h3 className="text-sm font-bold text-[#0D0C22]">
              Probability Tier Distribution Comparison
            </h3>
          </div>
          <span className="text-xs text-[#6E6D7A] font-medium hidden sm:inline">
            Side-by-side linguistic confidence
          </span>
        </CardHeader>
        <CardBody className="p-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="tier" stroke="#9E9EA7" fontSize={12} tickLine={false} />
                <YAxis stroke="#9E9EA7" fontSize={12} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E7E7E9',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(13,12,34,0.08)',
                    color: '#0D0C22',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  cursor={{ fill: '#F8F7F4' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="HookA" name="Hook Option A" fill="#0D0C22" radius={[6, 6, 0, 0]} />
                <Bar dataKey="HookB" name="Hook Option B" fill="#EA4C89" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* 4. Psycholinguistic Signals Breakdown Matrix */}
      <SignalsComparison hookA={hook_a} hookB={hook_b} />

      {/* 5. One-Click Diagnostic Exporter */}
      <ExportBanner result={result} />

      {/* 6. Ethical Disclaimer Display */}
      {disclaimer && (
        <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] flex items-start gap-3 text-xs text-[#6E6D7A]">
          <Info className="w-4 h-4 text-[#6E6D7A] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-normal">{disclaimer}</p>
        </div>
      )}
    </div>
  );
}
