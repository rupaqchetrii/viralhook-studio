import React from 'react';
import { X, Clock, Wand2, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

export function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen } = useHookStore();

  if (!onboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#13141C] border border-[#222432] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E202C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center text-[#A78BFA]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#EDEDEF] text-base">
              How HookStudio works
            </h3>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="text-[#8E90A0] hover:text-[#EDEDEF] transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-[#8E90A0]">
          <p className="leading-relaxed">
            Short-form platforms like TikTok, Reels, and Shorts decide whether to push your video based on whether viewers stay past the first 3 seconds. HookStudio helps you refine that opening before you record.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] space-y-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div className="font-semibold text-[#EDEDEF] text-xs">Pacing Check</div>
              <p className="text-[11px] leading-relaxed text-[#8E90A0]">
                Estimates spoken speed (~2.75 words/sec). Keeps you under the critical 3-second swipe threshold.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] space-y-1.5">
              <Wand2 className="w-4 h-4 text-[#A78BFA]" />
              <div className="font-semibold text-[#EDEDEF] text-xs">Filler Cleaner</div>
              <p className="text-[11px] leading-relaxed text-[#8E90A0]">
                Catches wasted intros like "Hey guys today I will..." and provides instant 1-click tighter rewrites.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] space-y-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <div className="font-semibold text-[#EDEDEF] text-xs">Honest Comparisons</div>
              <p className="text-[11px] leading-relaxed text-[#8E90A0]">
                Declares a statistical tie when differences are under 8%, rather than inventing fake winners.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#181924] border border-[#262838] text-xs text-[#EDEDEF] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Trained on 3,000 top short videos with sub-10ms local inference. Zero platform logins needed.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0E0F15] border-t border-[#1E202C] flex justify-end">
          <button
            onClick={() => setOnboardingOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#A78BFA] hover:bg-[#9065f7] text-[#0A0B10] font-bold text-xs transition-colors"
          >
            Got it, let's write
          </button>
        </div>
      </div>
    </div>
  );
}
