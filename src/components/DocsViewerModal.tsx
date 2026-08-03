import React, { useState } from 'react';
import { SYSTEM_DOCUMENTATION } from '../data/mockData';
import ReactMarkdown from 'react-markdown';
import { X, FileText, GitFork, Cpu, Database, Server, Rocket } from 'lucide-react';

interface DocsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsViewerModal: React.FC<DocsViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prd' | 'userFlow' | 'architecture' | 'databaseSchema' | 'apiDocs' | 'deploymentGuide'>('prd');

  if (!isOpen) return null;

  const tabs = [
    { id: 'prd' as const, label: 'PRD Document', icon: FileText },
    { id: 'userFlow' as const, label: 'User Flow', icon: GitFork },
    { id: 'architecture' as const, label: 'Architecture', icon: Cpu },
    { id: 'databaseSchema' as const, label: 'PostgreSQL Schema', icon: Database },
    { id: 'apiDocs' as const, label: 'API Docs', icon: Server },
    { id: 'deploymentGuide' as const, label: 'Deployment Guide', icon: Rocket }
  ];

  const getDocContent = () => {
    switch (activeTab) {
      case 'prd': return SYSTEM_DOCUMENTATION.prd;
      case 'userFlow': return SYSTEM_DOCUMENTATION.userFlow;
      case 'architecture': return SYSTEM_DOCUMENTATION.architecture;
      case 'databaseSchema': return SYSTEM_DOCUMENTATION.databaseSchema;
      case 'apiDocs': return SYSTEM_DOCUMENTATION.apiDocs;
      case 'deploymentGuide': return SYSTEM_DOCUMENTATION.deploymentGuide;
      default: return SYSTEM_DOCUMENTATION.prd;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
              FA
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm">FluentAI Technical Blueprint & PRD</h2>
              <p className="text-[11px] text-slate-400">Complete architectural specification & deliverables</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Row */}
        <div className="flex overflow-x-auto bg-slate-950 border-b border-slate-800 px-4 py-2 gap-2 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-200 font-sans text-xs leading-relaxed">
          <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-headings:text-indigo-300">
            <ReactMarkdown>{getDocContent()}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
