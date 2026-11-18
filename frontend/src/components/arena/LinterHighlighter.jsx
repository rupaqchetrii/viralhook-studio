import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Wand2, Check } from 'lucide-react';

export function LinterHighlighter({ flags, onApplyFix }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-300 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Pacing & phrasing are clean. Zero filler clichés detected.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <Wand2 className="w-3 h-3 text-violet-400" />
        <span>Linter Suggestions ({flags.length})</span>
      </div>

      <div className="space-y-2">
        {flags.map((flag) => {
          const isRed = flag.severity === 'red';
          const isYellow = flag.severity === 'yellow';

          return (
            <div
              key={flag.id}
              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all backdrop-blur-md ${
                isRed
                  ? 'bg-rose-950/25 border-rose-500/25 text-rose-200'
                  : isYellow
                  ? 'bg-amber-950/25 border-amber-500/25 text-amber-200'
                  : 'bg-emerald-950/25 border-emerald-500/25 text-emerald-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isRed ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : isYellow ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold flex items-center gap-2 text-[#F8FAFC]">
                    <span>{flag.tag}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold font-mono tracking-wide ${
                        isRed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isYellow
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{flag.message}</div>
                </div>
              </div>

              {flag.canAutoFix && onApplyFix && (
                <button
                  onClick={() => onApplyFix(flag.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-200 border border-violet-500/30 hover:border-violet-500/60 font-semibold text-[11px] transition-all shadow-sm group"
                >
                  <Wand2 className="w-3 h-3 text-violet-400 group-hover:rotate-12 transition-transform" />
                  <span>Fix: "{flag.suggestion}"</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
