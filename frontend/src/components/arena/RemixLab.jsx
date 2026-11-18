import React from 'react';
import { Wand2, Sparkles, ArrowRight, RefreshCw, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useHookStore } from '../../store/useHookStore';

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
  const { topic, setHookA, setHookB, runComparison } = useHookStore();

  const cleanTopic = topic.trim() || 'content creation';

  const handleApplyTemplate = (targetHook, template) => {
    const text = template.replace(/{topic}/g, cleanTopic);
    if (targetHook === 'A') {
      setHookA(text);
    } else {
      setHookB(text);
    }
    runComparison();
  };

  return (
    <Card className="border-[#E7E7E9]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#EA4C89]" />
          <h3 className="text-sm font-bold text-[#0D0C22]">
            Hook Remix Lab (Inspiration Gallery)
          </h3>
        </div>
        <span className="text-xs text-[#6E6D7A] font-medium hidden sm:inline">
          One-click viral psychological archetype formulas calibrated to your topic
        </span>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </CardBody>
    </Card>
  );
}
