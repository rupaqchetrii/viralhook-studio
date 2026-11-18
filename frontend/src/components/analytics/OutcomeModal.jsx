import React, { useState } from 'react';
import { X, CheckCircle, TrendingUp } from 'lucide-react';
import { logCreatorOutcomeAPI } from '../../services/api';

export function OutcomeModal({ isOpen, onClose, battle, onSaved }) {
  const [chosenHook, setChosenHook] = useState('A');
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [shares, setShares] = useState('');
  const [actualTier, setActualTier] = useState('High');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !battle) return null;

  const selectedText = chosenHook === 'A' ? battle.hook_a?.text || battle.hookA : battle.hook_b?.text || battle.hookB;
  const predictedTier = chosenHook === 'A' ? battle.hook_a?.predictedClass || 'High' : battle.hook_b?.predictedClass || 'Medium';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await logCreatorOutcomeAPI({
        battle_id: battle.id || `battle_${Date.now()}`,
        chosen_hook: selectedText,
        views_48h: parseInt(views, 10) || 0,
        likes: parseInt(likes, 10) || 0,
        shares: parseInt(shares, 10) || 0,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C22]/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E7E7E9] dark:border-white/10 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8F7F4] dark:bg-white/5 text-[#6E6D7A] hover:text-[#0D0C22] dark:hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40">
            <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>48-Hour Outcome Feedback Loop</span>
          </div>
          <h3 className="text-xl font-bold text-[#0D0C22] dark:text-white tracking-tight">Record Video Performance</h3>
          <p className="text-xs text-[#6E6D7A] dark:text-zinc-400">
            Log your actual performance metrics to calibrate future predictions for your audience.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0D0C22] dark:text-white">Outcome Recorded!</h4>
            <p className="text-xs text-[#6E6D7A] dark:text-zinc-400">Calibration feedback saved to database successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Hook Selector */}
            <div className="space-y-1.5">
              <label className="text-[#0D0C22] dark:text-zinc-200 font-semibold">Which Hook Did You Publish?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChosenHook('A')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    chosenHook === 'A'
                      ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-[#0D0C22] dark:text-white font-bold shadow-sm'
                      : 'bg-[#F8F7F4] dark:bg-white/5 border-[#E7E7E9] dark:border-white/10 text-[#6E6D7A] dark:text-zinc-400 hover:border-[#0D0C22]'
                  }`}
                >
                  <div className="text-[10px] uppercase text-violet-600 dark:text-violet-400 font-mono font-bold">Hook Option A</div>
                  <div className="truncate text-xs mt-1">"{battle.hook_a?.text || battle.hookA}"</div>
                </button>
                <button
                  type="button"
                  onClick={() => setChosenHook('B')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    chosenHook === 'B'
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-[#EA4C89] text-[#0D0C22] dark:text-white font-bold shadow-sm'
                      : 'bg-[#F8F7F4] dark:bg-white/5 border-[#E7E7E9] dark:border-white/10 text-[#6E6D7A] dark:text-zinc-400 hover:border-[#0D0C22]'
                  }`}
                >
                  <div className="text-[10px] uppercase text-[#EA4C89] font-mono font-bold">Hook Option B</div>
                  <div className="truncate text-xs mt-1">"{battle.hook_b?.text || battle.hookB}"</div>
                </button>
              </div>
            </div>

            {/* Views & Actual Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#0D0C22] dark:text-zinc-200 font-semibold">48h View Count:</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 85000"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white rounded-xl px-3.5 py-2.5 border border-[#E7E7E9] dark:border-white/10 focus:border-[#EA4C89] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#0D0C22] dark:text-zinc-200 font-semibold">Actual Engagement Tier:</label>
                <select
                  value={actualTier}
                  onChange={(e) => setActualTier(e.target.value)}
                  className="w-full bg-[#F8F7F4] dark:bg-[#11121F] text-[#0D0C22] dark:text-white rounded-xl px-3.5 py-2.5 border border-[#E7E7E9] dark:border-white/10 focus:border-[#EA4C89] focus:outline-none"
                >
                  <option value="High">🚀 High (Outperformed average)</option>
                  <option value="Medium">⚖️ Medium (Normal baseline)</option>
                  <option value="Low">📉 Low (Underperformed)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-[#0D0C22] dark:text-zinc-200 font-semibold">Creator Notes (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Posted at 6 PM, strong comments, good visual delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white rounded-xl px-3.5 py-2.5 border border-[#E7E7E9] dark:border-white/10 focus:border-[#EA4C89] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#F8F7F4] dark:bg-white/5 text-[#6E6D7A] hover:text-[#0D0C22] dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl font-bold text-white bg-[#0D0C22] hover:bg-[#3D3D4E] dark:bg-[#EA4C89] dark:hover:bg-[#d63d76] shadow-sm transition-all"
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
