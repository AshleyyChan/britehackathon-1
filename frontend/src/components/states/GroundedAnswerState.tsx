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
        <span className="ml-auto text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase tracking-wider">
          Citation: {answer.directCitation}
        </span>
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

      {/* Policy Sources */}
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Policy Sources
        </h4>
        <span className="text-[11px] text-slate-400">Click citation to view manual</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        {primaryClause && (
          <div
            onClick={() => onSelectClause(primaryClause.clauseId)}
            className="border border-blue-200 bg-blue-50/50 p-4 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-left shadow-2xs group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-blue-700 group-hover:underline flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-blue-600" />
                {primaryClause.clauseId}
              </span>
              <span className="text-[9px] font-bold font-mono text-blue-700 uppercase tracking-wider bg-blue-100/70 border border-blue-200 px-1.5 py-0.5 rounded">
                PRIMARY
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">
              {primaryClause.sectionTitle}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 font-medium">
              {primaryClause.exactText}
            </p>
            <div className="mt-2.5 pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] text-blue-700/80 font-mono">
              <span>{primaryClause.part}</span>
              <ArrowUpRight className="w-3 h-3 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        )}

        {response.evidenceClauses
          .filter((c) => c.clauseId !== primaryClause?.clauseId)
          .slice(0, 1)
          .map((clause) => (
            <div
              key={clause.clauseId}
              onClick={() => onSelectClause(clause.clauseId)}
              className="border border-slate-200 bg-slate-50/70 p-4 rounded-lg cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all text-left shadow-2xs group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold font-mono text-slate-700 group-hover:underline flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-slate-500" />
                  {clause.clauseId}
                </span>
                <span className="text-[9px] font-bold font-mono text-slate-600 uppercase tracking-wider bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                  SUPPORTING
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">
                {clause.sectionTitle}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                {clause.exactText}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{clause.part}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-600" />
              </div>
            </div>
          ))}
      </div>

      {/* Copy Action footer */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
        <span className="font-mono text-[10px]">Citation: {answer.directCitation}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
