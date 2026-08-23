import React from 'react';
import { PolicyQueryResponse, ResponseStatus } from '../types/policy';
import { GroundedAnswerState } from './states/GroundedAnswerState';
import { PolicyConflictState } from './states/PolicyConflictState';
import { NotCoveredState } from './states/NotCoveredState';
import { TemporalAmbiguousState } from './states/TemporalAmbiguousState';
import { EvidencePanel } from './EvidencePanel';
import { Clock } from 'lucide-react';

interface ResponseViewProps {
  response: PolicyQueryResponse;
  onSelectClause: (clauseId: string) => void;
  onAskRelated: (question: string) => void;
  onAskWithDate?: (question: string, eventDate: string) => void;
  onTabChange?: (status: ResponseStatus) => void;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  response,
  onSelectClause,
  onAskRelated,
  onAskWithDate,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Main Evaluated Area */}
      <div className="flex-1 p-4 sm:p-7 overflow-y-auto">
        {/* High Density State Tabs Bar */}
        <div className="flex items-center justify-between gap-1 mb-5 border-b border-slate-100 pb-2.5 overflow-x-auto">
          {import.meta.env.DEV && (
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('SUFFICIENT')}
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-4 py-1.5 transition-colors rounded-t whitespace-nowrap ${
                  response.status === 'SUFFICIENT'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Grounded
              </button>
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('CONFLICTING')}
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-4 py-1.5 transition-colors rounded-t whitespace-nowrap ${
                  response.status === 'CONFLICTING'
                    ? 'text-amber-700 border-b-2 border-amber-600 bg-amber-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Conflict
              </button>
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('TEMPORALLY_AMBIGUOUS')}
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-4 py-1.5 transition-colors rounded-t whitespace-nowrap ${
                  response.status === 'TEMPORALLY_AMBIGUOUS'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Temporal
              </button>
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('INSUFFICIENT')}
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-4 py-1.5 transition-colors rounded-t whitespace-nowrap ${
                  response.status === 'INSUFFICIENT'
                    ? 'text-slate-800 border-b-2 border-slate-700 bg-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Not Covered
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(response.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* State Content */}
        {response.status === 'SUFFICIENT' && (
          <GroundedAnswerState
            response={response}
            onSelectClause={onSelectClause}
          />
        )}

        {response.status === 'CONFLICTING' && (
          <PolicyConflictState
            response={response}
            onSelectClause={onSelectClause}
          />
        )}

        {response.status === 'TEMPORALLY_AMBIGUOUS' && (
          <TemporalAmbiguousState
            response={response}
            onAskWithDate={(question, eventDate) => {
              if (onAskWithDate) {
                onAskWithDate(question, eventDate);
              } else {
                onAskRelated(question);
              }
            }}
          />
        )}

        {response.status === 'INSUFFICIENT' && (
          <NotCoveredState
            response={response}
            onAskRelated={onAskRelated}
          />
        )}
      </div>

      {/* High Density Retrieved Evidence Aside */}
      <EvidencePanel
        evidenceClauses={response.evidenceClauses}
        onSelectClause={onSelectClause}
      />
    </div>
  );
};
