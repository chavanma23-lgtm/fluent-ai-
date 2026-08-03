import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Flame, Sparkles, Trophy, Award, BarChart3, Calendar, CheckCircle2, RefreshCw, Zap, ShieldCheck, Check, X, HelpCircle, ArrowUpRight } from 'lucide-react';
import { StreakCounter } from './StreakCounter';
import { AchievementEngine } from './AchievementEngine';
import { MilestoneCelebrationData } from './RewardMilestoneModal';

interface ProgressDashboardProps {
  user: UserProfile;
  setUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
  authUserUid?: string | null;
  onTriggerMilestoneModal?: (data: MilestoneCelebrationData) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  user,
  setUser,
  authUserUid,
  onTriggerMilestoneModal
}) => {
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [activeBenchmarkTab, setActiveBenchmarkTab] = useState<'all' | 'duolingo' | 'elsa' | 'cambly'>('all');
  const [streakShieldBought, setStreakShieldBought] = useState(false);
  const [doubleXpBoost, setDoubleXpBoost] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState<number[]>([]);

  const DAILY_QUESTS = [
    { id: 1, title: 'Complete 1 Voice Conversation', xp: 50, coins: 10, icon: '🎙️' },
    { id: 2, title: 'Record a Phonetic Sentence in Accent Coach', xp: 40, coins: 5, icon: '🗣️' },
    { id: 3, title: 'Review 5 Flashcards in Vocabulary Builder', xp: 30, coins: 5, icon: '📚' }
  ];

  const handleGenerateCoachPlan = async () => {
    setGeneratingPlan(true);
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: user.level,
          goal: user.goal,
          weakAreas: user.weakAreas
        })
      });
      const data = await response.json();
      setStudyPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const COMPETITOR_BENCHMARKS = [
    {
      feature: 'Real-time AI Conversational Voice Partner',
      fluentAI: true,
      duolingo: false,
      elsa: false,
      cambly: true, // Only via human tutors ($200+/mo)
      details: 'Gemini 2.5 voice responses with sub-second latency, filler word detection, and live transcript'
    },
    {
      feature: 'Word-Level Syllable Stress & Phonetic IPA Coach',
      fluentAI: true,
      duolingo: false,
      elsa: true,
      cambly: false,
      details: 'Detailed IPA phonetic breakdowns, audio playback, and stress accuracy scoring'
    },
    {
      feature: 'IELTS Band 9 & Corporate STAR Job Interview Room',
      fluentAI: true,
      duolingo: false,
      elsa: false,
      cambly: false,
      details: 'Evaluates candidates on fluency, coherence, lexical resource, and interview impact'
    },
    {
      feature: 'Global Impact & UN Sustainable Development Pledges',
      fluentAI: true,
      duolingo: false,
      elsa: false,
      cambly: false,
      details: 'Convert learning XP into real-world clean water, climate literacy, and humanitarian support'
    },
    {
      feature: 'Instant Live Grammar Diagnostic & Rewrite Suggestions',
      fluentAI: true,
      duolingo: false, // Only passive multiple choice
      elsa: false,
      cambly: false,
      details: 'Contextual AI corrections for past perfect, prepositions, and natural phrasing'
    },
    {
      feature: 'Unlimited 24/7 Practice for Free / Low Cost',
      fluentAI: true,
      duolingo: true,
      elsa: false,
      cambly: false,
      details: 'No scheduling constraints, video anxiety, or per-hour tutor fees'
    }
  ];

  const LEADERBOARD_USERS = [
    { rank: 1, name: 'Sofia M.', xp: 3420, streak: 28, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: `${user.name} (You)`, xp: user.xp, streak: user.streak, avatar: user.avatar, isUser: true },
    { rank: 3, name: 'Kenji T.', xp: 1190, streak: 14, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { rank: 4, name: 'Elena K.', xp: 980, streak: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
          Learning Analytics & AI Coach
        </span>
        <h1 className="text-2xl font-black text-white mt-1">Progress & Personal Study Plan</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your daily learning momentum, review weak areas, inspect streak achievements, and generate custom study roadmaps.
        </p>
      </div>

      {/* StreakCounter Reward Component */}
      {setUser && (
        <StreakCounter
          user={user}
          setUser={setUser}
          authUserUid={authUserUid}
          onTriggerMilestoneModal={onTriggerMilestoneModal}
        />
      )}

      {/* AchievementEngine Component */}
      {setUser && (
        <AchievementEngine
          user={user}
          setUser={setUser}
          authUserUid={authUserUid}
          onTriggerMilestoneModal={onTriggerMilestoneModal}
        />
      )}

      {/* Market Competitor Comparison & Advantage Section */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" /> Market Advantage Benchmark
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Why FluentAI Outperforms Competitors</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing FluentAI against Duolingo, ELSA Speak, and Cambly across key fluency dimensions.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveBenchmarkTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activeBenchmarkTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveBenchmarkTab('duolingo')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activeBenchmarkTab === 'duolingo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              vs Duolingo
            </button>
            <button
              onClick={() => setActiveBenchmarkTab('elsa')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activeBenchmarkTab === 'elsa' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              vs ELSA
            </button>
            <button
              onClick={() => setActiveBenchmarkTab('cambly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activeBenchmarkTab === 'cambly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              vs Cambly
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Capability / Feature</th>
                <th className="py-3 px-3 text-center bg-indigo-500/10 text-indigo-300 font-extrabold rounded-t-xl">
                  FluentAI ✨
                </th>
                <th className="py-3 px-3 text-center">Duolingo</th>
                <th className="py-3 px-3 text-center">ELSA Speak</th>
                <th className="py-3 px-3 text-center">Cambly ($200+/m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {COMPETITOR_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-3 text-white font-bold">
                    <div>{item.feature}</div>
                    <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{item.details}</span>
                  </td>
                  <td className="py-3 px-3 text-center bg-indigo-500/5 font-extrabold text-emerald-400">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.duolingo ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.elsa ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.cambly ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Paid Only</span>
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Streak</span>
          <div className="text-2xl font-black text-white mt-0.5">{user.streak} Days</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total XP</span>
          <div className="text-2xl font-black text-indigo-400 mt-0.5">{user.xp} XP</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">CEFR Rank</span>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">Level {user.level}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Badges</span>
          <div className="text-2xl font-black text-purple-400 mt-0.5">{user.unlockedBadges.length}</div>
        </div>
      </div>

      {/* Gamification Power-Up Shop & Daily Quests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Shield & XP Boost Shop */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Gamification Power-Up Vault
            </h3>
            <span className="text-xs text-indigo-300 font-extrabold bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              🪙 {user.coins} Coins
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Item 1: Streak Shield */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Streak Freeze Shield</h4>
                  <p className="text-[10px] text-slate-400">Protects your {user.streak}-day streak if you miss a day.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (user.coins >= 15) {
                    if (setUser) {
                      setUser(prev => ({ ...prev, coins: prev.coins - 15 }));
                    }
                    setStreakShieldBought(true);
                  }
                }}
                disabled={streakShieldBought || user.coins < 15}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  streakShieldBought
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : user.coins < 15
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                }`}
              >
                {streakShieldBought ? 'Active Shield' : user.coins < 15 ? 'Need 15 🪙' : 'Buy (15 🪙)'}
              </button>
            </div>

            {/* Item 2: 2x XP Boost */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">2x XP Power Hour</h4>
                  <p className="text-[10px] text-slate-400">Double XP rewards on all lessons for 20 mins.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (user.coins >= 20) {
                    if (setUser) {
                      setUser(prev => ({ ...prev, coins: prev.coins - 20 }));
                    }
                    setDoubleXpBoost(true);
                  }
                }}
                disabled={doubleXpBoost || user.coins < 20}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  doubleXpBoost
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                    : user.coins < 20
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                }`}
              >
                {doubleXpBoost ? '2x Active (20m)' : user.coins < 20 ? 'Need 20 🪙' : 'Activate (20 🪙)'}
              </button>
            </div>
          </div>
        </div>

        {/* Daily Quest Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              Daily Quest Checklist
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">
              {claimedQuests.length}/{DAILY_QUESTS.length} Claimed
            </span>
          </div>

          <div className="space-y-2">
            {DAILY_QUESTS.map(q => {
              const isClaimed = claimedQuests.includes(q.id);
              return (
                <div key={q.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{q.icon}</span>
                    <div>
                      <span className="font-bold text-white block text-xs">{q.title}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">+{q.xp} XP • +{q.coins} Coins</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isClaimed) {
                        setClaimedQuests(prev => [...prev, q.id]);
                        if (setUser) {
                          setUser(prev => ({
                            ...prev,
                            xp: prev.xp + q.xp,
                            coins: prev.coins + q.coins
                          }));
                        }
                      }
                    }}
                    disabled={isClaimed}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      isClaimed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isClaimed ? 'Claimed' : 'Claim Reward'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Personal Coach Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" /> AI Coach Luna's Recommendation Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Generates adaptive study plans tailored to your weak areas.</p>
          </div>

          <button
            onClick={handleGenerateCoachPlan}
            disabled={generatingPlan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md"
          >
            {generatingPlan ? <Sparkles className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {generatingPlan ? 'Building Plan...' : 'Generate 3-Day Plan'}
          </button>
        </div>

        {/* Weak Areas Tags */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Identified Improvement Targets:
          </span>
          <div className="flex flex-wrap gap-2">
            {user.weakAreas.map((wa, idx) => (
              <span key={idx} className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full font-medium">
                ⚠️ {wa}
              </span>
            ))}
          </div>
        </div>

        {/* Generated Plan Output */}
        {studyPlan && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <p className="text-xs text-indigo-300 italic font-medium">"{studyPlan.motivationalQuote}"</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {studyPlan.studyPlan.map((d: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-black text-indigo-400 block">{d.day} — {d.focus}</span>
                  <ul className="space-y-1">
                    {d.tasks.map((t: string, ti: number) => (
                      <li key={ti} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base">Weekly Global Learners Leaderboard</h3>

        <div className="space-y-2">
          {LEADERBOARD_USERS.map(u => (
            <div
              key={u.rank}
              className={`p-3 rounded-xl border flex items-center justify-between transition ${
                u.isUser
                  ? 'bg-indigo-600/20 border-indigo-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center font-black text-xs ${u.rank === 1 ? 'text-amber-400' : 'text-slate-400'}`}>
                  #{u.rank}
                </span>
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                <span className="font-bold text-white text-xs">{u.name}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-slate-400">{u.streak}d streak</span>
                <span className="text-indigo-400 font-bold">{u.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
