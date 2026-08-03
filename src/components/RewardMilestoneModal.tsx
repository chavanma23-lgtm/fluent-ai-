import React, { useEffect } from 'react';
import { Sparkles, Award, Flame, CheckCircle2, Trophy, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface MilestoneCelebrationData {
  type: 'streak' | 'achievement';
  title: string;
  badgeName: string;
  description: string;
  xp: number;
  coins: number;
  icon?: string;
}

interface RewardMilestoneModalProps {
  data: MilestoneCelebrationData | null;
  onClose: () => void;
}

export const RewardMilestoneModal: React.FC<RewardMilestoneModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      // Fire confetti burst
      try {
        const end = Date.now() + 1.5 * 1000;
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      } catch (err) {
        console.warn('Confetti effect failed', err);
      }
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-5 transform transition-all scale-100">
        
        {/* Glowing background aura */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon / Badge Display */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-1 shadow-xl shadow-indigo-600/30 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            {data.icon ? (
              <span className="text-4xl animate-bounce">{data.icon}</span>
            ) : data.type === 'streak' ? (
              <Flame className="w-12 h-12 text-amber-400 fill-amber-500 animate-pulse" />
            ) : (
              <Trophy className="w-12 h-12 text-indigo-400 animate-bounce" />
            )}
          </div>
          <span className="absolute -bottom-2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md border border-slate-900">
            {data.badgeName}
          </span>
        </div>

        {/* Milestone Header */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {data.type === 'streak' ? 'Streak Milestone Unlocked!' : 'New Achievement Unlocked!'}
          </span>
          <h2 className="text-2xl font-black text-white">{data.title}</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Rewards Earned Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">XP Gained</span>
              <span className="text-base font-black text-indigo-400">+{data.xp} XP</span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Coins Earned</span>
              <span className="text-base font-black text-amber-400">+{data.coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group"
        >
          <span>Claim Rewards & Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
};
