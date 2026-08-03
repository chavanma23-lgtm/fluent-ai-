import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import {
  Globe,
  Compass,
  Languages,
  Sparkles,
  Camera,
  Users,
  MessageSquare,
  Award,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
  Volume2,
  Smile,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface UniversalLanguageHubProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setActiveTab: (tab: any) => void;
}

export const UniversalLanguageHub: React.FC<UniversalLanguageHubProps> = ({ user, setUser, setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pairs' | 'culture' | 'translator' | 'community'>('pairs');
  
  // Translator simulator state
  const [inputText, setInputText] = useState('मला इंग्रजीत आत्मविश्वासाने बोलायला शिकायचे आहे.');
  const [translatedText, setTranslatedText] = useState('I want to learn to speak English confidently.');
  const [isTranslating, setIsTranslating] = useState(false);

  // Cultural Insights Data for popular target languages
  const culturalInsights: Record<string, {
    greetings: string[];
    customs: string[];
    slang: { phrase: string; meaning: string }[];
    festivals: string[];
    etiquette: string[];
  }> = {
    English: {
      greetings: ["Hey there! How's it going?", "Good morning/afternoon!", "Pleased to meet you."],
      customs: ["Firm handshake or friendly wave", "Eye contact signifies sincerity", "Punctuality is strictly respected"],
      slang: [
        { phrase: "Break a leg", meaning: "Good luck!" },
        { phrase: "Hit the nail on the head", meaning: "Exactly right" },
        { phrase: "Spill the tea", meaning: "Share the gossip" }
      ],
      festivals: ["Thanksgiving", "New Year's Eve", "Independence Day"],
      etiquette: ["Always say 'please' and 'thank you'", "Respect personal physical space"]
    },
    Hindi: {
      greetings: ["नमस्ते (Namaste)", "आप कैसे हैं? (Aap kaise hain?)"],
      customs: ["Namaste gesture with folded palms", "Touching elders' feet (Charan Sparsh) for blessings"],
      slang: [
        { phrase: "बिंदास (Bindaas)", meaning: "Carefree, cool" },
        { phrase: "Jugaad (जुगाड़)", meaning: "Clever improvised solution" }
      ],
      festivals: ["Diwali", "Holi", "Navratri"],
      etiquette: ["Remove shoes before entering homes", "Use right hand for eating and giving items"]
    },
    Marathi: {
      greetings: ["नमस्कार (Namaskar)", "तुम्ही कसे आहात? (Tumhi kase ahat?)"],
      customs: ["Warm hospitality with Solkadhi or Chai", "Respectful addressing using 'Rao' or 'Tai'"],
      slang: [
        { phrase: "भारी (Bhari)", meaning: "Awesome, great" },
        { phrase: "विषय हार्ड (Vishay Hard)", meaning: "Deep or serious topic" }
      ],
      festivals: ["Ganesh Chaturthi", "Gudi Padwa", "Diwali"],
      etiquette: ["Addressing elders with respect (Aapan / Tumhi)", "Accepting prasad or sweets with right hand"]
    },
    Spanish: {
      greetings: ["¡Hola! ¿Cómo estás?", "¡Buenos días!"],
      customs: ["Two cheek kisses for informal greetings", "Siesta and late dinner hours"],
      slang: [
        { phrase: "Guay", meaning: "Cool / Awesome" },
        { phrase: "Chévere", meaning: "Great / Fantastic" }
      ],
      festivals: ["La Tomatina", "Día de los Muertos", "Las Fallas"],
      etiquette: ["Maintain friendly eye contact", "Generous compliments and animated hand gestures"]
    },
    Japanese: {
      greetings: ["こんにちは (Konnichiwa)", "はじめまして (Hajimemashite)"],
      customs: ["Bowing (Ojigi) to show respect", "Exchanging business cards (Meishi) with both hands"],
      slang: [
        { phrase: "ヤバい (Yabai)", meaning: "Crazy / Amazing / Dangerous" },
        { phrase: "ウケる (Ukeru)", meaning: "Hilarious" }
      ],
      festivals: ["Hanami (Cherry Blossom)", "Matsuri Summer Festivals", "Shinto New Year"],
      etiquette: ["Never leave chopsticks standing vertically in rice", "Quiet etiquette on public transit"]
    }
  };

  const currentCulture = culturalInsights[user.targetLanguage] || culturalInsights['English'];

  const quickPairs = [
    { native: 'Marathi', target: 'English', flag1: '🇮🇳', flag2: '🇺🇸', label: 'Marathi ➔ English' },
    { native: 'Hindi', target: 'English', flag1: '🇮🇳', flag2: '🇺🇸', label: 'Hindi ➔ English' },
    { native: 'English', target: 'Marathi', flag1: '🇺🇸', flag2: '🇮🇳', label: 'English ➔ Marathi' },
    { native: 'English', target: 'Hindi', flag1: '🇺🇸', flag2: '🇮🇳', label: 'English ➔ Hindi' },
    { native: 'Tamil', target: 'English', flag1: '🇮🇳', flag2: '🇺🇸', label: 'Tamil ➔ English' },
    { native: 'Telugu', target: 'English', flag1: '🇮🇳', flag2: '🇺🇸', label: 'Telugu ➔ English' },
    { native: 'Spanish', target: 'English', flag1: '🇪🇸', flag2: '🇺🇸', label: 'Spanish ➔ English' },
    { native: 'English', target: 'Japanese', flag1: '🇺🇸', flag2: '🇯🇵', label: 'English ➔ Japanese' }
  ];

  const handleSelectPair = (native: string, target: string) => {
    setUser(prev => ({ ...prev, nativeLanguage: native, targetLanguage: target }));
  };

  const handleSimulateTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      if (user.nativeLanguage === 'Marathi') {
        setTranslatedText('I am eager to practice speaking fluently without hesitation.');
      } else if (user.nativeLanguage === 'Hindi') {
        setTranslatedText('I want to master daily conversational sentences and vocabulary.');
      } else {
        setTranslatedText('Learning with AI gives me immediate feedback and real-time confidence.');
      }
      setIsTranslating(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Universal Language Engine
              </span>
              <span className="text-xs text-slate-400">30+ Languages • Any-to-Any Pairing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Global Language & Cultural Operating System
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Learn any language natively from your own mother tongue. Master regional customs, slang, live subtitles, camera translations, and global speaking clubs.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Native Tongue</span>
              <span className="text-sm font-extrabold text-white">{user.nativeLanguage}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
            <div className="text-center">
              <span className="text-[10px] uppercase text-indigo-300 font-bold block">Target Language</span>
              <span className="text-sm font-extrabold text-indigo-300">{user.targetLanguage}</span>
            </div>
          </div>
        </div>

        {/* Subnav */}
        <div className="flex border-t border-slate-800/80 mt-6 pt-4 gap-2 overflow-x-auto">
          {[
            { id: 'pairs', label: 'Language Pair Matrix', icon: Languages },
            { id: 'culture', label: 'Cultural & Slang Coach', icon: Compass },
            { id: 'translator', label: 'AI Camera & Live Translator', icon: Camera },
            { id: 'community', label: 'Global Speaking Clubs', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: PAIRS MATRIX */}
      {activeSubTab === 'pairs' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Popular Universal Language Learning Pairs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickPairs.map((pair, idx) => {
                const isSelected = user.nativeLanguage === pair.native && user.targetLanguage === pair.target;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPair(pair.native, pair.target)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-lg">
                      <span>{pair.flag1}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span>{pair.flag2}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{pair.label}</span>
                      <span className="text-[10px] text-slate-400">Native to Target</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Custom Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>1. Choose Your Native Language (Mother Tongue)</span>
              </h4>
              <p className="text-xs text-slate-400">
                The AI coach will explain grammar rules, translations, and pronunciations in your native language.
              </p>
              <select
                value={user.nativeLanguage}
                onChange={(e) => setUser(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={`nat_custom_${lang.name}`} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>2. Choose Your Target Language To Master</span>
              </h4>
              <p className="text-xs text-slate-400">
                Select from 30+ launch languages. AI voice tutors will converse with you naturally.
              </p>
              <select
                value={user.targetLanguage}
                onChange={(e) => setUser(prev => ({ ...prev, targetLanguage: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={`tgt_custom_${lang.name}`} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CULTURAL INSIGHTS & SLANG */}
      {activeSubTab === 'culture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <span>Cultural Etiquette & Native Slang: {user.targetLanguage} Culture</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Language is deeply tied to culture. Master greetings, body language, regional slang, and social etiquette.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  <span>Greetings & Customs</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentCulture.greetings.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Native Slang & Expressions</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  {currentCulture.slang.map((s, i) => (
                    <div key={i} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">{s.phrase}</span>
                      <span className="text-[11px] text-slate-400">Meaning: {s.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: AI CAMERA & LIVE TRANSLATOR */}
      {activeSubTab === 'translator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-400" />
              <span>Real-time Live Subtitles & Text Refiner</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Translate sentences instantly between {user.nativeLanguage} and {user.targetLanguage} with native tone alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase block">
                Source Input ({user.nativeLanguage})
              </span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 h-28"
              />
              <button
                onClick={handleSimulateTranslate}
                disabled={isTranslating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                <span>{isTranslating ? 'Translating...' : `Translate to ${user.targetLanguage}`}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-indigo-300 uppercase block">
                Target Translation ({user.targetLanguage})
              </span>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-indigo-200 h-28 flex items-center">
                <p className="text-sm font-medium">{translatedText}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: GLOBAL SPEAKING CLUBS */}
      {activeSubTab === 'community' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Global AI Speaking Clubs & Exchange Partner Lounge</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Join active voice rooms with learners worldwide or challenge AI conversation partners in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Global Tech & Startup Pitch Club', topic: 'Business English & Tech Interviews', activeMembers: 142 },
              { title: 'IELTS Band 8+ Speaking Circle', topic: 'Academic Fluency & Task 2 Practice', activeMembers: 98 },
              { title: 'Casual Coffee Chat Lounge', topic: 'Everyday Idioms & Travel English', activeMembers: 210 }
            ].map((room, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Audio Room
                  </span>
                  <h4 className="font-bold text-white text-sm mt-2">{room.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{room.topic}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span className="text-[11px] text-slate-400">{room.activeMembers} communicators in room</span>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
