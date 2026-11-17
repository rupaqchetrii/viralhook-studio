import React, { memo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';

export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
  tagline,
  value,
  onChange,
  onApplyFix,
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
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const charPercent = Math.min(100, Math.round((charCount / 280) * 100));
  const isNearLimit = charCount >= 240;
  const isAtLimit = charCount >= 280;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#13141C] border border-[#222432] hover:border-[#2D3042] transition-colors p-4 sm:p-5 space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#EDEDEF] px-2.5 py-1 rounded-lg bg-[#202230] border border-[#2e3144]">
            {label}
          </span>
          <span className="text-xs text-[#8E90A0] hidden sm:inline">{tagline}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="text-xs text-[#8E90A0] hover:text-[#EDEDEF] transition-colors px-2 py-1 rounded-md hover:bg-[#1E202C] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 font-mono"
            title="Copy opening line"
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

          <span className="text-[#3A3D50]">·</span>

          <span className="text-[#8E90A0] font-mono text-[11px]">
            <strong className="text-[#EDEDEF]">{wordCount}</strong> words
          </span>

          <span className="text-[#3A3D50]">·</span>

          <span className={`font-mono text-[11px] ${isAtLimit ? 'text-rose-400 font-bold' : isNearLimit ? 'text-amber-400' : 'text-[#8E90A0]'}`}>
            {charCount}/280
          </span>
        </div>
      </div>

      {/* Input Textarea */}
      <div className="space-y-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder={`Write ${label.toLowerCase()}... e.g. "Stop scrolling if you want to fix your code"`}
          className="w-full bg-[#0B0C10] text-[#EDEDEF] placeholder-[#55586D] text-sm sm:text-base rounded-xl p-4 border border-[#1E202C] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]/30 focus:outline-none resize-none transition-all leading-relaxed font-sans"
        />

        {/* Subtle character progress bar */}
        <div className="w-full h-1 bg-[#181924] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              isAtLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-400' : 'bg-[#A78BFA]'
            }`}
            style={{ width: `${charPercent}%` }}
          />
        </div>
      </div>

      {/* Pacing Speed Indicator */}
      <PacingBarometer wordCount={wordCount} />

      {/* Writing suggestions */}
      <div className="pt-2 border-t border-[#1C1D28]">
        <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
      </div>
    </div>
  );
});
