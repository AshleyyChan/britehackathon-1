import React, { useState } from 'react';
import { X, BookOpen, Search, ArrowUpRight, Layers } from 'lucide-react';
import { OFFICIAL_POLICY_MANUAL } from '../data/mockPolicyData';

interface PolicyManualViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClause: (clauseId: string) => void;
}

export const PolicyManualViewer: React.FC<PolicyManualViewerProps> = ({
  isOpen,
  onClose,
  onSelectClause,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<string>('ALL');

  if (!isOpen) return null;

  const parts = Array.from(new Set(OFFICIAL_POLICY_MANUAL.map((s) => s.partNumber)));

  const filteredSections = OFFICIAL_POLICY_MANUAL.filter((section) => {
    const matchesPart = selectedPart === 'ALL' || section.partNumber === selectedPart;
    const matchesSearch =
      searchTerm.trim() === '' ||
      section.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.fullText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesPart && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-2xs flex justify-end">
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b-2 border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Calder County HSP
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Policy Manual · REV 4.2 · AMENDMENT 2026-01
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search policy sections, keywords, or clause (e.g. §8.2.3)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Part:</span>
            <button
              type="button"
              onClick={() => setSelectedPart('ALL')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                selectedPart === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {parts.map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => setSelectedPart(part)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors whitespace-nowrap ${
                  selectedPart === part
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Sections List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => (
              <div
                key={sec.id}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-400 transition-all space-y-2 group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#0F172A] text-white font-mono font-bold text-[11px]">
                        {sec.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium font-mono">
                        {sec.partNumber}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                      {sec.sectionTitle}
                    </h4>
                  </div>

                  <button
                    onClick={() => onSelectClause(sec.code)}
                    type="button"
                    className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Focus clause"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                  "{sec.fullText}"
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 space-y-1 text-xs text-slate-400">
              <Layers className="w-6 h-6 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No matching policy sections found.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 shrink-0">
          <span className="font-mono text-[10px]">POLICY MANUAL · REV 4.2 · AMENDMENT 2026-01</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
