import React, { useState } from 'react';
import { Copy, Check, FileText, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function ExportBanner({ result, onOpenOutcome }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopyReport = () => {
    const { hook_a, hook_b, margin_guard, disclaimer } = result;

    const report = [
      `=== ViralHook Studio A/B Hook Battle Report ===`,
      `Date: ${new Date().toLocaleString()}`,
      `Verdict: ${margin_guard.summary}`,
      ``,
      `--- Hook Option A ---`,
      `Text: "${hook_a.text}"`,
      `Predicted Tier: ${hook_a.predictedClass || 'High'}`,
      `Viral Prob: ${(hook_a.probabilities.high * 100).toFixed(0)}% (Med: ${(hook_a.probabilities.medium * 100).toFixed(0)}%, Low: ${(hook_a.probabilities.low * 100).toFixed(0)}%)`,
      `Duration: ${hook_a.spokenTime.toFixed(1)}s (${hook_a.words} words)`,
      ``,
      `--- Hook Option B ---`,
      `Text: "${hook_b.text}"`,
      `Predicted Tier: ${hook_b.predictedClass || 'Low'}`,
      `Viral Prob: ${(hook_b.probabilities.high * 100).toFixed(0)}% (Med: ${(hook_b.probabilities.medium * 100).toFixed(0)}%, Low: ${(hook_b.probabilities.low * 100).toFixed(0)}%)`,
      `Duration: ${hook_b.spokenTime.toFixed(1)}s (${hook_b.words} words)`,
      ``,
      `Disclaimer: ${disclaimer || 'Result is an estimate based on historical patterns, not a guarantee of virality.'}`,
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-white tracking-tight">Creator Export & 48h Outcome Loop</h5>
          <p className="text-[11px] text-zinc-400">
            Copy diagnostics for your script or record real views after publishing.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenOutcome && (
          <button
            onClick={onOpenOutcome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Log 48h Outcome</span>
          </button>
        )}

        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] text-xs font-semibold transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
