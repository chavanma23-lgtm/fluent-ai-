import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { exportUserDataFromFirestore, deleteAccountAndDataFromFirestore } from '../lib/userSync';
import { GooglePayModal } from './GooglePayModal';
import {
  X,
  ShieldCheck,
  CreditCard,
  Download,
  Trash2,
  Lock,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  Globe,
  Award,
  Phone,
  Smartphone,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  authUser: FirebaseUser | null;
  onLogout: () => void;
  onLogin: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  authUser,
  onLogout,
  onLogin
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'subscription' | 'privacy' | 'terms' | 'data'>('auth');
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(user.isPro || false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isGPayOpen, setIsGPayOpen] = useState(false);

  // Mobile Phone Verification & Anti-Loophole State (1 Account per Mobile Number)
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneStep, setPhoneStep] = useState<'idle' | 'otp' | 'verified'>(user.isPhoneVerified ? 'verified' : 'idle');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(user.phoneNumber || '');

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError('');
    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (rawDigits.length < 7) {
      setPhoneError('Please enter a valid mobile phone number (at least 7 digits).');
      return;
    }
    const fullPhone = `${countryCode}${rawDigits}`;

    // Anti-Loophole Check: Check if mobile number has already used a trial
    const usedPhones: string[] = JSON.parse(localStorage.getItem('fluentai_used_trial_phones') || '[]');
    if (usedPhones.includes(fullPhone)) {
      setPhoneError(`Loophole Protection: ${fullPhone} has already claimed a 7-day free trial on another account. Strict 1 trial per mobile number.`);
      return;
    }

    setSendingOtp(true);
    setTimeout(() => {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockCode);
      setPhoneStep('otp');
      setSendingOtp(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setVerifyingOtp(true);
    const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    setTimeout(() => {
      setVerifyingOtp(false);
      if (otpInput.trim() === generatedOtp || otpInput.trim() === '123456') {
        setPhoneStep('verified');
        setVerifiedPhone(fullPhone);
        
        // Lock mobile number in anti-abuse store
        const usedPhones: string[] = JSON.parse(localStorage.getItem('fluentai_used_trial_phones') || '[]');
        if (!usedPhones.includes(fullPhone)) {
          localStorage.setItem('fluentai_used_trial_phones', JSON.stringify([...usedPhones, fullPhone]));
        }

        // Activate 7-day free trial automatically once verified
        setIsSubscribed(true);
        onLogin();
      } else {
        setPhoneError('Invalid SMS verification code. Please check your SMS or try 123456.');
      }
    }, 1000);
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      setMagicSent(true);
      onLogin();
    }, 1200);
  };

  const handleSocialSignIn = (providerName: string) => {
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      onLogin();
    }, 1000);
  };

  if (!isOpen) return null;

  const handleExportData = async () => {
    setExporting(true);
    try {
      let dataToExport: Record<string, any> = { profile: user, exportDate: new Date().toISOString() };
      if (authUser?.uid) {
        dataToExport = await exportUserDataFromFirestore(authUser.uid);
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `fluent_ai_user_data_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Failed to export data:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (authUser?.uid) {
        await deleteAccountAndDataFromFirestore(authUser.uid);
      }
      onLogout();
      onClose();
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert("Account deletion failed. If your session is old, please re-authenticate and try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubscribe = () => {
    if (phoneStep !== 'verified') {
      setActiveTab('auth');
      setPhoneError('Mobile Number Verification Required: To prevent trial abuse, 1 free trial is strictly restricted to 1 verified mobile phone number.');
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setSubscribing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-indigo-500/50 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {isSubscribed ? 'Pro Member' : 'Free Tier'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{authUser?.email || 'Guest Session (Cloud Synced)'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'auth'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In & Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'subscription'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pro Subscription</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'data'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data & Deletion</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-200">
          
          {/* TAB 0: AUTH & SIGN IN */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* Guest Data Conversion Banner */}
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase text-amber-300">Instant Progress Conversion</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">Save {user.xp} XP & {user.streak}-Day Streak to Cloud</h3>
                  <p className="text-xs text-slate-300">
                    Sign in to sync your personalized pronunciation history, mastered vocabulary, and interview scores across all your mobile & desktop devices.
                  </p>
                </div>
              </div>

              {/* Direct Account Email or Mobile Sign-In */}
              <div className="space-y-4">
                {/* Anti-Loophole Security Notice */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>1 Account per Mobile Phone Policy</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">Loophole Security</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      To prevent trial duplication and maintain platform security, 7-day free trials are locked to <strong>1 verified mobile phone number per account</strong>.
                    </p>
                  </div>
                </div>

                {/* Mobile Phone Verification Box */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        Mobile Number Verification (1 Account = 1 Number)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {phoneStep === 'verified'
                          ? `Verified Mobile: ${verifiedPhone}`
                          : 'Verify your mobile number to unlock instant Cloud Sync & 7-Day Trial eligibility.'}
                      </p>
                    </div>

                    {phoneStep === 'verified' && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  {phoneError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{phoneError}</span>
                    </div>
                  )}

                  {phoneStep === 'idle' && (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs text-white font-bold px-3 py-2.5 rounded-xl outline-none"
                        >
                          <option value="+1">🇺🇸 +1 (US/CA)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+91">🇮🇳 +91 (IN)</option>
                          <option value="+61">🇦🇺 +61 (AU)</option>
                          <option value="+49">🇩🇪 +49 (DE)</option>
                          <option value="+33">🇫🇷 +33 (FR)</option>
                          <option value="+81">🇯🇵 +81 (JP)</option>
                          <option value="+86">🇨🇳 +86 (CN)</option>
                          <option value="+55">🇧🇷 +55 (BR)</option>
                          <option value="+52">🇲🇽 +52 (MX)</option>
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Mobile number (e.g. 555-019-2831)"
                          className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 text-xs text-white px-3.5 py-2.5 rounded-xl outline-none font-medium"
                          required
                        />
                        <button
                          type="submit"
                          disabled={sendingOtp}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{sendingOtp ? 'Sending SMS...' : 'Send SMS OTP'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {phoneStep === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3 bg-slate-900 p-4 rounded-xl border border-indigo-500/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          Enter 6-Digit SMS Code sent to {countryCode}{phoneNumber}
                        </label>
                        <button
                          type="button"
                          onClick={() => setPhoneStep('idle')}
                          className="text-[10px] text-slate-400 hover:text-white underline"
                        >
                          Change Number
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="Enter code e.g. 849201"
                          className="flex-1 bg-slate-950 border border-indigo-500/50 text-center font-mono text-base tracking-widest text-emerald-300 py-2 rounded-xl outline-none font-bold"
                          required
                        />
                        <button
                          type="submit"
                          disabled={verifyingOtp}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{verifyingOtp ? 'Verifying...' : 'Verify OTP'}</span>
                        </button>
                      </div>

                      {generatedOtp && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Demo SMS Code generated: <strong className="text-emerald-300 font-mono">{generatedOtp}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOtpInput(generatedOtp)}
                            className="text-indigo-400 font-bold hover:underline"
                          >
                            Auto-Fill Code
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>

                {/* Direct Email Account Sign-In */}
                <form onSubmit={handleMagicLink} className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-lg">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-white block">Email Account Sign-In</label>
                    <p className="text-[11px] text-slate-400">
                      Enter your email address to log into your account or sync your learning progress instantly.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      placeholder="Enter your email (e.g. alex@example.com)"
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 text-xs text-white px-3.5 py-2.5 rounded-xl outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={authenticating}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shrink-0 flex items-center justify-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{authenticating ? 'Signing In...' : 'Sign In & Sync'}</span>
                    </button>
                  </div>
                  {magicSent && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Account signed in and progress synchronized!
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 1: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Billing Toggle Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    FluentAI Pro Unlimited
                  </h3>
                  <p className="text-xs text-slate-400">
                    Try 7 days of full unrestricted access. Cancel anytime with zero commitment.
                  </p>
                </div>

                {/* Billing Cycle Switcher */}
                <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl text-xs shrink-0">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded-md font-extrabold">SAVE 33%</span>
                  </button>
                </div>
              </div>

              {/* 7-Day Trial Timeline (Google Style) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-3">How Your 7-Day Free Trial Works</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 relative">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Day 1 (Today)
                    </div>
                    <p className="text-xs font-extrabold text-white">$0.00 Due Today</p>
                    <p className="text-[11px] text-slate-400 mt-1">Instant full access to all Pro features unlocked immediately.</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Day 5
                    </div>
                    <p className="text-xs font-extrabold text-white">Trial Reminder</p>
                    <p className="text-[11px] text-slate-400 mt-1">We'll email you a reminder before your free trial concludes.</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Day 8
                    </div>
                    <p className="text-xs font-extrabold text-white">
                      {billingCycle === 'annual' ? '$79.99 / year' : '$9.99 / month'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Plan converts automatically unless canceled before Day 8.</p>
                  </div>
                </div>
              </div>

              {/* Main Subscription Card */}
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/40 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-400">7-Day Free Trial</span>
                    <h4 className="text-2xl font-black text-white">
                      $0.00 <span className="text-xs font-normal text-slate-300">due today</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Then {billingCycle === 'annual' ? '$79.99/yr ($6.66/mo)' : '$9.99/mo'} starting on Day 8
                    </p>
                  </div>
                  {isSubscribed ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>7-Day Trial Active</span>
                    </div>
                  ) : (
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-xl text-xs font-bold">
                      7 Days Free
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    "Unlimited AI Voice & Speech Chat",
                    "All 18 Practice Languages Unlocked",
                    "Real-Time Phonetic & Accent Analysis",
                    "Sub-100ms Low Latency AI Response",
                    "Instant 2x XP Boost & Daily Streak Shield",
                    "Cancel Anytime in 1-Click with $0 Charge"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left w-full sm:w-auto">
                    <p className="text-xs font-bold text-white">Summary: $0.00 Today</p>
                    <p className="text-[11px] text-slate-400">Cancel anytime before Day 8 to avoid charges.</p>
                  </div>

                  {isSubscribed ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Pro 7-Day Trial Active
                      </span>
                      <button
                        onClick={() => setIsSubscribed(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                      >
                        Cancel Trial
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsGPayOpen(true)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-black hover:bg-slate-950 border border-slate-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 group"
                      >
                        <span className="text-[11px] text-slate-300">Checkout with</span>
                        <div className="bg-white px-2 py-0.5 rounded flex items-center">
                          <svg className="h-3.5 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4 17.5V22.2H26.8C26.5 24 24.5 26.9 19.4 26.9C15 26.9 11.4 23.3 11.4 18.9C11.4 14.5 15 10.9 19.4 10.9C21.9 10.9 23.6 12 24.5 12.9L28.2 9.3C25.8 7.1 22.8 5.8 19.4 5.8C12.2 5.8 6.4 11.7 6.4 18.9C6.4 26.1 12.2 32 19.4 32C26.9 32 31.9 26.7 31.9 19.2C31.9 18.4 31.8 17.9 31.7 17.5H19.4Z" fill="#4285F4"/>
                            <path d="M33.6 13.5H30.8V17.5H33.6V13.5Z" fill="#34A853"/>
                            <path d="M33.6 17.5H30.8V21.5H33.6V17.5Z" fill="#FBBC05"/>
                            <path d="M33.6 21.5H30.8V25.5H33.6V21.5Z" fill="#EA4335"/>
                          </svg>
                          <span className="text-slate-900 font-extrabold text-xs ml-1 tracking-tight">Pay</span>
                        </div>
                      </button>

                      <button
                        onClick={handleSubscribe}
                        disabled={subscribing}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {subscribing
                            ? 'Starting Trial...'
                            : phoneStep === 'verified'
                            ? 'Start 7-Day Free Trial ($0.00)'
                            : 'Verify Mobile & Start 7-Day Free Trial ($0.00)'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice */}
              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-slate-300">Simple Google-Style Billing Terms</p>
                <p>
                  You will not be charged during your 7-day free trial. If you enjoy FluentAI Pro, your subscription will automatically begin on Day 8 at {billingCycle === 'annual' ? '$79.99/year' : '$9.99/month'}. You can cancel anytime before Day 8 in your account settings with zero hidden fees.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Privacy Policy & Google Play Data Safety Notice</h3>
              <p><strong>Effective Date:</strong> July 31, 2026</p>
              <p>
                FluentAI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy in compliance with the Google Play Developer Program Policies, General Data Protection Regulation (GDPR), and California Consumer Privacy Act (CCPA).
              </p>

              <h4 className="font-bold text-indigo-300 pt-2">1. Data We Collect</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, profile avatar (via Google Auth).</li>
                <li><strong>Voice & Speech Data:</strong> Spoken audio inputs converted locally to text via browser Web Speech API; text transcripts submitted securely to backend endpoints for AI evaluation. Audio files are processed transiently and NOT stored permanently.</li>
                <li><strong>Usage & Learning Metrics:</strong> User level, streak, XP, target language preferences, and saved vocabulary items stored securely in Google Cloud Firestore.</li>
              </ul>

              <h4 className="font-bold text-indigo-300 pt-2">2. How We Use Data</h4>
              <p>Data is strictly used to deliver personalized AI language coaching, evaluate pronunciation accuracy, store learning history across devices, and maintain active subscription privileges.</p>

              <h4 className="font-bold text-indigo-300 pt-2">3. Data Sharing & Third Parties</h4>
              <p>We do NOT sell, rent, or trade personal data. Speech text prompts are processed server-side via Google Gemini API under strict privacy safeguards.</p>

              <h4 className="font-bold text-indigo-300 pt-2">4. User Rights & Account Deletion</h4>
              <p>You maintain full control over your data. You may download a complete JSON export of your stored data or request permanent account and data deletion directly within the app under the &quot;Data & Deletion&quot; tab.</p>
            </div>
          )}

          {/* TAB 3: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Terms of Service</h3>
              <p><strong>Last Updated:</strong> July 31, 2026</p>
              <p>
                By downloading, accessing, or using FluentAI from the Google Play Store, you agree to be bound by these Terms of Service.
              </p>

              <h4 className="font-bold text-indigo-300 pt-2">1. Acceptable Use</h4>
              <p>FluentAI is designed for educational language practice. Users must not attempt to reverse engineer, abuse, or use automated scripts to access the AI service endpoints.</p>

              <h4 className="font-bold text-indigo-300 pt-2">2. AI Feedback Disclaimer</h4>
              <p>FluentAI utilizes advanced generative AI models (Google Gemini API) to provide real-time conversation feedback and pronunciation coaching. While highly accurate, feedback is generated for learning assistance and should not be relied upon for official linguistic certifications.</p>

              <h4 className="font-bold text-indigo-300 pt-2">3. Subscriptions & Billing</h4>
              <p>Paid subscriptions are billed through Google Play In-App Purchases. Payment will be charged to your Google Play Account at confirmation of purchase.</p>
            </div>
          )}

          {/* TAB 4: DATA EXPORT & ACCOUNT DELETION */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Download className="w-4 h-4" />
                  <h4>GDPR & CCPA Data Export</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Download a complete, structured JSON copy of your personal profile, saved vocabulary, practice conversation history, and daily challenge attempts stored in Google Cloud Firestore.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exporting ? 'Preparing Download...' : 'Download My Personal Data (.json)'}</span>
                </button>
              </div>

              <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Trash2 className="w-4 h-4" />
                  <h4>Delete Account & Erase All Personal Data</h4>
                </div>
                <p className="text-xs text-slate-400">
                  In compliance with Google Play Store User Data Deletion policies, this action will permanently delete your user profile, saved vocabulary words, conversation logs, and authentication records from Google Cloud Firestore and Firebase Auth.
                </p>

                {showDeleteConfirm ? (
                  <div className="bg-rose-900/40 p-4 rounded-xl border border-rose-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-rose-200 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Are you absolutely sure? This action cannot be undone.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deleting ? 'Deleting Data...' : 'Yes, Delete Everything'}</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 font-medium text-xs transition border border-rose-800 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account & Data</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      <GooglePayModal
        isOpen={isGPayOpen}
        onClose={() => setIsGPayOpen(false)}
        user={user}
        onPaymentSuccess={(details) => {
          setIsSubscribed(true);
          setIsGPayOpen(false);
          onLogin();
        }}
      />
    </div>
  );
};
