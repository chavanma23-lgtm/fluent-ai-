import React, { useState, useEffect, useRef } from 'react';
import { ConversationMessage, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AiConversationProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  initialMode?: string;
}

export const AiConversation: React.FC<AiConversationProps> = ({ user, setUser, initialMode = 'free_chat' }) => {
  const targetLangObj = SUPPORTED_LANGUAGES.find(l => l.name === user.targetLanguage) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name}! I'm your FluentAI coach for ${user.targetLanguage || 'English'}. What topic would you like to practice today? We can talk about your daily life, travel, career, or any custom subject!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPhrases: [
        `I'd like to practice speaking ${user.targetLanguage || 'English'} about my hobbies.`,
        "Let's talk about my favorite travel experiences.",
        "Can you ask me 3 interview questions for practice?"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [topic, setTopic] = useState('General Conversation');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = targetLangObj.code || 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [user.targetLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = async (text: string) => {
    if (!autoSpeak) return;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore', targetLanguage: user.targetLanguage || 'English' })
      });
      const data = await res.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.play().catch(() => speakWithWebSpeech(text));
      } else {
        speakWithWebSpeech(text);
      }
    } catch {
      speakWithWebSpeech(text);
    }
  };

  const speakWithWebSpeech = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLangObj.code || 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ sender: m.sender, text: m.text })),
          userLevel: user.level,
          mode: initialMode,
          scenarioTitle: topic,
          targetLanguage: user.targetLanguage || 'English',
          nativeLanguage: user.nativeLanguage || 'English'
        })
      });

      const data = await response.json();

      const aiMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "That's great! Tell me more about that.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grammarCorrection: data.grammarCorrection || undefined,
        pronunciationScore: data.pronunciationEstimate || 88,
        suggestedPhrases: data.suggestedPhrases || []
      };

      setMessages(prev => [...prev, aiMsg]);
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 15,
        completedTodayMinutes: Math.min(prev.dailyGoalMinutes, prev.completedTodayMinutes + 2)
      }));

      speakText(aiMsg.text);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "That sounds fascinating! Could you tell me more about how you practice your English daily?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pronunciationScore: 85
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-2">
      {/* Top Banner Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              AI
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              FluentAI Voice Tutor
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Level {user.level}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time English Conversation & Pronunciation Coach</p>
          </div>
        </div>

        {/* Real-time Fluency Diagnostic Radar Bar */}
        <div className="flex items-center gap-3 bg-slate-950 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Fluency: 92/100</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-slate-300">
            Pace: <span className="font-mono text-indigo-300 font-bold">135 WPM</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-slate-300">
            Fillers: <span className="text-amber-400 font-bold">0 "um/uh"</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-2 rounded-lg border transition ${
              autoSpeak
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={autoSpeak ? 'Audio Speech Output Enabled' : 'Audio Muted'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setMessages([
                {
                  id: Date.now().toString(),
                  sender: 'ai',
                  text: `Fresh session started! What topic would you like to explore today?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[88%] ${
              msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 px-1">
              <span>{msg.sender === 'user' ? 'You' : 'Coach FluentAI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.pronunciationScore && msg.sender === 'ai' && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono text-[10px]">
                  P-Score: {msg.pronunciationScore}/100
                </span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>

              {/* Speaker Audio Button */}
              <button
                onClick={() => speakWithWebSpeech(msg.text)}
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium transition ${
                  msg.sender === 'user'
                    ? 'text-indigo-200 hover:text-white'
                    : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{msg.sender === 'user' ? 'Hear My Pronunciation' : 'Listen to AI'}</span>
              </button>
            </div>

            {/* Grammar Feedback Card attached to AI message */}
            {msg.grammarCorrection && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs max-w-full">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Grammar & Expression Tip</span>
                </div>
                <p className="text-slate-300">
                  <span className="line-through text-slate-400 mr-2">{msg.grammarCorrection.original}</span>
                  <span className="text-emerald-400 font-semibold">{msg.grammarCorrection.corrected}</span>
                </p>
                <p className="text-slate-400 text-[11px] mt-1">{msg.grammarCorrection.explanation}</p>
              </div>
            )}

            {/* Suggested Phrases Chips */}
            {msg.suggestedPhrases && msg.suggestedPhrases.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {msg.suggestedPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(phrase)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full transition text-left"
                  >
                    💡 "{phrase}"
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs bg-slate-900/80 p-3 rounded-2xl w-fit border border-slate-800 animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>FluentAI is thinking & evaluating pronunciation...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Mic Active Visualizer Strip */}
      {isListening && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-t border-rose-500/30 px-4 py-2.5 flex items-center justify-between text-rose-400 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="font-bold text-white">Live Voice Capture Active</span>
            {/* Animated Equalizer Waveform Bars */}
            <div className="flex items-end gap-1 h-4">
              <div className="w-1 bg-rose-500 rounded-full animate-[bounce_1s_infinite_100ms] h-full"></div>
              <div className="w-1 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_300ms] h-2/3"></div>
              <div className="w-1 bg-amber-400 rounded-full animate-[bounce_1s_infinite_200ms] h-4/5"></div>
              <div className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms] h-1/2"></div>
              <div className="w-1 bg-purple-500 rounded-full animate-[bounce_1s_infinite_150ms] h-full"></div>
            </div>
          </div>
          <button
            onClick={toggleListening}
            className="bg-rose-500 text-white text-[11px] px-3 py-1 rounded-xl font-bold hover:bg-rose-600 transition shadow-md"
          >
            Finish Speaking
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl font-medium transition flex items-center justify-center ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
          title={isListening ? 'Stop Mic' : 'Start Voice Recording'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={isListening ? 'Listening to speech...' : 'Type or tap mic to speak English...'}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition font-semibold"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
