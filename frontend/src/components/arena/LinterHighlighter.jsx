import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function LinterHighlighter({ flags, onApplyFix }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
        <span className="font-medium">No filler flags detected. Clean, direct opening hook structure!</span>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-bold text-[#0D0C22] uppercase tracking-wider flex items-center gap-1.5">
        <Wand2 className="w-3.5 h-3.5 text-[#EA4C89]" />
        <span>Linter Diagnostics & Quick-Fixes ({flags.length})</span>
      </div>

      <div className="space-y-2">
        {flags.map((flag) => {
          const isRed = flag.severity === 'red';
          const isYellow = flag.severity === 'yellow';

          return (
            <div
              key={flag.id}
              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
                isRed
                  ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                  : isYellow
                  ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isRed ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : isYellow ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>{flag.tag}</span>
                    <span
                      className={`text-[10px] uppercase px-2 py-0.2 rounded-full font-bold ${
                        isRed
                          ? 'bg-rose-200 text-rose-800'
                          : isYellow
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{flag.message}</div>
                </div>
              </div>

              {flag.fix && onApplyFix && (
                <button
                  type="button"
                  onClick={() => onApplyFix(flag.id)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] shrink-0 self-end sm:self-center transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3 text-[#EA4C89]" />
                  <span>Fix phrase</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
