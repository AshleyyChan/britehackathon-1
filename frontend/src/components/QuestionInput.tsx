import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface QuestionInputProps {
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
  currentQuestion?: string;
}

export const EXAMPLE_QUESTIONS = [
  {
    id: 'ex-1',
    label: 'How long must the Department give an applicant to provide evidence?',
    shortLabel: 'Evidence deadline',
    tag: '§8.2.3 (Grounded)',
  },
  {
    id: 'ex-2',
    label: 'How many days do I have to report a change?',
    shortLabel: 'Reporting change (Temporal)',
    tag: 'Temporal Information Required',
  },
  {
    id: 'ex-3',
    label: 'How long do I have to report a change?',
    shortLabel: 'Reporting change (Conflict)',
    tag: '§4.3.2 vs §9.1.4 (Conflict)',
  },
  {
    id: 'ex-4',
    label: 'What is the maximum countable resources?',
    shortLabel: 'Countable resources',
    tag: '§2.4.1 (Grounded)',
  },
  {
    id: 'ex-5',
    label: 'Does the policy manual cover emergency lodging reimbursement?',
    shortLabel: 'Emergency lodging',
    tag: 'Not Covered State',
  },
];

export const QuestionInput: React.FC<QuestionInputProps> = ({
  onAskQuestion,
  isLoading,
  currentQuestion = '',
}) => {
  const [inputValue, setInputValue] = useState(currentQuestion);

  React.useEffect(() => {
    if (currentQuestion !== undefined) {
      setInputValue(currentQuestion);
    }
  }, [currentQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onAskQuestion(inputValue.trim());
    }
  };

  const handleExampleClick = (questionText: string) => {
    setInputValue(questionText);
    onAskQuestion(questionText);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 leading-tight">
          Policy Inquiry
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Ask a question about HSP policy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="How long must the Department give an applicant to provide evidence?"
              className="w-full pl-4 pr-11 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-all"
              disabled={isLoading}
              aria-label="Policy Question"
            />
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {!inputValue && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shrink-0 ${
              inputValue.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/10 active:transform active:scale-95 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Evaluating...</span>
              </>
            ) : (
              <span>Ask Question</span>
            )}
          </button>
        </div>

        {/* Verification Badges */}
        <div className="mt-4 flex flex-wrap gap-4 items-center pl-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 tracking-wide">
            <span className="text-green-600">✓</span> GROUNDED
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 tracking-wide">
            <span className="text-green-600">✓</span> CITED
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 tracking-wide">
            <span className="text-green-600">✓</span> VERIFIED
          </div>
        </div>
      </form>
    </div>
  );
};
