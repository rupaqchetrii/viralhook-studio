import React from 'react';
import { Wand2, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

const REMIX_TEMPLATES = [
  {
    archetype: 'Curiosity Loop',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    template: 'Why {topic} is secretly failing (and the 1 fix nobody talks about)',
    description: 'Creates an open knowledge gap that compels viewers to stay for the payoff.',
  },
  {
    archetype: 'Loss Aversion',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    template: 'Stop doing this with your {topic} right now or you will regret it',
    description: 'Triggers the psychological urge to avoid loss or wasted effort.',
  },
  {
    archetype: 'Listicle & Specificity',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    template: '3 simple {topic} habits that will save you 10 hours every week',
    description: 'Concrete numbers establish clear expectations and perceived value.',
  },
  {
    archetype: 'Direct Audience Challenge',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    template: 'You are probably making this major {topic} mistake without realizing it',
    description: 'Direct second-person address ("you") immediately grabs scroll attention.',
  },
];

export function RemixLab() {
  const { topic, setHookA, setHookB, runComparison } = useHookStore();

  const cleanTopic = topic.trim() || 'content creation';

  const handleApplyTemplate = (targetHook, template) => {
    const text = template.replace(/{topic}/g, cleanTopic);
    if (targetHook === 'A') {
      setHookA(text);
    } else {
      setHookB(text);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] mb-5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Hook Remix & Inspiration Lab
            </h3>
            <p className="text-xs text-zinc-400">One-click viral psychological archetype formulas calibrated to your topic</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REMIX_TEMPLATES.map((item, idx) => {
          const formatted = item.template.replace(/{topic}/g, cleanTopic);

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/[0.06] bg-black/30 hover:border-violet-500/40 hover:bg-white/[0.02] transition-all duration-200 flex flex-col justify-between gap-3 group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${item.badgeClass}`}>
                    {item.archetype}
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors leading-relaxed">
                  "{formatted}"
                </p>
                <p className="text-xs text-zinc-400">{item.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => handleApplyTemplate('A', item.template)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-violet-600/20 text-violet-300 border border-white/[0.06] hover:border-violet-500/40 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inject into Hook A</span>
                  <ArrowRight className="w-3 h-3 text-violet-400" />
                </button>
                <button
                  onClick={() => handleApplyTemplate('B', item.template)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-600/20 text-cyan-300 border border-white/[0.06] hover:border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inject into Hook B</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
