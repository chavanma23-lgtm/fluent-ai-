import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  Cpu,
  Globe,
  Sliders,
  Sparkles,
  BarChart2,
  Search,
  Lock,
  Compass,
  Target,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'competitors' | 'swot' | 'roadmap' | 'architecture' | 'prompts'>('kpi');
  
  // Feature Flags state
  const [flags, setFlags] = useState({
    emotionAI: true,
    fillerWordMeter: true,
    sub100msLatency: true,
    spacedRepetitionMemory: true,
    multiAgentRoleplay: true,
    voiceCloningPreview: false
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live CEO & Strategy Intelligence
              </span>
              <span className="text-xs text-slate-400">10x Communication Platform Moat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FluentAI Executive Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Competitive market research, 100M user scaling roadmap, competitor matrix, SWOT analysis, and real-time AI prompt & telemetry controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">System Status</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational (86ms Latency)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-t border-slate-800/80 mt-6 pt-4 gap-2 overflow-x-auto">
          {[
            { id: 'kpi', label: 'KPI & Growth Analytics', icon: TrendingUp },
            { id: 'competitors', label: 'Competitor Intelligence Matrix', icon: Target },
            { id: 'swot', label: 'SWOT & 10x Moat', icon: ShieldCheck },
            { id: 'roadmap', label: '3-Year Product Roadmap', icon: Compass },
            { id: 'architecture', label: '100M Scale Architecture', icon: Cpu },
            { id: 'prompts', label: 'Prompt & Feature Flags', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: KPI & GROWTH ANALYTICS */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Recurring Revenue</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-white">$1,428,500</span>
                <span className="text-xs font-bold text-emerald-400 ml-2">+28.4% MoM</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pro Pass ($9.99/mo) & Enterprise B2B</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Communicators</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-white">3,850,000</span>
                <span className="text-xs font-bold text-indigo-400 ml-2">840k DAU</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 18 Global Languages</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Viral K-Factor</span>
                <div className="p-2 bg-pink-500/10 text-pink-400 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-white">1.38x</span>
                <span className="text-xs font-bold text-pink-400 ml-2">Organic Loop</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Challenge Sharing & Referral Rewards</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Voice AI Latency P99</span>
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-white">86 ms</span>
                <span className="text-xs font-bold text-emerald-400 ml-2">-14ms vs target</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Gemini 3.6 Flash Proxy Engine</p>
            </div>
          </div>

          {/* Retention & Cohort Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Retention Benchmarks vs Industry Competitors</span>
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Day 1 Retention', fluentai: 74, duolingo: 52, elsa: 44, cambly: 38 },
                  { name: 'Day 7 Retention', fluentai: 48, duolingo: 28, elsa: 22, cambly: 18 },
                  { name: 'Day 30 Retention', fluentai: 32, duolingo: 16, elsa: 12, cambly: 9 }
                ].map((row, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{row.name}</span>
                      <span className="text-indigo-400">FluentAI Lead: +{(row.fluentai - row.duolingo)}% vs Duolingo</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-slate-300 font-bold">FluentAI</span>
                        <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${row.fluentai}%` }}></div>
                        </div>
                        <span className="font-bold text-indigo-400 w-8 text-right">{row.fluentai}%</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-slate-500">Duolingo</span>
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-600 h-full rounded-full" style={{ width: `${row.duolingo}%` }}></div>
                        </div>
                        <span className="text-slate-400 w-8 text-right">{row.duolingo}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Geographic & Language Distribution</span>
              </h3>

              <div className="space-y-3">
                {[
                  { region: 'Latin America (Spanish/Portuguese)', share: 34, growth: '+42%' },
                  { region: 'East Asia (Japanese/Korean/Mandarin)', share: 28, growth: '+36%' },
                  { region: 'South Asia (Hindi/Bengali/Urdu)', share: 22, growth: '+58%' },
                  { region: 'Europe (French/German/Italian)', share: 16, growth: '+19%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.region}</h4>
                      <p className="text-[11px] text-slate-400">{item.share}% of total active user base</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPETITOR INTELLIGENCE MATRIX */}
      {activeTab === 'competitors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Comprehensive Competitor Intelligence Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct comparison of FluentAI against all 12 market players across core functional capabilities.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                  <th className="p-3 font-bold">Platform</th>
                  <th className="p-3 font-bold">Real-time Latency</th>
                  <th className="p-3 font-bold">Emotion/Confidence AI</th>
                  <th className="p-3 font-bold">Long-term Memory</th>
                  <th className="p-3 font-bold">Multi-Agent Roleplay</th>
                  <th className="p-3 font-bold">Phonetic Score</th>
                  <th className="p-3 font-bold">Monthly Price</th>
                  <th className="p-3 font-bold">10x Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="bg-indigo-950/40 font-bold border-l-4 border-indigo-500 text-white">
                  <td className="p-3 flex items-center gap-1.5 text-indigo-300">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>FluentAI</span>
                  </td>
                  <td className="p-3 text-emerald-400">86 ms (Native)</td>
                  <td className="p-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  <td className="p-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  <td className="p-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  <td className="p-3 text-emerald-400">0-100 Phonetics</td>
                  <td className="p-3 text-emerald-400">$9.99 (Free Tier)</td>
                  <td className="p-3 text-indigo-300">Real-time Multimodal + Long-term Graph Memory</td>
                </tr>

                {[
                  { name: 'Stimuler', latency: '350 ms', emotion: false, memory: false, roleplay: true, phonetics: 'Basic', price: '$12.99', weakness: 'Lacks long-term conversation memory' },
                  { name: 'ELSA Speak', latency: '400 ms', emotion: false, memory: false, roleplay: false, phonetics: 'Detailed', price: '$11.99', weakness: 'Rigid isolated phrase drills only' },
                  { name: 'Speak', latency: '280 ms', emotion: false, memory: true, roleplay: true, phonetics: 'Basic', price: '$14.99', weakness: 'High pricing & strict script adherence' },
                  { name: 'Duolingo', latency: 'N/A (Text)', emotion: false, memory: false, roleplay: false, phonetics: 'None', price: '$12.99', weakness: 'Gamified matching cards without live speech' },
                  { name: 'Cambly', latency: 'Human Call', emotion: false, memory: false, roleplay: false, phonetics: 'Manual', price: '$120.00+', weakness: 'Extremely expensive human tutors' },
                  { name: 'ChatGPT Voice', latency: '220 ms', emotion: true, memory: false, roleplay: false, phonetics: 'None', price: '$20.00', weakness: 'Generic assistant without CEFR language coaching' },
                  { name: 'Google Gemini Live', latency: '180 ms', emotion: true, memory: false, roleplay: false, phonetics: 'None', price: '$19.99', weakness: 'No structured language curriculum or scoring' }
                ].map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white">{comp.name}</td>
                    <td className="p-3 text-slate-400">{comp.latency}</td>
                    <td className="p-3">{comp.emotion ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}</td>
                    <td className="p-3">{comp.memory ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}</td>
                    <td className="p-3">{comp.roleplay ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}</td>
                    <td className="p-3 text-slate-400">{comp.phonetics}</td>
                    <td className="p-3 text-slate-400">{comp.price}</td>
                    <td className="p-3 text-rose-400/90 text-[11px]">{comp.weakness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SWOT ANALYSIS */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-emerald-400 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Strengths (Competitive Moats)</span>
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
              <li><strong>Sub-100ms Latency Engine:</strong> Gemini 3.6 Flash proxy server delivers natural human-like voice conversations with sub-100ms response time.</li>
              <li><strong>Persistent Learner Graph:</strong> Remembers weak grammar rules, target vocabulary, confidence trends, and personal interest across sessions.</li>
              <li><strong>Complete Multi-Domain Suite:</strong> Single platform covering Free Chat, Mock Interviews, IELTS/TOEFL, Roleplays, Phonetics, and Writing Refiner.</li>
              <li><strong>Multi-Language Native Coaching:</strong> Supports 18 global languages with target-native speech synthesis and translations.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-amber-400 text-base flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <span>Opportunities (Expansion Vectors)</span>
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
              <li><strong>B2B Corporate Enterprise Suite:</strong> Selling bulk seats to tech firms and global call centers for employee English proficiency certification.</li>
              <li><strong>University IELTS/TOEFL Prep Partnerships:</strong> Licensing the AI examiner module to test preparation centers worldwide.</li>
              <li><strong>Offline Edge Model Fallback:</strong> Running quantized speech evaluation models directly on Android devices for offline practice.</li>
              <li><strong>AR Smart Glasses Integration:</strong> Displaying real-time speaking prompts & vocabulary hints on AR heads-up displays during meetings.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: 3-YEAR PRODUCT ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>3-Month, 6-Month, 1-Year & 3-Year Strategic Roadmap</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                time: '3 Months',
                title: 'Phase 1: Precision Voice & Growth',
                items: [
                  'Real-time Multimodal Video/Lip Sync Coaching',
                  'Sub-100ms Gemini 3.6 Flash pipeline fine-tuning',
                  'Android Play Store Global Launch & Localized Billing',
                  'Referral K-factor optimization to reach K > 1.5'
                ],
                color: 'border-indigo-500'
              },
              {
                time: '6 Months',
                title: 'Phase 2: B2B & Exam Certification',
                items: [
                  'B2B Enterprise Admin Dashboard & Team Analytics',
                  'Official IELTS Band 9 & TOEFL Score Predictor Engine',
                  'Offline Quantized On-Device Speech Model Fallback',
                  'Voice Cloning for personalized native pronunciation comparison'
                ],
                color: 'border-purple-500'
              },
              {
                time: '1 Year',
                title: 'Phase 3: Ecosystem Expansion',
                items: [
                  'Universal Neural Accent Transcoder for global accents',
                  'Real-time Zoom & Google Meet AI Copilot extension',
                  '100M User Distributed Infrastructure Scaling',
                  'Community Creator Marketplace for custom AI scenario scripts'
                ],
                color: 'border-pink-500'
              },
              {
                time: '3 Years',
                title: 'Phase 4: Global Dominance',
                items: [
                  '100+ Million Active Communicators worldwide',
                  'Non-verbal assistive neural speech synthesis',
                  'Native Spatial Computing / Vision Pro Language Tutor',
                  'De-facto global standard for communication coaching'
                ],
                color: 'border-emerald-500'
              }
            ].map((phase, idx) => (
              <div key={idx} className={`bg-slate-950 p-5 rounded-2xl border-t-4 ${phase.color} border-slate-800 space-y-3`}>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                  {phase.time}
                </span>
                <h4 className="font-extrabold text-white text-sm">{phase.title}</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-300">
                  {phase.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 100M SCALE ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>100 Million User Distributed Cloud Architecture</span>
          </h3>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
            <div className="text-indigo-400 font-bold">[CLIENT LAYER: Web SPA + Capacitor Android App]</div>
            <div className="pl-4 text-slate-400">├── Web Speech Audio Recorder (PCM) / AudioWorklet Processors</div>
            <div className="pl-4 text-slate-400">└── Local Cache & Firestore Synchronization Engine</div>

            <div className="text-purple-400 font-bold pt-2">[INGRESS & EDGE ROUTING]</div>
            <div className="pl-4 text-slate-400">├── Cloudflare Global Anycast Edge CDN + SSL Offloading</div>
            <div className="pl-4 text-slate-400">└── NGINX Reverse Proxy Cluster (Port 3000 Ingress Routing)</div>

            <div className="text-pink-400 font-bold pt-2">[BACKEND SERVICE LAYER: Express + Cloud Run Autoscaling]</div>
            <div className="pl-4 text-slate-400">├── Express.js Node API Proxy Server (esbuild CJS bundle)</div>
            <div className="pl-4 text-slate-400">├── Gemini 3.6 Flash SDK Server-side SDK Client</div>
            <div className="pl-4 text-slate-400">└── Redis In-Memory Session & Latency Buffer Cache</div>

            <div className="text-emerald-400 font-bold pt-2">[DATA PERSISTENCE & MEMORY GRAPH]</div>
            <div className="pl-4 text-slate-400">├── Google Cloud Firestore Multi-Region Database</div>
            <div className="pl-4 text-slate-400">└── User Memory Vector Store (Weaknesses, XP, Pronunciation History)</div>
          </div>
        </div>
      )}

      {/* TAB 6: PROMPT ENGINEERING & FEATURE FLAGS */}
      {activeTab === 'prompts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Real-Time AI Feature Flags & System Prompt Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle live backend AI capabilities and inspect current system prompt parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(flags).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                  <p className="text-[11px] text-slate-400">
                    {val ? 'Enabled in server Gemini pipeline' : 'Disabled for testing'}
                  </p>
                </div>
                <button
                  onClick={() => toggleFlag(key as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                    val
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {val ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
