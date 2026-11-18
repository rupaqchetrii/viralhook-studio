/**
 * ViralHook Studio - Zustand Global State Store
 * Manages Hook A/B inputs, live character/word diagnostics, comparison results,
 * statistical tie-detection, and local history persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { compareHooksAPI } from '../services/api';
import { lintHook } from '../utils/linterRules';

export const useHookStore = create(
  persist(
    (set, get) => ({
      // Current active inputs
      hookA: 'In this video I will show you 3 coding mistakes you are making right now',
      hookB: 'Stop making these 3 coding mistakes if you actually want to get hired in 2026',
      topic: 'Software engineering tips and junior developer common mistakes',
      platform: 'tiktok', // 'tiktok' | 'reels' | 'shorts'
      niche: 'tech',      // 'tech' | 'finance' | 'fitness' | 'education' | 'lifestyle'

      // Application UI states
      isComparing: false,
      comparisonResult: null,
      error: null,
      historyDrawerOpen: false,
      onboardingOpen: false,
      settingsPanelOpen: false,

      // Theme & user preferences
      theme: 'light',       // 'light' | 'dark'
      fontSize: 'medium',   // 'small' | 'medium' | 'large'
      userName: 'Creator',
      userEmail: 'creator@viralhook.studio',
      isLoggedIn: false,

      // Persisted Battle Library History
      battleHistory: [],

      // Actions
      setHookA: (text) => set({ hookA: text, error: null }),
      setHookB: (text) => set({ hookB: text, error: null }),
      setTopic: (text) => set({ topic: text }),
      setPlatform: (platform) => set({ platform }),
      setNiche: (niche) => set({ niche }),
      setHistoryDrawerOpen: (open) => set({ historyDrawerOpen: open }),
      setOnboardingOpen: (open) => set({ onboardingOpen: open }),
      setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setUserName: (userName) => set({ userName }),
      setUserEmail: (userEmail) => set({ userEmail }),
      logout: () => set({
        isLoggedIn: false,
        comparisonResult: null,
        settingsPanelOpen: false,
        hookA: '',
        hookB: '',
        topic: '',
      }),
      loginBack: () => set({ isLoggedIn: true }),
      showLoginPage: () => set({ isLoggedIn: false }),

      // Swap Hook A and Hook B
      swapHooks: () => {
        const { hookA, hookB } = get();
        set({ hookA: hookB, hookB: hookA });
      },

      // Apply a drop-in quick-fix from the linter
      applyQuickFix: (hookKey, ruleId) => {
        const currentText = hookKey === 'A' ? get().hookA : get().hookB;
        const flags = lintHook(currentText);
        const match = flags.find((f) => f.id === ruleId);

        if (match && match.applyFix) {
          const updatedText = match.applyFix(currentText);
          if (hookKey === 'A') {
            set({ hookA: updatedText });
          } else {
            set({ hookB: updatedText });
          }
        }
      },

      // Execute A/B Battle Comparison
      runComparison: async () => {
        const { hookA, hookB, topic, platform, niche } = get();

        // Validation: reject empty or whitespace inputs
        if (!hookA.trim() || !hookB.trim()) {
          set({ error: 'Please enter valid text for both Hook A and Hook B before starting the battle.' });
          return;
        }

        // Validation: max 280 characters
        if (hookA.length > 280 || hookB.length > 280) {
          set({ error: 'Hooks must be within 280 characters for optimal 1-5 second delivery.' });
          return;
        }

        set({ isComparing: true, error: null });

        try {
          const result = await compareHooksAPI({
            hookA,
            hookB,
            topic,
            platform,
            niche,
          });

          set({ comparisonResult: result, isComparing: false });

          // Automatically record into recent battle history
          get().saveCurrentBattle(result);
        } catch (err) {
          set({
            error: 'Failed to analyze hooks: ' + (err.message || 'Unknown error'),
            isComparing: false,
          });
        }
      },

      // Save battle result to history
      saveCurrentBattle: (explicitResult = null) => {
        const result = explicitResult || get().comparisonResult;
        if (!result) return;

        const { hookA, hookB, platform, niche, battleHistory } = get();

        const newEntry = {
          id: 'battle_' + Date.now(),
          timestamp: new Date().toISOString(),
          platform,
          niche,
          hookA,
          hookB,
          winner: result.margin_guard.winner,
          deltaP: result.margin_guard.delta_p,
          isDeadHeat: result.margin_guard.is_dead_heat,
          pHighA: result.hook_a.probabilities.high,
          pHighB: result.hook_b.probabilities.high,
          fnvmA: result.hook_a.fnvmScore,
          fnvmB: result.hook_b.fnvmScore,
        };

        // Keep last 30 saved battles
        set({ battleHistory: [newEntry, ...battleHistory.slice(0, 29)] });
      },

      // Restore past battle into active workspace
      restoreBattle: (entry) => {
        set({
          hookA: entry.hookA,
          hookB: entry.hookB,
          platform: entry.platform || 'tiktok',
          niche: entry.niche || 'tech',
          historyDrawerOpen: false,
        });
        get().runComparison();
      },

      // Delete history item
      deleteHistoryItem: (id) => {
        const { battleHistory } = get();
        set({ battleHistory: battleHistory.filter((item) => item.id !== id) });
      },

      // Clear all history
      clearAllHistory: () => {
        set({ battleHistory: [] });
      },
    }),
    {
      name: 'viralhook_studio_storage',
      partialize: (state) => ({
        battleHistory: state.battleHistory,
        platform: state.platform,
        niche: state.niche,
        theme: state.theme,
        fontSize: state.fontSize,
        userName: state.userName,
        userEmail: state.userEmail,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
