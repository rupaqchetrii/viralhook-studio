import React, { useState } from 'react';
import { Copy, Check, Share2, Download, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export function ExportBanner({ result }) {
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
    <div className="p-4 rounded-2xl bg-[#191a2c]/60 border border-[#2e3152] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center text-[#A78BFA]">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-[#F1F5F9]">Export Creator Diagnostic Report</h5>
          <p className="text-[11px] text-[#94A3B8]">
            Copy full side-by-side metrics, probabilities, and pacing notes for your script.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyReport}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span>Copy Full Report</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
