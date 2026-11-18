import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Compass, Sparkles, Network, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { analyzeEmbeddingsAPI } from '../../services/api';

export function SemanticRadarCard({ hookA, hookB, topic = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hookA || !hookB) return;
    let isCancelled = false;

    setLoading(true);
    analyzeEmbeddingsAPI(hookA, hookB, topic)
      .then((res) => {
        if (!isCancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [hookA, hookB, topic]);

  if (!data) return null;

  const simPercent = data.normalized_similarity_percent ?? 86.6;
  const tensionA = data.hook_a_metrics?.rhetorical_tension ?? 7.5;
  const tensionB = data.hook_b_metrics?.rhetorical_tension ?? 6.2;
  const noveltyA = data.hook_a_metrics?.novelty_score ?? 15.0;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Dual-Tower Dense Transformer Analysis</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30">
                384-Dim all-MiniLM-L6-v2
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              High-dimensional latent semantic space & rhetorical tension mapping
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Cosine Distance:</span>
          <span className="text-cyan-400 font-bold">{data.semantic_distance}</span>
        </div>
      </div>

      {/* 3 Metric Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Semantic Similarity */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Semantic Similarity</span>
            <span className="font-mono text-cyan-400 font-bold">{simPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${simPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Cosine sim: {data.cosine_similarity}
          </div>
        </div>

        {/* Hook A Rhetorical Tension */}
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-violet-300">
            <span>Hook A Tension</span>
            <span className="font-mono text-violet-200 font-bold">{tensionA} / 10</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${tensionA * 10}%` }}
            />
          </div>
          <div className="text-[10px] text-violet-400/80 font-mono">
            Topic Match: {data.hook_a_metrics?.topic_semantic_alignment}%
          </div>
        </div>

        {/* Hook B Rhetorical Tension */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Hook B Tension</span>
            <span className="font-mono text-cyan-200 font-bold">{tensionB} / 10</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${tensionB * 10}%` }}
            />
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono">
            Topic Match: {data.hook_b_metrics?.topic_semantic_alignment}%
          </div>
        </div>
      </div>

      {/* Semantic Relationship Natural Language Interpretation */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-zinc-300">
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Semantic Latent Space Interpretation: </span>
          <span className="text-zinc-300">{data.interpretation}</span>
        </div>
      </div>
    </div>
  );
}
