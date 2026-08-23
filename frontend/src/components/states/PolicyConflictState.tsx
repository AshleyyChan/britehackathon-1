import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, Bookmark } from 'lucide-react';
import { PolicyQueryResponse } from '../../types/policy';

interface PolicyConflictStateProps {
  response: PolicyQueryResponse;
  onSelectClause: (clauseId: string) => void;
}

export const PolicyConflictState: React.FC<PolicyConflictStateProps> = ({
  response,
  onSelectClause,
}) => {
  const [copied, setCopied] = useState(false);
  const conflict = response.conflictDetails;

  const conflictingClauses = conflict?.conflictingExcerpts || [
    {
      clauseId: '§4.3.2',
      sourceSection: 'Part 4: Participant Obligations',
      sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
      excerpt: '10 calendar days',
    },
    {
      clauseId: '§9.1.4',
      sourceSection: 'Part 9: Program Administration',
      sectionTitle: 'Standard Case Adjustment and Notification Timelines',
      excerpt: '30 calendar days',
    },
  ];

  const handleCopySupervisorMemo = () => {
    const memo = `[SUPERVISOR POLICY ESCALATION]
Inquiry: "${response.question}"
Issue: Policy Conflict Detected between provisions.
Provision A: §4.3.2 specifies "10 calendar days"
Provision B: §9.1.4 specifies "30 calendar days"
Next step: Consult a supervisor.`;
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn">
      {/* Warning Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 mb-5 shadow-xs">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-1.5 bg-amber-500 rounded-full text-white shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-amber-900 leading-none">
            {conflict?.title || 'Policy Conflict Detected'}
          </h3>
        </div>
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          {conflict?.warningMessage ||
            'The policy manual contains conflicting provisions, so a definitive answer cannot be provided.'}
        </p>
      </div>

      {/* Two Neutral Conflicting Cards (Side-by-Side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        {conflictingClauses.map((item, idx) => (
          <div
            key={item.clauseId}
            onClick={() => onSelectClause(item.clauseId)}
            className="border-2 border-amber-200 p-4 rounded-lg bg-white shadow-xs hover:border-amber-400 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold font-mono text-slate-700 group-hover:text-blue-600 flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-600" />
                {item.clauseId}
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100/70 px-1.5 py-0.5 rounded">
                Provision {idx === 0 ? 'A' : 'B'}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-800 italic my-2">
              "{item.excerpt}"
            </p>

            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight line-clamp-1">
              Section: {item.sectionTitle}
            </p>
          </div>
        ))}
      </div>

      {/* Supervisor Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0F172A] rounded-lg text-white gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-100">
            {conflict?.supervisorGuidance || 'Next step: Consult a supervisor.'}
          </span>
        </div>

        <button
          onClick={handleCopySupervisorMemo}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Escalation Note Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy Escalation Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
