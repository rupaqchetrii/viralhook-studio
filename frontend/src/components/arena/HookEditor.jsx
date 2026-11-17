import React, { memo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';

/**
 * HookEditor - A/B Input Editor Component
 * Implementation Owner: Meenmoy (Frontend Lead)
 * Complies with FR-01: Two independent text inputs with character counters (max 280 chars).
 * Typing in Hook A does not re-render or clear Hook B (memoized React architecture).
 */
export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
  tagline,
  value,
  onChange,
  onApplyFix,
  badgeVariant = 'accent',
}) {
  const [copied, setCopied] = useState(false);
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const linterFlags = lintHook(value);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const charPercent = Math.min(100, Math.round((charCount / 280) * 100));
  const isNearLimit = charCount >= 250;
  const isAtLimit = charCount >= 280;

  return (
    <Card className="flex flex-col h-full border-[#2e3152] hover:border-[#A78BFA]/30 transition-all shadow-lg">
      <CardHeader className="bg-[#191a2c]/60 py-3 px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Badge variant={badgeVariant} size="sm" className="font-bold tracking-wide">
            {label}
          </Badge>
          <span className="text-xs text-[#94A3B8] hidden sm:inline">{tagline}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Copy Action */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            title="Copy hook to clipboard"
            className="text-xs text-[#94A3B8] hover:text-[#A78BFA] transition-colors p-1 rounded-md hover:bg-[#202238] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 font-mono"
            aria-label="Copy hook"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <span className="text-[#64748B]">|</span>

          {/* Character & Word Diagnostics (FR-01) */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <span>
              <strong className="text-[#F1F5F9]">{wordCount}</strong> words
            </span>
            <span className="text-[#64748B]">·</span>
            <span className={isAtLimit ? 'text-rose-400 font-bold' : isNearLimit ? 'text-amber-400' : ''}>
              <strong className={isAtLimit ? 'text-rose-400' : isNearLimit ? 'text-amber-400' : 'text-[#F1F5F9]'}>
                {charCount}
              </strong>
              /280 chars
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-4 p-4 sm:p-5">
        {/* Text Area (FR-01) */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={280}
            placeholder={`Enter ${label} (e.g. your opening 1-5 second hook line)...`}
            className="w-full bg-[#11121B] text-[#F1F5F9] placeholder-[#64748B] text-sm sm:text-base rounded-xl p-4 border border-[#2e3152] focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 focus:outline-none resize-none transition-all duration-150 leading-relaxed font-sans"
            aria-label={label}
          />

          {/* Character Usage Mini-Bar */}
          <div className="w-full h-1 bg-[#202238] rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                isAtLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-400' : 'bg-[#A78BFA]'
              }`}
              style={{ width: `${charPercent}%` }}
            />
          </div>
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
