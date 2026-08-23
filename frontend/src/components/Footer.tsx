import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenManual: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenManual }) => {
  return (
    <footer className="h-9 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 select-none">
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight truncate">
        Answers are based solely on the Calder County Household Support Program Policy Manual.
      </p>

      <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400">
        <button
          onClick={onOpenManual}
          type="button"
          className="hover:text-blue-600 transition-colors uppercase tracking-tight flex items-center gap-1 font-mono"
        >
          <BookOpen className="w-3 h-3" />
          <span>POLICY MANUAL · CONSOLIDATED 31 DEC 2025</span>
        </button>
      </div>
    </footer>
  );
};
