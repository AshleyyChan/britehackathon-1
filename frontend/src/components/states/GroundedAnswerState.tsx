import React, { useState } from 'react';
import { Bookmark, Copy, Check, ArrowUpRight } from 'lucide-react';
import { PolicyQueryResponse } from '../../types/policy';

interface GroundedAnswerStateProps {
  response: PolicyQueryResponse;
  onSelectClause: (clauseId: string) => void;
}

export const GroundedAnswerState: React.FC<GroundedAnswerStateProps> = ({
  response,
  onSelectClause,
}) => {
  const [copied, setCopied] = useState(false);
  const answer = response.groundedAnswer;

  if (!answer) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${answer.summary}\n\nCitation: ${answer.directCitation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryClause = response.evidenceClauses.find(
    (c) => c.clauseId === answer.directCitation
  ) || response.evidenceClauses[0];

  return (
    <div className="animate-fadeIn">
      {/* State Header Bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Grounded Answer
        </h3>
        <div className="ml-auto flex items-center gap-2">
          {response.confidence !== undefined && (
            <span 
              className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-wider cursor-help"
              title="Confidence reflects how strongly the verified policy evidence supports this answer."
            >
              Answer Confidence: {response.confidence}%
            </span>
          )}
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase tracking-wider">
            Citation: {answer.directCitation}
          </span>
        </div>
      </div>

      {/* Answer Quote Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 mb-5 shadow-xs">
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium italic">
          "{answer.summary}"
        </p>
        {answer.detailedText && (
          <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200/80 leading-normal not-italic font-normal">
            {answer.detailedText}
          </p>
        )}
      </div>

      {/* Action footer */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="border-t border-slate-200"></div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">Source: {answer.directCitation}</span>
        </div>
        
        <div className="mt-2">
          <button
            onClick={() => onSelectClause(primaryClause?.clauseId || answer.directCitation)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-700 text-sm font-bold rounded-lg transition-colors border border-slate-700 shadow-sm"
          >
            View Policy Clause
          </button>
        </div>
      </div>
    </div>
  );
};
