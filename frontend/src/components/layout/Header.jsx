import React, { useState, useEffect } from 'react';
import {
  Flame,
  History,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  BarChart3,
  Settings,
  Share2,
} from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';
import { checkBackendHealth } from '../../services/api';

export function Header({ onOpenAnalytics, onOpenOAuth }) {
  const {
    platform,
    setPlatform,
    niche,
    setNiche,
    battleHistory,
    setHistoryDrawerOpen,
    setOnboardingOpen,
    swapHooks,
    setSettingsPanelOpen,
    theme,
    userName,
    isLoggedIn,
    logout,
  } = useHookStore();

  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHealthStatus(res);
    });
  }, []);

  const isModelLive = healthStatus?.status === 'healthy';
  const isTrained = healthStatus?.inference_mode === 'trained_model';

  return (
    <header className="border-b border-[#E7E7E9] bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo (ViralHook Studio) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D0C22] flex items-center justify-center text-white shadow-sm hover:bg-[#EA4C89] transition-colors">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-[#0D0C22] tracking-tight flex items-center">
                viralhook
                <span className="inline-block w-2 h-2 rounded-full bg-[#EA4C89] ml-1"></span>
              </span>
              <span className="text-[11px] font-bold text-[#6E6D7A] tracking-wider uppercase bg-[#F8F7F4] border border-[#E7E7E9] px-2 py-0.5 rounded-md">
                Studio
              </span>
              {healthStatus && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    isModelLive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isModelLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  {isTrained ? 'Dual-Tower ML' : isModelLive ? 'Gateway Live' : 'Offline'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6E6D7A] hidden sm:block font-medium">
              Creator A/B Hook Lab & Virality Predictor
            </p>
          </div>
        </div>

        {/* Center Controls: Platform & Niche Selection (Dribbble Pill Style) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Platform Segmented Switcher */}
          <div className="flex items-center p-1 rounded-full bg-[#F3F3F6] border border-[#E7E7E9]">
            {[
              { id: 'tiktok', label: 'TikTok' },
              { id: 'reels', label: 'IG Reels' },
              { id: 'shorts', label: 'Shorts' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  platform === p.id
                    ? 'bg-white text-[#0D0C22] shadow-sm font-bold'
                    : 'text-[#6E6D7A] hover:text-[#0D0C22]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Niche Selector Chip */}
          <div className="relative flex items-center">
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-[#F8F7F4] border border-[#E7E7E9] hover:border-[#0D0C22] text-xs font-semibold text-[#0D0C22] rounded-full px-4 py-2 appearance-none pr-8 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="tech">💻 Tech & Coding</option>
              <option value="finance">📈 Finance & Business</option>
              <option value="fitness">🏋️ Fitness & Health</option>
              <option value="education">📚 How-To & Education</option>
              <option value="lifestyle">✨ Lifestyle / Story</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E6D7A] absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Swap button */}
          <button
            onClick={swapHooks}
            title="Swap Hook A and Hook B"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] text-xs font-semibold bg-white transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#6E6D7A]" />
            <span>Swap</span>
          </button>

          {/* Connected Social Channels */}
          {onOpenOAuth && (
            <button
              onClick={onOpenOAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-semibold transition-all shadow-sm active:scale-95"
              title="Connected Social Channels (TikTok & Instagram OAuth)"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Channels</span>
            </button>
          )}

          {/* Analytics Modal trigger */}
          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all shadow-sm active:scale-95"
              title="Channel Accuracy & Outcome Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          )}

          {/* History Drawer */}
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] text-xs font-semibold bg-white transition-all shadow-sm active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-[#6E6D7A]" />
            <span>History</span>
            {battleHistory?.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#EA4C89] text-white text-[10px] flex items-center justify-center font-bold">
                {battleHistory.length}
              </span>
            )}
          </button>

          {/* How Scoring Works */}
          <button
            onClick={() => setOnboardingOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How Scoring Works</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsPanelOpen(true)}
            className="w-9 h-9 rounded-full border border-[#E7E7E9] hover:border-[#0D0C22] bg-white hover:bg-[#F8F7F4] flex items-center justify-center text-[#6E6D7A] hover:text-[#0D0C22] transition-all shadow-sm active:scale-95 group relative"
            title="Settings"
          >
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* User Avatar / Login Action Button */}
          {isLoggedIn ? (
            <button
              onClick={() => setSettingsPanelOpen(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EA4C89] to-[#0D0C22] flex items-center justify-center text-white font-black text-sm shadow-sm hover:shadow-md hover:scale-105 transition-all active:scale-95 select-none"
              title={`${userName} — Settings`}
            >
              {(userName || 'C')[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
