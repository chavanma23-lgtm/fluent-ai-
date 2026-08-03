import React, { useState } from 'react';
import { MOCK_INTERVIEWS } from '../data/mockData';
import { MockInterviewScenario, UserProfile } from '../types';
import { Briefcase, Award, Mic, MicOff, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface MockInterviewRoomProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const MockInterviewRoom: React.FC<MockInterviewRoomProps> = ({ user, setUser }) => {
  const [selectedInterview, setSelectedInterview] = useState<MockInterviewScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleStartInterview = (interview: MockInterviewScenario) => {
    setSelectedInterview(interview);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluations({});
  };

  const handleNextQuestion = async () => {
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: userAnswer }],
          userLevel: user.level,
          mode: 'interview_evaluation',
          scenarioTitle: selectedInterview?.title
        })
      });
      const data = await response.json();

      setEvaluations(prev => ({
        ...prev,
        [currentQuestionIndex]: data.reply || "Strong answer with relevant examples and clear delivery."
      }));

      if (selectedInterview && currentQuestionIndex < selectedInterview.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
            High-Stakes Preparation
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Mock Interview Simulator & Exam Prep</h1>
          <p className="text-xs text-slate-400 mt-1">
            Prepare for HR screenings, technical tech leader interviews, IELTS Band 8+ Speaking, and TOEFL Task 1-2.
          </p>
        </div>

        <button
          onClick={() => {
            const customRole = prompt("Enter Custom Role / Target Exam (e.g. 'Senior Product Manager at Google' or 'US Visa Officer'):");
            if (!customRole) return;
            const newScenario: MockInterviewScenario = {
              id: `custom_${Date.now()}`,
              title: customRole,
              type: 'HR',
              companyOrExam: 'Custom AI Simulator',
              questions: [
                `Tell me about yourself and why you are qualified for ${customRole}.`,
                `What is a major challenge you faced in your field and how did you resolve it?`,
                `Where do you see yourself professionally in the next 3 years?`
              ],
              evaluationCriteria: ['Grammatical Accuracy', 'Vocabulary Precision', 'Confidence & STAR Method']
            };
            handleStartInterview(newScenario);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs shrink-0 transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" /> Create Custom Scenario
        </button>
      </div>

      {!selectedInterview ? (
        /* Interview Selector Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_INTERVIEWS.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-xl space-y-4 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{item.companyOrExam}</span>
                </div>

                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.questions.length} Exam Questions included</p>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Evaluation Criteria:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.evaluationCriteria.map((c, i) => (
                      <span key={i} className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded">
                        • {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartInterview(item)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md"
              >
                Start Mock Session <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active Interview Simulator Room */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-base">{selectedInterview.title}</h2>
              <span className="text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {selectedInterview.questions.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Exit Mock Session
            </button>
          </div>

          {/* Question Prompt */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider block mb-1">
              AI Interviewer Question:
            </span>
            <p className="text-lg font-extrabold text-white leading-relaxed">
              "{selectedInterview.questions[currentQuestionIndex]}"
            </p>
          </div>

          {/* User Answer Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Answer / Spoken Transcript</label>
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              rows={4}
              placeholder="Speak or type your structured response (STAR method recommended)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Next & Submit */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setUserAnswer("In my previous software engineering role, I led a cross-functional team to reduce API latency by 40% through redis caching.")}
              className="text-xs text-indigo-400 hover:underline"
            >
              Autofill STAR response example
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={!userAnswer.trim() || isEvaluating}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isEvaluating ? 'Evaluating Answer...' : 'Submit & Next Question'}
            </button>
          </div>

          {/* Evaluation Feedback */}
          {evaluations[currentQuestionIndex] && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
              <strong className="block text-emerald-400 mb-1 font-bold">Interviewer Evaluation Feedback:</strong>
              {evaluations[currentQuestionIndex]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
