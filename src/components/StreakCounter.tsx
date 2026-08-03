import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Flame, ShieldCheck, CheckCircle2, Sparkles, Award, ArrowUpRight, Zap, Play } from 'lucide-react';
import { STREAK_MILESTONES, evaluateAndUnlockAchievements } from '../lib/rewardEngine';
import { saveUserProfileToFirestore, recordStreakCompletionToFirestore } from '../lib/userSync';
import { MilestoneCelebrationData } from './RewardMilestoneModal';

interface StreakCounterProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  authUserUid?: string | null;
  onTriggerMilestoneModal?: (data: MilestoneCelebrationData) => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  user,
  setUser,
  authUserUid,
  onTriggerMilestoneModal
}) => {
  const [recording, setRecording] = useState(false);
  const [streakMessage, setStreakMessage] = useState<string | null>(null);

  // Find next upcoming streak milestone
  const currentStreak = user.streak || 0;
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const prevMilestoneDays = STREAK_MILESTONES.filter(m => m.days <= currentStreak).pop()?.days || 0;
  const milestoneProgress = Math.min(
    100,
    Math.round(((currentStreak - prevMilestoneDays) / Math.max(1, nextMilestone.days - prevMilestoneDays)) * 100)
  );

  // Mock 7-day week completion states
  const weekDays = [
    { label: 'M', completed: true },
    { label: 'T', completed: true },
    { label: 'W', completed: true },
    { label: 'T', completed: true },
    { label: 'F', completed: true },
    { label: 'S', completed: user.completedTodayMinutes >= 5 },
    { label: 'S', completed: false }
  ];

  const handleCompleteDailyPractice = async () => {
    setRecording(true);
    setStreakMessage(null);

    setTimeout(async () => {
      const isFirstPracticeToday = user.completedTodayMinutes === 0;
      const newStreak = isFirstPracticeToday ? user.streak + 1 : user.streak;
      const addedMinutes = 15;
      const xpGained = 150;
      const coinsGained = 30;

      const updatedUser: UserProfile = {
        ...user,
        streak: newStreak,
        xp: user.xp + xpGained,
        coins: user.coins + coinsGained,
        completedTodayMinutes: user.completedTodayMinutes + addedMinutes
      };

      setUser(updatedUser);

      // Save to Firestore
      if (authUserUid) {
        await saveUserProfileToFirestore(authUserUid, updatedUser);
        await recordStreakCompletionToFirestore(authUserUid, {
          streak: newStreak,
          xpGained,
          coinsGained,
          milestoneUnlocked: nextMilestone.days === newStreak ? nextMilestone.title : undefined
        });
      }

      // Check if a milestone was reached
      const milestoneReached = STREAK_MILESTONES.find(m => m.days === newStreak);
      if (milestoneReached && onTriggerMilestoneModal) {
        onTriggerMilestoneModal({
          type: 'streak',
          title: milestoneReached.title,
          badgeName: milestoneReached.badgeName,
          description: milestoneReached.description,
          xp: milestoneReached.xpReward,
          coins: milestoneReached.coinReward,
          icon: milestoneReached.icon
        });
      }

      // Evaluate additional achievements
      evaluateAndUnlockAchievements(updatedUser, setUser, authUserUid);

      setStreakMessage(`Daily practice recorded! +${xpGained} XP & +${coinsGained} Coins added. Saved to Cloud Firestore.`);
      setRecording(false);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
      
      {/* Top Bar: Flame & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center relative">
            <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Daily Habit Engine
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Streak Shield Active
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
              <span>{currentStreak} Day Practice Streak</span>
            </h3>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCompleteDailyPractice}
          disabled={recording}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{recording ? 'Saving Progress...' : 'Record Daily Completion'}</span>
        </button>
      </div>

      {streakMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{streakMessage}</span>
        </div>
      )}

      {/* Week Calendar Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-300">This Week's Momentum Tracker</span>
          <span className="text-[11px] text-indigo-400 font-medium">{user.completedTodayMinutes} / {user.dailyGoalMinutes} min today</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition ${
                day.completed
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{day.label}</span>
              {day.completed ? (
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone Progress Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{nextMilestone.icon}</span>
            <div>
              <span className="text-xs font-extrabold text-white block">Next Goal: {nextMilestone.title}</span>
              <span className="text-[11px] text-slate-400">{nextMilestone.description}</span>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400">+{nextMilestone.xpReward} XP</span>
        </div>

        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{currentStreak} Days Done</span>
          <span>{nextMilestone.days - currentStreak} Days to {nextMilestone.days}-Day Milestone</span>
        </div>
      </div>
    </div>
  );
};
