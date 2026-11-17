import React from 'react';
import { X, Trash2, ArrowUpRight, History } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

export function HistoryDrawer() {
  const {
    battleHistory,
    historyDrawerOpen,
    setHistoryDrawerOpen,
    restoreBattle,
    deleteHistoryItem,
    clearAllHistory,
  } = useHookStore();

  if (!historyDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#13141C] border-l border-[#222432] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#1E202C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#A78BFA]" />
              <h3 className="font-bold text-[#EDEDEF] text-sm">Saved Hook Comparisons</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#181924] border border-[#262838] text-[#8E90A0]">
                {battleHistory.length}
              </span>
            </div>
            <button
              onClick={() => setHistoryDrawerOpen(false)}
              className="text-[#8E90A0] hover:text-[#EDEDEF] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Battles */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {battleHistory.length === 0 ? (
              <div className="text-center py-16 text-[#64748B] space-y-2">
                <History className="w-8 h-8 mx-auto text-[#222432]" />
                <p className="text-xs">No saved comparisons yet.</p>
                <p className="text-[11px] text-[#55586D]">
                  Compare two hooks to automatically record results in your history.
                </p>
              </div>
            ) : (
              battleHistory.map((entry) => {
                const dateStr = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E202C] hover:border-[#2D3042] transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            entry.isDeadHeat
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              : 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                          }`}
                        >
                          {entry.isDeadHeat ? 'Even Tie' : `Winner: ${entry.winner === 'HOOK_A' ? 'A' : 'B'}`}
                        </span>
                        <span className="text-[#64748B] uppercase font-mono text-[10px]">
                          {entry.platform} · {dateStr}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-rose-400 transition-opacity p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="line-clamp-1 text-[#EDEDEF]">
                        <span className="text-[#A78BFA] font-bold mr-1.5">A:</span>
                        {entry.hookA}
                      </div>
                      <div className="line-clamp-1 text-[#8E90A0]">
                        <span className="text-[#94A3B8] font-bold mr-1.5">B:</span>
                        {entry.hookB}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#181924] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#64748B]">
                        Difference: {(entry.deltaP * 100).toFixed(1)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => restoreBattle(entry)}
                        className="text-xs text-[#A78BFA] hover:text-white flex items-center gap-1 font-medium transition-colors"
                      >
                        <span>Load</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Clear All */}
          {battleHistory.length > 0 && (
            <div className="p-4 border-t border-[#1E202C] bg-[#0E0F15] flex justify-between items-center">
              <span className="text-xs text-[#64748B] font-mono">
                {battleHistory.length} saved
              </span>
              <button
                onClick={clearAllHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
