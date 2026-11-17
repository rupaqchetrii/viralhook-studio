import React, { memo } from 'react';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';
import { Sparkles, Type } from 'lucide-react';

export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
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

  const isHookA = label.includes('A');

  return (
    <div
      className={`glass-panel rounded-2xl p-5 sm:p-6 flex flex-col h-full border transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-violet-950/20 ${
        isHookA
          ? 'focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20'
          : 'focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-wide ${
              isHookA
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {label}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">{tagline}</span>
        </div>

        {/* Word and Char count badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
            <strong className="text-white font-bold">{wordCount}</strong> words
          </span>
          <span
            className={`px-2 py-0.5 rounded-md border text-[11px] ${
              charCount > 280
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold'
                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
            }`}
          >
            {charCount}/280
          </span>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Sleek Text Area */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={350}
            placeholder={`Enter ${label} (e.g. your opening 1-5 second hook line)...`}
            className="w-full bg-black/30 text-white placeholder-zinc-500 text-sm sm:text-base rounded-xl p-4 border border-white/[0.08] focus:border-white/30 focus:outline-none resize-none transition-all duration-200 leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* 3s Spoken Delivery Pace Barometer */}
        <PacingBarometer wordCount={wordCount} />

        {/* Real-time Phrase Linter Diagnostics */}
        <div className="pt-2 border-t border-white/[0.06]">
          <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
        </div>
      </div>
    </div>
  );
});
