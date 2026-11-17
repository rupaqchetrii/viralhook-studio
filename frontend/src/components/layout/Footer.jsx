import React from 'react';
import { ShieldCheck, Cpu, Code2, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#2e3152] bg-[#11121B] mt-16 py-8 text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#F1F5F9]">ViralHook Studio</span>
            <span>•</span>
            <span>Group M B.Tech CSE Capstone Project</span>
            <span>•</span>
            <span className="text-[#A78BFA]">16–20 November 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Cpu className="w-3.5 h-3.5" /> Sub-50ms CPU ML Inference
            </span>
            <span className="flex items-center gap-1 text-[#A78BFA]">
              <ShieldCheck className="w-3.5 h-3.5" /> Margin Guard (ΔP ≥ 0.08)
            </span>
          </div>
        </div>

        {/* Team Credits */}
        <div className="pt-4 border-t border-[#2e3152]/60 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center sm:text-left">
          <div>
            <div className="font-semibold text-[#F1F5F9]">Rupak</div>
            <div className="text-[11px] text-[#64748B]">Project Lead / Backend</div>
          </div>
          <div>
            <div className="font-semibold text-[#F1F5F9]">Tanvir</div>
            <div className="text-[11px] text-[#64748B]">ML & NLP Lead</div>
          </div>
          <div>
            <div className="font-semibold text-[#F1F5F9]">Aditya</div>
            <div className="text-[11px] text-[#64748B]">Backend & Database Lead</div>
          </div>
          <div>
            <div className="font-semibold text-[#A78BFA]">Samina</div>
            <div className="text-[11px] text-[#94A3B8]">Frontend Lead / UI Arch</div>
          </div>
          <div>
            <div className="font-semibold text-[#F1F5F9]">Meenmoy</div>
            <div className="text-[11px] text-[#64748B]">Battle Arena & Visuals</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
