import React, { useState } from 'react';
import { X, Trophy, CheckCircle, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { logCreatorOutcomeAPI } from '../../services/api';

export function OutcomeModal({ isOpen, onClose, battle, onSaved }) {
  if (!isOpen || !battle) return null;

  const [chosenHook, setChosenHook] = useState('A');
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [shares, setShares] = useState('');
  const [actualTier, setActualTier] = useState('High');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedText = chosenHook === 'A' ? battle.hook_a?.text || battle.hookA : battle.hook_b?.text || battle.hookB;
  const predictedTier = chosenHook === 'A' ? battle.hook_a?.predictedClass || 'High' : battle.hook_b?.predictedClass || 'Medium';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await logCreatorOutcomeAPI({
        battle_id: battle.id || `battle_${Date.now()}`,
        chosen_hook: selectedText,
        views_48h: parseInt(views) || 0,
        likes: parseInt(likes) || 0,
        shares: parseInt(shares) || 0,
        actual_tier: actualTier,
        predicted_tier: predictedTier,
        creator_notes: notes,
      });

      setSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      alert(err.message || 'Failed to record outcome.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="glass-panel-elevated rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span>48-Hour Outcome Feedback Loop</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Record Video Performance</h3>
          <p className="text-xs text-zinc-400">
            Log your actual performance metrics to calibrate future predictions for your audience.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Outcome Recorded!</h4>
            <p className="text-xs text-zinc-400">Calibration feedback saved to database successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Hook Selector */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Which Hook Did You Publish?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChosenHook('A')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    chosenHook === 'A'
                      ? 'bg-violet-500/20 border-violet-500 text-white font-bold shadow-md shadow-violet-500/20'
                      : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] uppercase text-violet-400 font-mono">Hook Option A</div>
                  <div className="truncate text-xs mt-1">"{battle.hook_a?.text || battle.hookA}"</div>
                </button>
                <button
                  type="button"
                  onClick={() => setChosenHook('B')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    chosenHook === 'B'
                      ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] uppercase text-cyan-400 font-mono">Hook Option B</div>
                  <div className="truncate text-xs mt-1">"{battle.hook_b?.text || battle.hookB}"</div>
                </button>
              </div>
            </div>

            {/* Views & Actual Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">48h View Count:</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 85000"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  className="w-full bg-black/40 text-white rounded-xl px-3.5 py-2.5 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Actual Engagement Tier:</label>
                <select
                  value={actualTier}
                  onChange={(e) => setActualTier(e.target.value)}
                  className="w-full bg-black/40 text-white rounded-xl px-3.5 py-2.5 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none"
                >
                  <option value="High">🚀 High (Outperformed average)</option>
                  <option value="Medium">⚖️ Medium (Normal baseline)</option>
                  <option value="Low">📉 Low (Underperformed)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Creator Notes (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Posted at 6 PM, strong comments, good visual delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-black/40 text-white rounded-xl px-3.5 py-2.5 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 transition-all"
              >
                {isSubmitting ? 'Recording...' : 'Save 48h Outcome'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
