import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import { Zap, ShieldCheck, AlertCircle, BarChart3, TrendingUp, Layers } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MarginGuardBanner } from './MarginGuardBanner';

export function ComparisonArena({ result }) {
  if (!result) return null;

  const { hook_a, hook_b, margin_guard } = result;

  // Prepare chart data for Recharts
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

  return (
    <div className="space-y-6 pt-4">
      {/* 1. Margin Guard Dead-Heat / Winner Announcement */}
      <MarginGuardBanner marginGuard={margin_guard} />

      {/* 2. Side-by-Side Engagement & FNVM Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook A Metrics Card */}
        <Card borderAccent={margin_guard.winner === 'HOOK_A'}>
          <CardHeader className="bg-[#191a2c]/60">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Hook A</Badge>
              <span className="text-xs text-[#94A3B8] truncate max-w-[200px]">"{hook_a.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94A3B8]">FNVM Score: </span>
              <strong className="text-sm font-mono text-[#A78BFA]">{hook_a.fnvmScore}x</strong>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                <div className="text-[10px] uppercase text-[#64748B]">Low</div>
                <div className="text-sm font-bold font-mono text-slate-300">
                  {(hook_a.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                <div className="text-[10px] uppercase text-[#64748B]">Medium</div>
                <div className="text-sm font-bold font-mono text-amber-400">
                  {(hook_a.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-emerald-500/30 bg-emerald-950/10">
                <div className="text-[10px] uppercase text-emerald-400 font-semibold">High (Viral)</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {(hook_a.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-2 border-t border-[#2e3152]/60 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-semibold font-mono ${
                  hook_a.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {(hook_a.topicAlignment * 100).toFixed(0)}%
                {hook_a.clickbaitWarning && ' (⚠️ Clickbait Risk)'}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Hook B Metrics Card */}
        <Card borderAccent={margin_guard.winner === 'HOOK_B'}>
          <CardHeader className="bg-[#191a2c]/60">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Hook B</Badge>
              <span className="text-xs text-[#94A3B8] truncate max-w-[200px]">"{hook_b.text}"</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94A3B8]">FNVM Score: </span>
              <strong className="text-sm font-mono text-[#A78BFA]">{hook_b.fnvmScore}x</strong>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                <div className="text-[10px] uppercase text-[#64748B]">Low</div>
                <div className="text-sm font-bold font-mono text-slate-300">
                  {(hook_b.probabilities.low * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-[#2e3152]">
                <div className="text-[10px] uppercase text-[#64748B]">Medium</div>
                <div className="text-sm font-bold font-mono text-amber-400">
                  {(hook_b.probabilities.medium * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#11121B] border border-emerald-500/30 bg-emerald-950/10">
                <div className="text-[10px] uppercase text-emerald-400 font-semibold">High (Viral)</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {(hook_b.probabilities.high * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Clickbait Semantic Alignment */}
            <div className="pt-2 border-t border-[#2e3152]/60 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                Hook-to-Promise Alignment:
              </span>
              <span
                className={`font-semibold font-mono ${
                  hook_b.clickbaitWarning ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {(hook_b.topicAlignment * 100).toFixed(0)}%
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
              Calibrated Dual-Tower Engagement Tier Distribution
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8]">
            Dense Sentence Transformers + Sparse TF-IDF (P sum = 1.000)
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
    </div>
  );
}
