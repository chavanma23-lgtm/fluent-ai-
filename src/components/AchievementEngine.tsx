import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_ACHIEVEMENTS, Achievement, evaluateAndUnlockAchievements } from '../lib/rewardEngine';
import { Award, Lock, CheckCircle2, Sparkles, Trophy, Star, RefreshCw } from 'lucide-react';
import { MilestoneCelebrationData } from './RewardMilestoneModal';

interface AchievementEngineProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  authUserUid?: string | null;
  onTriggerMilestoneModal?: (data: MilestoneCelebrationData) => void;
}

export const AchievementEngine: React.FC<AchievementEngineProps> = ({
  user,
  setUser,
  authUserUid,
  onTriggerMilestoneModal
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'streak' | 'learning' | 'vocab' | 'social'>('all');
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const unlockedBadgesList = user.unlockedBadges || [];

  const handleManualCheck = () => {
    setSyncing(true);
    setSyncNotice(null);

    setTimeout(() => {
      const newlyUnlocked = evaluateAndUnlockAchievements(user, setUser, authUserUid);
      setSyncing(false);

      if (newlyUnlocked.length > 0) {
        setSyncNotice(`🎉 Success! Unlocked ${newlyUnlocked.length} new achievement(s): ${newlyUnlocked.map(a => a.title).join(', ')}! Saved to Firestore.`);
        if (onTriggerMilestoneModal && newlyUnlocked[0]) {
          const first = newlyUnlocked[0];
          onTriggerMilestoneModal({
            type: 'achievement',
            title: first.title,
            badgeName: first.badgeName,
            description: first.description,
            xp: first.xpReward,
            coins: first.coinReward,
            icon: first.icon
          });
        }
      } else {
        setSyncNotice('All achievements are up-to-date with your current Firestore progress.');
      }
    }, 700);
  };

  const filteredAchievements = ALL_ACHIEVEMENTS.filter(ach => {
    if (filterCategory === 'all') return true;
    return ach.category === filterCategory;
  });

  const unlockedCount = ALL_ACHIEVEMENTS.filter(ach => unlockedBadgesList.includes(ach.badgeName)).length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const overallCompletion = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header & Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded flex items-center gap-1 w-fit mb-1">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" /> Real-Time Achievement Engine
          </span>
          <h2 className="text-xl font-black text-white">Fluency Badges & Milestones</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete daily practice, save vocabulary, and maintain streaks to earn badges synced to Cloud Firestore.
          </p>
        </div>

        <button
          onClick={handleManualCheck}
          disabled={syncing}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Scanning Firestore...' : 'Sync & Check Badges'}</span>
        </button>
      </div>

      {syncNotice && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Progress Bar Header */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-white">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Achievement Mastery: {unlockedCount} / {totalCount} Unlocked</span>
          </span>
          <span className="text-indigo-400 font-mono">{overallCompletion}% Complete</span>
        </div>

        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${overallCompletion}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'All Badges' },
          { key: 'streak', label: '🔥 Streak' },
          { key: 'learning', label: '🎯 Learning' },
          { key: 'vocab', label: '📖 Vocab' },
          { key: 'social', label: '🌍 Impact' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key as any)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              filterCategory === cat.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredAchievements.map((ach) => {
          const isUnlocked = unlockedBadgesList.includes(ach.badgeName) || ach.checkUnlocked(user);
          const metric = ach.getMetricProgress(user);
          const percent = Math.min(100, Math.round((metric.current / metric.target) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition relative space-y-3 ${
                isUnlocked
                  ? 'bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border-indigo-500/40 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked
                        ? 'bg-indigo-500/20 border border-indigo-500/40 shadow-md'
                        : 'bg-slate-900 border border-slate-800 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white">{ach.title}</h4>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
                  </div>
                </div>
              </div>

              {/* Reward Tags & Metric Progress */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-indigo-400">+{ach.xpReward} XP</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-extrabold text-amber-400">+{ach.coinReward} Coins</span>
                </div>

                {isUnlocked ? (
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {metric.current} / {metric.target}
                  </span>
                )}
              </div>

              {/* Progress bar for locked */}
              {!isUnlocked && (
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
