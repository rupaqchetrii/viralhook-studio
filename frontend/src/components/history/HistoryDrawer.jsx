import React from 'react';
import { X, Trash2, ArrowUpRight, History } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0D0C22]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7E7E9] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#E7E7E9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EA4C89]/10 flex items-center justify-center">
                <History className="w-4 h-4 text-[#EA4C89]" />
              </div>
              <h3 className="font-bold text-[#0D0C22] text-base tracking-tight">Hook Battle Library</h3>
              <Badge variant="accent" size="xs">
                {battleHistory.length}
              </Badge>
            </div>
            <button
              onClick={() => setHistoryDrawerOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-[#F3F3F6] flex items-center justify-center text-[#6E6D7A] hover:text-[#0D0C22] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Battles */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-[#FAF9F8]">
            {battleHistory.length === 0 ? (
              <div className="text-center py-20 text-[#6E6D7A] space-y-2">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E7E7E9] flex items-center justify-center mx-auto shadow-sm">
                  <History className="w-6 h-6 text-[#9E9EA7]" />
                </div>
                <p className="text-sm font-semibold text-[#0D0C22]">No saved battles yet</p>
                <p className="text-xs text-[#6E6D7A] max-w-xs mx-auto">
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
                    className="p-4 rounded-2xl bg-white border border-[#E7E7E9] hover:border-[#EA4C89]/40 hover:shadow-md transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={entry.isDeadHeat ? 'warning' : 'accent'}
                          size="xs"
                        >
                          {entry.isDeadHeat ? 'Dead-Heat' : `Winner: ${entry.winner === 'HOOK_A' ? 'A' : 'B'}`}
                        </Badge>
                        <span className="text-[#6E6D7A] uppercase font-mono text-[10px]">
                          {entry.platform} • {dateStr}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#9E9EA7] hover:text-rose-500 transition-opacity p-1 rounded-full hover:bg-rose-50"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="line-clamp-1 text-[#0D0C22] font-medium">
                        <span className="text-[#EA4C89] font-bold mr-1.5">A:</span>
                        {entry.hookA}
                      </div>
                      <div className="line-clamp-1 text-[#6E6D7A]">
                        <span className="text-emerald-600 font-bold mr-1.5">B:</span>
                        {entry.hookB}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7E7E9] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#6E6D7A]">
                        ΔP: {(entry.deltaP * 100).toFixed(1)}% | FNVM: {entry.fnvmA}x vs {entry.fnvmB}x
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => restoreBattle(entry)}
                        className="text-xs text-[#EA4C89] hover:text-[#0D0C22] p-0 h-auto font-semibold"
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
            <div className="p-4 border-t border-[#E7E7E9] bg-white flex justify-between items-center">
              <span className="text-xs text-[#6E6D7A] font-mono">
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
