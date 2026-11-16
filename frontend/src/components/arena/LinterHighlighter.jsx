import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function LinterHighlighter({ flags, onApplyFix }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>No linter flags detected. Clean, direct hook structure.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
        <Wand2 className="w-3.5 h-3.5 text-[#A78BFA]" />
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
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  : isYellow
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
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
                  <div className="font-semibold flex items-center gap-2">
                    <span>{flag.tag}</span>
                    <span
                      className={`text-[10px] uppercase px-1.5 py-0.2 rounded font-bold ${
                        isRed
                          ? 'bg-rose-500/20 text-rose-300'
                          : isYellow
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5">{flag.message}</div>
                </div>
              </div>

              {flag.canAutoFix && onApplyFix && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplyFix(flag.id)}
                  className="shrink-0 border-current hover:bg-white/10"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Fix: "{flag.suggestion}"
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
