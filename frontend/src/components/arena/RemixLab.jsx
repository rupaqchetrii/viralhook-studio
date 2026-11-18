import React, { useState } from 'react';
import { Wand2, Sparkles, ArrowRight, Lightbulb, RefreshCw, Cpu, Check } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';
import { fetchAIRemixes } from '../../services/api';

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
  const { hookA, hookB, topic, setHookA, setHookB, runComparison } = useHookStore();

  const [aiVariants, setAiVariants] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeRemixSource, setActiveRemixSource] = useState('A');
  const [injectedIdx, setInjectedIdx] = useState(null);

  const cleanTopic = topic.trim() || 'content creation';

  const handleApplyTemplate = (targetHook, template) => {
    const text = template.replace(/{topic}/g, cleanTopic);
    if (targetHook === 'A') {
      setHookA(text);
    } else {
      setHookB(text);
    }
  };

  const handleGenerateAiRemix = async (sourceKey) => {
    const sourceText = sourceKey === 'A' ? hookA : hookB;
    if (!sourceText.trim()) return;

    setActiveRemixSource(sourceKey);
    setLoadingAi(true);
    setInjectedIdx(null);

    const variants = await fetchAIRemixes(sourceText);
    if (variants && variants.length > 0) {
      setAiVariants(variants);
    } else {
      // Fallback if backend is offline
      const core = sourceText.replace(/^(in this video|hey guys|today|i will show you|we are)\s*/i, '').trim();
      setAiVariants([
        {
          label: 'Direct Address Flip',
          text: `If you want to master ${core}, stop scrolling right now`,
          tip: 'Uses second-person "you" to target the audience directly.',
        },
        {
          label: 'Loss Aversion Warning',
          text: `Stop ignoring this ${core} warning before it is too late`,
          tip: 'Frames the problem as immediate potential loss.',
        },
        {
          label: 'Curiosity Gap Challenge',
          text: `The real reason ${core} is harder than anyone admits`,
          tip: 'Withholds the core answer to drive watch time.',
        },
        {
          label: 'Numeric Specificity',
          text: `3 steps to completely fix your ${core} today`,
          tip: 'Establishes measurable cognitive expectations.',
        },
      ]);
    }
    setLoadingAi(false);
  };

  const handleInjectAiVariant = (targetHook, text, idx) => {
    if (targetHook === 'A') {
      setHookA(text);
    } else {
      setHookB(text);
    }
    setInjectedIdx(idx);
    setTimeout(() => setInjectedIdx(null), 1500);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Hook Remix & Inspiration Lab</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30">
                Day 3 NLP
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Transform weak opening lines with deterministic psycholinguistic rewrite rules
            </p>
          </div>
        </div>

        {/* Dynamic AI Rewrite Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateAiRemix('A')}
            disabled={loadingAi}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeRemixSource === 'A' && aiVariants.length > 0
                ? 'bg-violet-600/30 text-violet-200 border-violet-500/40 shadow-sm'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white border-white/[0.08] hover:border-violet-500/30'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Remix Hook A</span>
          </button>

          <button
            onClick={() => handleGenerateAiRemix('B')}
            disabled={loadingAi}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeRemixSource === 'B' && aiVariants.length > 0
                ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500/40 shadow-sm'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white border-white/[0.08] hover:border-cyan-500/30'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Remix Hook B</span>
          </button>
        </div>
      </div>

      {/* Dynamic AI Generated Rewrites from Backend /api/remix */}
      {loadingAi ? (
        <div className="py-8 text-center space-y-2 text-zinc-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-violet-400" />
          <p>Generating psycholinguistic rewrite variants for Hook {activeRemixSource}...</p>
        </div>
      ) : aiVariants.length > 0 ? (
        <div className="space-y-3 p-4 rounded-xl bg-violet-950/20 border border-violet-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-violet-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Dynamic NLP Rewrites for Hook {activeRemixSource} ({aiVariants.length} variants):
            </span>
            <button
              onClick={() => setAiVariants([])}
              className="text-[11px] text-zinc-400 hover:text-white underline"
            >
              Close AI variants
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {aiVariants.map((v, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/50 border border-white/10 hover:border-violet-500/40 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-violet-300 font-mono text-[10px] uppercase">
                    {v.label}
                  </span>
                  <span className="text-[10px] text-zinc-400">{v.tip}</span>
                </div>
                <p className="text-zinc-100 font-medium leading-relaxed">"{v.text}"</p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleInjectAiVariant('A', v.text, idx)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 flex items-center gap-1"
                  >
                    {injectedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
                    <span>Use as Hook A</span>
                  </button>
                  <button
                    onClick={() => handleInjectAiVariant('B', v.text, idx)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
                  >
                    {injectedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
                    <span>Use as Hook B</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Static Viral Archetype Formulas (Topic-Calibrated) */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Topic-Calibrated Archetypes (Promise: "{cleanTopic}"):
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
    </div>
  );
}
