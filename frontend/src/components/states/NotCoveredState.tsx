import React, { useState } from 'react';
import { HelpCircle, Copy, Check } from 'lucide-react';
import { PolicyQueryResponse } from '../../types/policy';

interface NotCoveredStateProps {
  response: PolicyQueryResponse;
  onAskRelated?: (question: string) => void;
}

export const NotCoveredState: React.FC<NotCoveredStateProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const details = response.notCoveredDetails;

  const handleCopyReferral = () => {
    const text = `[POLICY INQUIRY - NOT COVERED]
Inquiry: "${response.question}"
Status: Not Covered by Policy Manual
Next step: Refer the question to the appropriate program staff.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn">
      {/* High Density Not Covered Card */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 sm:p-8 text-center mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
          {details?.title || 'Not Covered by the Policy Manual'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          {details?.primaryMessage || 'The policy manual does not establish an answer to this question.'}
        </p>
      </div>

      {/* Recommended Action Box */}
      <div className="p-4 sm:p-5 border-2 border-dashed border-slate-200 rounded-lg bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Recommended Action
          </h4>
          <button
            onClick={handleCopyReferral}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Note</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            {details?.nextStepGuidance || 'Next step: Refer the question to the appropriate program staff.'}
          </p>
        </div>
      </div>
    </div>
  );
};
