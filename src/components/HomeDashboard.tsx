import React from 'react';
import { UserProfile, NavTab } from '../types';
import {
  Mic,
  Flame,
  Sparkles,
  BookMarked,
  MessageSquareCode,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Globe,
  Compass
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile;
  setActiveTab: (tab: NavTab) => void;
  onOpenCommandPalette?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ user, setActiveTab, onOpenCommandPalette }) => {
  const goalProgressPercent = Math.min(100, Math.round((user.completedTodayMinutes / user.dailyGoalMinutes) * 100));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      
      {/* Universal Search & AI Command Trigger Bar */}
      <div
        onClick={onOpenCommandPalette}
        className="bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer transition group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition block">
              Ask AI or Search Any Tool...
            </span>
            <span className="text-[11px] text-slate-400">
              Type e.g. "I want to prepare for an interview" or "Learn Japanese"
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-700 hidden sm:inline-block">
          Ctrl + K
        </span>
      </div>

      {/* AI Coach Smart Next Action Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                AI Smart Next Action
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> {user.streak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to practice {user.targetLanguage}, {user.name}? 👋
            </h1>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 max-w-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended 5-Minute Lesson for CEFR {user.level}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Practice conversational fluency and natural word stress when expressing professional opinions in {user.targetLanguage}."
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('speak')}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Start Live Voice AI Practice</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Explore All Practice Hubs</span>
              </button>
            </div>
          </div>

          {/* Daily Goal Bar */}
          <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl min-w-[230px] shrink-0 self-start md:self-auto">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-400">Daily Learning Goal</span>
              <span className="text-indigo-400">{user.completedTodayMinutes} / {user.dailyGoalMinutes} min</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${goalProgressPercent}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2 text-right font-medium">
              {goalProgressPercent >= 100 ? '🎉 Daily Goal Completed!' : `${100 - goalProgressPercent}% remaining today`}
            </span>
          </div>
        </div>
      </div>

      {/* Progressive Core Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* 1. Voice AI Speaking */}
        <div
          onClick={() => setActiveTab('speak')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl transition cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full animate-pulse">
                Live AI
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition">
              Speak - Live AI Voice
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time voice conversation in {user.targetLanguage} with instant grammar & accent coaching.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">
            Speak Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 2. Practice Hub */}
        <div
          onClick={() => setActiveTab('practice')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-xl transition cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                6 Modules
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-purple-300 transition">
              Practice - All Modules
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Roleplays, Job Interviews, IELTS Drills, Spaced Vocab, Phonetics & Cultural Etiquette.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-bold text-purple-400 group-hover:translate-x-1 transition">
            Open Practice Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 3. Global Language Matrix & Culture */}
        <div
          onClick={() => setActiveTab('practice')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {user.nativeLanguage} ➔ {user.targetLanguage}
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition">
              Language & Cultural Coach
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Learn natively from your mother tongue ({user.nativeLanguage}) with regional slang & customs.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition">
            Explore Culture & Pairs <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

