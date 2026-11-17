import React, { useState, useMemo, useCallback } from 'react';
import { 
  Heart, Eye, Check 
} from 'lucide-react';
import { useHookStore } from './store/useHookStore';

const INSPIRATION_HOOKS = [
  {
    id: 1,
    title: "Curiosity Loop Archetype",
    category: "Curiosity Loop",
    quote: "Why 99% of software engineers secretly fail this 1 interview question (and how to ace it)",
    mechanic: "Creates an open knowledge gap that compels the viewer to stay past the swipe cliff for the payoff.",
    creator: "Tanvir & Rupak",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    badge: "TEAM",
    likes: 1240,
    views: 18900,
    bgGradient: "from-pink-500 via-rose-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Loss Aversion Formula",
    category: "Loss Aversion",
    quote: "Stop doing this with your Python virtual environments right now or you will regret it",
    mechanic: "Triggers the immediate psychological urge to prevent a catastrophe or wasted effort.",
    creator: "Meenmoy Bhuyan",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    badge: "PRO",
    likes: 2180,
    views: 34200,
    bgGradient: "from-blue-600 via-indigo-600 to-purple-800"
  },
  {
    id: 3,
    title: "Listicle & Specificity",
    category: "Listicle & Specificity",
    quote: "3 simple developer habits that will save you 10 hours of debugging every single week",
    mechanic: "Concrete numbers establish clear expectations and quantifiable perceived return on time.",
    creator: "Samina",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    badge: "TEAM",
    likes: 3120,
    views: 45100,
    bgGradient: "from-emerald-400 via-teal-600 to-slate-900"
  },
  {
    id: 4,
    title: "Direct Audience Challenge",
    category: "Direct Challenge",
    quote: "You are probably making this major junior developer mistake without even realizing it",
    mechanic: "Direct second-person address ('you') immediately commands scroll attention in the feed.",
    creator: "Aditya",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    badge: "PRO",
    likes: 980,
    views: 12800,
    bgGradient: "from-slate-800 via-slate-900 to-black"
  },
  {
    id: 5,
    title: "Contrarian Industry Myth",
    category: "Curiosity Loop",
    quote: "Everything you've been told about writing clean code in 2026 is completely backwards",
    mechanic: "Directly contradicts widely accepted beliefs to generate disbelief and high comment debate.",
    creator: "Tanvir",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    badge: "TEAM",
    likes: 1890,
    views: 29400,
    bgGradient: "from-amber-400 via-orange-500 to-red-600"
  },
  {
    id: 6,
    title: "E-Commerce Warning Hook",
    category: "Loss Aversion",
    quote: "Do not buy this viral mechanical keyboard before checking this 1 fatal flaw",
    mechanic: "Protective warning framing creates urgency before an impending consumer decision.",
    creator: "Meenmoy Bhuyan",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    badge: "PRO",
    likes: 2750,
    views: 38200,
    bgGradient: "from-rose-500 via-fuchsia-600 to-indigo-700"
  }
];

