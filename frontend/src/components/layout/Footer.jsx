import React from 'react';
import { ShieldCheck, Cpu, Code2, Users, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#E7E7E9] bg-white mt-20 py-12 text-xs text-[#6E6D7A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-extrabold text-[#0D0C22] text-sm tracking-tight flex items-center">
              viralhook
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EA4C89] ml-1"></span>
            </span>
            <span>•</span>
            <span className="font-medium text-[#0D0C22]">Group M B.Tech Project</span>
            <span>•</span>
            <span className="text-[#EA4C89] font-medium">16–20 November 2026</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#0D0C22] font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>Faculty Mentor: Prof. Megha Gupta</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Sub-50ms CPU ML Inference
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#EA4C89] border border-[#EA4C89]/20 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA4C89]" /> Close Result Guard (ΔP ≤ 0.08)
            </span>
          </div>
        </div>

        {/* Team Credits Grid */}
        <div className="pt-6 border-t border-[#E7E7E9] grid grid-cols-2 sm:grid-cols-5 gap-4 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
            <div className="font-bold text-[#0D0C22] text-xs">Rupak</div>
            <div className="text-[11px] text-[#6E6D7A] mt-0.5">Project Lead / Backend</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
            <div className="font-bold text-[#0D0C22] text-xs">Tanvir</div>
            <div className="text-[11px] text-[#6E6D7A] mt-0.5">ML & NLP Lead</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
            <div className="font-bold text-[#0D0C22] text-xs">Aditya</div>
            <div className="text-[11px] text-[#6E6D7A] mt-0.5">Backend & DB Lead</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E7E7E9]">
            <div className="font-bold text-[#0D0C22] text-xs">Samina</div>
            <div className="text-[11px] text-[#6E6D7A] mt-0.5">Frontend Lead / UI Arch</div>
          </div>
          <div className="p-3 rounded-xl bg-[#FDF2F7] border border-[#EA4C89]/30">
            <div className="font-bold text-[#EA4C89] text-xs">Meenmoy</div>
            <div className="text-[11px] text-[#6E6D7A] mt-0.5">Battle Arena & Visuals</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
