import React from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { PolicyEvidenceClause, QualitativeScoreLabel } from '../types/policy';

interface EvidencePanelProps {
  evidenceClauses: PolicyEvidenceClause[];
  onSelectClause: (clauseId: string) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceClauses,
  onSelectClause,
}) => {
  if (!evidenceClauses || evidenceClauses.length === 0) {
    return null;
  }

  const getQualitativeBadge = (clause: PolicyEvidenceClause): { label: QualitativeScoreLabel; badgeClass: string } => {
    if (clause.qualitativeLabel) {
      if (clause.qualitativeLabel === 'PRIMARY') {
        return { label: 'PRIMARY', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
      }
      if (clause.qualitativeLabel === 'SUPPORTING') {
        return { label: 'SUPPORTING', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
      }
      return { label: 'CONTEXT', badgeClass: 'bg-slate-50 text-slate-500 border-slate-200' };
    }

    switch (clause.relevance) {
      case 'direct_authority':
        return { label: 'PRIMARY', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'supporting_provision':
        return { label: 'SUPPORTING', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'contextual':
      default:
        return { label: 'CONTEXT', badgeClass: 'bg-slate-50 text-slate-500 border-slate-200' };
    }
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-100 flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200">
      {/* High Density Aside Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
            Retrieved Evidence
          </h3>
          <span className="text-[10px] font-bold text-slate-400 font-mono">
            {evidenceClauses.length} {evidenceClauses.length === 1 ? 'Clause' : 'Clauses'}
          </span>
        </div>
      </div>

      {/* Evidence Cards Stack */}
      <div className="p-3 sm:p-4 space-y-3 overflow-y-auto flex-1 max-h-[500px] lg:max-h-none">
        {evidenceClauses.map((clause, index) => {
          const badge = getQualitativeBadge(clause);
          return (
            <div
              key={clause.clauseId + index}
              onClick={() => onSelectClause(clause.clauseId)}
              className="bg-white p-3.5 sm:p-4 rounded-lg shadow-2xs border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-blue-600 font-mono group-hover:underline flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-blue-500" />
                  {clause.clauseId}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase ${badge.badgeClass}`}
                  title={clause.score !== undefined ? `BM25 Score: ${clause.score}` : undefined}
                >
                  {badge.label}
                </span>
              </div>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 line-clamp-1">
                {clause.sectionTitle}
              </p>

              {clause.isAmendment && clause.amendmentName && (
                <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-50 border border-amber-200">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">{clause.amendmentName}</span>
                  <span className="text-[9px] text-amber-600/80 font-mono italic">EFFECTIVE 1 MARCH 2026</span>
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-slate-700 italic line-clamp-3">
                "{clause.exactText}"
              </p>

              <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{clause.part}</span>
                <span className="text-blue-600 font-sans font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
