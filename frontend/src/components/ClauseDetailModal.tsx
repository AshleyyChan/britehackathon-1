import React, { useState } from 'react';
import { X, Bookmark, Copy, Check } from 'lucide-react';
import { OFFICIAL_POLICY_MANUAL } from '../data/mockPolicyData';
import { PolicyManualSection } from '../types/policy';

interface ClauseDetailModalProps {
  clauseId: string | null;
  onClose: () => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({ clauseId, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!clauseId) return null;

  const section: PolicyManualSection | undefined = OFFICIAL_POLICY_MANUAL.find(
    (s) => s.code.toLowerCase() === clauseId.toLowerCase()
  );

  const handleCopy = () => {
    if (!section) return;
    const text = `Policy Manual — ${section.code}: ${section.sectionTitle}\n${section.fullText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs font-mono">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-widest">
                  Policy Provision
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono leading-tight">
                {clauseId}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {section ? (
            <>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {section.partNumber}: {section.partTitle}
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {section.sectionTitle}
                </h4>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Codified Policy Text:
                </span>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed italic">
                  "{section.fullText}"
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-slate-500 text-xs">
              Clause <strong className="font-mono">{clauseId}</strong> details loaded.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-mono">
            POLICY MANUAL · REV 4.2 · AMENDMENT 2026-01
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition-colors text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
