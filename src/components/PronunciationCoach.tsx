import React, { useState, useRef } from 'react';
import { PronunciationResult, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface PronunciationCoachProps {
  user?: UserProfile;
}

export const PronunciationCoach: React.FC<PronunciationCoachProps> = ({ user }) => {
  const targetLanguage = user?.targetLanguage || 'English';
  const targetLangObj = SUPPORTED_LANGUAGES.find(l => l.name === targetLanguage) || SUPPORTED_LANGUAGES[0];

  const [targetSentence, setTargetSentence] = useState('The meticulous engineer articulated a practical solution for the project.');
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>({
    overallScore: 89,
    clarityScore: 92,
    fluencyScore: 86,
    wordBreakdown: [
      { word: 'The', score: 98, phonetic: '/ðə/', stressCorrect: true },
      { word: 'meticulous', score: 82, phonetic: '/məˈtɪk.jə.ləs/', stressCorrect: true, issue: 'Focus on second syllable stress' },
      { word: 'engineer', score: 91, phonetic: '/ˌen.dʒɪˈnɪər/', stressCorrect: true },
      { word: 'articulated', score: 84, phonetic: '/ɑːrˈtɪk.jə.leɪ.tɪd/', stressCorrect: false, issue: 'Soften the final /tɪd/ sound' },
      { word: 'a', score: 99, phonetic: '/ə/', stressCorrect: true },
      { word: 'practical', score: 94, phonetic: '/ˈpræk.tɪ.kəl/', stressCorrect: true },
      { word: 'solution', score: 88, phonetic: '/səˈluː.ʃən/', stressCorrect: true },
      { word: 'for', score: 96, phonetic: '/fɔːr/', stressCorrect: true },
      { word: 'the', score: 97, phonetic: '/ðə/', stressCorrect: true },
      { word: 'project.', score: 85, phonetic: '/ˈprɒdʒ.ekt/', stressCorrect: true }
    ],
    improvementTip: 'Great clarity overall! Focus on placing primary stress on "ti" in me-TIC-u-lous.'
  });

  const SAMPLE_PRACTICE_SENTENCES = [
    'The meticulous engineer articulated a practical solution for the project.',
    'She sells sea shells by the sea shore to practice sibilant consonants.',
    'I would thoroughly appreciate an opportunity to discuss our upcoming strategy.',
    'Clear communication and active listening build strong professional relationships.'
  ];

  const handleStartAnalysis = async (userSpokenText?: string) => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userSpokenText || targetSentence, targetLanguage })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
      setIsRecording(false);
    }
  };

  const [selectedAccent, setSelectedAccent] = useState<'en-US' | 'en-GB' | 'en-AU' | 'en-IN'>('en-US');

  const playNativeAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetSentence);
      utterance.lang = selectedAccent;
      utterance.rate = 0.85; // Slightly slower for clear phonetic practice
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSingleWord = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.replace(/[^a-zA-Z]/g, ''));
      utterance.lang = selectedAccent;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const simulateRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      handleStartAnalysis();
    }, 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ELSA-Style Phonetic AI Coach
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Pronunciation & Accent Coach</h1>
            <p className="text-xs text-slate-400 mt-1">
              Get instant word-by-word feedback, syllable stress analysis, and native speaker audio comparison.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dialect / Accent Selector */}
            <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
              {[
                { code: 'en-US', label: '🇺🇸 US' },
                { code: 'en-GB', label: '🇬🇧 UK' },
                { code: 'en-AU', label: '🇦🇺 AU' },
                { code: 'en-IN', label: '🇮🇳 IN' }
              ].map(acc => (
                <button
                  key={acc.code}
                  onClick={() => setSelectedAccent(acc.code as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    selectedAccent === acc.code ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>

            <button
              onClick={playNativeAudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/20"
            >
              <Volume2 className="w-4 h-4" /> Listen ({selectedAccent.split('-')[1]})
            </button>
          </div>
        </div>
      </div>

      {/* Target Sentence Selector & Practice Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Sentence to Practice</label>
          <span className="text-xs text-indigo-400 font-medium">Click a sentence to switch</span>
        </div>

        {/* Practice sentence options chips */}
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRACTICE_SENTENCES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetSentence(s);
                handleStartAnalysis(s);
              }}
              className={`text-xs px-3 py-2 rounded-xl transition border text-left ${
                targetSentence === s
                  ? 'bg-indigo-600/20 text-white border-indigo-500 font-semibold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              "{s}"
            </button>
          ))}
        </div>

        {/* Big Display Target Box */}
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center relative group">
          <p className="text-lg md:text-xl font-bold text-white leading-relaxed tracking-wide">
            "{targetSentence}"
          </p>
        </div>

        {/* Record Control */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={simulateRecord}
            disabled={isRecording || analyzing}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-sm transition shadow-2xl ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5 animate-spin" /> Recording Audio...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" /> Tap to Speak & Analyze Score
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Scores */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Pronunciation Report
            </h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold">
              AI Speech Engine
            </span>
          </div>

          {/* Meter Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Overall Fluency</span>
              <div className="text-3xl font-black text-emerald-400 my-1">{result.overallScore}%</div>
              <span className="text-[11px] text-slate-500">Native-like clarity</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Clarity Score</span>
              <div className="text-3xl font-black text-indigo-400 my-1">{result.clarityScore}%</div>
              <span className="text-[11px] text-slate-500">Distinct articulation</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Speech Pacing</span>
              <div className="text-3xl font-black text-teal-400 my-1">{result.fluencyScore}%</div>
              <span className="text-[11px] text-slate-500">Natural rhythm & pauses</span>
            </div>
          </div>

          {/* Word-By-Word Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Word-by-Word Phonetic Assessment
              </h4>
              <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Tap any word to listen
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {result.wordBreakdown.map((wb, idx) => (
                <button
                  key={idx}
                  onClick={() => speakSingleWord(wb.word)}
                  title={`Click to listen to "${wb.word}" in ${selectedAccent}`}
                  className={`p-3 rounded-xl border flex flex-col items-center min-w-[90px] transition hover:scale-105 active:scale-95 cursor-pointer group ${getScoreColor(
                    wb.score
                  )}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300">{wb.word}</span>
                    <Volume2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-400 transition" />
                  </div>
                  <span className="text-[10px] opacity-80 font-mono my-0.5">{wb.phonetic}</span>
                  <span className="text-[11px] font-black">{wb.score}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Tip */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">Pronunciation Coach Tip</h5>
              <p className="text-sm text-slate-200 mt-0.5">{result.improvementTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
