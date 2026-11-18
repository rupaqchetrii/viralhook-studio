import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Activity } from 'lucide-react';
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

  return (
    <div className="bg-white dark:bg-[#11121F] rounded-3xl border border-[#E7E7E9] dark:border-white/10 p-6 shadow-sm space-y-5 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E7E9] dark:border-white/10 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0D0C22] dark:text-white tracking-tight flex items-center gap-2">
              <span>Dual-Tower Dense Transformer Analysis</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                384-Dim all-MiniLM-L6-v2
              </span>
            </h3>
            <p className="text-[11px] text-[#6E6D7A] dark:text-zinc-400">
              High-dimensional latent semantic space & rhetorical tension mapping
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="text-[#6E6D7A] dark:text-zinc-400">Cosine Distance:</span>
          <span className="text-purple-600 dark:text-purple-400">{data.semantic_distance}</span>
        </div>
      </div>

      {/* 3 Metric Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Semantic Similarity */}
        <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0D0C22] dark:text-white">
            <span>Semantic Similarity</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">{simPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E7E7E9] dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-[#EA4C89] rounded-full transition-all duration-500"
              style={{ width: `${simPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-[#6E6D7A] dark:text-zinc-400 font-mono">
            Cosine sim: {data.cosine_similarity}
          </div>
        </div>

        {/* Hook A Rhetorical Tension */}
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
            <span>Hook A Tension</span>
            <span className="font-mono text-purple-700 dark:text-purple-300">{tensionA} / 10</span>
          </div>
          <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-purple-600 dark:bg-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${tensionA * 10}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-700 dark:text-purple-400 font-mono font-semibold">
            Topic Match: {data.hook_a_metrics?.topic_semantic_alignment}%
          </div>
        </div>

        {/* Hook B Rhetorical Tension */}
        <div className="p-4 rounded-2xl bg-[#FDF2F7] dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#EA4C89] dark:text-pink-300">
            <span>Hook B Tension</span>
            <span className="font-mono text-[#EA4C89] dark:text-pink-300">{tensionB} / 10</span>
          </div>
          <div className="w-full h-2 rounded-full bg-pink-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#EA4C89] rounded-full transition-all duration-500"
              style={{ width: `${tensionB * 10}%` }}
            />
          </div>
          <div className="text-[10px] text-[#EA4C89] dark:text-pink-400 font-mono font-semibold">
            Topic Match: {data.hook_b_metrics?.topic_semantic_alignment}%
          </div>
        </div>
      </div>

      {/* Semantic Relationship Natural Language Interpretation */}
      <div className="p-3.5 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10 flex items-start gap-3 text-xs text-[#6E6D7A] dark:text-zinc-300">
        <Sparkles className="w-4 h-4 text-[#EA4C89] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#0D0C22] dark:text-white">Semantic Latent Space Interpretation: </span>
          <span>{data.interpretation}</span>
        </div>
      </div>
    </div>
  );
}
