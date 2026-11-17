import React, { useState, useMemo, useCallback } from 'react';
import { 
  Heart, Bookmark, Eye, Search, SlidersHorizontal, ChevronDown, 
  X, Check, Zap 
} from 'lucide-react';
import { useHookStore } from './store/useHookStore';

const INITIAL_SHOTS = [
  {
    id: 1,
    title: "Nebula — AI Video Hook Generator",
    category: "Viral Hooks",
    tags: ["Curiosity Loop", "Viral Hooks", "TikTok Hooks", "SaaS Demo"],
    color: "#EA4C89",
    colors: ["#EA4C89", "#0D0C22", "#FDF2F7", "#6366F1"],
    creator: {
      name: "Studio Voxel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      badge: "TEAM"
    },
    likes: 1842,
    views: 24800,
    liked: false,
    saved: false,
    bgGradient: "from-pink-500 via-rose-500 to-indigo-600",
    headline: "High-retention storytelling for TikTok & Reels",
    description: "Engineered specifically to solve the 2.5-second swipe cliff. Nebula pairs psychological pattern interrupts with clean minimalist micro-interactions."
  },
  {
    id: 2,
    title: "Fintech Mobile Banking 3.0",
    category: "Mobile",
    tags: ["Mobile UI", "Product Design", "Direct Address"],
    color: "#6366F1",
    colors: ["#6366F1", "#10B981", "#0D0C22", "#F3F3F6"],
    creator: {
      name: "Antonina Croft",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      badge: "PRO"
    },
    likes: 2190,
    views: 31200,
    liked: false,
    saved: false,
    bgGradient: "from-blue-600 via-indigo-600 to-purple-800",
    headline: "Next-gen personal wealth overview",
    description: "Zero-latency banking interface with dynamic spending forecast widgets, biometric authorization, and dark-mode spatial depth."
  },
  {
    id: 3,
    title: "Hyperdrive 3D Brand Identity",
    category: "Branding",
    tags: ["Branding", "Animation", "Curiosity Loop"],
    color: "#10B981",
    colors: ["#10B981", "#0D0C22", "#E7E7E9", "#3B82F6"],
    creator: {
      name: "Koto Motion",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      badge: "TEAM"
    },
    likes: 3410,
    views: 48900,
    liked: true,
    saved: true,
    bgGradient: "from-emerald-400 via-teal-600 to-slate-900",
    headline: "Fluid spatial brand system for autonomous vehicles",
    description: "A complete kinetic identity system designed in Cinema 4D and Blender, prioritizing high-velocity motion curves and tactile tactile feel."
  },
  {
    id: 4,
    title: "Chronos — SaaS Analytics Dashboard",
    category: "Product Design",
    tags: ["Product Design", "SaaS Demo", "Loss Aversion"],
    color: "#0D0C22",
    colors: ["#0D0C22", "#EA4C89", "#F8F7F4", "#9E9EA7"],
    creator: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      badge: "PRO"
    },
    likes: 980,
    views: 14200,
    liked: false,
    saved: false,
    bgGradient: "from-slate-800 via-slate-900 to-black",
    headline: "Real-time creator retention & LTV telemetry",
    description: "Streamlined data density without visual clutter. Custom canvas rendering enables rendering 100,000 live data points at 60fps."
  },
  {
    id: 5,
    title: "Kinetic Typography & Sound Design",
    category: "Typography",
    tags: ["Typography", "Animation", "TikTok Hooks"],
    color: "#F59E0B",
    colors: ["#F59E0B", "#0D0C22", "#FFFFFF", "#EA4C89"],
    creator: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      badge: "PRO"
    },
    likes: 1450,
    views: 19800,
    liked: false,
    saved: false,
    bgGradient: "from-amber-400 via-orange-500 to-red-600",
    headline: "Variable font weight choreography",
    description: "Exploring musicality and speech cadence through variable typography weight modulation, paired with procedural audio reactive triggers."
  },
  {
    id: 6,
    title: "Aether — Spatial Audio Interface",
    category: "Animation",
    tags: ["Animation", "Mobile UI", "Curiosity Loop"],
    color: "#3B82F6",
    colors: ["#3B82F6", "#8B5CF6", "#0D0C22", "#F3F3F6"],
    creator: {
      name: "Studio Lumina",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      badge: "TEAM"
    },
    likes: 2780,
    views: 39100,
    liked: false,
    saved: false,
    bgGradient: "from-cyan-400 via-blue-600 to-indigo-900",
    headline: "Immersive soundscape navigation for visionOS",
    description: "Translating 3D head-tracking coordinates into tactile, glowing sonic spheres. High-contrast white surfaces meet deep acoustic reflections."
  },
  {
    id: 7,
    title: "Viral Hook Blueprint: TikTok Edition",
    category: "Viral Hooks",
    tags: ["Viral Hooks", "TikTok Hooks", "Loss Aversion", "High Retaining"],
    color: "#EA4C89",
    colors: ["#EA4C89", "#F8F7F4", "#0D0C22", "#10B981"],
    creator: {
      name: "Meenmoy Bhuyan",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
      badge: "TEAM"
    },
    likes: 4120,
    views: 62400,
    liked: true,
    saved: false,
    bgGradient: "from-rose-500 via-fuchsia-600 to-indigo-700",
    headline: "A/B Opening Hook Battle Architecture",
    description: "Tested across 3,000 video openers. Combines 24 psycholinguistic features with logistic probability grading to predict drop-off curves."
  },
  {
    id: 8,
    title: "Minimalist Editorial Layout System",
    category: "Web Design",
    tags: ["Web Design", "Typography", "Direct Address"],
    color: "#0D0C22",
    colors: ["#0D0C22", "#E7E7E9", "#FFFFFF", "#6E6D7A"],
    creator: {
      name: "Sophie Dubois",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      badge: "PRO"
    },
    likes: 1670,
    views: 22300,
    liked: false,
    saved: false,
    bgGradient: "from-neutral-200 via-stone-400 to-zinc-700",
    headline: "Generous whitespace & asymmetric grid composition",
    description: "An editorial publishing framework inspired by Swiss typography principles, featuring pure white primary canvas and subtle 1px hairlines."
  }
];

