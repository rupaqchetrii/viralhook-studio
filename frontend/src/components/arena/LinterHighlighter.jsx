import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Wand2, CheckCircle2, TrendingUp } from 'lucide-react';

export function LinterHighlighter({ flags, onApplyFix }) {

  // ── Clean state: show score cards instead of a simple banner ──
  if (!flags || flags.length === 0) {
    return (
      <div className="rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6E6D7A]">
            Phrase Linter
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            All Clear
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Issues',    value: '0',   icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Strength',  value: '100', icon: TrendingUp,   color: 'text-emerald-600' },
            { label: 'Score',     value: 'A+',  icon: Sparkles,     color: 'text-[#EA4C89]'   },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E7E7E9] rounded-xl p-3 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <div className={`text-sm font-black font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-[#9E9EA7] font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span className="font-semibold">No weak phrases detected — clean, direct hook structure.</span>
        </div>
      </div>
    );
  }

  // ── Flags state: show professional diagnostic cards ──
  return (
    <div className="rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] p-4 space-y-3">

      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-[#EA4C89]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6E6D7A]">
            Phrase Linter
          </span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
          {flags.length} issue{flags.length > 1 ? 's' : ''} found
        </span>
      </div>

      {/* Score bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-[#6E6D7A]">
          <span>Hook Strength</span>
          <span className={flags.length >= 3 ? 'text-rose-600' : flags.length >= 2 ? 'text-amber-500' : 'text-amber-500'}>
            {Math.max(10, 100 - flags.length * 25)}%
          </span>
        </div>
        <div className="h-2 w-full bg-[#E7E7E9] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              flags.length >= 3 ? 'bg-rose-500' : flags.length >= 2 ? 'bg-amber-400' : 'bg-amber-400'
            }`}
            style={{ width: `${Math.max(10, 100 - flags.length * 25)}%` }}
          />
        </div>
      </div>

      {/* Flag cards */}
      <div className="space-y-2">
        {flags.map((flag) => {
          const isRed    = flag.severity === 'red';
          const isYellow = flag.severity === 'yellow';
          return (
            <div
              key={flag.id}
              className={`rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                isRed
                  ? 'bg-rose-50 border-rose-200'
                  : isYellow
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isRed ? (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                ) : isYellow ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`font-black flex items-center gap-2 ${isRed ? 'text-rose-800' : isYellow ? 'text-amber-800' : 'text-emerald-800'}`}>
                    <span>{flag.tag}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-black ${
                      isRed ? 'bg-rose-200 text-rose-800' : isYellow ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 leading-relaxed ${isRed ? 'text-rose-700' : isYellow ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {flag.message}
                  </div>
                </div>
              </div>

              {flag.fix && onApplyFix && (
                <button
                  type="button"
                  onClick={() => onApplyFix(flag.id)}
                  className="shrink-0 self-end sm:self-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-white border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3 text-[#EA4C89]" />
                  Quick Fix
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
