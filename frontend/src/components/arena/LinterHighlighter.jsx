import React from 'react';
import { AlertCircle, AlertTriangle, Check, Wand2 } from 'lucide-react';

export function LinterHighlighter({ flags, onApplyFix }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs">
        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
        <span className="text-[11px]">No filler words found · Direct and ready to film</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium text-[#94A3B8] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Suggestions ({flags.length})</span>
        </span>
        <span className="text-[10px] text-[#64748B]">Click fix to auto-apply</span>
      </div>

      <div className="space-y-1.5">
        {flags.map((flag) => {
          const isRed = flag.severity === 'red';

          return (
            <div
              key={flag.id}
              className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                isRed
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {isRed ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-xs text-[#F1F5F9]">
                    {flag.tag}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5">{flag.message}</div>
                </div>
              </div>

              {flag.canAutoFix && onApplyFix && (
                <button
                  type="button"
                  onClick={() => onApplyFix(flag.id)}
                  className="shrink-0 self-end sm:self-center px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1 border border-white/10 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Fix to "{flag.suggestion}"</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
