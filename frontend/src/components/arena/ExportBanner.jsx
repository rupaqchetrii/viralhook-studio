import React, { useState } from 'react';
import { Copy, Check, FileText, TrendingUp } from 'lucide-react';

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
    <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E7E9] flex items-center justify-center text-[#0D0C22] shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-[#0D0C22]">Creator Export & 48h Outcome Loop</h5>
          <p className="text-[11px] text-[#6E6D7A] mt-0.5">
            Copy diagnostics for your script or record real views after publishing.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenOutcome && (
          <button
            onClick={onOpenOutcome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Log 48h Outcome</span>
          </button>
        )}

        <button
          onClick={handleCopyReport}
          className="px-4 py-2 rounded-full text-xs font-bold bg-[#0D0C22] hover:bg-[#3D3D4E] text-white transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Report!</span>
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
