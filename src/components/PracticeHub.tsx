import React, { useState } from 'react';
import { UserProfile, NavTab } from '../types';
import { AiConversation } from './AiConversation';
import { RoleplaySimulator } from './RoleplaySimulator';
import { MockInterviewRoom } from './MockInterviewRoom';
import { VocabularyBuilder } from './VocabularyBuilder';
import { SkillsPractice } from './SkillsPractice';
import { UniversalLanguageHub } from './UniversalLanguageHub';
import { GlobalImpactHub } from './GlobalImpactHub';
import {
  Mic,
  MessageSquareCode,
  BookMarked,
  Sparkles,
  Globe,
  Briefcase,
  HeartHandshake
} from 'lucide-react';

interface PracticeHubProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setActiveTab: (tab: NavTab) => void;
  initialSubTab?: string;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ user, setUser, setActiveTab, initialSubTab }) => {
  const [subTab, setSubTab] = useState<string>(initialSubTab || 'speak');

  const subTabs = [
    { id: 'speak', label: 'Live AI Voice', icon: Mic, badge: 'Realtime' },
    { id: 'roleplays', label: 'Roleplay Scenarios', icon: MessageSquareCode },
    { id: 'interviews', label: 'Interviews & IELTS', icon: Briefcase },
    { id: 'vocab', label: 'Vocabulary Builder', icon: BookMarked },
    { id: 'skills', label: 'Phonetics & Games', icon: Sparkles },
    { id: 'impact', label: 'Global Impact (SDG)', icon: HeartHandshake, badge: 'Better World' },
    { id: 'culture', label: 'Global Hub & Culture', icon: Globe }
  ];

  return (
    <div className="space-y-4">
      {/* Practice Subnav Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 sticky top-[57px] z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold bg-pink-500 text-white px-1.5 py-0.2 rounded-full uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected SubTab */}
      <div>
        {subTab === 'speak' && <AiConversation user={user} setUser={setUser} />}
        {subTab === 'roleplays' && <RoleplaySimulator user={user} setUser={setUser} />}
        {subTab === 'interviews' && <MockInterviewRoom user={user} setUser={setUser} />}
        {subTab === 'vocab' && <VocabularyBuilder />}
        {subTab === 'skills' && <SkillsPractice />}
        {subTab === 'impact' && <GlobalImpactHub user={user} setUser={setUser} />}
        {subTab === 'culture' && <UniversalLanguageHub user={user} setUser={setUser} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
};
