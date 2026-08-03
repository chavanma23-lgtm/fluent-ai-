import React, { useState } from 'react';
import { READING_ARTICLES, LISTENING_LESSONS } from '../data/mockData';
import { Sparkles, PenTool, BookOpen, Headphones, Gamepad2, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';

export const SkillsPractice: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<'writing' | 'reading' | 'listening' | 'games'>('writing');

  // Writing state
  const [essayText, setEssayText] = useState("Dear Hiring Manager, I am writing for apply to the position of Senior Frontend Engineer. I have 5 years experience building React apps.");
  const [writingAnalysis, setWritingAnalysis] = useState<any>(null);
  const [analyzingWriting, setAnalyzingWriting] = useState(false);

  // Reading state
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({});

  // Listening state
  const [selectedListeningIndex, setSelectedListeningIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationScore, setDictationScore] = useState<string | null>(null);

  // Games state
  const [gameScore, setGameScore] = useState(0);
  const [sentenceWords, setSentenceWords] = useState(['The', 'fluency', 'requires', 'consistent', 'practice', 'daily']);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);

  const handleAnalyzeWriting = async () => {
    setAnalyzingWriting(true);
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: essayText })
      });
      const data = await response.json();
      setWritingAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingWriting(false);
    }
  };

  const playScriptAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Skill Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
            Comprehensive Learning Suite
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Skills & Interactive Games</h1>
        </div>

        {/* Skill Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button
            onClick={() => setActiveSkill('writing')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition border ${
              activeSkill === 'writing'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" /> Writing Lab
          </button>

          <button
            onClick={() => setActiveSkill('reading')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition border ${
              activeSkill === 'reading'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Reading Articles
          </button>

          <button
            onClick={() => setActiveSkill('listening')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition border ${
              activeSkill === 'listening'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" /> Listening & Dictation
          </button>

          <button
            onClick={() => setActiveSkill('games')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition border ${
              activeSkill === 'games'
                ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> English Games
          </button>
        </div>
      </div>

      {/* 1. WRITING LAB */}
      {activeSkill === 'writing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-white text-base">Professional Email & Essay Refiner</h2>
          <textarea
            value={essayText}
            onChange={e => setEssayText(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleAnalyzeWriting}
            disabled={analyzingWriting}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30"
          >
            {analyzingWriting ? 'Analyzing...' : 'Analyze Writing & Tone'}
          </button>

          {writingAnalysis && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-purple-400 uppercase tracking-wider block">Writing Feedback:</span>
              <p className="text-slate-200"><strong className="text-white">Revised Text:</strong> {writingAnalysis.correctedText}</p>
              {writingAnalysis.betterAlternatives?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold">Elevated Phrasing:</span>
                  <p className="text-indigo-300 italic">"{writingAnalysis.betterAlternatives[0]}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. READING LAB */}
      {activeSkill === 'reading' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">{READING_ARTICLES[selectedArticleIndex].title}</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
              Level {READING_ARTICLES[selectedArticleIndex].level}
            </span>
          </div>

          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {READING_ARTICLES[selectedArticleIndex].content}
          </div>

          {/* Comprehension Quiz */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comprehension Quiz</h3>
            {READING_ARTICLES[selectedArticleIndex].comprehensionQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-white">{q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setReadingAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                      className={`text-xs p-2.5 rounded-lg text-left transition border ${
                        readingAnswers[qIdx] === optIdx
                          ? optIdx === q.correctIndex
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LISTENING LAB */}
      {activeSkill === 'listening' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-base">{LISTENING_LESSONS[selectedListeningIndex].title}</h2>
              <span className="text-xs text-slate-400">Accent: {LISTENING_LESSONS[selectedListeningIndex].accent}</span>
            </div>

            <button
              onClick={() => playScriptAudio(LISTENING_LESSONS[selectedListeningIndex].audioScript)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
            >
              <Volume2 className="w-4 h-4" /> Play Audio Lesson
            </button>
          </div>

          {/* Dictation Exercise */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dictation Challenge</h3>
            <p className="text-xs text-slate-400">Listen to the audio clip and type the exact sentence spoken:</p>

            <input
              type="text"
              value={dictationInput}
              onChange={e => setDictationInput(e.target.value)}
              placeholder="Type sentence here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => {
                const target = LISTENING_LESSONS[selectedListeningIndex].dictationSentence;
                if (dictationInput.trim().toLowerCase() === target.toLowerCase()) {
                  setDictationScore('🎉 Perfect Dictation! 100% Accuracy.');
                } else {
                  setDictationScore(`Near match! Target: "${target}"`);
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Verify Dictation
            </button>

            {dictationScore && <p className="text-xs font-bold text-emerald-400 mt-2">{dictationScore}</p>}
          </div>
        </div>
      )}

      {/* 4. ENGLISH GAMES */}
      {activeSkill === 'games' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Sentence Builder Game</h2>
            <span className="text-xs font-bold text-pink-400">Score: {gameScore} Points</span>
          </div>

          <p className="text-xs text-slate-400">Tap words in the correct order to form a grammatically valid sentence:</p>

          {/* Constructed Sentence Slot */}
          <div className="min-h-[60px] p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-center">
            {constructedSentence.map((w, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setConstructedSentence(prev => prev.filter((_, i) => i !== idx));
                  setSentenceWords(prev => [...prev, w]);
                }}
                className="bg-pink-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm"
              >
                {w} ✕
              </button>
            ))}
          </div>

          {/* Available Words Pool */}
          <div className="flex flex-wrap gap-2 pt-2">
            {sentenceWords.map((w, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setConstructedSentence(prev => [...prev, w]);
                  setSentenceWords(prev => prev.filter((_, i) => i !== idx));
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-semibold transition"
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (constructedSentence.join(' ') === "The fluency requires consistent practice daily" || constructedSentence.join(' ') === "Consistent practice requires daily fluency") {
                setGameScore(prev => prev + 100);
                alert('🎉 Correct Sentence! +100 Game Points');
              } else {
                alert('Try rearranging the words to make sense!');
              }
            }}
            className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-lg shadow-pink-600/30"
          >
            Check Sentence
          </button>
        </div>
      )}
    </div>
  );
};
