import React from 'react';
import { Flame, History, HelpCircle, Layers, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useHookStore } from '../../store/useHookStore';

export function Header() {
  const {
    platform,
    setPlatform,
    niche,
    setNiche,
    battleHistory,
    setHistoryDrawerOpen,
    setOnboardingOpen,
    swapHooks,
  } = useHookStore();

  return (
    <header className="border-b border-[#2e3152] bg-[#11121B]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#6366F1] flex items-center justify-center shadow-lg shadow-[#A78BFA]/20">
            <Flame className="w-5 h-5 text-[#11121B] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#F1F5F9] tracking-tight">
                ViralHook <span className="text-[#A78BFA]">Studio</span>
              </span>
              <Badge variant="accent" size="xs">
                v1.0 Lab
              </Badge>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden sm:block">
              Creator A/B Hook Lab & Virality Predictor
            </p>
          </div>
        </div>

        {/* Center Controls: Platform & Niche Selection */}
        <div className="hidden md:flex items-center gap-2">
          {/* Platform Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#202238] border border-[#2e3152]">
            {[
              { id: 'tiktok', label: 'TikTok' },
              { id: 'reels', label: 'IG Reels' },
              { id: 'shorts', label: 'Shorts' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  platform === p.id
                    ? 'bg-[#A78BFA] text-[#11121B] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Niche Selector */}
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="bg-[#202238] border border-[#2e3152] text-xs font-medium text-[#F1F5F9] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#A78BFA]"
          >
            <option value="tech">💻 Tech & Coding</option>
            <option value="finance">📈 Finance & Business</option>
            <option value="fitness">🏋️ Fitness & Health</option>
            <option value="education">📚 How-To & Education</option>
            <option value="lifestyle">✨ Lifestyle / Story</option>
          </select>
        </div>

        {/* Right Actions: Swap, Onboarding & History */}
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={swapHooks}
            title="Swap Hook A and Hook B"
            className="hidden sm:inline-flex"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Swap
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOnboardingOpen(true)}
            title="How it Works"
          >
            <HelpCircle className="w-4 h-4 text-[#94A3B8]" />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setHistoryDrawerOpen(true)}
            className="relative"
          >
            <History className="w-4 h-4 mr-1 text-[#A78BFA]" />
            <span>Library</span>
            {battleHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#A78BFA] text-[#11121B] text-[10px] font-bold">
                {battleHistory.length}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
