import React, { memo } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';

// Memoized editor component: Typing in Hook A does not re-render Hook B
export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
  tagline,
  value,
  onChange,
  onApplyFix,
  badgeVariant = 'accent',
  accentColor = '#EA4C89',
}) {
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const linterFlags = lintHook(value);

  return (
    <Card className="flex flex-col h-full border-[#E7E7E9] hover:border-[#0D0C22] shadow-[0_2px_12px_rgba(13,12,34,0.04)] hover:shadow-md transition-all">
      <CardHeader className="bg-[#F8F7F4]/60 border-b border-[#E7E7E9]">
        <div className="flex items-center gap-2.5">
          <Badge variant={badgeVariant} size="sm" className="font-bold">
            {label}
          </Badge>
          <span className="text-xs text-[#6E6D7A] font-medium hidden sm:inline">{tagline}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#6E6D7A]">
          <span>
            <strong className="text-[#0D0C22]">{wordCount}</strong> words
          </span>
          <span className="text-[#E7E7E9]">|</span>
          <span className={charCount > 280 ? 'text-rose-600 font-bold' : ''}>
            <strong className={charCount > 280 ? 'text-rose-600' : 'text-[#0D0C22]'}>
              {charCount}
            </strong>
            /280 chars
          </span>
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-4 p-6">
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={350}
            placeholder={`Enter ${label} (e.g. your opening 1-5 second hook line)...`}
            className="w-full bg-[#F8F7F4] hover:bg-white text-[#0D0C22] placeholder-[#9E9EA7] text-sm sm:text-base rounded-xl p-4 border border-[#E7E7E9] focus:bg-white focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none resize-none transition-all duration-150 leading-relaxed font-sans shadow-sm"
          />
        </div>

        {/* 3s Spoken Delivery Pace Barometer */}
        <PacingBarometer wordCount={wordCount} />

        {/* Real-time Phrase Linter Diagnostics */}
        <div className="pt-3 border-t border-[#E7E7E9]">
          <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
        </div>
      </CardBody>
    </Card>
  );
});
