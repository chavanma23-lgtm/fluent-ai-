import React, { useState } from 'react';
import { ROLEPLAY_SCENARIOS } from '../data/mockData';
import { RoleplayScenario, UserProfile } from '../types';
import { AiConversation } from './AiConversation';
import { Utensils, Briefcase, Plane, Hotel, Stethoscope, DollarSign, CheckCircle2, ArrowLeft, Play } from 'lucide-react';

interface RoleplaySimulatorProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Briefcase,
  Plane,
  Hotel,
  Stethoscope,
  DollarSign
};

export const RoleplaySimulator: React.FC<RoleplaySimulatorProps> = ({ user, setUser }) => {
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);

  if (selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Scenario Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scenarios
          </button>
          <div className="text-right">
            <h2 className="font-bold text-white text-sm">{selectedScenario.title}</h2>
            <p className="text-[11px] text-slate-400">Your role: {selectedScenario.role} | AI: {selectedScenario.aiRole}</p>
          </div>
        </div>

        {/* Objectives Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scenario Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {selectedScenario.objectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Active AI Conversation */}
        <AiConversation
          user={user}
          setUser={setUser}
          initialMode={selectedScenario.title}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">
          Real-World Situations
        </span>
        <h1 className="text-2xl font-black text-white mt-1">Conversation Simulator & Roleplays</h1>
        <p className="text-xs text-slate-400 mt-1">
          Practice high-stakes English scenarios with AI characters before encountering them in real life.
        </p>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLEPLAY_SCENARIOS.map(scen => {
          const IconComponent = ICON_MAP[scen.iconName] || Briefcase;
          return (
            <div
              key={scen.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                    Level {scen.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1 group-hover:text-indigo-300 transition">
                  {scen.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{scen.description}</p>

                <div className="space-y-1 mb-4">
                  <div className="text-[11px] text-slate-500">
                    <strong className="text-slate-400">AI Character:</strong> {scen.aiRole}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <strong className="text-slate-400">Your Role:</strong> {scen.role}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedScenario(scen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Start Roleplay Session
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
