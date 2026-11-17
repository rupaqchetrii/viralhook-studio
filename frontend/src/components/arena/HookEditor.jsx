import React, { memo } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';

// Memoized editor component: Typing in Hook A does not re-render Hook B
export const HookEditor = memo(function HookEditor({
  label, // 'Hook A' | 'Hook B'
  tagline,
  value,
  onChange,
  onApplyFix,
  badgeVariant = 'accent',
  accentColor = '#A78BFA',
}) {
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const linterFlags = lintHook(value);

  return (
    <Card className="flex flex-col h-full border-[#2e3152] hover:border-[#A78BFA]/30 transition-all">
      <CardHeader className="bg-[#191a2c]/60">
        <div className="flex items-center gap-2.5">
          <Badge variant={badgeVariant} size="sm" className="font-bold">
            {label}
          </Badge>
          <span className="text-xs text-[#94A3B8] hidden sm:inline">{tagline}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
          <span>
            <strong className="text-[#F1F5F9]">{wordCount}</strong> words
          </span>
          <span className="text-[#64748B]">|</span>
          <span className={charCount > 280 ? 'text-rose-400 font-bold' : ''}>
            <strong className={charCount > 280 ? 'text-rose-400' : 'text-[#F1F5F9]'}>
              {charCount}
            </strong>
            /280 chars
          </span>
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-4">
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={350}
            placeholder={`Enter ${label} (e.g. your opening 1-5 second hook line)...`}
            className="w-full bg-[#11121B] text-[#F1F5F9] placeholder-[#64748B] text-sm sm:text-base rounded-xl p-4 border border-[#2e3152] focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 focus:outline-none resize-none transition-all duration-150 leading-relaxed font-sans"
          />
        </div>

        {/* 3s Spoken Delivery Pace Barometer */}
        <PacingBarometer wordCount={wordCount} />

        {/* Real-time Phrase Linter Diagnostics */}
        <div className="pt-2 border-t border-[#2e3152]/60">
          <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
        </div>
      </CardBody>
    </Card>
  );
});
