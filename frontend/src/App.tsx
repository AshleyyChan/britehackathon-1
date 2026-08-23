import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuestionInput } from './components/QuestionInput';
import { ResponseView } from './components/ResponseView';
import { StateDemoToolbar } from './components/StateDemoToolbar';
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

  // Auto-load initial canonical Grounded state on initial mount so workbench is immediately active
  React.useEffect(() => {
    handleAskQuestion(
      'How long must the Department give an applicant to provide evidence?',
      'SUFFICIENT'
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-900 overflow-x-hidden select-text">
      {/* Top Demo State Switcher */}
      {import.meta.env.DEV && (
        <StateDemoToolbar
          currentStatus={response?.status}
          onSelectPresetState={handleSelectPresetState}
          onReset={handleReset}
        />
      )}

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
                  Select a state or submit an inquiry to evaluate codified provisions.
                </p>
              </div>

              <button
                onClick={() => setIsManualOpen(true)}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Browse Manual →
              </button>
            </div>
            
            {import.meta.env.DEV && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => handleSelectPresetState('SUFFICIENT')}
                  className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-left hover:border-blue-400 transition-colors group"
                >
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                    1 · Grounded
                  </div>
                  <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">
                    Evidence Provision Deadline
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Grounded answer citing §8.2.3 (14 days requirement).
                  </p>
                </button>
  
                <button
                  onClick={() => handleSelectPresetState('CONFLICTING')}
                  className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 text-left hover:border-amber-400 transition-colors group"
                >
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    2 · Conflict
                  </div>
                  <div className="font-bold text-slate-900 mb-1 group-hover:text-amber-800">
                    Change Reporting Timeframe
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Contradiction between §4.3.2 and §9.1.4.
                  </p>
                </button>
  
                <button
                  onClick={() => handleSelectPresetState('TEMPORALLY_AMBIGUOUS')}
                  className="p-4 rounded-lg bg-blue-50/70 border border-blue-300 text-left hover:border-blue-500 transition-colors group"
                >
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">
                    3 · Temporal
                  </div>
                  <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-800">
                    Date-Dependent Reporting
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Date clarification required to resolve applicable policy rule.
                  </p>
                </button>
  
                <button
                  onClick={() => handleSelectPresetState('INSUFFICIENT')}
                  className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-left hover:border-slate-300 transition-colors group"
                >
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    4 · Not Covered
                  </div>
                  <div className="font-bold text-slate-900 mb-1 group-hover:text-slate-900">
                    Emergency Lodging
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Uncodified rule with staff referral next step.
                  </p>
                </button>
              </div>
            )}
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
