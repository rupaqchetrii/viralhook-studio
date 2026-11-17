import React from 'react';
import { Wand2, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
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
  };

  return (
    <Card className="border-[#2e3152]/80 bg-[#191a2c]/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#A78BFA]" />
          <h3 className="text-sm font-bold text-[#F1F5F9]">
            Hook Remix Lab (Day 3 Inspiration)
          </h3>
        </div>
        <span className="text-xs text-[#94A3B8]">
          One-click viral psychological archetype templates based on your topic
        </span>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REMIX_TEMPLATES.map((item, idx) => {
            const formatted = item.template.replace(/{topic}/g, cleanTopic);

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#2e3152] bg-[#11121B] hover:border-[#A78BFA]/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={item.badgeVariant} size="xs">
                      {item.archetype}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-[#F1F5F9] group-hover:text-[#A78BFA] transition-colors">
                    "{formatted}"
                  </p>
                  <p className="text-xs text-[#94A3B8]">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2e3152]/60">
                  <button
                    onClick={() => handleApplyTemplate('A', item.template)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#202238] hover:bg-[#A78BFA]/20 text-[#A78BFA] border border-[#2e3152] hover:border-[#A78BFA]/40 transition-all flex items-center gap-1"
                  >
                    <span>Use for Hook A</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleApplyTemplate('B', item.template)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#202238] hover:bg-[#C084FC]/20 text-[#C084FC] border border-[#2e3152] hover:border-[#C084FC]/40 transition-all flex items-center gap-1"
                  >
                    <span>Use for Hook B</span>
                    <ArrowRight className="w-3 h-3" />
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
