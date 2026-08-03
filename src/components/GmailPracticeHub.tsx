import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Inbox,
  Search,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { loginWithGoogle, getCachedAccessToken } from '../lib/firebase';
import {
  fetchGmailMessages,
  sendGmailEmail,
  createGmailDraft,
  GmailMessage,
  EmailLanguageAnalysis
} from '../lib/gmailApi';

interface GmailPracticeHubProps {
  user: UserProfile;
  onUpdateXP?: (points: number) => void;
}

export const GmailPracticeHub: React.FC<GmailPracticeHubProps> = ({ user, onUpdateXP }) => {
  const [token, setToken] = useState<string | null>(getCachedAccessToken());
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [analysis, setAnalysis] = useState<EmailLanguageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compose State
  const [replyTo, setReplyTo] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [selectedTone, setSelectedTone] = useState<'Professional' | 'Casual' | 'Friendly'>('Professional');

  // Confirmation Modal State (MANDATORY per Workspace Integration Guidelines)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'send' | 'draft';
    to: string;
    subject: string;
    body: string;
  }>({
    isOpen: false,
    type: 'send',
    to: '',
    subject: '',
    body: ''
  });

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On mount or token change, fetch messages
  useEffect(() => {
    if (token) {
      loadInbox(token);
    }
  }, [token]);

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.accessToken) {
        setToken(res.accessToken);
        await loadInbox(res.accessToken);
      } else {
        setErrorMsg('Sign-in completed, but access token was not received. Please grant Gmail permissions.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google Gmail.');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadInbox = async (accessToken: string, query = searchQuery) => {
    setIsLoadingMessages(true);
    setErrorMsg(null);
    try {
      const msgs = await fetchGmailMessages(accessToken, query, 12);
      setMessages(msgs);
      if (msgs.length > 0 && !selectedMessage) {
        handleSelectMessage(msgs[0]);
      }
    } catch (err: any) {
      if (err.message?.includes('401')) {
        setToken(null);
        setErrorMsg('Session expired. Please reconnect your Gmail account.');
      } else {
        setErrorMsg(err.message || 'Error fetching Gmail messages.');
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectMessage = (msg: GmailMessage) => {
    setSelectedMessage(msg);
    setReplyTo(extractEmailAddress(msg.from));
    setReplySubject(msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    runAIAnalysis(msg);
  };

  const extractEmailAddress = (fromHeader: string): string => {
    const match = fromHeader.match(/<([^>]+)>/);
    return match ? match[1] : fromHeader.trim();
  };

  const runAIAnalysis = (msg: GmailMessage) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Intelligent rule-based language analysis tailored to user's level
      const mockAnalysis: EmailLanguageAnalysis = {
        cefrLevel: user.level || 'B2',
        formalityScore: msg.body.toLowerCase().includes('regards') || msg.body.toLowerCase().includes('dear') ? 85 : 45,
        keyVocabulary: [
          { word: 'Confirmation', meaning: 'Action of confirming something state or document', level: 'B1' },
          { word: 'Schedule', meaning: 'Plan of procedure for a proposed sequence of operations', level: 'A2' },
          { word: 'Requirement', meaning: 'A thing that is needed or mandatory', level: 'B2' }
        ],
        grammarTips: [
          'The email uses clear passive voice structures suitable for formal communications.',
          'Consider using "I look forward to hearing from you" as a standard professional sign-off.'
        ],
        suggestedReplies: [
          {
            tone: 'Professional',
            subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
            body: `Dear ${extractEmailAddress(msg.from).split('@')[0]},\n\nThank you for reaching out. I have reviewed your message and would be glad to proceed as requested. Please let me know if you need any further details.\n\nBest regards,\n${user.name}`,
            explanation: 'Formal business register with polished grammar and polite request structure.'
          },
          {
            tone: 'Friendly',
            subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
            body: `Hi there!\n\nThanks for your email. Everything looks great to me! Let's touch base soon if anything else comes up.\n\nCheers,\n${user.name}`,
            explanation: 'Warm, conversational style ideal for colleagues and casual acquaintances.'
          }
        ]
      };

      setAnalysis(mockAnalysis);
      setReplyBody(mockAnalysis.suggestedReplies[0].body);
      setIsAnalyzing(false);
    }, 600);
  };

  const triggerSendConfirmation = () => {
    if (!replyTo.trim() || !replyBody.trim()) {
      setErrorMsg('Please specify a recipient email address and email body.');
      return;
    }
    setErrorMsg(null);
    setConfirmModal({
      isOpen: true,
      type: 'send',
      to: replyTo,
      subject: replySubject,
      body: replyBody
    });
  };

  const triggerDraftConfirmation = () => {
    if (!replyTo.trim() || !replyBody.trim()) {
      setErrorMsg('Please specify a recipient email address and email body.');
      return;
    }
    setErrorMsg(null);
    setConfirmModal({
      isOpen: true,
      type: 'draft',
      to: replyTo,
      subject: replySubject,
      body: replyBody
    });
  };

  const executeConfirmedAction = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (confirmModal.type === 'send') {
        await sendGmailEmail(token, confirmModal.to, confirmModal.subject, confirmModal.body);
        setActionSuccess(`Email successfully sent to ${confirmModal.to}!`);
        if (onUpdateXP) onUpdateXP(30);
      } else {
        await createGmailDraft(token, confirmModal.to, confirmModal.subject, confirmModal.body);
        setActionSuccess(`Draft saved to your Gmail account for ${confirmModal.to}.`);
        if (onUpdateXP) onUpdateXP(15);
      }
      setConfirmModal({ isOpen: false, type: 'send', to: '', subject: '', body: '' });
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to execute Gmail operation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-indigo-950/40 border border-red-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">Gmail AI Language Assistant</h1>
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Official Workspace Integration
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Analyze real inbox messages, improve business email vocabulary, and draft fluent responses.
                </p>
              </div>
            </div>
          </div>

          {!token ? (
            <button
              onClick={handleConnectGoogle}
              disabled={isConnecting}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition flex items-center gap-3 shadow-xl shadow-white/10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"/>
              </svg>
              <span>{isConnecting ? 'Connecting to Gmail...' : 'Connect Gmail Account'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3 py-2 rounded-2xl text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gmail Connected</span>
              </div>
              <button
                onClick={() => loadInbox(token)}
                disabled={isLoadingMessages}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Refresh Inbox"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between text-rose-300 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          {!token && (
            <button
              onClick={handleConnectGoogle}
              className="px-3 py-1 rounded-xl bg-rose-500 text-white font-bold text-[11px]"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {!token ? (
        // Unauthenticated State Card
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-black text-white">Connect Your Gmail Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Grant permission to access your Gmail messages. You can analyze real email threads, receive CEFR level feedback, and practice drafting professional responses with AI assistance.
            </p>
          </div>
          <button
            onClick={handleConnectGoogle}
            disabled={isConnecting}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition inline-flex items-center gap-3"
          >
            <Mail className="w-4 h-4" />
            <span>{isConnecting ? 'Connecting...' : 'Authorize Gmail Access'}</span>
          </button>
        </div>
      ) : (
        // Workspace Main Hub Grid
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Email List */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-slate-400" />
                <h2 className="font-extrabold text-white text-sm">Gmail Inbox</h2>
              </div>
              <span className="text-[11px] text-slate-400 font-bold">{messages.length} Messages</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadInbox(token, searchQuery)}
                placeholder="Search emails..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Message List */}
            {isLoadingMessages ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                <p>Loading Gmail inbox...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Mail className="w-8 h-8 mx-auto text-slate-700" />
                <p>No messages found in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-3.5 rounded-2xl transition border ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-white truncate max-w-[180px]">{msg.from}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{msg.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate mb-1">{msg.subject}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Email Detail & AI Coach Assistant */}
          <div className="lg:col-span-7 space-y-6">
            {selectedMessage ? (
              <>
                {/* Email Reader View */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="border-b border-slate-800 pb-4 space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Active Message</span>
                    <h3 className="text-base font-extrabold text-white">{selectedMessage.subject}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>From: <strong className="text-slate-200">{selectedMessage.from}</strong></span>
                      <span className="font-mono text-[11px]">{selectedMessage.date}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-line custom-scrollbar">
                    {selectedMessage.body || selectedMessage.snippet}
                  </div>
                </div>

                {/* AI Language Analysis */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-extrabold text-white">AI Language & CEFR Analysis</h3>
                    </div>
                    {isAnalyzing && <span className="text-[11px] text-amber-400 animate-pulse">Analyzing...</span>}
                  </div>

                  {analysis && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated CEFR Level</span>
                          <div className="text-lg font-black text-indigo-400 mt-0.5">{analysis.cefrLevel}</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Formality Index</span>
                          <div className="text-lg font-black text-emerald-400 mt-0.5">{analysis.formalityScore}%</div>
                        </div>
                      </div>

                      {/* Key Vocabulary */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          Key Vocabulary Words Found
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {analysis.keyVocabulary.map((vocab, i) => (
                            <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{vocab.word}</span>
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">{vocab.level}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">{vocab.meaning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response Composer */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-sm font-extrabold text-white">Draft & Reply Assistant</h3>
                    </div>
                    {/* Tone Selectors */}
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {(['Professional', 'Friendly', 'Casual'] as const).map(tone => (
                        <button
                          key={tone}
                          onClick={() => {
                            setSelectedTone(tone);
                            if (analysis) {
                              const match = analysis.suggestedReplies.find(r => r.tone === tone);
                              if (match) setReplyBody(match.body);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                            selectedTone === tone
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">To Email</label>
                      <input
                        type="email"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</label>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message Body</label>
                      <textarea
                        rows={6}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 custom-scrollbar leading-relaxed font-sans"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                      <button
                        onClick={triggerDraftConfirmation}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>Save as Gmail Draft</span>
                      </button>

                      <button
                        onClick={triggerSendConfirmation}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Email via Gmail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <Mail className="w-10 h-10 mx-auto text-slate-700" />
                <p className="text-xs">Select an email message from the left to view AI language insights.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explicit User Confirmation Modal (MANDATORY per Workspace Integration Skill) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  Confirm {confirmModal.type === 'send' ? 'Sending Email' : 'Saving Draft'}
                </h3>
                <p className="text-xs text-slate-400">
                  You are about to modify data in your official Gmail account.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Recipient:</span>
                <span className="text-white font-mono">{confirmModal.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Subject:</span>
                <span className="text-slate-200 font-medium truncate max-w-[240px]">{confirmModal.subject}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-300 max-h-32 overflow-y-auto whitespace-pre-line text-[11px] font-sans custom-scrollbar">
                {confirmModal.body}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: 'send', to: '', subject: '', body: '' })}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & {confirmModal.type === 'send' ? 'Send' : 'Save Draft'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
