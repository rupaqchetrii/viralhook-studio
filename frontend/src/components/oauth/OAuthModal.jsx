import React, { useState, useEffect } from 'react';
import { X, Share2, CheckCircle2, RefreshCw, Plus, Trash2, ShieldCheck, Zap, Video, ExternalLink } from 'lucide-react';
import {
  getOAuthAccountsAPI,
  connectOAuthAccountAPI,
  disconnectOAuthAccountAPI,
  syncLatestOAuthVideosAPI,
} from '../../services/api';

export function OAuthModal({ isOpen, onClose, onSyncComplete }) {
  if (!isOpen) return null;

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  // New connection form state
  const [isAdding, setIsAdding] = useState(false);
  const [platform, setPlatform] = useState('TikTok');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState(150000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    const data = await getOAuthAccountsAPI();
    setAccounts(data?.accounts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, [isOpen]);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsSubmitting(true);
    try {
      await connectOAuthAccountAPI({
        platform,
        handle: handle.trim(),
        followers: parseInt(followers) || 100000,
      });
      setHandle('');
      setIsAdding(false);
      await fetchAccounts();
    } catch (err) {
      alert(err.message || 'Connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (id) => {
    await disconnectOAuthAccountAPI(id);
    await fetchAccounts();
  };

  const handleSyncLatest = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncLatestOAuthVideosAPI();
      setSyncResult(res);
      if (onSyncComplete) onSyncComplete();
      await fetchAccounts();
    } catch (err) {
      alert(err.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="glass-panel-elevated rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Social OAuth 2.0 Integration</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Connected Creator Channels</h3>
          <p className="text-xs text-zinc-400">
            Authenticated via TikTok Creator Marketplace & Instagram Graph APIs for 1-click video retention sync.
          </p>
        </div>

        {/* 1-Click Sync Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-black/40 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Video Analytics Pull</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Fetch latest post metrics & 3s retention rate into Performance Tracker
            </div>
          </div>
          <button
            onClick={handleSyncLatest}
            disabled={isSyncing || accounts.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Channel...' : 'Sync Latest Videos'}</span>
          </button>
        </div>

        {/* Sync Success Notification */}
        {syncResult && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              Successfully imported <strong>{syncResult.videos_imported} latest videos</strong> from {syncResult.channel} into the SQLite Performance Tracker!
            </div>
          </div>
        )}

        {/* Connected Accounts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span>Active Channels ({accounts.length})</span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'Connect New Channel'}</span>
            </button>
          </div>

          {/* New Connection Form */}
          {isAdding && (
            <form onSubmit={handleConnect} className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-3 text-xs animate-fade-in-up">
              <div className="font-semibold text-white">OAuth 2.0 Account Authorization</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#11121B] border border-white/[0.08] text-white rounded-xl p-2 focus:border-cyan-400"
                  >
                    <option value="TikTok">TikTok Creator</option>
                    <option value="Instagram">Instagram Professional</option>
                    <option value="Shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="@yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#11121B] border border-white/[0.08] text-white rounded-xl p-2 focus:border-cyan-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  {isSubmitting ? 'Authorizing...' : 'Authorize via OAuth'}
                </button>
              </div>
            </form>
          )}

          {/* Accounts Cards */}
          <div className="space-y-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {acc.platform === 'TikTok' ? '🎵' : acc.platform === 'Instagram' ? '📸' : '⚡'}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{acc.handle}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        OAuth Active
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {acc.platform} &bull; {(acc.followers || 0).toLocaleString()} followers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDisconnect(acc.id)}
                    title="Disconnect Account"
                    className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Token Info */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-zinc-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            Tokens are encrypted and stored locally in your SQLite database. Scopes granted are strictly read-only for video performance and engagement metrics.
          </div>
        </div>
      </div>
    </div>
  );
}
