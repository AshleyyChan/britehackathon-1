import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, RotateCw, AlertCircle } from 'lucide-react';
import { PolicyQueryResponse } from '../../types/policy';

interface TemporalAmbiguousStateProps {
  response: PolicyQueryResponse;
  onAskWithDate: (question: string, eventDate: string) => void;
}

export const TemporalAmbiguousState: React.FC<TemporalAmbiguousStateProps> = ({
  response,
  onAskWithDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  const requiredField = 'EVENT DATE REQUIRED';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!selectedDate) {
      return;
    }
    const clarifiedQuestion = `${response.question} (Date of occurrence: ${selectedDate})`;
    onAskWithDate(clarifiedQuestion, selectedDate);
  };

  return (
    <div className="animate-fadeIn">
      {/* State Header Bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Temporal Clarification
        </h3>
        <span className="ml-auto text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-wider">
          {requiredField}
        </span>
      </div>

      {/* Main Temporal Notice Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 sm:p-6 mb-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3 mb-2.5">
          <div className="p-2 bg-blue-600 rounded-lg text-white shrink-0 mt-0.5 sm:mt-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-blue-950 leading-tight">
              Temporal Information Required
            </h3>
            <p className="text-xs sm:text-sm text-blue-800 font-medium mt-0.5">
              The applicable policy depends on when the relevant event occurred.
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-200/80 bg-white/70 rounded-lg p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <p className="italic">Please provide the date the change occurred so the applicable policy provision can be determined.</p>
        </div>
      </div>

      {/* Temporal Clarification Action Box */}
      <div className="p-4 sm:p-5 border-2 border-dashed border-blue-200 rounded-xl bg-white space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Provide Temporal Context</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            Date input required for policy determination
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <label htmlFor="event-date-input" className="sr-only">
                Select date of occurrence
              </label>
              <input
                id="event-date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (hasAttemptedSubmit) setHasAttemptedSubmit(false);
                }}
                className={`w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all ${
                  hasAttemptedSubmit && !selectedDate
                    ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-300'
                    : 'border-slate-300'
                }`}
                placeholder="YYYY-MM-DD"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate}
              className={`min-h-[44px] px-5 py-2.5 font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                selectedDate
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-sm cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Ask Again</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasAttemptedSubmit && !selectedDate && (
            <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Please select a date to proceed with the inquiry.
            </p>
          )}

          <p className="text-[11px] text-slate-400">
            Note: The system does not assume or default to any date. The applicable rule will be evaluated against the date provided.
          </p>
        </form>
      </div>
    </div>
  );
};
