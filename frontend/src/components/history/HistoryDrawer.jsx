import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ArrowUpRight,
  History,
  TrendingUp,
  Database,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function HistoryDrawer() {
  const {
    battleHistory,
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
      if (syncDatabaseLibrary) syncDatabaseLibrary();
      if (loadPerformanceRecords) loadPerformanceRecords();
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
    if (addPerformanceRecord) {
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
    }
    setIsSubmittingRecord(false);
    setRecordSuccess(true);
    setTimeout(() => {
      setSelectedHookForTracking(null);
      setActiveTab('performance');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0D0C22]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-[#E7E7E9] shadow-2xl flex flex-col">
          {/* Top Bar Header */}
          <div className="p-5 border-b border-[#E7E7E9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EA4C89]/10 flex items-center justify-center text-[#EA4C89]">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#0D0C22] text-sm">Hook Library & Tracker</h3>
                <p className="text-[11px] text-[#6E6D7A]">SQLite Persistent Storage</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={syncDatabaseLibrary}
                disabled={isSyncingWithDb}
                title="Sync with SQLite Database"
                className="px-2.5 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-white text-[#6E6D7A] hover:text-[#0D0C22] border border-[#E7E7E9] transition-all text-xs flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithDb ? 'animate-spin text-[#EA4C89]' : ''}`} />
                <span className="hidden sm:inline text-[11px] font-semibold">Sync DB</span>
              </button>

              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F8F7F4] flex items-center justify-center text-[#6E6D7A] hover:text-[#0D0C22] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E7E7E9] bg-[#F8F7F4] p-1.5 text-xs gap-1">
            <button
              onClick={() => setActiveTab('battles')}
              className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'battles'
                  ? 'bg-white text-[#0D0C22] shadow-sm border border-[#E7E7E9]'
                  : 'text-[#6E6D7A] hover:text-[#0D0C22]'
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#EA4C89]" />
              <span>Saved Comparisons ({battleHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'performance'
                  ? 'bg-white text-[#0D0C22] shadow-sm border border-[#E7E7E9]'
                  : 'text-[#6E6D7A] hover:text-[#0D0C22]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>48h Tracker ({performanceRecords?.length || 0})</span>
            </button>
          </div>

          {/* Tab 1: Saved Comparisons List */}
          {activeTab === 'battles' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#FAF9F8]">
              {battleHistory.length === 0 ? (
                <div className="text-center py-20 text-[#6E6D7A] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E7E7E9] flex items-center justify-center mx-auto shadow-sm">
                    <Database className="w-6 h-6 text-[#9E9EA7]" />
                  </div>
                  <p className="text-sm font-semibold text-[#0D0C22]">No saved comparisons yet</p>
                  <p className="text-xs text-[#6E6D7A] max-w-xs mx-auto">
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
                      className="p-4 rounded-2xl bg-white border border-[#E7E7E9] hover:border-[#EA4C89]/40 hover:shadow-md transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={entry.isDeadHeat ? 'warning' : 'accent'}
                            size="xs"
                          >
                            {entry.isDeadHeat ? 'Dead-Heat (Tie)' : `Winner: ${entry.winner === 'HOOK_A' ? 'A' : 'B'}`}
                          </Badge>
                          <span className="text-[#6E6D7A] uppercase font-mono text-[10px]">
                            {entry.platform} • {dateStr}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#9E9EA7] hover:text-rose-500 transition-opacity p-1 rounded-full hover:bg-rose-50"
                          title="Delete from list"
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

                      <div className="pt-2.5 border-t border-[#E7E7E9] flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono text-[#6E6D7A]">
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
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200"
                            title="Log 48-hour video post performance"
                          >
                            <TrendingUp className="w-3 h-3" />
                            <span>Track 48h</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => restoreBattle(entry)}
                            className="text-[11px] font-semibold text-[#0D0C22] hover:text-[#EA4C89] flex items-center gap-1 transition-colors px-2.5 py-1 rounded-full bg-[#F8F7F4] hover:bg-white border border-[#E7E7E9]"
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
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#FAF9F8]">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <BarChart2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <div className="font-bold">48-Hour Post-Publication Empirical Tracker</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Compare ML predictions against empirical creator metrics recorded after 48 hours of distribution.
                  </div>
                </div>
              </div>

              {!performanceRecords || performanceRecords.length === 0 ? (
                <div className="text-center py-16 text-[#6E6D7A] space-y-2">
                  <TrendingUp className="w-10 h-10 mx-auto text-[#9E9EA7]" />
                  <p className="text-sm font-semibold text-[#0D0C22]">No performance logs recorded yet</p>
                  <p className="text-xs text-[#6E6D7A] max-w-xs mx-auto">
                    Click "Track 48h" on any saved hook to log actual views, likes, and engagement outcome.
                  </p>
                </div>
              ) : (
                performanceRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white border border-[#E7E7E9] space-y-2.5 shadow-sm text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0D0C22] px-2 py-0.5 rounded-md bg-[#F8F7F4] border border-[#E7E7E9] text-[10px] uppercase">
                        {rec.platform}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.outcome_class === 'High'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.outcome_class === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        Actual: {rec.outcome_class}
                      </span>
                    </div>

                    <p className="text-[#0D0C22] font-medium line-clamp-2">"{rec.hook_text}"</p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E7E7E9] text-center font-mono">
                      <div className="p-2 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                        <div className="text-[10px] text-[#6E6D7A]">Views</div>
                        <div className="font-bold text-[#0D0C22] text-xs">{rec.actual_views.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
                        <div className="text-[10px] text-[#6E6D7A]">Likes</div>
                        <div className="font-bold text-[#0D0C22] text-xs">{rec.actual_likes.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="text-[10px] text-emerald-700">Eng. Rate</div>
                        <div className="font-bold text-emerald-700 text-xs">{rec.engagement_rate}%</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer with Clear All */}
          {activeTab === 'battles' && battleHistory.length > 0 && (
            <div className="p-4 border-t border-[#E7E7E9] bg-white flex justify-between items-center">
              <span className="text-xs text-[#6E6D7A] font-mono">
                {battleHistory.length} saved battles
              </span>
              <button
                onClick={clearAllHistory}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D0C22]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[#E7E7E9] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E7E9]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-[#0D0C22] text-sm">Record 48-Hour Performance</h4>
              </div>
              <button
                onClick={() => setSelectedHookForTracking(null)}
                className="text-[#6E6D7A] hover:text-[#0D0C22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] text-xs text-[#6E6D7A]">
              <span className="text-emerald-700 font-bold block mb-1">Target Hook:</span>
              <p className="text-[#0D0C22] line-clamp-2">"{selectedHookForTracking.hookText}"</p>
            </div>

            <form onSubmit={handleSavePerformance} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6E6D7A] block mb-1">Platform</label>
                  <select
                    value={trackingForm.platform}
                    onChange={(e) => setTrackingForm({ ...trackingForm, platform: e.target.value })}
                    className="w-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] rounded-xl p-2.5 focus:border-[#EA4C89] focus:outline-none"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#6E6D7A] block mb-1">Actual Outcome Tier</label>
                  <select
                    value={trackingForm.outcomeClass}
                    onChange={(e) => setTrackingForm({ ...trackingForm, outcomeClass: e.target.value })}
                    className="w-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] rounded-xl p-2.5 focus:border-[#EA4C89] focus:outline-none"
                  >
                    <option value="High">High (Viral Breakout)</option>
                    <option value="Medium">Medium (Baseline Reach)</option>
                    <option value="Low">Low (Underperformed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#6E6D7A] block mb-1">Views</label>
                  <input
                    type="number"
                    required
                    placeholder="10000"
                    value={trackingForm.views}
                    onChange={(e) => setTrackingForm({ ...trackingForm, views: e.target.value })}
                    className="w-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] rounded-xl p-2.5 font-mono focus:border-[#EA4C89] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6E6D7A] block mb-1">Likes</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={trackingForm.likes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, likes: e.target.value })}
                    className="w-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] rounded-xl p-2.5 font-mono focus:border-[#EA4C89] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6E6D7A] block mb-1">Comments</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={trackingForm.comments}
                    onChange={(e) => setTrackingForm({ ...trackingForm, comments: e.target.value })}
                    className="w-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] rounded-xl p-2.5 font-mono focus:border-[#EA4C89] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between font-mono">
                <span className="text-[11px] text-emerald-800">Computed Engagement Rate:</span>
                <span className="text-sm font-bold text-emerald-700">{computedEngagementRate}%</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E7E9]">
                <button
                  type="button"
                  onClick={() => setSelectedHookForTracking(null)}
                  className="px-4 py-2 rounded-full border border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F8F7F4] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRecord}
                  className="px-5 py-2 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  {recordSuccess ? 'Saved to DB!' : isSubmittingRecord ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
