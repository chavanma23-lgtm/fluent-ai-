import React, { useState } from 'react';
import { NavTab, UserProfile } from '../types';
import {
  Search,
  Mic,
  MessageSquareCode,
  BookMarked,
  Sparkles,
  Globe,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  setUser
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickActions = [
    {
      title: 'Practice Live Voice AI Speaking',
      description: 'Instant AI voice-to-voice conversation with real-time feedback',
      icon: Mic,
      tab: 'speak' as NavTab,
      keywords: ['speak', 'voice', 'call', 'talk', 'conversation', 'pronunciation']
    },
    {
      title: 'Job & HR Interview Simulator',
      description: 'Practice HR, technical, or IELTS speaking interview questions',
      icon: MessageSquareCode,
      tab: 'practice' as NavTab,
      keywords: ['interview', 'hr', 'job', 'ielts', 'toefl', 'questions']
    },
    {
      title: 'Real-World Roleplays',
      description: 'Simulate ordering at a café, checking into a hotel, or airport claims',
      icon: MessageSquareCode,
      tab: 'practice' as NavTab,
      keywords: ['roleplay', 'cafe', 'hotel', 'restaurant', 'airport', 'travel']
    },
    {
      title: 'Spaced Repetition Vocabulary',
      description: 'Review daily target words with phonetics, examples, and card flips',
      icon: BookMarked,
      tab: 'practice' as NavTab,
      keywords: ['vocab', 'vocabulary', 'words', 'flashcards', 'definitions']
    },
    {
      title: 'Global Hub & Cultural Etiquette',
      description: 'Master regional customs, greetings, slang, and join speaking clubs',
      icon: Globe,
      tab: 'practice' as NavTab,
      keywords: ['culture', 'slang', 'customs', 'marathi', 'hindi', 'languages', 'club']
    },
    {
      title: 'Fluency Progress & Analytics',
      description: 'Track CEFR levels, grammar scores, streaks, and XP milestones',
      icon: BarChart3,
      tab: 'progress' as NavTab,
      keywords: ['progress', 'stats', 'analytics', 'xp', 'streak', 'level']
    },
    {
      title: 'Executive Strategy & CEO Blueprint',
      description: 'View live PRD, multi-agent AI framework, and security logs',
      icon: ShieldAlert,
      tab: 'profile' as NavTab,
      keywords: ['admin', 'ceo', 'strategy', 'prd', 'blueprint', 'docs']
    }
  ];

  const filteredActions = quickActions.filter(action => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      action.title.toLowerCase().includes(q) ||
      action.description.toLowerCase().includes(q) ||
      action.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleLanguageCommand = (native: string, target: string) => {
    setUser(prev => ({ ...prev, nativeLanguage: native, targetLanguage: target }));
    setActiveTab('speak');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search any tool, goal, or ask AI (e.g. 'I want to prepare for an interview')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Language Switching Shortcuts */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0">
            Quick Pair:
          </span>
          <button
            onClick={() => handleLanguageCommand('Marathi', 'English')}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition shrink-0 font-medium"
          >
            🇮🇳 Marathi ➔ 🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageCommand('Hindi', 'English')}
            className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition shrink-0 font-medium"
          >
            🇮🇳 Hindi ➔ 🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageCommand('English', 'Japanese')}
            className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition shrink-0 font-medium"
          >
            🇺🇸 English ➔ 🇯🇵 Japanese
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Zap className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-white">AI Command Assistant</p>
              <p className="text-xs text-slate-400">
                Opening voice practice for <span className="text-indigo-300">"{query}"</span>...
              </p>
              <button
                onClick={() => handleSelect('speak')}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Launch Voice Coach for "{query}"</span>
              </button>
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(action.tab)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950/60 hover:bg-indigo-600/10 border border-slate-800/80 hover:border-indigo-500/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Universal Search surfaces all 100+ platform capabilities instantly.</span>
          <span className="font-bold text-slate-400">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
