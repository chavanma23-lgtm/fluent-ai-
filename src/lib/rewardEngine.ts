import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { saveUserProfileToFirestore, recordAchievementUnlockToFirestore, recordStreakCompletionToFirestore } from './userSync';

export interface MilestoneItem {
  days: number;
  title: string;
  badgeName: string;
  xpReward: number;
  coinReward: number;
  description: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'learning' | 'vocab' | 'social';
  badgeName: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  checkUnlocked: (user: UserProfile) => boolean;
  getMetricProgress: (user: UserProfile) => { current: number; target: number };
}

export const STREAK_MILESTONES: MilestoneItem[] = [
  {
    days: 3,
    title: '3-Day Momentum Flame',
    badgeName: '3-Day Streak',
    xpReward: 100,
    coinReward: 25,
    description: 'Practiced 3 days in a row! You are building habits.',
    icon: '🔥'
  },
  {
    days: 7,
    title: '7-Day Titan Streak',
    badgeName: '7-Day Streak',
    xpReward: 250,
    coinReward: 50,
    description: '1 whole week of daily practice! Dual XP unlocked.',
    icon: '⚡'
  },
  {
    days: 14,
    title: '14-Day Fortitude',
    badgeName: '14-Day Streak',
    xpReward: 500,
    coinReward: 100,
    description: '2 consecutive weeks! Your pronunciation accuracy is surging.',
    icon: '🛡️'
  },
  {
    days: 30,
    title: '30-Day Master',
    badgeName: '30-Day Master',
    xpReward: 1200,
    coinReward: 300,
    description: '30 days of dedication! You are in the top 5% of global learners.',
    icon: '👑'
  },
  {
    days: 60,
    title: '60-Day Centurion',
    badgeName: '60-Day Centurion',
    xpReward: 2500,
    coinReward: 600,
    description: '60 consecutive days! Unstoppable language fluency.',
    icon: '🚀'
  }
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_conv',
    title: 'First Step to Fluency',
    description: 'Complete your first live AI voice or practice session.',
    category: 'learning',
    badgeName: 'First Conversation',
    icon: '💬',
    xpReward: 50,
    coinReward: 15,
    checkUnlocked: (u) => u.completedTodayMinutes > 0 || u.xp > 0,
    getMetricProgress: (u) => ({ current: Math.min(1, u.completedTodayMinutes > 0 ? 1 : 0), target: 1 })
  },
  {
    id: 'streak_3',
    title: '3-Day Flame Starter',
    description: 'Maintain a daily practice streak for 3 consecutive days.',
    category: 'streak',
    badgeName: '3-Day Streak',
    icon: '🔥',
    xpReward: 100,
    coinReward: 25,
    checkUnlocked: (u) => u.streak >= 3,
    getMetricProgress: (u) => ({ current: Math.min(3, u.streak), target: 3 })
  },
  {
    id: 'streak_7',
    title: '7-Day Titan Streak',
    description: 'Maintain a daily practice streak for 7 consecutive days.',
    category: 'streak',
    badgeName: '7-Day Streak',
    icon: '⚡',
    xpReward: 250,
    coinReward: 50,
    checkUnlocked: (u) => u.streak >= 7,
    getMetricProgress: (u) => ({ current: Math.min(7, u.streak), target: 7 })
  },
  {
    id: 'streak_14',
    title: '14-Day Legend',
    description: 'Maintain a 14-day practice streak without missing a day.',
    category: 'streak',
    badgeName: '14-Day Streak',
    icon: '🛡️',
    xpReward: 500,
    coinReward: 100,
    checkUnlocked: (u) => u.streak >= 14,
    getMetricProgress: (u) => ({ current: Math.min(14, u.streak), target: 14 })
  },
  {
    id: 'vocab_5',
    title: 'Vocab Collector',
    description: 'Save 5 new vocabulary words to your personal deck.',
    category: 'vocab',
    badgeName: 'Vocab Builder',
    icon: '📖',
    xpReward: 150,
    coinReward: 30,
    checkUnlocked: (u) => u.savedWords ? u.savedWords.length >= 5 : false,
    getMetricProgress: (u) => ({ current: Math.min(5, u.savedWords ? u.savedWords.length : 0), target: 5 })
  },
  {
    id: 'vocab_15',
    title: 'Polyglot Lexicon',
    description: 'Save 15 vocabulary words to master advanced phrasing.',
    category: 'vocab',
    badgeName: 'Polyglot Scholar',
    icon: '🎓',
    xpReward: 300,
    coinReward: 60,
    checkUnlocked: (u) => u.savedWords ? u.savedWords.length >= 15 : false,
    getMetricProgress: (u) => ({ current: Math.min(15, u.savedWords ? u.savedWords.length : 0), target: 15 })
  },
  {
    id: 'xp_1000',
    title: 'Grammar Master',
    description: 'Accumulate over 1,000 total Experience Points (XP).',
    category: 'learning',
    badgeName: 'Grammar Master',
    icon: '🌟',
    xpReward: 200,
    coinReward: 40,
    checkUnlocked: (u) => u.xp >= 1000,
    getMetricProgress: (u) => ({ current: Math.min(1000, u.xp), target: 1000 })
  },
  {
    id: 'xp_2500',
    title: 'Pronunciation Star',
    description: 'Accumulate over 2,500 total Experience Points (XP).',
    category: 'learning',
    badgeName: 'Pronunciation Star',
    icon: '💎',
    xpReward: 500,
    coinReward: 100,
    checkUnlocked: (u) => u.xp >= 2500,
    getMetricProgress: (u) => ({ current: Math.min(2500, u.xp), target: 2500 })
  },
  {
    id: 'impact_pledge',
    title: 'Global Impact Hero',
    description: 'Complete at least 1 eco/humanitarian impact pledge.',
    category: 'social',
    badgeName: 'Global Impact Pledge',
    icon: '🌍',
    xpReward: 300,
    coinReward: 50,
    checkUnlocked: (u) => u.completedImpactPledges ? u.completedImpactPledges.length > 0 : false,
    getMetricProgress: (u) => ({ current: Math.min(1, u.completedImpactPledges ? u.completedImpactPledges.length : 0), target: 1 })
  }
];

