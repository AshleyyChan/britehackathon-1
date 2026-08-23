import React, { useState } from 'react';
import { Code, X } from 'lucide-react';
import { ResponseStatus } from '../types/policy';

interface StateDemoToolbarProps {
  currentStatus?: ResponseStatus | null;
  onSelectPresetState: (status: ResponseStatus) => void;
  onReset: () => void;
}

export const StateDemoToolbar: React.FC<StateDemoToolbarProps> = ({
  currentStatus,
  onSelectPresetState,
  onReset,
}) => {
  const [showApiContract, setShowApiContract] = useState(false);

  return (
    <>
      <div className="bg-[#0B1120] text-white border-b border-slate-800 px-3 sm:px-8 py-2 shrink-0 flex items-center justify-between text-xs select-none overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="hidden sm:inline">Response State:</span>
          </span>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => onSelectPresetState('SUFFICIENT')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded transition-colors ${
                currentStatus === 'SUFFICIENT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              Grounded
            </button>

            <button
              type="button"
              onClick={() => onSelectPresetState('CONFLICTING')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded transition-colors ${
                currentStatus === 'CONFLICTING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              Conflict
            </button>

            <button
              type="button"
              onClick={() => onSelectPresetState('TEMPORALLY_AMBIGUOUS')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded transition-colors ${
                currentStatus === 'TEMPORALLY_AMBIGUOUS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              Temporal
            </button>

            <button
              type="button"
              onClick={() => onSelectPresetState('INSUFFICIENT')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded transition-colors ${
                currentStatus === 'INSUFFICIENT'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              Not Covered
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => setShowApiContract(true)}
            className="text-[10px] font-semibold text-blue-300 hover:text-white uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">POST /api/query</span>
            <span className="sm:hidden">API</span>
          </button>

          {currentStatus && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-slate-400 hover:text-slate-200 uppercase tracking-wider font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* API Contract Modal */}
      {showApiContract && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F172A] text-slate-100 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  C
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                    API Specification: POST /api/query
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Enterprise service interface (src/services/api.ts)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiContract(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-slate-400 block mb-1 font-sans text-xs font-bold uppercase tracking-wider">
                  1. Request Payload:
                </span>
                <pre className="p-3 bg-[#0B1120] rounded-lg text-blue-400 border border-slate-800">
{`POST /api/query
Content-Type: application/json

{
  "question": "How many days do I have to report a change?",
  "eventDate": "2025-11-15" // optional temporal context
}`}
                </pre>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-sans text-xs font-bold uppercase tracking-wider">
                  2. Response Schema (SUFFICIENT | CONFLICTING | INSUFFICIENT | TEMPORALLY_AMBIGUOUS):
                </span>
                <pre className="p-3 bg-[#0B1120] rounded-lg text-emerald-400 border border-slate-800 overflow-x-auto text-[11px]">
{`// Example: TEMPORALLY_AMBIGUOUS Response
{
  "queryId": "qry-005",
  "status": "TEMPORALLY_AMBIGUOUS",
  "manualVersion": "POLICY MANUAL · CONSOLIDATED 31 DEC 2025",
  "message": "The reporting period depends on when the change of circumstances occurred. Please provide the date of the change.",
  "required_temporal_field": "event_date",
  "temporalDetails": {
    "title": "Temporal Information Required",
    "generalMessage": "The applicable policy depends on when the relevant event occurred.",
    "specificMessage": "The reporting period depends on when the change of circumstances occurred. Please provide the date of the change.",
    "requiredTemporalField": "event_date"
  },
  "evidenceClauses": [ ... ]
}`}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-[#0B1120] border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowApiContract(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
