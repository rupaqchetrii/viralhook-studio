import React from 'react';
import { X, Trash2, ArrowUpRight, Scale, Trophy, History } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#202238] border-l border-[#2e3152] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#2e3152] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-[#A78BFA]" />
              <h3 className="font-bold text-[#F1F5F9] text-base">Hook Battle Library</h3>
              <Badge variant="accent" size="xs">
                {battleHistory.length}
              </Badge>
            </div>
            <button
              onClick={() => setHistoryDrawerOpen(false)}
              className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Battles */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {battleHistory.length === 0 ? (
              <div className="text-center py-16 text-[#64748B] space-y-2">
                <History className="w-10 h-10 mx-auto text-[#2e3152]" />
                <p className="text-sm">No saved battles yet.</p>
                <p className="text-xs text-[#64748B]">
                  Run an A/B hook comparison to automatically record it in your library.
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
                    className="p-4 rounded-xl bg-[#11121B] border border-[#2e3152] hover:border-[#A78BFA]/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={entry.isDeadHeat ? 'warning' : 'accent'}
                          size="xs"
                        >
                          {entry.isDeadHeat ? 'Dead-Heat' : `Winner: ${entry.winner === 'HOOK_A' ? 'A' : 'B'}`}
                        </Badge>
                        <span className="text-[#64748B] uppercase font-mono text-[10px]">
                          {entry.platform} • {dateStr}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-rose-400 transition-opacity p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="line-clamp-1 text-[#F1F5F9]">
                        <span className="text-[#A78BFA] font-bold mr-1.5">A:</span>
                        {entry.hookA}
                      </div>
                      <div className="line-clamp-1 text-[#94A3B8]">
                        <span className="text-emerald-400 font-bold mr-1.5">B:</span>
                        {entry.hookB}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2e3152]/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#64748B]">
                        ΔP: {(entry.deltaP * 100).toFixed(1)}% | FNVM: {entry.fnvmA}x vs {entry.fnvmB}x
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => restoreBattle(entry)}
                        className="text-xs text-[#A78BFA] hover:text-[#F1F5F9] p-0 h-auto"
                      >
                        <span>Restore</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Clear All */}
          {battleHistory.length > 0 && (
            <div className="p-4 border-t border-[#2e3152] bg-[#191a2c] flex justify-between items-center">
              <span className="text-xs text-[#64748B] font-mono">
                {battleHistory.length} saved comparisons
              </span>
              <Button size="sm" variant="danger" onClick={clearAllHistory}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
