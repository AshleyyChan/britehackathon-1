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
        <div>
          <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-none text-white">
            Calder County
          </h1>
          <p className="text-[11px] sm:text-xs text-blue-200 opacity-90 mt-0.5">
            Household Support Program (HSP)
          </p>
        </div>
      </div>

      {/* Right meta controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="px-2.5 py-1 bg-slate-800/90 rounded text-[10px] uppercase font-bold tracking-widest text-slate-300 border border-slate-700 font-mono">
            POLICY MANUAL · CONSOLIDATED 31 DEC 2025
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
