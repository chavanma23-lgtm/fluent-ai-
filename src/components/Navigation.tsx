import React from 'react';
import {
  Home,
  Mic,
  Sparkles,
  BarChart3,
  User,
  Mail
} from 'lucide-react';
import { NavTab } from '../types';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isMobileFrame?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, isMobileFrame }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'speak' as NavTab, label: 'Speak', icon: Mic, badge: 'Live' },
    { id: 'practice' as NavTab, label: 'Practice', icon: Sparkles },
    { id: 'gmail' as NavTab, label: 'Gmail AI', icon: Mail, badge: 'OAuth' },
    { id: 'progress' as NavTab, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as NavTab, label: 'Profile', icon: User }
  ];

  // Helper to check if a tab is active (including sub-tabs)
  const isTabActive = (tabId: NavTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'practice' && ['simulators', 'vocabulary', 'skills', 'community'].includes(activeTab)) {
      return true;
    }
    if (tabId === 'profile' && activeTab === 'admin') {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Desktop / Large Screen Sidebar or Top Subnav */}
      <nav className={`bg-slate-900/90 backdrop-blur-md border-b border-slate-800 hidden md:block px-4 py-2 sticky top-[57px] z-20 ${isMobileFrame ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = isTabActive(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-bold bg-pink-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Frame / Small Screen Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-3 ${isMobileFrame ? 'block' : 'md:hidden'}`}>
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = isTabActive(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition ${isActive ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

