import React from 'react';
import { UserProfile, Level } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { Flame, Coins, Sparkles, Smartphone, Monitor, BookOpen, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenDocs: () => void;
  onOpenAccountModal: () => void;
  authUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const Header: React.FC<HeaderProps> = ({
  user,
  setUser,
  isMobileFrame,
  setIsMobileFrame,
  onOpenDocs,
  onOpenAccountModal,
  authUser,
  onLogin,
  onLogout
}) => {
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(prev => ({ ...prev, level: e.target.value as Level }));
  };

  const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(prev => ({ ...prev, targetLanguage: e.target.value }));
  };

  const handleNativeLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(prev => ({ ...prev, nativeLanguage: e.target.value }));
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenAccountModal}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white text-lg">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                FluentAI
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenAccountModal(); }}
                className="text-[10px] uppercase tracking-wider bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-semibold transition"
              >
                Pro Pass
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Speaking & Multi-Language Coach</p>
          </div>
        </div>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Native -> Target Language Selector Pair */}
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl px-2.5 py-1 border border-indigo-500/30 shadow-sm text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">Native:</span>
              <select
                value={user.nativeLanguage || 'Marathi'}
                onChange={handleNativeLanguageChange}
                className="bg-transparent font-bold text-slate-200 focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none text-xs"
                title="Your Native Language"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={`nat_${lang.name}`} value={lang.name} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-indigo-400 font-extrabold px-0.5">➔</span>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-indigo-300 font-medium hidden md:inline">Target:</span>
              <select
                value={user.targetLanguage || 'English'}
                onChange={handleTargetLanguageChange}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer max-w-[95px] sm:max-w-none text-xs"
                title="Language You Want To Master"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={`tgt_${lang.name}`} value={lang.name} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CEFR Level Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700/60">
            <span className="text-xs text-slate-400 mr-1.5 hidden lg:inline">Level:</span>
            <select
              value={user.level}
              onChange={handleLevelChange}
              className="bg-transparent text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer"
            >
              {LEVELS.map(lvl => (
                <option key={lvl} value={lvl} className="bg-slate-900 text-white">
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" />
            <span>{user.streak}d</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-semibold text-xs hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{user.xp} XP</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold text-xs hidden sm:flex">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user.coins}</span>
          </div>

          {/* Device Frame View Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Switch to Full Desktop View" : "Switch to Mobile Android View"}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center gap-1 text-xs"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">Full Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span className="hidden lg:inline text-[11px]">Mobile View</span>
              </>
            )}
          </button>

          {/* Docs Trigger */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs hover:opacity-90 transition shadow-md shadow-indigo-600/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Docs</span>
          </button>

          {/* Firebase Auth Button */}
          {authUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              {authUser.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt={authUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-indigo-500/50 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600/50 flex items-center justify-center text-xs font-bold text-white border border-indigo-500/50">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
              <button
                onClick={onLogout}
                title="Sign out of Firebase"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 transition border border-slate-700 flex items-center gap-1 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              title="Sign in with Google (Firebase)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-md shadow-indigo-600/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
