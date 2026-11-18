import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Presentation,
  FileCheck,
  PhoneCall,
  Sparkles,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// 5 Universal Attention Domains
const DOMAINS = [
  {
    id: 'resume',
    title: 'Resume & CV Summary',
    icon: FileText,
    badge: 'Career',
    color: '#3B82F6',
    windowSec: '6 Seconds',
    windowDesc: 'Recruiter Attention Window',
    formulaGoal: 'Stop the recruiter from skimming away. Lead with quantified metrics and direct impact.',
    badExample: 'Hardworking, results-driven software engineer seeking challenging opportunities in a fast-paced environment.',
    goodExample: 'Backend engineer who cut PostgreSQL query latency by 42% across 1.4M daily active users at scale.',
    rules: [
      { id: 'metrics', name: 'Quantified Metrics', desc: 'Contains numbers, percentages, or scale metrics (e.g., 42%, $1.2M, 50k users)' },
      { id: 'cliche', name: 'Anti-Cliché Filter', desc: 'Penalizes "hardworking", "passionate", "team player", "results-driven"' },
      { id: 'action', name: 'Strong Action Verb', desc: 'Starts with high-impact verbs (e.g., Engineered, Architected, Scaled)' },
    ],
    templates: [
      {
        title: 'Metric & Scale Opener',
        formula: '[Role] who [Action Verb] [Product/System] to achieve [X% / $Y] across [Scale].',
        example: 'Distributed systems engineer who scaled API throughput 3.4x while cutting AWS spend by $38k/mo.',
      },
      {
        title: 'Problem-Solver Hook',
        formula: 'Turned around [Failing Metric] by re-architecting [Core System] within [Timeframe].',
        example: 'Reduced customer churn from 8.2% to 2.1% in 90 days by redesigning real-time notifications.',
      },
      {
        title: 'Domain Authority Hook',
        formula: '[Years] specializing in [Niche] with [Flagship Accomplishment].',
        example: 'Fintech backend developer with 4 years deploying low-latency payment rails handling $120M+ volume.',
      },
    ],
  },
  {
    id: 'email',
    title: 'Cold Email & LinkedIn Outreach',
    icon: Mail,
    badge: 'Sales & Networking',
    color: '#8B5CF6',
    windowSec: '3 Seconds',
    windowDesc: 'Mobile Preview Window',
    formulaGoal: 'Win the subject line and first 12 preview words. Trigger curiosity without triggering spam filters.',
    badExample: 'Dear Sir/Madam, we provide high quality AI development services at affordable rates for you.',
    goodExample: 'Quick question about how your engineering team handles memory leaks in production?',
    rules: [
      { id: 'brevity', name: 'Mobile Preview Fit', desc: 'Under 50 characters so preview is not truncated on phones' },
      { id: 'spam', name: 'Anti-Spam Filter', desc: 'Detects and penalizes "Free", "Guarantee", "Urgent", ALL-CAPS' },
      { id: 'curiosity', name: 'Curiosity Loop', desc: 'Ends with a low-friction question or intriguing observation' },
    ],
    templates: [
      {
        title: 'Specific Observation Hook',
        formula: 'Noticed your team is using [Tool/Stack] — quick thought on [Specific Bottleneck]?',
        example: 'Noticed your team is hiring React 19 devs — quick question on your Vite migration roadmap?',
      },
      {
        title: 'Mutual Context Hook',
        formula: 'Saw your talk on [Topic] — had 1 contrarian perspective regarding [Subtopic].',
        example: 'Loved your talk at PyCon on async tasks — had 1 contrarian thought on Celery vs RQ.',
      },
      {
        title: 'Micro-Value Hook',
        formula: 'Made a 2-minute teardown of [Prospect Product/Page] — mind if I send the link?',
        example: 'Audited 3 UX friction points on your checkout page — mind if I drop the 2-minute video?',
      },
    ],
  },
  {
    id: 'pitch',
    title: 'Pitch Deck & Keynote',
    icon: Presentation,
    badge: 'Investors & Public',
    color: '#EA4C89',
    windowSec: '15 Seconds',
    windowDesc: 'Slide 1 Investor Decision',
    formulaGoal: 'Hook partners and angels before they open their phones. Present massive market tension.',
    badExample: 'Today we are excited to present our innovative mobile platform revolutionizing commerce.',
    goodExample: 'E-commerce brands lose $4.2B each year because 70% of shoppers abandon carts over 1 missing button.',
    rules: [
      { id: 'stakes', name: 'High Dollar Stakes', desc: 'Mentions large financial impact, market loss, or TAM' },
      { id: 'contrast', name: 'Contrarian Market Reality', desc: 'Juxtaposes what people think vs what data reveals' },
      { id: 'clarity', name: 'Jargon-Free Clarity', desc: 'Avoids empty buzzwords like "synergy", "disruptive", "paradigm"' },
    ],
    templates: [
      {
        title: 'The Bleeding Wound Hook',
        formula: '[Customer Profile] loses $[Amount] every year because [Hidden Industry Flaw].',
        example: 'SaaS companies lose $3.8B in pipeline every quarter because demo requests wait 4+ hours for a reply.',
      },
      {
        title: 'Contrarian Truth Hook',
        formula: 'Everyone in [Industry] believes [Common Dogma] — but [Hard Data Point] proves the opposite.',
        example: 'Every creator thinks virality is random luck — but 83% of drop-off occurs in the first 3.2 seconds.',
      },
      {
        title: 'The Inevitable Shift',
        formula: 'By [Year], [Old Approach] will be obsolete due to [Catalyst]. We built the replacement.',
        example: 'By 2027, manual cold outbound will yield 0.2% reply rates. We built agentic attention scoring.',
      },
    ],
  },
  {
    id: 'memo',
    title: 'Executive PDF / Board Memo',
    icon: FileCheck,
    badge: 'Leadership & Strategy',
    color: '#10B981',
    windowSec: '10 Seconds',
    windowDesc: 'C-Suite Scanning Threshold',
    formulaGoal: 'Bottom-Line-Up-Front (BLUF). State the strategic outcome or cost consequence in sentence 1.',
    badExample: 'The purpose of this memo is to evaluate various strategic options considered by management.',
    goodExample: 'Delaying our cloud database migration past Q3 will expose the organization to $340k in compliance penalties.',
    rules: [
      { id: 'bluf', name: 'BLUF (Bottom-Line-Up-Front)', desc: 'States outcome and decision required in the very first clause' },
      { id: 'risk', name: 'Quantified Risk/Upside', desc: 'Connects the statement directly to timeline or budget' },
      { id: 'concise', name: 'Zero Fluff', desc: 'Eliminates passive voice and introductory filler phrases' },
    ],
    templates: [
      {
        title: 'Strategic Warning BLUF',
        formula: 'Delaying [Decision] past [Date] will cost [Amount/Resource] due to [Risk].',
        example: 'Delaying multi-region database failover past June exposes the platform to $180k/hr downtime risks.',
      },
      {
        title: 'Decision Recommendation BLUF',
        formula: 'We recommend approving $[Budget] for [Initiative] to unlock $[Return] in [Timeframe].',
        example: 'We recommend allocating $45k for GPU inference caching to reduce monthly operational cost by 60%.',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Cold Call & Elevator Pitch',
    icon: PhoneCall,
    badge: 'Direct Sales',
    color: '#F59E0B',
    windowSec: '5 Seconds',
    windowDesc: 'Hang-Up Window',
    formulaGoal: 'Pattern interrupt. Disarm defensive barriers with an authentic, non-salesy opening line.',
    badExample: 'Hello sir, my name is John from ABC Corp and I am calling to offer you our premier services.',
    goodExample: 'Hey Sarah, I know you were not expecting my call — do you have 20 seconds to see if this is relevant to your pipeline?',
    rules: [
      { id: 'interrupt', name: 'Pattern Interrupt', desc: 'Breaks typical telemarketer scripts and disarms defenses' },
      { id: 'permission', name: 'Micro-Permission', desc: 'Asks for 15-20 seconds instead of pushing a pitch' },
      { id: 'relevance', name: 'Direct Audience Callout', desc: 'Addresses their exact title or current workflow' },
    ],
    templates: [
      {
        title: 'Upfront Honesty Opener',
        formula: 'Hey [Name], I know you are busy and were not expecting this — could I take 25 seconds to share why I reached out?',
        example: 'Hey Alex, I know you were not expecting my call — can I take 20 seconds to tell you why I called, and you tell me if it makes sense?',
      },
      {
        title: 'Peer Benchmark Opener',
        formula: 'Most [Job Titles] I talk to say [Pain Point] is taking up half their day. Is that true for you too?',
        example: 'Most engineering leads I talk to say PR reviews take 3+ days. Are you seeing that bottleneck as well?',
      },
    ],
  },
];

// Psycholinguistic Domain Evaluation Function
function scoreUniversalHook(text, domainId) {
  if (!text || !text.trim()) {
    return { score: 0, flags: [], metrics: { numbers: false, action: false, clean: true } };
  }

  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  let score = 50;
  const flags = [];

  const hasNumbers = /\d+|(\$|%)/.test(text);
  const startsWithAction = /^[A-Z][a-z]*(ed|ing|s)?\b/.test(text) && !/^(The|This|I|We|My|Our|Dear|Hello|Hi)\b/i.test(text);

  // Resume Scoring
  if (domainId === 'resume') {
    if (hasNumbers) {
      score += 24;
      flags.push({ label: 'Quantified Metrics', status: 'pass', text: 'Includes concrete numbers, data, or scale indicators.' });
    } else {
      score -= 18;
      flags.push({ label: 'Missing Metrics', status: 'warn', text: 'Add specific numbers, percentage gains, or scale (e.g. 40%, $10k).' });
    }

    if (/\b(hardworking|passionate|team player|results[- ]driven|detail[- ]oriented|go[- ]getter)\b/i.test(text)) {
      score -= 22;
      flags.push({ label: 'Cliché Detected', status: 'fail', text: 'Uses generic buzzwords that recruiters skim right past.' });
    } else {
      score += 12;
      flags.push({ label: 'Zero Clichés', status: 'pass', text: 'Free of empty recruiter buzzwords.' });
    }

    if (startsWithAction) {
      score += 14;
      flags.push({ label: 'Active Voice', status: 'pass', text: 'Starts with strong accomplishment action phrasing.' });
    }
  }

  // Cold Email Scoring
  else if (domainId === 'email') {
    if (chars <= 55) {
      score += 20;
      flags.push({ label: 'Mobile Preview Fit', status: 'pass', text: `Only ${chars} characters. Won't truncate on iPhone/Android.` });
    } else {
      score -= 15;
      flags.push({ label: 'Risk of Truncation', status: 'warn', text: `${chars} characters — might get cut off in mobile preview.` });
    }

    if (/\b(free|guarantee|urgent|congratulations|click here|winner|act now)\b/i.test(text) || text === text.toUpperCase() && text.length > 10) {
      score -= 30;
      flags.push({ label: 'Spam Trigger Alarm', status: 'fail', text: 'Contains trigger words likely to land in Spam or Promotions tab.' });
    } else {
      score += 15;
      flags.push({ label: 'High Deliverability', status: 'pass', text: 'Clean phrasing with low spam-filter probability.' });
    }

    if (/\?/.test(text)) {
      score += 15;
      flags.push({ label: 'Conversational Hook', status: 'pass', text: 'Ends with an engaging question loop.' });
    }
  }

  // Pitch Deck Scoring
  else if (domainId === 'pitch') {
    if (/\$|\b(billion|million|trillion|percent|%)\b/i.test(text)) {
      score += 25;
      flags.push({ label: 'Financial Stakes', status: 'pass', text: 'Presents a tangible dollar or market magnitude.' });
    } else {
      score -= 15;
      flags.push({ label: 'Low Stakes', status: 'warn', text: 'Introduce specific financial loss, cost, or market size.' });
    }

    if (/\b(because|while|reveals|despite|every|lost|abandon|burn)\b/i.test(text)) {
      score += 15;
      flags.push({ label: 'High Tension', status: 'pass', text: 'Creates conflict or urgency for investors.' });
    }
  }

  // Executive Memo
  else if (domainId === 'memo') {
    if (/^(Delaying|Approving|Failing|Allocating|Recommending|Cutting)\b/i.test(text)) {
      score += 25;
      flags.push({ label: 'BLUF Architecture', status: 'pass', text: 'Bottom-line-up-front. Direct consequence delivered in word 1.' });
    }

    if (hasNumbers) {
      score += 15;
      flags.push({ label: 'Cost/Timeline Clear', status: 'pass', text: 'Quantified business impact included.' });
    }
  }

  // Cold Call
  else {
    if (/\b(know you were not expecting|20 seconds|25 seconds|quick question|is that true for you)\b/i.test(text)) {
      score += 25;
      flags.push({ label: 'Pattern Interrupt', status: 'pass', text: 'Disarms telemarketer defensive reflexes immediately.' });
    }
    if (words <= 25) {
      score += 15;
      flags.push({ label: 'Crisp Cadence', status: 'pass', text: `Only ${words} words. Can be spoken in under 5 seconds.` });
    }
  }

  const finalScore = Math.max(8, Math.min(98, score));
  return {
    score: finalScore,
    flags,
    words,
    chars,
  };
}

export function UniversalHookLab() {
  const [activeDomainId, setActiveDomainId] = useState('resume');
  const activeDomain = DOMAINS.find((d) => d.id === activeDomainId) || DOMAINS[0];

  // Active inputs for Option A vs Option B
  const [hookA, setHookA] = useState(activeDomain.goodExample);
  const [hookB, setHookB] = useState(activeDomain.badExample);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Switch domain handler
  const handleDomainChange = (id) => {
    setActiveDomainId(id);
    const target = DOMAINS.find((d) => d.id === id);
    if (target) {
      setHookA(target.goodExample);
      setHookB(target.badExample);
    }
  };

  const scoreA = scoreUniversalHook(hookA, activeDomainId);
  const scoreB = scoreUniversalHook(hookB, activeDomainId);

  const delta = Math.abs(scoreA.score - scoreB.score);
  const winner = delta <= 6 ? 'TIE' : scoreA.score > scoreB.score ? 'HOOK_A' : 'HOOK_B';

  const copyTemplate = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const applyTemplateToA = (example) => {
    setHookA(example);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0D0C22] via-[#1A1A2E] to-[#0D0C22] text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA4C89]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-[#EA4C89] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Omni-Channel Attention Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Universal <span className="text-[#EA4C89]">Hook Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            The 6-second attention cliff applies to <strong>every</strong> human interaction. Whether it is a recruiter scanning 200 resumes, an investor opening Slide 1, or a prospect skimming an email preview, evaluate your opening sentence before you hit send.
          </p>
        </div>
      </div>

      {/* 5-Domain Horizontal Selector Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#6E6D7A] uppercase tracking-wider px-1">
          <span>Select Target Communication Channel</span>
          <span className="text-[#EA4C89]">{activeDomain.windowDesc}: {activeDomain.windowSec}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => handleDomainChange(domain.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 group relative overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-[#1A1A2E] border-[#EA4C89] shadow-md shadow-[#EA4C89]/10'
                    : 'bg-[#F8F7F4] dark:bg-white/5 border-[#E7E7E9] dark:border-white/10 hover:border-[#0D0C22] dark:hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive ? 'bg-[#EA4C89] text-white shadow-sm' : 'bg-white dark:bg-white/10 text-[#0D0C22] dark:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#EA4C89]/10 text-[#EA4C89]'
                        : 'bg-black/5 dark:bg-white/5 text-[#6E6D7A]'
                    }`}
                  >
                    {domain.windowSec}
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-xs text-[#0D0C22] dark:text-white line-clamp-1">
                    {domain.title}
                  </div>
                  <div className="text-[10px] text-[#6E6D7A] dark:text-zinc-400 mt-0.5">
                    {domain.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Context & Rules Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1A1A2E] border border-[#E7E7E9] dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#EA4C89]" />
            <span className="font-bold text-xs text-[#0D0C22] dark:text-white">Attention Optimization Target:</span>
          </div>
          <p className="text-xs text-[#6E6D7A] dark:text-zinc-300">
            {activeDomain.formulaGoal}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeDomain.rules.map((r) => (
            <div
              key={r.id}
              title={r.desc}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10 text-[#0D0C22] dark:text-white flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4C89]" />
              <span>{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Universal Battle Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Option A */}
        <Card className="flex flex-col border-[#E7E7E9] dark:border-white/10 shadow-sm">
          <CardHeader className="bg-[#F8F7F4]/60 dark:bg-white/5 border-b border-[#E7E7E9] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="dark" size="sm" className="font-bold">
                Hook Variant A
              </Badge>
              <span className="text-[11px] font-mono text-[#6E6D7A]">
                {scoreA.words} words &bull; {scoreA.chars} chars
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6E6D7A]">Attention Score:</span>
              <span className="font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {scoreA.score}%
              </span>
            </div>
          </CardHeader>
          <CardBody className="p-6 flex-1 flex flex-col gap-4">
            <textarea
              rows={4}
              value={hookA}
              onChange={(e) => setHookA(e.target.value)}
              placeholder="Enter your opening hook or draft sentence..."
              className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white rounded-xl p-4 border border-[#E7E7E9] dark:border-white/10 text-sm focus:border-[#EA4C89] focus:outline-none resize-none leading-relaxed font-sans"
            />

            {/* Diagnostic Signals */}
            <div className="space-y-2 pt-1 flex-1">
              <div className="text-[11px] font-bold text-[#6E6D7A] uppercase tracking-wide">
                Psycholinguistic Diagnostics
              </div>
              <div className="space-y-1.5">
                {scoreA.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-xs flex items-start gap-2 border ${
                      flag.status === 'pass'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30'
                        : flag.status === 'fail'
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/30'
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30'
                    }`}
                  >
                    {flag.status === 'pass' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block text-[11px]">{flag.label}</strong>
                      <span className="text-[11px] opacity-90">{flag.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Option B */}
        <Card className="flex flex-col border-[#E7E7E9] dark:border-white/10 shadow-sm">
          <CardHeader className="bg-[#F8F7F4]/60 dark:bg-white/5 border-b border-[#E7E7E9] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm" className="font-bold">
                Hook Variant B (Challenger)
              </Badge>
              <span className="text-[11px] font-mono text-[#6E6D7A]">
                {scoreB.words} words &bull; {scoreB.chars} chars
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6E6D7A]">Attention Score:</span>
              <span className="font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/40 text-[#EA4C89] border border-pink-200 dark:border-pink-800">
                {scoreB.score}%
              </span>
            </div>
          </CardHeader>
          <CardBody className="p-6 flex-1 flex flex-col gap-4">
            <textarea
              rows={4}
              value={hookB}
              onChange={(e) => setHookB(e.target.value)}
              placeholder="Enter comparison hook or alternate phrasing..."
              className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white rounded-xl p-4 border border-[#E7E7E9] dark:border-white/10 text-sm focus:border-[#EA4C89] focus:outline-none resize-none leading-relaxed font-sans"
            />

            {/* Diagnostic Signals */}
            <div className="space-y-2 pt-1 flex-1">
              <div className="text-[11px] font-bold text-[#6E6D7A] uppercase tracking-wide">
                Psycholinguistic Diagnostics
              </div>
              <div className="space-y-1.5">
                {scoreB.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-xs flex items-start gap-2 border ${
                      flag.status === 'pass'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30'
                        : flag.status === 'fail'
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/30'
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30'
                    }`}
                  >
                    {flag.status === 'pass' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block text-[11px]">{flag.label}</strong>
                      <span className="text-[11px] opacity-90">{flag.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Battle Verdict Bar */}
      <div
        className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          winner === 'TIE'
            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300'
            : winner === 'HOOK_A'
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300'
            : 'bg-pink-50 dark:bg-pink-950/20 border-[#EA4C89]/50'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
              winner === 'TIE' ? 'bg-amber-500' : winner === 'HOOK_A' ? 'bg-emerald-600' : 'bg-[#EA4C89]'
            }`}
          >
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#6E6D7A] dark:text-zinc-400">
              Universal Attention Verdict
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#0D0C22] dark:text-white">
              {winner === 'TIE'
                ? `Statistical Dead-Heat (Within ±${delta}% margin)`
                : winner === 'HOOK_A'
                ? `Variant A Outperforms Variant B by +${delta}% Attention Retention`
                : `Variant B Outperforms Variant A by +${delta}% Attention Retention`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-[#E7E7E9] dark:border-white/10 shadow-sm">
            <div className="text-xs font-mono font-black text-[#0D0C22] dark:text-white">{scoreA.score}% vs {scoreB.score}%</div>
            <div className="text-[10px] text-[#6E6D7A] font-bold">Raw Score</div>
          </div>
        </div>
      </div>

      {/* Curated Domain Templates & Formulas */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EA4C89]" />
            <h3 className="text-sm font-extrabold text-[#0D0C22] dark:text-white">
              Curated Formulas for {activeDomain.title}
            </h3>
          </div>
          <span className="text-xs text-[#6E6D7A]">Click to insert into Variant A</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeDomain.templates.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1A2E] border border-[#E7E7E9] dark:border-white/10 flex flex-col justify-between gap-4 shadow-sm hover:border-[#EA4C89] transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0D0C22] dark:text-white">
                    {tmpl.title}
                  </span>
                  <button
                    onClick={() => copyTemplate(tmpl.example, idx)}
                    title="Copy Example"
                    className="p-1.5 rounded-lg text-[#6E6D7A] hover:text-[#0D0C22] dark:hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-white/5 font-mono text-[11px] text-[#6E6D7A] dark:text-zinc-400 border border-[#E7E7E9] dark:border-white/10 leading-relaxed">
                  {tmpl.formula}
                </div>
                <p className="text-xs text-[#0D0C22] dark:text-zinc-200 leading-relaxed italic">
                  "{tmpl.example}"
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => applyTemplateToA(tmpl.example)}
                className="w-full text-xs font-bold justify-center hover:bg-[#EA4C89] hover:text-white hover:border-[#EA4C89]"
              >
                <span>Use as Hook A</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
