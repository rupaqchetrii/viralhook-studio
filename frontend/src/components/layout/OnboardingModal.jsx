import React from 'react';
import { X, Clock, Wand2, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useHookStore } from '../../store/useHookStore';

export function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen } = useHookStore();

  if (!onboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C22]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E7E7E9] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E7E9] flex items-center justify-between bg-[#F8F7F4]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F7] border border-[#EA4C89]/30 flex items-center justify-center text-[#EA4C89]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0D0C22] text-base">
              Welcome to ViralHook Studio
            </h3>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F3F3F6] flex items-center justify-center text-[#6E6D7A] hover:text-[#0D0C22] transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-[#6E6D7A]">
          <p className="leading-relaxed">
            ViralHook Studio is a pre-production creator intelligence lab designed to test and optimize your opening 1–5 seconds before recording.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div className="font-bold text-[#0D0C22] text-xs">1. Spoken Pace Barometer</div>
              <p className="text-[11px] leading-relaxed">
                Calculates spoken time at conversational tempo (2.75 wps). Green zone is ≤3.0 seconds to beat the viewer swipe cliff.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-2">
              <Wand2 className="w-5 h-5 text-[#EA4C89]" />
              <div className="font-bold text-[#0D0C22] text-xs">2. Smart Phrase Linter</div>
              <p className="text-[11px] leading-relaxed">
                Flags weak filler intros ("In this video I will show you") and offers one-click drop-in replacements like "Here is how to".
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] space-y-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <div className="font-bold text-[#0D0C22] text-xs">3. Honest Margin Guard</div>
              <p className="text-[11px] leading-relaxed">
                Enforces honest tie-detection (ΔP &lt; 0.08) rather than displaying deceptive coin-flip winners.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All predictions run locally on CPU with sub-50ms latency. No video passwords or credentials requested.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E7E7E9] bg-[#F8F7F4]/50 flex justify-end">
          <button
            onClick={() => setOnboardingOpen(false)}
            className="px-5 py-2.5 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Ready to Battle
          </button>
        </div>
      </div>
    </div>
  );
}
