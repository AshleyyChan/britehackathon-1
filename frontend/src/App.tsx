import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuestionInput } from './components/QuestionInput';
import { ResponseView } from './components/ResponseView';
import { ClauseDetailModal } from './components/ClauseDetailModal';
import { PolicyManualViewer } from './components/PolicyManualViewer';
import { Footer } from './components/Footer';
import { PolicyApiService } from './services/api';
import { PolicyQueryResponse, ResponseStatus } from './types/policy';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [response, setResponse] = useState<PolicyQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<string>(
    'How long must the Department give an applicant to provide evidence?'
  );

  // Handle inquiry submission through the Policy API service
  const handleAskQuestion = async (
    question: string,
    forcedStatus?: ResponseStatus,
    eventDate?: string
  ) => {
    setActiveQuestion(question);
    setIsLoading(true);
    try {
      const result = await PolicyApiService.queryPolicy(
        { question, eventDate },
        forcedStatus
      );
      setResponse(result);
    } catch (err) {
      console.error('Error fetching policy answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct state switcher from the toolbar or response tabs
  const handleSelectPresetState = (status: ResponseStatus) => {
    const canonicalQuestions: Record<ResponseStatus, string> = {
      SUFFICIENT: 'How long must the Department give an applicant to provide evidence?',
      CONFLICTING: 'How long do I have to report a change?',
      TEMPORALLY_AMBIGUOUS: 'How many days do I have to report a change?',
      INSUFFICIENT: 'Does the policy manual cover emergency lodging reimbursement?',
    };
    const targetQ = canonicalQuestions[status];
    handleAskQuestion(targetQ, status);
  };

  const handleReset = () => {
    setResponse(null);
    setActiveQuestion('');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-900 overflow-x-hidden select-text">
      {/* Enterprise Header */}
      <Header onOpenManual={() => setIsManualOpen(true)} />

      {/* Policy Inquiry Bar Box */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-200 shadow-2xs shrink-0">
        <div className="max-w-4xl mx-auto">
          <QuestionInput
            onAskQuestion={(q) => handleAskQuestion(q)}
            isLoading={isLoading}
            currentQuestion={activeQuestion}
          />
        </div>
      </div>

      {/* Main Workbench Body */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-4">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-2xs text-center space-y-3 animate-fadeIn">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Evaluating Policy Manual Evidence...
            </p>
          </div>
        )}

        {/* Active Response View with High-Density Side Pane */}
        {!isLoading && response && (
          <ResponseView
            response={response}
            onSelectClause={(clauseId) => setSelectedClauseId(clauseId)}
            onAskRelated={(question) => handleAskQuestion(question)}
            onAskWithDate={(question, eventDate) => handleAskQuestion(question, undefined, eventDate)}
            onTabChange={(status) => handleSelectPresetState(status)}
          />
        )}

        {/* Fallback Empty Guide */}
        {!isLoading && !response && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Calder County Policy Assistant
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ask a policy question to retrieve, verify, and explain the applicable provisions.
                </p>
              </div>

              <button
                onClick={() => setIsManualOpen(true)}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Browse Manual →
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div
                className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-left"
              >
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                  1 · GROUNDED
                </div>
                <p className="text-[11px] text-slate-600">
                  Evidence-backed answer with supporting policy citations.
                </p>
              </div>

              <div
                className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 text-left"
              >
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                  2 · CONFLICT
                </div>
                <p className="text-[11px] text-slate-600">
                  Conflicting policy provisions detected; no definitive answer is provided.
                </p>
              </div>

              <div
                className="p-4 rounded-lg bg-blue-50/70 border border-blue-300 text-left"
              >
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">
                  3 · DATE REQUIRED
                </div>
                <p className="text-[11px] text-slate-600">
                  The applicable policy depends on when the relevant event occurred.
                </p>
              </div>

              <div
                className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-left"
              >
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  4 · NOT COVERED
                </div>
                <p className="text-[11px] text-slate-600">
                  The policy manual does not establish an answer; referral is recommended.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clause Detail Inspector Modal */}
      <ClauseDetailModal
        clauseId={selectedClauseId}
        onClose={() => setSelectedClauseId(null)}
      />

      {/* Policy Manual Drawer */}
      <PolicyManualViewer
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onSelectClause={(clauseId) => {
          setSelectedClauseId(clauseId);
          setIsManualOpen(false);
        }}
      />

      {/* High Density Footer */}
      <Footer onOpenManual={() => setIsManualOpen(true)} />
    </div>
  );
}
