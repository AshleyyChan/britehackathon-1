import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenManual: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenManual }) => {
  return (
    <header className="h-16 bg-[#0F172A] text-white flex items-center justify-between px-4 sm:px-8 border-b-4 border-blue-600 shrink-0 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-md flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow-sm shrink-0">
          C
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-none text-white mb-1">
            Calder County
          </h1>
          <p className="text-[11px] sm:text-xs text-blue-200 opacity-90 leading-none">
            HSP Policy Assistant
          </p>
        </div>
      </div>

      {/* Right meta controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex flex-col items-end justify-center">
          <div className="text-[11px] uppercase font-bold tracking-widest text-slate-300 font-mono leading-tight">
            REV 4.2
          </div>
          <div className="text-[11px] uppercase font-bold tracking-widest text-slate-400 font-mono leading-tight">
            AMENDMENT 2026-01
          </div>
        </div>

        <button
          onClick={onOpenManual}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          title="Browse Policy Manual"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Browse Manual</span>
        </button>

        {/* Staff badge avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200" title="Caseworker Session">
          CW
        </div>
      </div>
    </header>
  );
};
