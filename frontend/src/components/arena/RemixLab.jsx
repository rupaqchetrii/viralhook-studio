import React, { useState } from 'react';
import { Wand2, Sparkles, ArrowRight, RefreshCw, Cpu, Check, Lightbulb } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useHookStore } from '../../store/useHookStore';
import { fetchAIRemixes } from '../../services/api';

const REMIX_TEMPLATES = [
  {
    archetype: 'Curiosity Loop',
    badgeVariant: 'accent',
    template: 'Why {topic} is secretly failing (and the 1 fix nobody talks about)',
    description: 'Creates an open knowledge gap that compels viewers to stay for the payoff.',
  },
  {
    archetype: 'Loss Aversion / Negative Frame',
    badgeVariant: 'danger',
    template: 'Stop doing this with your {topic} right now or you will regret it',
    description: 'Triggers the psychological urge to avoid loss or wasted effort.',
  },
  {
    archetype: 'Specificity & Listicle Proof',
    badgeVariant: 'success',
    template: '3 simple {topic} habits that will save you 10 hours every week',
    description: 'Concrete numbers establish clear expectations and perceived value.',
  },
  {
    archetype: 'Direct Audience Challenge',
    badgeVariant: 'warning',
    template: 'You are probably making this major {topic} mistake without realizing it',
    description: 'Direct second-person address ("you") immediately grabs scroll attention.',
  },
];

export function RemixLab() {
  const { topic, hookA, hookB, setHookA, setHookB, runComparison } = useHookStore();

  const [aiVariants, setAiVariants] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeRemixSource, setActiveRemixSource] = useState(null);
  const [injectedIdx, setInjectedIdx] = useState(null);

  const cleanTopic = topic.trim() || 'content creation';

  const handleApplyTemplate = (targetHook, template) => {
    const text = template.replace(/{topic}/g, cleanTopic);
    if (targetHook === 'A') {
      setHookA(text);
    } else {
      setHookB(text);
    }
    if (runComparison) runComparison();
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
      // Fallback if backend offline
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
    if (runComparison) runComparison();
  };

  return (
    <Card className="border-[#E7E7E9] overflow-hidden">
      <CardHeader className="bg-[#F8F7F4]/60 border-b border-[#E7E7E9]">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#EA4C89]" />
          <h3 className="text-sm font-bold text-[#0D0C22]">
            Hook Remix Lab (AI & Archetypes)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateAiRemix('A')}
            disabled={loadingAi || !hookA.trim()}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white hover:bg-[#0D0C22] text-[#0D0C22] hover:text-white border border-[#E7E7E9] transition-all shadow-sm active:scale-95 flex items-center gap-1.5 disabled:opacity-40"
          >
            {loadingAi && activeRemixSource === 'A' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-[#EA4C89]" />
            ) : (
              <Sparkles className="w-3 h-3 text-[#EA4C89]" />
            )}
            <span>AI Remix Hook A</span>
          </button>
          <button
            onClick={() => handleGenerateAiRemix('B')}
            disabled={loadingAi || !hookB.trim()}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#FDF2F7] hover:bg-[#EA4C89] text-[#EA4C89] hover:text-white border border-[#EA4C89]/25 transition-all shadow-sm active:scale-95 flex items-center gap-1.5 disabled:opacity-40"
          >
            {loadingAi && activeRemixSource === 'B' ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            <span>AI Remix Hook B</span>
          </button>
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-6">
        {/* Dynamic AI Variants Section */}
        {aiVariants.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EA4C89]" />
                <h4 className="text-xs font-bold text-[#0D0C22]">
                  Live AI Hook Variations (Synthesized from Hook {activeRemixSource})
                </h4>
              </div>
              <button
                onClick={() => setAiVariants([])}
                className="text-[11px] text-[#6E6D7A] hover:text-[#0D0C22] underline"
              >
                Close AI variants
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiVariants.map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-[#E7E7E9] hover:border-[#EA4C89] transition-all space-y-2 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#EA4C89] font-mono text-[10px] uppercase">
                      {v.label}
                    </span>
                    <span className="text-[10px] text-[#6E6D7A]">{v.tip}</span>
                  </div>
                  <p className="text-[#0D0C22] font-medium leading-relaxed">"{v.text}"</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E7E7E9]">
                    <button
                      onClick={() => handleInjectAiVariant('A', v.text, idx)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-[#0D0C22] text-[#0D0C22] hover:text-white border border-[#E7E7E9] flex items-center gap-1 transition-all"
                    >
                      {injectedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <ArrowRight className="w-3 h-3" />}
                      <span>Use as Hook A</span>
                    </button>
                    <button
                      onClick={() => handleInjectAiVariant('B', v.text, idx)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FDF2F7] hover:bg-[#EA4C89] text-[#EA4C89] hover:text-white border border-[#EA4C89]/25 flex items-center gap-1 transition-all"
                    >
                      {injectedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <ArrowRight className="w-3 h-3" />}
                      <span>Use as Hook B</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Static Topic Archetypes */}
        <div>
          <div className="text-xs font-semibold text-[#6E6D7A] uppercase tracking-wider mb-4">
            Topic-Calibrated Archetypes (Promise: "{cleanTopic}"):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REMIX_TEMPLATES.map((item, idx) => {
              const previewText = item.template.replace(/{topic}/g, cleanTopic);

              return (
                <div
                  key={idx}
                  className="group p-5 rounded-2xl bg-[#F8F7F4] hover:bg-white border border-[#E7E7E9] hover:border-[#0D0C22] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={item.badgeVariant} size="xs">
                        {item.archetype}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-[#0D0C22] leading-snug mb-2 group-hover:text-[#EA4C89] transition-colors">
                      "{previewText}"
                    </p>
                    <p className="text-[11px] text-[#6E6D7A] leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E7E7E9] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleApplyTemplate('A', item.template)}
                      className="flex-1 py-1.5 px-2 rounded-full text-[11px] font-semibold bg-white hover:bg-[#0D0C22] text-[#0D0C22] hover:text-white border border-[#E7E7E9] transition-all shadow-sm active:scale-95 text-center"
                    >
                      + Hook A
                    </button>
                    <button
                      onClick={() => handleApplyTemplate('B', item.template)}
                      className="flex-1 py-1.5 px-2 rounded-full text-[11px] font-semibold bg-[#FDF2F7] hover:bg-[#EA4C89] text-[#EA4C89] hover:text-white border border-[#EA4C89]/25 transition-all shadow-sm active:scale-95 text-center"
                    >
                      + Hook B
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
