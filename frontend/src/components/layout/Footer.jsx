import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E202C] bg-[#0A0B10] mt-16 py-8 text-xs text-[#8E90A0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#EDEDEF]">HookStudio</span>
            <span>·</span>
            <span>Creator A/B Hook Lab & Engagement Predictor</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Cpu className="w-3 h-3" /> TF-IDF + Logistic Regression
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-violet-400">
              <ShieldCheck className="w-3 h-3" /> 8% Significance Guard
            </span>
          </div>
        </div>

        {/* Team Credits & Context */}
        <div className="pt-3 border-t border-[#181924] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#64748B]">
          <div>
            Built by Group M (Meenmoy, Rupak, Tanvir, Aditya, Samina) · CSE Assessment 2026
          </div>
          <div>
            Trained on 3,000 verified short-form video transcripts
          </div>
        </div>
      </div>
    </footer>
  );
}
