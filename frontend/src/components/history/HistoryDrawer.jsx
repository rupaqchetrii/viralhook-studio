import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ArrowUpRight,
  History,
  TrendingUp,
  Database,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  BarChart2,
  Award,
} from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

export function HistoryDrawer() {
  const {
    battleHistory,
    databaseHistory,
    performanceRecords,
    isSyncingWithDb,
    historyDrawerOpen,
    setHistoryDrawerOpen,
    restoreBattle,
    deleteHistoryItem,
    clearAllHistory,
    syncDatabaseLibrary,
    addPerformanceRecord,
    loadPerformanceRecords,
  } = useHookStore();

  const [activeTab, setActiveTab] = useState('battles'); // 'battles' | 'performance'
  const [selectedHookForTracking, setSelectedHookForTracking] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    platform: 'TikTok',
    views: '',
    likes: '',
    comments: '',
    outcomeClass: 'High',
    notes: '',
  });
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);

  useEffect(() => {
    if (historyDrawerOpen) {
      syncDatabaseLibrary();
      loadPerformanceRecords();
    }
  }, [historyDrawerOpen]);

  if (!historyDrawerOpen) return null;

  // Calculate engagement rate: ((likes + comments) / views) * 100
  const viewsNum = parseInt(trackingForm.views, 10) || 0;
  const likesNum = parseInt(trackingForm.likes, 10) || 0;
  const commentsNum = parseInt(trackingForm.comments, 10) || 0;
  const computedEngagementRate =
    viewsNum > 0 ? (((likesNum + commentsNum) / viewsNum) * 100).toFixed(2) : '0.00';

  const handleOpenTrackingModal = (hookText, libraryId = null) => {
    setSelectedHookForTracking({ hookText, libraryId });
    setTrackingForm({
      platform: 'TikTok',
      views: '',
      likes: '',
      comments: '',
      outcomeClass: 'High',
      notes: '',
    });
    setRecordSuccess(false);
  };

  const handleSavePerformance = async (e) => {
    e.preventDefault();
    if (!selectedHookForTracking) return;

    setIsSubmittingRecord(true);
    await addPerformanceRecord({
      library_id: selectedHookForTracking.libraryId || null,
      hook_text: selectedHookForTracking.hookText,
      platform: trackingForm.platform,
      actual_views: viewsNum,
      actual_likes: likesNum,
      actual_comments: commentsNum,
      engagement_rate: parseFloat(computedEngagementRate),
      outcome_class: trackingForm.outcomeClass,
      notes: trackingForm.notes || null,
    });
    setIsSubmittingRecord(false);
    setRecordSuccess(true);
    setTimeout(() => {
      setSelectedHookForTracking(null);
      setActiveTab('performance');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#11121B] border-l border-[#2e3152] shadow-2xl flex flex-col">
          {/* Top Bar Header */}
          <div className="p-5 border-b border-[#2e3152] flex items-center justify-between bg-[#191a2c]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/20 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#F1F5F9] text-sm">Hook Library & Tracker</h3>
                <p className="text-[11px] text-[#94A3B8]">SQLite Persistent Storage (FR-08)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={syncDatabaseLibrary}
                disabled={isSyncingWithDb}
                title="Sync with SQLite Database"
                className="p-1.5 rounded-lg bg-[#202238] hover:bg-[#282a45] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2e3152] transition-all text-xs flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithDb ? 'animate-spin text-[#A78BFA]' : ''}`} />
                <span className="hidden sm:inline text-[11px]">Sync DB</span>
              </button>

              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#2e3152] bg-[#161726]/40 p-1 text-xs">
            <button
              onClick={() => setActiveTab('battles')}
              className={`flex-1 py-2 text-center rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'battles'
                  ? 'bg-[#202238] text-[#F1F5F9] shadow-sm border border-[#2e3152]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Saved Comparisons ({battleHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 py-2 text-center rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'performance'
                  ? 'bg-[#202238] text-[#F1F5F9] shadow-sm border border-[#2e3152]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>48h Tracker ({performanceRecords.length})</span>
            </button>
          </div>

          {/* Tab 1: Saved Comparisons List */}
          {activeTab === 'battles' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {battleHistory.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] space-y-2">
                  <Database className="w-10 h-10 mx-auto text-[#2e3152]" />
                  <p className="text-sm text-[#94A3B8]">No saved comparisons yet.</p>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    Run an A/B hook battle to automatically save results locally and sync with SQLite.
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
                      className="p-4 rounded-xl bg-[#161726] border border-[#2e3152] hover:border-[#A78BFA]/40 transition-all space-y-3 group shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              entry.isDeadHeat
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30'
                            }`}
                          >
                            {entry.isDeadHeat ? 'Dead-Heat (Tie)' : `Winner: ${entry.winner === 'HOOK_A' ? 'A' : 'B'}`}
                          </span>
                          <span className="text-[#64748B] uppercase font-mono text-[10px]">
                            {entry.platform} • {dateStr}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-rose-400 transition-opacity p-1"
                          title="Delete from list"
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
                          <span className="text-cyan-400 font-bold mr-1.5">B:</span>
                          {entry.hookB}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#2e3152]/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono text-[#94A3B8]">
                          ΔP: {(entry.deltaP * 100).toFixed(1)}% | FNVM: {entry.fnvmA}x vs {entry.fnvmB}x
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenTrackingModal(
                                entry.winner === 'HOOK_B' ? entry.hookB : entry.hookA,
                                entry.id
                              )
                            }
                            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/20"
                            title="Log 48-hour video post performance"
                          >
                            <TrendingUp className="w-3 h-3" />
                            <span>Track 48h</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => restoreBattle(entry)}
                            className="text-[11px] font-semibold text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-[#A78BFA]/10 border border-[#A78BFA]/20"
                          >
                            <span>Load</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: 48-Hour Performance Tracker Log */}
          {activeTab === 'performance' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <BarChart2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-bold">48-Hour Post-Publication Empirical Tracker</div>
                  <div className="text-[11px] text-emerald-200/80 mt-0.5">
                    Compare ML predictions against empirical creator metrics recorded after 48 hours of distribution.
                  </div>
                </div>
              </div>

              {performanceRecords.length === 0 ? (
                <div className="text-center py-16 text-[#64748B] space-y-2">
                  <TrendingUp className="w-10 h-10 mx-auto text-[#2e3152]" />
                  <p className="text-sm text-[#94A3B8]">No performance logs recorded yet.</p>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    Click "Track 48h" on any saved hook to log actual views, likes, and engagement outcome.
                  </p>
                </div>
              ) : (
                performanceRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-[#161726] border border-[#2e3152] space-y-2.5 shadow-sm text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase">
                        {rec.platform}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.outcome_class === 'High'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : rec.outcome_class === 'Medium'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        Actual: {rec.outcome_class}
                      </span>
                    </div>

                    <p className="text-zinc-200 font-medium line-clamp-2">"{rec.hook_text}"</p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2e3152]/60 text-center font-mono">
                      <div className="p-2 rounded-lg bg-[#11121B] border border-[#2e3152]">
                        <div className="text-[10px] text-[#64748B]">Views</div>
                        <div className="font-bold text-white text-xs">{rec.actual_views.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#11121B] border border-[#2e3152]">
                        <div className="text-[10px] text-[#64748B]">Likes</div>
                        <div className="font-bold text-white text-xs">{rec.actual_likes.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#11121B] border border-emerald-500/30">
                        <div className="text-[10px] text-emerald-400">Eng. Rate</div>
                        <div className="font-bold text-emerald-400 text-xs">{rec.engagement_rate}%</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer with Clear All */}
          {activeTab === 'battles' && battleHistory.length > 0 && (
            <div className="p-4 border-t border-[#2e3152] bg-[#161726]/80 flex justify-between items-center">
              <span className="text-xs text-[#64748B] font-mono">
                {battleHistory.length} saved battles
              </span>
              <button
                onClick={clearAllHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local History</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 48h Performance Tracking Dialog / Modal */}
      {selectedHookForTracking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#191a2c] border border-[#2e3152] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e3152]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Record 48-Hour Performance</h4>
              </div>
              <button
                onClick={() => setSelectedHookForTracking(null)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#11121B] border border-[#2e3152] text-xs text-[#94A3B8]">
              <span className="text-emerald-400 font-bold block mb-1">Target Hook:</span>
              <p className="text-zinc-200 line-clamp-2">"{selectedHookForTracking.hookText}"</p>
            </div>

            <form onSubmit={handleSavePerformance} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Platform</label>
                  <select
                    value={trackingForm.platform}
                    onChange={(e) => setTrackingForm({ ...trackingForm, platform: e.target.value })}
                    className="w-full bg-[#11121B] border border-[#2e3152] text-white rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Actual Outcome Tier</label>
                  <select
                    value={trackingForm.outcomeClass}
                    onChange={(e) => setTrackingForm({ ...trackingForm, outcomeClass: e.target.value })}
                    className="w-full bg-[#11121B] border border-[#2e3152] text-white rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="High">High (Viral Breakout)</option>
                    <option value="Medium">Medium (Baseline Reach)</option>
                    <option value="Low">Low (Underperformed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Actual Views</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 150000"
                    value={trackingForm.views}
                    onChange={(e) => setTrackingForm({ ...trackingForm, views: e.target.value })}
                    className="w-full bg-[#11121B] border border-[#2e3152] text-white rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Actual Likes</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 12500"
                    value={trackingForm.likes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, likes: e.target.value })}
                    className="w-full bg-[#11121B] border border-[#2e3152] text-white rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Actual Comments</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 450"
                  value={trackingForm.comments}
                  onChange={(e) => setTrackingForm({ ...trackingForm, comments: e.target.value })}
                  className="w-full bg-[#11121B] border border-[#2e3152] text-white rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-semibold">Calculated Engagement Rate:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{computedEngagementRate}%</span>
              </div>

              {recordSuccess ? (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Performance record saved to SQLite successfully!</span>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHookForTracking(null)}
                    className="px-4 py-2 rounded-lg bg-[#202238] hover:bg-[#282a45] text-zinc-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRecord}
                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    {isSubmittingRecord ? 'Saving...' : 'Save to Database'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