// Helper to fire visual confetti animation on milestone completion
export function triggerMilestoneConfetti() {
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (err) {
    console.warn('Confetti animation unavailable:', err);
  }
}

// AchievementEngine core scanner: automatically unlocks qualified badges and syncs to Firestore
export function evaluateAndUnlockAchievements(
  currentUser: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  authUid?: string | null
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const currentUnlockedBadges = currentUser.unlockedBadges || [];

  let updatedXp = currentUser.xp;
  let updatedCoins = currentUser.coins;
  const newBadges = [...currentUnlockedBadges];

  ALL_ACHIEVEMENTS.forEach(ach => {
    const isAlreadyUnlocked = newBadges.includes(ach.badgeName);
    if (!isAlreadyUnlocked && ach.checkUnlocked(currentUser)) {
      newBadges.push(ach.badgeName);
      updatedXp += ach.xpReward;
      updatedCoins += ach.coinReward;
      newlyUnlocked.push(ach);

      if (authUid) {
        recordAchievementUnlockToFirestore(authUid, {
          achievementId: ach.id,
          title: ach.title,
          badgeName: ach.badgeName,
          xp: ach.xpReward,
          coins: ach.coinReward
        });
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    const updatedUser: UserProfile = {
      ...currentUser,
      xp: updatedXp,
      coins: updatedCoins,
      unlockedBadges: newBadges
    };
    setUser(updatedUser);

    if (authUid) {
      saveUserProfileToFirestore(authUid, updatedUser);
    }
    triggerMilestoneConfetti();
  }

  return newlyUnlocked;
}
