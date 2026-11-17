import React from 'react';
import { Flame, History, HelpCircle } from 'lucide-react';
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
  } = useHookStore();

  return (
    <header className="border-b border-[#1E202C] bg-[#0A0B10]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A78BFA] to-[#6366F1] flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#0A0B10] fill-current" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#EDEDEF] tracking-tight">
              Hook<span className="text-[#A78BFA]">Studio</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-[#8E90A0] px-1.5 py-0.5 rounded bg-[#181924] border border-[#262838]">
              v1.0
            </span>
          </div>
        </div>

        {/* Center Controls: Platform & Niche */}
        <div className="hidden md:flex items-center gap-2">
          {/* Platform Segmented Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#14151F] border border-[#222432]">
            {[
              { id: 'tiktok', label: 'TikTok' },
              { id: 'reels', label: 'Reels' },
              { id: 'shorts', label: 'Shorts' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  platform === p.id
                    ? 'bg-[#A78BFA] text-[#0A0B10] font-bold shadow-sm'
                    : 'text-[#8E90A0] hover:text-[#EDEDEF]'
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
            className="bg-[#14151F] border border-[#222432] text-xs font-medium text-[#EDEDEF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#A78BFA]"
          >
            <option value="tech">💻 Tech & Coding</option>
            <option value="finance">📈 Finance & Business</option>
            <option value="fitness">🏋️ Fitness & Health</option>
            <option value="education">📚 How-To & Education</option>
            <option value="lifestyle">✨ Lifestyle / Story</option>
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="text-xs text-[#8E90A0] hover:text-[#EDEDEF] px-2.5 py-1.5 rounded-lg hover:bg-[#181924] transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How it works</span>
          </button>

          <button
            type="button"
            onClick={() => setHistoryDrawerOpen(true)}
            className="text-xs font-medium text-[#EDEDEF] bg-[#14151F] hover:bg-[#1E202C] border border-[#222432] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Saved hooks</span>
            {battleHistory.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#A78BFA] text-[#0A0B10] text-[10px] font-bold">
                {battleHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