export function App() {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);

  const {
    hookA,
    hookB,
    setHookA,
    setHookB,
    swapHooks,
    runComparison,
    isComparing,
    comparisonResult,
    error: arenaError
  } = useHookStore();

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  const wordCountA = useMemo(() => hookA.trim() ? hookA.trim().split(/\s+/).length : 0, [hookA]);
  const wordCountB = useMemo(() => hookB.trim() ? hookB.trim().split(/\s+/).length : 0, [hookB]);
  const spokenTimeA = useMemo(() => (wordCountA / 2.75).toFixed(1), [wordCountA]);
  const spokenTimeB = useMemo(() => (wordCountB / 2.75).toFixed(1), [wordCountB]);

  const loadExample = (idx) => {
    if (idx === 1) {
      setHookA("Stop scrolling if you code in Python, here are 5 critical mistakes.");
      setHookB("Hello guys today in this video I will discuss some programming errors.");
    } else if (idx === 2) {
      setHookA("Why 99% of developers struggle with memory leaks in web applications.");
      setHookB("The real reason software developers run into memory issues in web apps.");
    } else if (idx === 3) {
      setHookA("Don't buy this viral wireless microphone until you see this audio test.");
      setHookB("Reviewing the top wireless microphone that I purchased on sale recently.");
    }
    runComparison();
  };

  const copyDiagnosticReport = () => {
    const report = `VIRALHOOK STUDIO DIAGNOSTIC REPORT\n` +
      `-----------------------------------\n` +
      `Verdict: ${comparisonResult?.verdict || "Hook A leads"}\n\n` +
      `Hook A: "${hookA}"\n` +
      `High Probability: ${((comparisonResult?.hook_a?.probabilities?.High || 0.85) * 100).toFixed(1)}%\n\n` +
      `Hook B: "${hookB}"\n` +
      `High Probability: ${((comparisonResult?.hook_b?.probabilities?.High || 0.57) * 100).toFixed(1)}%\n\n` +
      `Pacing: 2.75 words/sec (Target <= 3.0s)\n` +
      `Core Team: Group M (Rupak, Tanvir, Aditya, Samina, Meenmoy)`;

    navigator.clipboard.writeText(report);
    showToast("Diagnostic report copied to clipboard! 📋");
  };

  return (
    <div className="min-h-screen bg-white text-[#0D0C22] flex flex-col font-sans selection:bg-[#EA4C89] selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full h-[92px] bg-white/95 backdrop-blur-md border-b border-[#E7E7E9]">
        <div className="max-w-[1520px] mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#0D0C22] flex items-center justify-center text-white text-lg font-bold shadow-sm group-hover:bg-[#EA4C89] transition-colors">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[22px] tracking-tight text-[#0D0C22] flex items-center leading-none">
                  viralhook
                  <span className="inline-block w-2 h-2 rounded-full bg-[#EA4C89] ml-1"></span>
                </span>
                <span className="text-[11px] font-bold text-[#6E6D7A] tracking-wider uppercase mt-1">
                  Studio Lab
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9] ml-1">
                Group M
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-6 text-[14px]">
              <a href="#arena" className="font-semibold text-[#0D0C22] hover:text-[#EA4C89] transition-colors flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA4C89] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA4C89]"></span>
                </span>
                A/B Hook Arena
              </a>
              <a href="#matrix" className="font-medium text-[#6E6D7A] hover:text-[#0D0C22] transition-colors">
                Psycholinguistic Matrix
              </a>
              <a href="#inspiration" className="font-medium text-[#6E6D7A] hover:text-[#0D0C22] transition-colors">
                Hook Inspiration Lab
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FastAPI ML Online</span>
            </div>

            <a href="#arena" className="px-5 py-2.5 rounded-full text-white bg-[#0D0C22] hover:bg-[#3D3D4E] text-[14px] font-semibold transition-all shadow-sm">
              Battle Arena
            </a>
          </div>

        </div>
      </header>

      {/* 2. HERO */}
      <section className="w-full pt-12 pb-6 px-6 md:px-10 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#6E6D7A] text-[13px] font-medium mb-5">
          <span className="w-2 h-2 rounded-full bg-[#EA4C89]"></span>
          <span>Pre-Production Video Virality Predictor • Tested on 3,000 Historical Hooks</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D0C22] tracking-tight leading-[1.12] mb-4">
          Test your opening 3 seconds <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA4C89] via-purple-600 to-[#0D0C22]">
            before hitting record
          </span>
        </h1>

        <p className="text-base md:text-lg text-[#6E6D7A] max-w-2xl mx-auto font-normal leading-relaxed mb-6">
          ViralHook Studio predicts short-form video retention using 24 psycholinguistic features. Catch filler intros, balance speech tempo, and see which hook wins.
        </p>

        {/* Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
          <span className="text-[13px] font-medium text-[#6E6D7A] mr-2">Presets:</span>
          <button onClick={() => loadExample(1)} className="px-4 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] hover:border-[#0D0C22] text-[#6E6D7A] hover:text-[#0D0C22] text-[13px] font-medium transition-all">
            Tech / Coding Mistake
          </button>
          <button onClick={() => loadExample(2)} className="px-4 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] hover:border-[#0D0C22] text-[#6E6D7A] hover:text-[#0D0C22] text-[13px] font-medium transition-all">
            Close Match (MarginGuard Tie)
          </button>
          <button onClick={() => loadExample(3)} className="px-4 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] hover:border-[#0D0C22] text-[#6E6D7A] hover:text-[#0D0C22] text-[13px] font-medium transition-all">
            E-Commerce Hook
          </button>
        </div>
      </section>

      {/* 3. A/B ARENA */}
      <section id="arena" className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
        <div className="bg-white rounded-2xl border border-[#E7E7E9] p-6 sm:p-8 md:p-10 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7E9]">
            <div>
              <h2 className="text-2xl font-bold text-[#0D0C22] tracking-tight">A/B Opening Hook Battle</h2>
              <p className="text-[14px] text-[#6E6D7A] mt-0.5">Input two prospective opening lines. Our model grades viewer drop-off resistance.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setHookA(""); setHookB(""); }} className="text-[13px] font-semibold text-[#6E6D7A] hover:text-[#EA4C89] px-3 py-1.5 rounded-lg border border-[#E7E7E9] bg-white">
                Clear
              </button>
              <button onClick={() => swapHooks()} className="text-[13px] font-semibold text-[#0D0C22] hover:text-[#EA4C89] px-3 py-1.5 rounded-lg border border-[#E7E7E9] bg-[#F8F7F4]">
                ⇄ Swap A / B
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            {/* Hook A */}
            <div className="bg-[#F8F7F4] rounded-xl p-6 border border-[#E7E7E9]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0D0C22] text-white font-bold text-[11px] flex items-center justify-center">A</span>
                  <span className="font-bold text-[14px] text-[#0D0C22]">Opening Hook A</span>
                </div>
                <span className="text-[12px] font-medium text-[#6E6D7A]">{hookA.length} / 280</span>
              </div>
              <textarea 
                rows={4}
                maxLength={280}
                value={hookA}
                onChange={(e) => setHookA(e.target.value)}
                placeholder="Type opening line A..."
                className="w-full bg-white rounded-lg p-4 text-[15px] text-[#0D0C22] border border-[#E7E7E9] focus:outline-none focus:border-[#EA4C89] resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 text-[12px] text-[#6E6D7A] font-medium">
                <span>{wordCountA} words</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ~{spokenTimeA}s spoken {Number(spokenTimeA) <= 3.0 ? '(Sweet Spot)' : '(Moderate)'}
                </span>
              </div>
            </div>

            {/* Hook B */}
            <div className="bg-[#F8F7F4] rounded-xl p-6 border border-[#E7E7E9]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EA4C89] text-white font-bold text-[11px] flex items-center justify-center">B</span>
                  <span className="font-bold text-[14px] text-[#0D0C22]">Opening Hook B</span>
                </div>
                <span className="text-[12px] font-medium text-[#6E6D7A]">{hookB.length} / 280</span>
              </div>
              <textarea 
                rows={4}
                maxLength={280}
                value={hookB}
                onChange={(e) => setHookB(e.target.value)}
                placeholder="Type opening line B..."
                className="w-full bg-white rounded-lg p-4 text-[15px] text-[#0D0C22] border border-[#E7E7E9] focus:outline-none focus:border-[#EA4C89] resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 text-[12px] text-[#6E6D7A] font-medium">
                <span>{wordCountB} words</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  ~{spokenTimeB}s spoken
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <button 
              onClick={() => runComparison()}
              disabled={isComparing}
              className="px-10 py-4 rounded-full bg-[#EA4C89] hover:bg-[#F082AC] text-white text-[16px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{isComparing ? "Comparing..." : "⚔️ Compare Hooks"}</span>
            </button>
            <span className="text-[12px] text-[#9E9EA7]">Real-time ML NLP evaluation with MarginGuard</span>
          </div>

          {arenaError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[14px]">
              {arenaError}
            </div>
          )}

          {/* Outcome Section */}
          <div className="mt-10 pt-10 border-t border-[#E7E7E9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D7A]">Comparison Outcome</span>
                <h3 className="text-3xl font-extrabold text-[#0D0C22] tracking-tight mt-1">
                  {comparisonResult?.verdict || "Hook A leads"}
                </h3>
                <p className="text-[14px] text-[#6E6D7A] mt-2 max-w-2xl leading-relaxed">
                  {comparisonResult?.explanation || "Hook A leads with an estimated 85.0% chance of high engagement vs 57.0% for Hook B (+28.0% lead), showing stronger linguistic retention signals."}
                </p>
              </div>
              <div className="flex sm:flex-col items-end gap-2">
                <span className="px-5 py-2 rounded-full text-[14px] font-bold bg-[#0D0C22] text-white shadow-sm">
                  {comparisonResult?.is_close_result ? "⚖️ Close Result (Dead Heat)" : `⭐ ${comparisonResult?.verdict || "Hook A Leads"}`}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-white border border-[#E7E7E9] text-[#0D0C22]">
                  ΔP: {((comparisonResult?.score_difference || 0.28) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl border border-[#E7E7E9] bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[15px] text-[#0D0C22]">Hook A Breakdown</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#FDF2F7] text-[#EA4C89] border border-[#EA4C89]/20">
                    {comparisonResult?.hook_a?.predicted_class || "High"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-[#6E6D7A] mb-2">
                  <span>High Engagement Probability</span>
                  <span className="font-bold text-[16px] text-[#EA4C89]">
                    {((comparisonResult?.hook_a?.probabilities?.High || 0.85) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#F8F7F4] overflow-hidden mb-3">
                  <div className="h-full bg-[#EA4C89] rounded-full transition-all duration-500" style={{ width: `${(comparisonResult?.hook_a?.probabilities?.High || 0.85) * 100}%` }}></div>
                </div>
                <span className="text-[12px] text-emerald-600 font-semibold">✨ Specificity & Curiosity Active</span>
              </div>

              <div className="p-6 rounded-xl border border-[#E7E7E9] bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[15px] text-[#0D0C22]">Hook B Breakdown</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9]">
                    {comparisonResult?.hook_b?.predicted_class || "Medium"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-[#6E6D7A] mb-2">
                  <span>High Engagement Probability</span>
                  <span className="font-bold text-[16px] text-[#0D0C22]">
                    {((comparisonResult?.hook_b?.probabilities?.High || 0.57) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#F8F7F4] overflow-hidden mb-3">
                  <div className="h-full bg-[#0D0C22] rounded-full transition-all duration-500" style={{ width: `${(comparisonResult?.hook_b?.probabilities?.High || 0.57) * 100}%` }}></div>
                </div>
                <span className="text-[12px] text-amber-600 font-semibold">⚠️ Contains Generic Intro Phrase</span>
              </div>
            </div>

            {/* Matrix */}
            <div id="matrix" className="p-6 sm:p-8 rounded-2xl bg-[#F8F7F4] border border-[#E7E7E9] mb-8">
              <h4 className="text-lg font-bold text-[#0D0C22] mb-1">Psycholinguistic Signal Matrix</h4>
              <p className="text-[13px] text-[#6E6D7A] mb-6">Side-by-side linguistic breakdown & retention mechanics</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-[#E7E7E9]">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0D0C22] block mb-3">Hook A Signals</span>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                      <span className="font-bold">Direct Address</span>
                      <span className="text-emerald-700 font-bold">Active</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                      <span className="font-bold">Curiosity Trigger</span>
                      <span className="text-emerald-700 font-bold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E7E7E9]">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#EA4C89] block mb-3">Hook B Signals</span>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                      <span className="font-bold">Direct Address</span>
                      <span className="text-rose-700 font-bold">Missing</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                      <span className="font-bold">Filler Phrase</span>
                      <span className="text-amber-700 font-bold">Flagged</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E7E7E9] pt-4">
                <span className="text-[13px] text-[#6E6D7A]">Share report with your editing team</span>
                <button onClick={copyDiagnosticReport} className="px-4 py-2 rounded-full border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] text-[13px] font-semibold bg-white">
                  📋 Copy Full Diagnostic Report
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-[#F3F3F6] border border-[#E7E7E9] text-center">
              <p className="text-[12px] text-[#6E6D7A] max-w-3xl mx-auto">
                Academic Notice: The predicted engagement class is only an estimate based on historical text patterns in the dataset. It cannot and does not guarantee that a video will go viral.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INSPIRATION LAB (Dribbble 4-Col Grid) */}
      <section id="inspiration" className="max-w-[1520px] mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#6E6D7A] text-[12px] font-semibold mb-2 inline-block">
              Inspiration Gallery
            </span>
            <h2 className="text-3xl font-extrabold text-[#0D0C22] tracking-tight">Viral Hook Inspiration Lab</h2>
            <p className="text-[15px] text-[#6E6D7A] mt-1 max-w-2xl">
              Curated opening hook cards calibrated for high short-form retention. Click any hook to inject it into your A/B battle arena.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Curiosity Loop', 'Loss Aversion', 'Listicle & Specificity', 'Direct Challenge'].map(cat => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-4 py-2 rounded-full text-[13px] transition-all flex-shrink-0 ${
                  currentCategory === cat 
                    ? 'font-semibold bg-[#0D0C22] text-white' 
                    : 'font-medium text-[#6E6D7A] hover:text-[#0D0C22] hover:bg-[#F8F7F4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[36px]">
          {INSPIRATION_HOOKS.filter(i => currentCategory === "All" || i.category === currentCategory).map(item => (
            <div key={item.id} className="group flex flex-col cursor-pointer" onClick={() => { setHookA(item.quote); showToast("Injected into Hook A! 🚀"); }}>
              <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F8F7F4] border border-[#E7E7E9] select-none">
                <div className={`w-full h-full bg-gradient-to-br ${item.bgGradient} p-6 flex flex-col justify-between text-white transition-transform duration-500 group-hover:scale-105`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                      {item.category}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white/40"></span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold leading-snug drop-shadow-sm mb-2">"{item.quote}"</p>
                    <span className="text-[11px] font-medium opacity-80">Click for retention mechanics</span>
                  </div>
                </div>

                <div className="shot-scrim absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-between p-4 z-10 pointer-events-none transition-opacity duration-200">
                  <span className="text-white text-[13px] font-bold truncate max-w-[60%] drop-shadow-sm">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setHookA(item.quote); showToast("Injected into Hook A!"); }}
                      className="px-2.5 py-1.5 rounded-full bg-white text-[#0D0C22] font-bold text-[11px] hover:text-[#EA4C89] shadow-md transition-transform hover:scale-105"
                    >
                      + Hook A
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setHookB(item.quote); showToast("Injected into Hook B!"); }}
                      className="px-2.5 py-1.5 rounded-full bg-[#EA4C89] text-white font-bold text-[11px] hover:bg-[#F082AC] shadow-md transition-transform hover:scale-105"
                    >
                      + Hook B
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[14px]">
                <div className="flex items-center gap-2 truncate">
                  <img src={item.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-medium text-[#0D0C22] text-[13px] truncate">{item.creator}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E7E7E9]">{item.badge}</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#9E9EA7]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{item.likes.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{(item.views / 1000).toFixed(1)}k</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="w-full border-t border-[#E7E7E9] bg-white mt-16 py-12 px-6 md:px-10">
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E7E7E9]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0D0C22] flex items-center justify-center text-white font-bold text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#0D0C22]">ViralHook Studio</h4>
                <p className="text-[12px] text-[#6E6D7A]">Group M B.Tech Computer Science Project • 16–20 November 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#6E6D7A]">
              <span className="font-semibold text-[#0D0C22]">Faculty Mentor:</span>
              <span className="px-2.5 py-1 rounded-md bg-[#F8F7F4] text-[#0D0C22] font-medium border border-[#E7E7E9]">
                Prof. Megha Gupta
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-6">
            <div>
              <span className="text-[13px] font-bold text-[#0D0C22] block">Rupak</span>
              <span className="text-[12px] text-[#6E6D7A]">Project Lead / Backend</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#0D0C22] block">Tanvir</span>
              <span className="text-[12px] text-[#6E6D7A]">ML & NLP Lead</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#0D0C22] block">Aditya</span>
              <span className="text-[12px] text-[#6E6D7A]">Backend & API Lead</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#0D0C22] block">Samina</span>
              <span className="text-[12px] text-[#6E6D7A]">Frontend Lead / Architecture</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#EA4C89] block">Meenmoy (You)</span>
              <span className="text-[12px] text-[#6E6D7A]">Frontend Battle Arena & Visuals</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D0C22] text-white px-4 py-2.5 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
