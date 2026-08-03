import React, { useState } from 'react';
import { SAMPLE_VOCABULARY } from '../data/mockData';
import { VocabularyWord, Level } from '../types';
import { BookMarked, Volume2, RotateCw, CheckCircle2, Search, Plus, Filter, Sparkles, Check } from 'lucide-react';

export const VocabularyBuilder: React.FC = () => {
  const [words, setWords] = useState<VocabularyWord[]>(SAMPLE_VOCABULARY);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [newWordInput, setNewWordInput] = useState('');

  const currentWord = words[currentIndex] || SAMPLE_VOCABULARY[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % words.length);
  };

  const speakWord = (w: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(w);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddCustomWord = () => {
    if (!newWordInput.trim()) return;
    const customWord: VocabularyWord = {
      id: Date.now().toString(),
      word: newWordInput.trim(),
      phonetic: `/${newWordInput.toLowerCase()}/`,
      definition: `Custom saved vocabulary item.`,
      partOfSpeech: 'noun',
      example: `I am actively practicing how to use "${newWordInput.trim()}" in real speech.`,
      synonyms: ['custom', 'vocabulary'],
      antonyms: [],
      level: 'B2',
      mastery: 10
    };

    setWords([customWord, ...words]);
    setNewWordInput('');
    setCurrentIndex(0);
  };

  const filteredWords = words.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || w.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || w.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
          Spaced Repetition & Daily Words
        </span>
        <h1 className="text-2xl font-black text-white mt-1">Vocabulary Builder</h1>
        <p className="text-xs text-slate-400 mt-1">
          Master high-frequency B1-C2 English vocabulary with interactive 3D flashcards, native audio pronunciation, and smart review schedules.
        </p>
      </div>

      {/* Flashcard Interactive Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Flashcard {currentIndex + 1} of {words.length}
          </span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
            Level {currentWord.level}
          </span>
        </div>

        {/* Flip Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[260px] bg-slate-950 border-2 border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-2xl group"
        >
          <div className="absolute top-3 right-3 text-slate-500 group-hover:text-indigo-400 transition flex items-center gap-1 text-[11px]">
            <RotateCw className="w-3.5 h-3.5" /> Tap to Flip
          </div>

          {!isFlipped ? (
            /* Front of Card */
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-widest">{currentWord.partOfSpeech}</span>
              <h2 className="text-4xl font-black text-white tracking-tight">{currentWord.word}</h2>
              <p className="text-slate-400 font-mono text-sm">{currentWord.phonetic}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentWord.word);
                }}
                className="mt-4 p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Back of Card */
            <div className="space-y-3 max-w-lg">
              <p className="text-lg font-bold text-slate-100 leading-snug">"{currentWord.definition}"</p>
              <p className="text-xs text-indigo-300 italic bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                Example: "{currentWord.example}"
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Synonyms:</span>
                {currentWord.synonyms.map((s, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Navigation Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
          >
            Previous Word
          </button>

          <button
            onClick={handleNextCard}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-lg shadow-indigo-600/30"
          >
            Next Card →
          </button>
        </div>
      </div>

      {/* Vocabulary List & Custom Word Add */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-white text-base">Your Mastered Vocabulary Bank</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const csvHeader = "Word,Level,Definition,Example,Phonetic\n";
                const csvRows = words.map(w => `"${w.word}","${w.level}","${w.definition.replace(/"/g, '""')}","${w.example.replace(/"/g, '""')}","${w.phonetic}"`).join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `FluentAI_Anki_Vocabulary_${Date.now()}.csv`;
                a.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Export to Anki / CSV
            </button>
          </div>
        </div>

        {/* Add custom word */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newWordInput}
            onChange={e => setNewWordInput(e.target.value)}
            placeholder="Add a new custom word to study..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddCustomWord}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Word
          </button>
        </div>

        {/* Search & Level Filter */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search vocabulary words or definitions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="A2">Level A2</option>
            <option value="B1">Level B1</option>
            <option value="B2">Level B2</option>
            <option value="C1">Level C1</option>
          </select>
        </div>

        {/* List of Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredWords.map((w, idx) => (
            <div key={w.id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-white text-sm">{w.word}</span>
                <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono font-semibold">
                  {w.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{w.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
