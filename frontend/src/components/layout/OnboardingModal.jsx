import React from 'react';
import { X, Clock, Wand2, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useHookStore } from '../../store/useHookStore';

export function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen } = useHookStore();

  if (!onboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#202238] border border-[#2e3152] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2e3152] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/20 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#F1F5F9] text-base">
              Welcome to ViralHook Studio
            </h3>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-[#94A3B8]">
          <p>
            ViralHook Studio is a pre-production creator intelligence lab designed to test and optimize your opening 1–5 seconds before recording.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#11121B] border border-[#2e3152] space-y-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div className="font-bold text-[#F1F5F9] text-xs">1. Spoken Pace Barometer</div>
              <p className="text-[11px] leading-relaxed">
                Calculates spoken time at conversational tempo (2.75 wps). Green zone is ≤3.0 seconds to beat the viewer swipe cliff.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#11121B] border border-[#2e3152] space-y-2">
              <Wand2 className="w-5 h-5 text-[#A78BFA]" />
              <div className="font-bold text-[#F1F5F9] text-xs">2. Smart Phrase Linter</div>
              <p className="text-[11px] leading-relaxed">
                Flags weak filler intros ("In this video I will show you") and offers one-click drop-in replacements like "Here is how to".
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#11121B] border border-[#2e3152] space-y-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-[#F1F5F9] text-xs">3. Honest Margin Guard</div>
              <p className="text-[11px] leading-relaxed">
                Enforces honest tie-detection (ΔP &lt; 0.08) rather than displaying deceptive coin-flip winners.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#A78BFA] text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              All predictions run locally on CPU with sub-50ms latency. No video passwords or credentials requested.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#191a2c] border-t border-[#2e3152] flex justify-end">
          <Button size="md" onClick={() => setOnboardingOpen(false)}>
            Ready to Battle
          </Button>
        </div>
      </div>
    </div>
  );
}
