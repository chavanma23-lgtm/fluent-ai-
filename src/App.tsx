import React, { useState, useEffect } from 'react';
import { UserProfile, NavTab } from './types';
import { INITIAL_USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { AiConversation } from './components/AiConversation';
import { PracticeHub } from './components/PracticeHub';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DocsViewerModal } from './components/DocsViewerModal';
import { AccountModal } from './components/AccountModal';
import { GooglePayModal } from './components/GooglePayModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { RewardMilestoneModal, MilestoneCelebrationData } from './components/RewardMilestoneModal';
import { auth, loginWithGoogle, logoutUser, testConnection } from './lib/firebase';
import { fetchUserProfileFromFirestore, saveUserProfileToFirestore } from './lib/userSync';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showOwnerKeyModal, setShowOwnerKeyModal] = useState(false);
  const [ownerKeyInput, setOwnerKeyInput] = useState('');
  const [ownerKeyError, setOwnerKeyError] = useState('');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isGooglePayOpen, setIsGooglePayOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [milestoneModalData, setMilestoneModalData] = useState<MilestoneCelebrationData | null>(null);

  // Test connection on boot & listen to Auth State
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      if (currentUser) {
        // Auto grant Owner status if logged in as chavanma23@gmail.com
        if (currentUser.email === 'chavanma23@gmail.com') {
          setIsOwnerMode(true);
        }
        // Fetch profile from Firestore
        const remoteProfile = await fetchUserProfileFromFirestore(currentUser.uid);
        if (remoteProfile) {
          setUser(remoteProfile);
        } else {
          // Initialize profile in Firestore
          const newProfile: UserProfile = {
            ...INITIAL_USER_PROFILE,
            name: currentUser.displayName || INITIAL_USER_PROFILE.name,
            avatar: currentUser.photoURL || INITIAL_USER_PROFILE.avatar,
          };
          setUser(newProfile);
          await saveUserProfileToFirestore(currentUser.uid, newProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Global Keyboard listener for Ctrl+K or Cmd+K AI Command Launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save profile state updates to Firestore whenever user state changes and logged in
  useEffect(() => {
    if (authUser?.uid) {
      saveUserProfileToFirestore(authUser.uid, user);
    }
  }, [user, authUser]);

  const handleLogin = async () => {
    try {
      const res = await loginWithGoogle();
      if (!res) return;
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(INITIAL_USER_PROFILE);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            user={user}
            setActiveTab={setActiveTab}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        );
      case 'speak':
        return <AiConversation user={user} setUser={setUser} />;
      case 'practice':
        return <PracticeHub user={user} setUser={setUser} setActiveTab={setActiveTab} />;
      case 'simulators':
        return <PracticeHub user={user} setUser={setUser} setActiveTab={setActiveTab} initialSubTab="roleplays" />;
      case 'vocabulary':
        return <PracticeHub user={user} setUser={setUser} setActiveTab={setActiveTab} initialSubTab="vocab" />;
      case 'skills':
        return <PracticeHub user={user} setUser={setUser} setActiveTab={setActiveTab} initialSubTab="skills" />;
      case 'community':
        return <PracticeHub user={user} setUser={setUser} setActiveTab={setActiveTab} initialSubTab="culture" />;
      case 'progress':
        return (
          <ProgressDashboard
            user={user}
            setUser={setUser}
            authUserUid={authUser?.uid}
            onTriggerMilestoneModal={(data) => setMilestoneModalData(data)}
          />
        );
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-500/50 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    {isOwnerMode && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        App Owner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {user.nativeLanguage} speaker learning {user.targetLanguage} (CEFR {user.level})
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Pro Pass Active
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/20"
                >
                  Manage Account & Privacy
                </button>

                {isOwnerMode ? (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition border border-amber-500/30 flex items-center gap-1.5"
                  >
                    <span>CEO Strategy Command</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOwnerKeyError('');
                      setOwnerKeyInput('');
                      setShowOwnerKeyModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-500 hover:text-slate-300 text-[10px] font-medium transition border border-slate-800/80"
                    title="Owner / Developer Portal Access"
                  >
                    Owner Login
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <HomeDashboard
            user={user}
            setActiveTab={setActiveTab}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Main Navigation Header */}
      <Header
        user={user}
        setUser={setUser}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAccountModal={() => setIsAccountOpen(true)}
        authUser={authUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Sub-Header Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileFrame={isMobileFrame}
      />

      {/* Main Content View with Optional Mobile Device Frame Wrapper */}
      <main className="flex-1 pb-20 md:pb-8">
        {isMobileFrame ? (
          <div className="max-w-md mx-auto my-6 p-4 bg-slate-900 border-4 border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden min-h-[780px]">
            {/* Phone Speaker Notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto mb-4 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
            </div>

            {renderTabContent()}
          </div>
        ) : (
          <div className="container mx-auto py-4 px-2 sm:px-4">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Universal Search & AI Command Palette Launcher Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        setUser={setUser}
      />

      {/* Floating Gemini/ChatGPT-style Instant AI Voice Launcher FAB */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-md transition hover:scale-105"
          title="Search or Jump Anywhere (Ctrl+K)"
        >
          <span className="text-indigo-400 font-bold">⌘K</span>
          <span>Quick Launcher</span>
        </button>

        <button
          onClick={() => setActiveTab('speak')}
          className="p-3.5 sm:px-4 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-full sm:rounded-2xl shadow-2xl shadow-indigo-500/30 border border-white/20 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 group"
          title="Start Live AI Voice Conversation (Gemini 2.5 Speed)"
        >
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          <span className="hidden sm:inline font-black tracking-wide">Live AI Voice Partner</span>
        </button>
      </div>

      {/* Technical Blueprint & Documentation Modal */}
      <DocsViewerModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Account, Subscription, Privacy & Data Deletion Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        authUser={authUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Reward & Milestone Celebration Modal */}
      <RewardMilestoneModal
        data={milestoneModalData}
        onClose={() => setMilestoneModalData(null)}
      />

      {/* Official Google Pay Payment Gateway Modal */}
      <GooglePayModal
        isOpen={isGooglePayOpen}
        onClose={() => setIsGooglePayOpen(false)}
        user={user}
        onPaymentSuccess={(details) => {
          setUser(prev => ({
            ...prev,
            isPro: true,
            proTransactionId: details.transactionId,
            xp: prev.xp + 500
          }));
          setIsGooglePayOpen(false);
        }}
      />

      {/* Owner Access Key Verification Modal */}
      {showOwnerKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xs">
                  CEO
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Owner Access Portal</h3>
                  <p className="text-[11px] text-slate-400">Unlock Executive Strategy Command</p>
                </div>
              </div>
              <button
                onClick={() => setShowOwnerKeyModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: Log in with Owner Google Email */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Method 1: Google Account</span>
                <p className="text-slate-300">
                  Sign in with your registered owner email (<span className="text-white font-bold">chavanma23@gmail.com</span>) to unlock automatically.
                </p>
                <button
                  onClick={async () => {
                    const u = await loginWithGoogle();
                    const email = u?.user?.email;
                    if (email === 'chavanma23@gmail.com') {
                      setIsOwnerMode(true);
                      setShowOwnerKeyModal(false);
                      setActiveTab('admin');
                    } else if (email) {
                      setOwnerKeyError(`Logged in as ${email}. Master Key required for this account.`);
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"/>
                  </svg>
                  <span>Verify with Google Sign-In</span>
                </button>
              </div>

              {/* Option 2: Enter Master Passcode */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Method 2: Owner Master Key</span>
                <p className="text-slate-300">
                  Enter your encrypted owner security key to unlock executive privileges.
                </p>
                <div className="flex gap-2 pt-1">
                  <input
                    type="password"
                    value={ownerKeyInput}
                    onChange={(e) => setOwnerKeyInput(e.target.value)}
                    placeholder="Enter Security Key"
                    className="flex-1 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-3 py-2 rounded-xl outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (ownerKeyInput.trim().toUpperCase() === 'OWNER2026' || ownerKeyInput.trim().toUpperCase() === 'CEO888' || ownerKeyInput.trim() === 'chavanma23') {
                        setIsOwnerMode(true);
                        setShowOwnerKeyModal(false);
                        setActiveTab('admin');
                      } else {
                        setOwnerKeyError('Invalid security key. Sign in as owner email or enter valid key.');
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl transition"
                  >
                    Unlock
                  </button>
                </div>
              </div>

              {ownerKeyError && (
                <p className="text-rose-400 text-[11px] font-medium bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl text-center">
                  {ownerKeyError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

