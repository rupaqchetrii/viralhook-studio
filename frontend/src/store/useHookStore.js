/**
 * ViralHook Studio - Zustand Global State Store
 * Manages Hook A/B inputs, live character/word diagnostics, comparison results,
 * statistical tie-detection, and local history persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  compareHooksAPI,
  saveComparisonToDatabase,
  fetchLibraryFromDatabase,
  deleteLibraryItemFromDatabase,
  recordPerformanceOutcome,
  fetchPerformanceHistory,
  saveBattleToDbAPI,
} from '../services/api';
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
      isLoggedIn: true,

      // Persisted Battle Library History
      battleHistory: [],
      databaseHistory: [],
      performanceRecords: [],
      isSyncingWithDb: false,

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

      // Save battle result to history (both LocalStorage and SQLite Backend API)
      saveCurrentBattle: (explicitResult = null) => {
        const result = explicitResult || get().comparisonResult;
        if (!result) return;

        const { hookA, hookB, platform, niche, topic, battleHistory } = get();

        const newEntry = {
          id: 'battle_' + Date.now(),
          timestamp: new Date().toISOString(),
          platform,
          niche,
          topic,
          hookA,
          hookB,
          winner: result.margin_guard.winner,
          deltaP: result.margin_guard.delta_p,
          isDeadHeat: result.margin_guard.is_dead_heat,
          pHighA: result.hook_a.probabilities.high,
          pHighB: result.hook_b.probabilities.high,
          classA: result.hook_a.predictedClass || (result.hook_a.probabilities.high >= 0.5 ? 'High' : 'Medium'),
          classB: result.hook_b.predictedClass || (result.hook_b.probabilities.high >= 0.5 ? 'High' : 'Medium'),
          fnvmA: result.hook_a.fnvmScore,
          fnvmB: result.hook_b.fnvmScore,
        };

        // Keep last 30 saved battles in client state
        set({ battleHistory: [newEntry, ...battleHistory.slice(0, 29)] });

        // Asynchronously persist to SQLite Backend
        saveComparisonToDatabase({
          hook_a: hookA,
          hook_b: hookB,
          verdict: result.margin_guard.winner === 'DEAD_HEAT' ? 'Dead-Heat' : result.margin_guard.winner === 'HOOK_A' ? 'Hook A Leads' : 'Hook B Leads',
          leading_hook: result.margin_guard.winner === 'DEAD_HEAT' ? null : (result.margin_guard.winner === 'HOOK_A' ? hookA : hookB),
          score_diff: result.margin_guard.delta_p,
          is_close: result.margin_guard.is_dead_heat,
          prob_high_a: result.hook_a.probabilities.high,
          prob_high_b: result.hook_b.probabilities.high,
          class_a: newEntry.classA,
          class_b: newEntry.classB,
          is_mock: Boolean(result.isMockModel),
          topic: topic || null,
          notes: `FNVM: ${result.hook_a.fnvmScore}x vs ${result.hook_b.fnvmScore}x`,
        }).then(() => {
          get().syncDatabaseLibrary();
        }).catch((e) => console.warn('SQLite persistence error:', e));

        saveBattleToDbAPI(newEntry);
      },

      // Sync with SQLite backend library
      syncDatabaseLibrary: async () => {
        set({ isSyncingWithDb: true });
        try {
          const items = await fetchLibraryFromDatabase(50);
          set({ databaseHistory: items || [], isSyncingWithDb: false });
        } catch (e) {
          set({ isSyncingWithDb: false });
        }
      },

      // Delete SQLite library entry
      deleteDatabaseEntry: async (id) => {
        await deleteLibraryItemFromDatabase(id);
        get().syncDatabaseLibrary();
      },

      // Record 48-Hour Performance Outcome (FR-08)
      addPerformanceRecord: async (recordData) => {
        const res = await recordPerformanceOutcome(recordData);
        await get().loadPerformanceRecords();
        return res;
      },

      // Load all 48-Hour Performance Records
      loadPerformanceRecords: async () => {
        try {
          const records = await fetchPerformanceHistory();
          set({ performanceRecords: records || [] });
        } catch (e) {
          console.warn('Failed to load performance records:', e);
        }
      },

      // Restore past battle into active workspace
      restoreBattle: (entry) => {
        set({
          hookA: entry.hookA || entry.hook_a,
          hookB: entry.hookB || entry.hook_b,
          platform: entry.platform || 'tiktok',
          niche: entry.niche || 'tech',
          topic: entry.topic || get().topic,
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