export function App() {
  const [shots, setShots] = useState(INITIAL_SHOTS);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  
  // Modals
  const [activeModalShot, setActiveModalShot] = useState(null);
  const [isArenaModalOpen, setIsArenaModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Hook Store Integration
  const {
    hookA,
    hookB,
    setHookA,
    setHookB,
    runComparison,
    isComparing,
    comparisonResult,
    error: arenaError
  } = useHookStore();

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  const handleToggleLike = (id, e) => {
    e?.stopPropagation();
    setShots(prev => prev.map(s => {
      if (s.id === id) {
        const nextLiked = !s.liked;
        const nextCount = s.likes + (nextLiked ? 1 : -1);
        if (nextLiked) showToast("Added to your Liked Shots ❤️");
        return { ...s, liked: nextLiked, likes: nextCount };
      }
      return s;
    }));
  };

  const handleToggleSave = (id, e) => {
    e?.stopPropagation();
    setShots(prev => prev.map(s => {
      if (s.id === id) {
        const nextSaved = !s.saved;
        if (nextSaved) showToast("Saved to your Collection 📌");
        return { ...s, saved: nextSaved };
      }
      return s;
    }));
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`);
  };

  // Filter & Sort calculation
  const displayedShots = useMemo(() => {
    let result = shots.filter(shot => {
      if (currentCategory !== "All" && shot.category !== currentCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = shot.title.toLowerCase().includes(q);
        const matchCreator = shot.creator.name.toLowerCase().includes(q);
        const matchTags = shot.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCreator && !matchTags) return false;
      }
      if (activeTags.length > 0) {
        const hasTag = activeTags.some(t => shot.tags.includes(t));
        if (!hasTag) return false;
      }
      if (activeColor && activeColor !== 'all') {
        if (shot.color !== activeColor) return false;
      }
      return true;
    });

    if (sortOption === "Popular" || sortOption === "Most Liked") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortOption === "New & Noteworthy") {
      result.sort((a, b) => b.views - a.views);
    } else if (sortOption === "Most Viral Potential") {
      result.sort((a, b) => (b.tags.includes("High Retaining") ? 1 : 0) - (a.tags.includes("High Retaining") ? 1 : 0));
    }

    return result;
  }, [shots, currentCategory, searchQuery, activeTags, activeColor, sortOption]);

  const toggleTagFilter = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#0D0C22] flex flex-col font-sans selection:bg-[#EA4C89] selection:text-white">
      
      {/* 1. STICKY TOP NAVBAR (height: 92px) */}
      <header className="sticky top-0 z-40 w-full h-[92px] bg-white/95 backdrop-blur-md border-b border-[#E7E7E9]">
        <div className="max-w-[1520px] mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Nav */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-1 group text-decoration-none">
              <span className="font-extrabold text-[28px] tracking-tight text-[#0D0C22] flex items-center select-none">
                dribbble
                <span className="inline-block w-2 h-2 rounded-full bg-[#EA4C89] ml-0.5 group-hover:scale-125 transition-transform"></span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9] ml-1">
                Studio
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => setCurrentCategory("All")} 
                className="text-[14px] font-medium text-[#0D0C22] hover:text-[#EA4C89] transition-colors flex items-center gap-1"
              >
                Explore <ChevronDown className="w-3.5 h-3.5 text-[#6E6D7A]" />
              </button>
              
              <button 
                onClick={() => setIsArenaModalOpen(true)} 
                className="text-[14px] font-medium text-[#0D0C22] hover:text-[#EA4C89] transition-colors flex items-center gap-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA4C89] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA4C89]"></span>
                </span>
                A/B Hook Arena
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDF2F7] text-[#EA4C89] px-2 py-0.5 rounded-full border border-[#EA4C89]/20">
                  Live ML
                </span>
              </button>

              <button 
                onClick={() => setCurrentCategory("Viral Hooks")} 
                className="text-[14px] font-medium text-[#6E6D7A] hover:text-[#0D0C22] transition-colors"
              >
                Hook Inspiration
              </button>

              <a href="#pro" className="text-[14px] font-medium text-[#6E6D7A] hover:text-[#0D0C22] transition-colors">
                Go Pro
              </a>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-[480px] hidden md:flex items-center">
            <div className="w-full h-[48px] rounded-full bg-[#F3F3F6] border border-transparent focus-within:border-[#E7E7E9] focus-within:bg-white px-4 flex items-center gap-3 transition-all">
              <div className="flex items-center border-r border-[#E7E7E9] pr-3 text-[13px] font-medium text-[#0D0C22]">
                <span>Shots</span>
                <ChevronDown className="w-3 h-3 text-[#6E6D7A] ml-1" />
              </div>
              <input 
                type="text" 
                placeholder="Search 18M+ shots & viral hooks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[#0D0C22] placeholder-[#9E9EA7] focus:outline-none"
              />
              <button 
                onClick={() => {}} 
                className="w-8 h-8 rounded-full bg-[#EA4C89] hover:bg-[#F082AC] text-white flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Auth & CTAs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsArenaModalOpen(true)} 
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#EA4C89] bg-[#FDF2F7] border border-[#EA4C89]/20 hover:bg-[#EA4C89] hover:text-white transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>A/B Hook Arena</span>
            </button>

            <a href="#login" className="text-[14px] font-medium text-[#0D0C22] hover:text-[#EA4C89] transition-colors">
              Log in
            </a>

            <a href="#signup" className="px-5 py-2.5 rounded-full text-white bg-[#0D0C22] hover:bg-[#3D3D4E] text-[14px] font-semibold transition-all shadow-sm">
              Sign up
            </a>
          </div>

        </div>
      </header>

      {/* 2. HERO / DISCOVERY HEADER */}
      <section className="w-full pt-12 pb-8 px-6 md:px-10 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#6E6D7A] text-[13px] font-medium mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Over 3 million designers & creators share their top converting work</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D0C22] tracking-tight leading-[1.12] mb-4">
          Discover the world’s top <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA4C89] via-purple-600 to-[#0D0C22]">
            viral hooks & design shots
          </span>
        </h1>

        <p className="text-base md:text-lg text-[#6E6D7A] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Explore high-retention video hooks, design architectures, and short-form storytelling patterns crafted by the top 1% of creators.
        </p>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
          <span className="text-[13px] font-medium text-[#6E6D7A] mr-2">Trending:</span>
          {['TikTok Hooks', 'Animation', 'Curiosity Loop', 'Mobile UI', 'SaaS Demo', 'Branding'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setSearchQuery(tag)} 
              className="px-4 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] hover:border-[#0D0C22] text-[#6E6D7A] hover:text-[#0D0C22] text-[13px] font-medium transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 3. STICKY FILTER & CATEGORY BAR */}
      <section className="sticky top-[92px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E7E9] py-4">
        <div className="max-w-[1520px] mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
          
          {/* Left: Popular Dropdown */}
          <div className="relative flex-shrink-0">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)} 
              className="px-4 py-2.5 rounded-lg border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] text-[14px] font-medium flex items-center gap-2 bg-white transition-colors"
            >
              <span>{sortOption}</span>
              <ChevronDown className="w-4 h-4 text-[#6E6D7A]" />
            </button>
            {isSortOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E7E7E9] py-2 z-50">
                {['Popular', 'New & Noteworthy', 'Most Viral Potential', 'Most Liked'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSortOption(opt); setIsSortOpen(false); }} 
                    className="w-full text-left px-4 py-2 text-[14px] text-[#0D0C22] hover:bg-[#F8F7F4] font-medium flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    {sortOption === opt && <span className="text-[#EA4C89]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Category Pills */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 px-2">
            {['All', 'Viral Hooks', 'Animation', 'Branding', 'Illustration', 'Mobile', 'Product Design', 'Typography', 'Web Design'].map(cat => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-4 py-2 rounded-full text-[14px] transition-all flex-shrink-0 ${
                  currentCategory === cat 
                    ? 'font-semibold bg-[#F8F7F4] text-[#0D0C22]' 
                    : 'font-medium text-[#6E6D7A] hover:text-[#0D0C22] hover:bg-[#F8F7F4]'
                }`}
              >
                {cat === 'All' ? 'Discover' : cat}
              </button>
            ))}
          </div>

          {/* Right: Filters Button */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)} 
              className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium flex items-center gap-2 transition-colors ${
                isFilterDrawerOpen 
                  ? 'border-[#0D0C22] bg-[#F8F7F4] text-[#0D0C22]' 
                  : 'border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] bg-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

        </div>

        {/* Collapsible 4-Col Drawer */}
        {isFilterDrawerOpen && (
          <div className="max-w-[1520px] mx-auto px-6 md:px-10 border-t border-[#E7E7E9] mt-4 pt-6 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-[13px] font-bold text-[#0D0C22] uppercase tracking-wider mb-3">Hook Archetypes</h4>
                <div className="flex flex-wrap gap-2">
                  {['Curiosity Loop', 'Direct Address', 'Loss Aversion', 'High Retaining'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors ${
                        activeTags.includes(tag) 
                          ? 'bg-[#0D0C22] text-white border-[#0D0C22]' 
                          : 'border-[#E7E7E9] text-[#6E6D7A] hover:border-[#0D0C22]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D0C22] uppercase tracking-wider mb-3">Dominant Color</h4>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {['#EA4C89', '#6366F1', '#10B981', '#F59E0B', '#0D0C22', '#3B82F6'].map(col => (
                    <button 
                      key={col}
                      onClick={() => setActiveColor(activeColor === col ? null : col)}
                      style={{ backgroundColor: col }}
                      className={`w-7 h-7 rounded-full ring-offset-2 hover:scale-110 transition-transform ${
                        activeColor === col ? 'ring-4 ring-[#0D0C22]' : ''
                      }`}
                    />
                  ))}
                  <button 
                    onClick={() => setActiveColor(null)} 
                    className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#F8F7F4] text-[#6E6D7A]"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D0C22] uppercase tracking-wider mb-3">Timeframe</h4>
                <div className="flex flex-col gap-1.5 text-[13px]">
                  <label className="flex items-center gap-2 text-[#0D0C22] cursor-pointer">
                    <input type="radio" name="timeframe" defaultChecked className="text-[#EA4C89]" />
                    <span>Now & Trending</span>
                  </label>
                  <label className="flex items-center gap-2 text-[#6E6D7A] cursor-pointer">
                    <input type="radio" name="timeframe" className="text-[#EA4C89]" />
                    <span>This Past Month</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D0C22] uppercase tracking-wider mb-3">Model & Tools</h4>
                <div className="flex flex-wrap gap-2 text-[12px] text-[#6E6D7A]">
                  <span className="px-3 py-1 rounded-md bg-[#F8F7F4] border border-[#E7E7E9]">FastAPI ML</span>
                  <span className="px-3 py-1 rounded-md bg-[#F8F7F4] border border-[#E7E7E9]">Figma</span>
                  <span className="px-3 py-1 rounded-md bg-[#F8F7F4] border border-[#E7E7E9]">After Effects</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. SHOWCASE CARD GRID (36px gaps) */}
      <main className="max-w-[1520px] mx-auto px-6 md:px-10 py-10 flex-1">
        {displayedShots.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-bold text-[#0D0C22] mb-1">No shots found</h3>
            <p className="text-[#6E6D7A] text-[14px] mb-6">Try clearing your filters or search keywords.</p>
            <button 
              onClick={() => { setSearchQuery(""); setCurrentCategory("All"); setActiveTags([]); setActiveColor(null); }}
              className="px-5 py-2.5 rounded-full bg-[#0D0C22] text-white text-[14px] font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[36px]">
            {displayedShots.map((shot) => (
              <div key={shot.id} className="group flex flex-col cursor-pointer">
                
                {/* 4:3 Aspect Ratio Thumbnail */}
                <div 
                  onClick={() => setActiveModalShot(shot)}
                  className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F8F7F4] border border-[#E7E7E9]/60 select-none"
                >
                  <div className={`w-full h-full bg-gradient-to-br ${shot.bgGradient} p-6 flex flex-col justify-between text-white transition-transform duration-500 ease-out group-hover:scale-105`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                        {shot.category}
                      </span>
                      <span className="w-3 h-3 rounded-full bg-white/40"></span>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">{shot.tags[0]}</span>
                      <h4 className="text-xl font-extrabold tracking-tight leading-snug drop-shadow-sm">{shot.title}</h4>
                    </div>
                  </div>

                  {/* Scrim Overlay */}
                  <div className="shot-scrim absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-between p-4 z-10 pointer-events-none transition-opacity duration-200">
                    <span className="text-white text-[15px] font-semibold tracking-tight truncate max-w-[65%] drop-shadow-sm">
                      {shot.title}
                    </span>
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button 
                        onClick={(e) => handleToggleSave(shot.id, e)}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0D0C22] hover:text-[#EA4C89] shadow-md transition-transform hover:scale-105 active:scale-95"
                      >
                        <Bookmark className={`w-4 h-4 ${shot.saved ? 'text-[#EA4C89] fill-[#EA4C89]' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => handleToggleLike(shot.id, e)}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0D0C22] hover:text-[#EA4C89] shadow-md transition-transform hover:scale-105 active:scale-95"
                      >
                        <Heart className={`w-4 h-4 ${shot.liked ? 'text-[#EA4C89] fill-[#EA4C89]' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="mt-2 flex items-center justify-between text-[14px]">
                  <div className="flex items-center gap-2 truncate">
                    <img src={shot.creator.avatar} alt={shot.creator.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-medium text-[#0D0C22] hover:text-[#EA4C89] transition-colors truncate">
                      {shot.creator.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E7E7E9] group-hover:bg-[#EA4C89] group-hover:text-white transition-colors">
                      {shot.creator.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[12px] text-[#9E9EA7]">
                    <span className="flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${shot.liked ? 'text-[#EA4C89] fill-[#EA4C89]' : ''}`} />
                      <span>{shot.likes.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{(shot.views / 1000).toFixed(1)}k</span>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. DETAIL LIGHTBOX MODAL */}
      {activeModalShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div onClick={() => setActiveModalShot(null)} className="absolute inset-0 bg-[#0D0C22]/60 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-y-auto no-scrollbar z-10 flex flex-col">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#E7E7E9] px-6 sm:px-8 py-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <img src={activeModalShot.creator.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-[16px] font-bold text-[#0D0C22] leading-tight">{activeModalShot.title}</h3>
                  <div className="flex items-center gap-2 text-[13px] text-[#6E6D7A] mt-0.5">
                    <span className="font-medium text-[#0D0C22]">{activeModalShot.creator.name}</span>
                    <span>•</span>
                    <button className="text-[#EA4C89] font-semibold hover:underline">Follow</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => handleToggleLike(activeModalShot.id, e)} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E7E7E9] text-[13px] font-semibold hover:border-[#EA4C89]"
                >
                  <Heart className={`w-4 h-4 ${activeModalShot.liked ? 'text-[#EA4C89] fill-[#EA4C89]' : 'text-[#6E6D7A]'}`} />
                  <span>{activeModalShot.likes.toLocaleString()}</span>
                </button>
                <button 
                  onClick={() => {
                    const shot = activeModalShot;
                    setActiveModalShot(null);
                    setHookA(shot.headline);
                    setHookB("Hey guys, in this video I will discuss some programming tips.");
                    setIsArenaModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#0D0C22] text-white text-[13px] font-semibold hover:bg-[#3D3D4E]"
                >
                  Test In A/B Arena
                </button>
                <button 
                  onClick={() => setActiveModalShot(null)} 
                  className="w-9 h-9 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] flex items-center justify-center text-[#6E6D7A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-10 py-8">
              <div className={`w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center text-white mb-8 bg-gradient-to-br ${activeModalShot.bgGradient} p-8 sm:p-12`}>
                <div className="max-w-xl text-center">
                  <span className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-4 inline-block">
                    {activeModalShot.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">{activeModalShot.title}</h1>
                  <p className="text-white/80 text-[15px]">{activeModalShot.headline}</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl font-bold text-[#0D0C22] mb-4">Crafting the high-retention hook architecture</h2>
                <p className="text-base text-[#6E6D7A] leading-relaxed mb-6">{activeModalShot.description}</p>
                
                <div className="border-t border-b border-[#E7E7E9] py-6 my-6">
                  <h4 className="text-[12px] font-bold text-[#0D0C22] uppercase tracking-wider mb-3">Color Palette (Click to Copy Hex)</h4>
                  <div className="flex items-center gap-3">
                    {activeModalShot.colors.map(col => (
                      <button 
                        key={col}
                        onClick={() => copyHex(col)}
                        style={{ backgroundColor: col }}
                        className="w-8 h-8 rounded-full border border-[#E7E7E9] hover:scale-110 active:scale-95 transition-transform"
                        title={`Copy ${col}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. A/B HOOK BATTLE LAB MODAL */}
      {isArenaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div onClick={() => setIsArenaModalOpen(false)} className="absolute inset-0 bg-[#0D0C22]/60 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-4xl max-h-[94vh] bg-white rounded-2xl shadow-2xl overflow-y-auto no-scrollbar z-10 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between pb-6 border-b border-[#E7E7E9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EA4C89] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0D0C22] tracking-tight flex items-center gap-2">
                    ViralHook A/B Battle Lab
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Trained ML Ready
                    </span>
                  </h2>
                  <p className="text-[13px] text-[#6E6D7A]">Test two opening video hooks before recording to maximize viewer retention.</p>
                </div>
              </div>
              <button onClick={() => setIsArenaModalOpen(false)} className="w-8 h-8 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] flex items-center justify-center text-[#6E6D7A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 py-4">
              <span className="text-[12px] font-semibold text-[#6E6D7A]">Presets:</span>
              <button 
                onClick={() => {
                  setHookA("Stop scrolling if you code in Python, here are 5 critical mistakes.");
                  setHookB("Hello guys today in this video I will discuss some programming errors.");
                }} 
                className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] text-[#0D0C22]"
              >
                Tech / Coding Mistake
              </button>
              <button 
                onClick={() => {
                  setHookA("Why 99% of creators secretly fail at TikTok retention.");
                  setHookB("The real reason why most creator videos never reach the FYP.");
                }} 
                className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] text-[#0D0C22]"
              >
                Close Match (MarginGuard Tie)
              </button>
            </div>

            {/* Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              <div className="bg-[#F8F7F4] rounded-xl p-5 border border-[#E7E7E9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0D0C22] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0D0C22] text-white flex items-center justify-center text-[10px]">A</span>
                    Opening Hook A
                  </span>
                  <span className="text-[11px] text-[#6E6D7A] font-medium">{hookA.length} / 280</span>
                </div>
                <textarea 
                  rows={4}
                  maxLength={280}
                  value={hookA}
                  onChange={(e) => setHookA(e.target.value)}
                  className="w-full bg-white rounded-lg p-3 text-[14px] text-[#0D0C22] border border-[#E7E7E9] focus:outline-none focus:border-[#EA4C89] resize-none"
                  placeholder="Type opening hook A..."
                />
              </div>

              <div className="bg-[#F8F7F4] rounded-xl p-5 border border-[#E7E7E9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0D0C22] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#EA4C89] text-white flex items-center justify-center text-[10px]">B</span>
                    Opening Hook B
                  </span>
                  <span className="text-[11px] text-[#6E6D7A] font-medium">{hookB.length} / 280</span>
                </div>
                <textarea 
                  rows={4}
                  maxLength={280}
                  value={hookB}
                  onChange={(e) => setHookB(e.target.value)}
                  className="w-full bg-white rounded-lg p-3 text-[14px] text-[#0D0C22] border border-[#E7E7E9] focus:outline-none focus:border-[#EA4C89] resize-none"
                  placeholder="Type opening hook B..."
                />
              </div>
            </div>

            <div className="flex items-center justify-center my-4">
              <button 
                onClick={() => runComparison()}
                disabled={isComparing}
                className="px-8 py-3 rounded-full bg-[#EA4C89] hover:bg-[#F082AC] text-white text-[14px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{isComparing ? "Comparing..." : "⚔️ Run A/B Comparison"}</span>
              </button>
            </div>

            {arenaError && (
              <div className="my-2 p-3 rounded-lg bg-rose-50 text-rose-600 text-[13px] border border-rose-200">
                {arenaError}
              </div>
            )}

            {comparisonResult && (
              <div className="mt-4 pt-6 border-t border-[#E7E7E9]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9] mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D7A]">Comparison Verdict</span>
                    <h3 className="text-2xl font-bold text-[#0D0C22] tracking-tight mt-0.5">{comparisonResult.verdict}</h3>
                    <p className="text-[13px] text-[#6E6D7A] mt-1 max-w-xl">{comparisonResult.explanation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full text-[13px] font-bold bg-[#0D0C22] text-white">
                      {comparisonResult.is_close_result ? "⚖️ Close Match" : `⭐ ${comparisonResult.verdict}`}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-white border border-[#E7E7E9] text-[#0D0C22]">
                      ΔP: {(comparisonResult.score_difference * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#E7E7E9] bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[#0D0C22]">Hook A High Probability</span>
                      <span className="text-[15px] font-bold text-[#EA4C89]">
                        {((comparisonResult.hook_a?.probabilities?.High || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F8F7F4] overflow-hidden">
                      <div 
                        className="h-full bg-[#EA4C89] rounded-full transition-all duration-500" 
                        style={{ width: `${(comparisonResult.hook_a?.probabilities?.High || 0) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E7E7E9] bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[#0D0C22]">Hook B High Probability</span>
                      <span className="text-[15px] font-bold text-[#6E6D7A]">
                        {((comparisonResult.hook_b?.probabilities?.High || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F8F7F4] overflow-hidden">
                      <div 
                        className="h-full bg-[#0D0C22] rounded-full transition-all duration-500" 
                        style={{ width: `${(comparisonResult.hook_b?.probabilities?.High || 0) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D0C22] text-white px-4 py-2.5 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer className="w-full border-t border-[#E7E7E9] bg-white mt-16 py-12 px-6 md:px-10">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[22px] tracking-tight text-[#0D0C22]">
              dribbble
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EA4C89] ml-0.5"></span>
            </span>
            <span className="text-[13px] text-[#6E6D7A]">
              © 2026 ViralHook Studio • Built for Creators & Design Teams
            </span>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-medium text-[#6E6D7A]">
            <a href="#shots" className="hover:text-[#0D0C22] transition-colors">For designers</a>
            <a href="#hire" className="hover:text-[#0D0C22] transition-colors">Hire talent</a>
            <a href="#inspiration" className="hover:text-[#0D0C22] transition-colors">Inspiration</a>
            <a href="#privacy" className="hover:text-[#0D0C22] transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
