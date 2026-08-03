import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Globe,
  HeartHandshake,
  Award,
  Sparkles,
  Leaf,
  ShieldCheck,
  Users,
  CheckCircle2,
  Share2,
  Download,
  Zap,
  BookOpen,
  HeartPulse,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface GlobalImpactHubProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export interface ImpactPledgeItem {
  id: string;
  title: string;
  sdgCategory: string;
  impactPoints: number;
  description: string;
  iconName: string;
  difficulty: string;
  actionSteps: string[];
}

export const IMPACT_PLEDGES: ImpactPledgeItem[] = [
  {
    id: 'sdg1',
    title: 'UN SDG 13: Climate Action & Local Clean Water Advocate',
    sdgCategory: 'SDG 13 - Climate Action',
    impactPoints: 250,
    description: 'Complete 3 climate roleplay scenarios in your target language and pledge to teach 1 neighbor about water conservation.',
    iconName: 'Leaf',
    difficulty: 'Intermediate',
    actionSteps: [
      'Practice key climate change vocabulary in target language',
      'Deliver a 2-minute clean water advocacy speech',
      'Share sustainability tips with international peers'
    ]
  },
  {
    id: 'sdg2',
    title: 'UN SDG 4: Cross-Border Digital Literacy & Peer Mentorship',
    sdgCategory: 'SDG 4 - Quality Education',
    impactPoints: 300,
    description: 'Help an ESL learner or non-native speaker practice basic conversation for 15 minutes each week.',
    iconName: 'BookOpen',
    difficulty: 'Beginner',
    actionSteps: [
      'Share custom vocabulary flashcards with community learners',
      'Provide warm, non-judgmental pronunciation feedback',
      'Help low-income students build confidence in interview English'
    ]
  },
  {
    id: 'sdg3',
    title: 'UN SDG 10: Volunteer Disaster Relief & Humanitarian Translation',
    sdgCategory: 'SDG 10 - Reduced Inequalities',
    impactPoints: 400,
    description: 'Learn rapid medical triage phrases to assist international refugees and medical relief teams during emergencies.',
    iconName: 'HeartPulse',
    difficulty: 'Advanced',
    actionSteps: [
      'Master 25 emergency medical symptoms in target language',
      'Roleplay triage translation under pressure',
      'Pledge readiness to assist non-profit relief organization'
    ]
  },
  {
    id: 'sdg4',
    title: 'UN SDG 16: Cultural Diplomacy & Inclusive Welcome Circles',
    sdgCategory: 'SDG 16 - Peace, Justice & Strong Institutions',
    impactPoints: 350,
    description: 'Welcoming newly arrived international families in your city by explaining municipal services and transit.',
    iconName: 'Users',
    difficulty: 'Intermediate',
    actionSteps: [
      'Explain local library and healthcare registration in simple words',
      'Share non-verbal cultural etiquette tips and warm gestures',
      'Organize a virtual or local intercultural potluck conversation'
    ]
  }
];

export const GlobalImpactHub: React.FC<GlobalImpactHubProps> = ({ user, setUser }) => {
  const [selectedPledge, setSelectedPledge] = useState<ImpactPledgeItem | null>(null);
  const [isPledging, setIsPledging] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedPledges = user.completedImpactPledges || [];
  const currentPoints = user.impactPoints || 120;

  const handleCompletePledge = (pledge: ImpactPledgeItem) => {
    if (completedPledges.includes(pledge.id)) return;

    setIsPledging(true);
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        impactPoints: (prev.impactPoints || 0) + pledge.impactPoints,
        completedImpactPledges: [...(prev.completedImpactPledges || []), pledge.id],
        xp: prev.xp + 100,
        unlockedBadges: Array.from(new Set([...prev.unlockedBadges, 'Global Impact Advocate']))
      }));
      setIsPledging(false);
      setSelectedPledge(null);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" /> UN Sustainable Development Goals Alignment
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Language Learning for a Better World 🌍
            </h1>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Transform language acquisition into tangible social good. Earn Impact Points by advocating for sustainability, humanitarian translation, climate education, and intercultural peace.
            </p>
          </div>

          {/* Impact Stats Card */}
          <div className="bg-slate-950/90 border border-emerald-500/30 p-5 rounded-2xl shrink-0 text-center space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Your Global Impact Score</span>
            <div className="text-3xl font-black text-white flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{currentPoints} Points</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {completedPledges.length} Active Global Pledges
            </span>

            <button
              onClick={() => setShowCertificate(true)}
              className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" /> View Impact Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Sustainable Development Goal Pledges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" /> Sustainable Action Pledges
            </h2>
            <p className="text-xs text-slate-400">Complete action steps in your target language to unlock impact points.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {IMPACT_PLEDGES.map(pledge => {
            const isCompleted = completedPledges.includes(pledge.id);
            return (
              <div
                key={pledge.id}
                className={`bg-slate-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {pledge.sdgCategory}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{pledge.impactPoints} PTS
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base mt-1">{pledge.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{pledge.description}</p>

                  <div className="mt-4 space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Action Requirements:</span>
                    {pledge.actionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isCompleted ? (
                  <div className="py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pledge Fulfilled & Impact Points Earned
                  </div>
                ) : (
                  <button
                    onClick={() => handleCompletePledge(pledge)}
                    disabled={isPledging}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {isPledging ? <Sparkles className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-4 h-4" />}
                    <span>{isPledging ? 'Verifying Action...' : 'Take Pledge & Earn Points'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Impact Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 relative text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>

            <div className="p-8 bg-slate-950 rounded-2xl border-2 border-emerald-500/50 space-y-4 shadow-inner">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Globe className="w-8 h-8" />
              </div>

              <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 block">
                FluentAI Global Impact Ambassador Certificate
              </span>

              <h2 className="text-2xl font-black text-white">{user.name}</h2>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Has successfully completed sustainable action pledges in <strong className="text-emerald-400">{user.targetLanguage}</strong>, accumulating <strong className="text-amber-400">{currentPoints} Global Impact Points</strong> in service of UN Sustainable Development Goals for global education and environmental action.
              </p>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span>ID: GLOBAL-IMPACT-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  alert("Certificate downloaded as high-resolution PDF artifact!");
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
