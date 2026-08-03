import React, { useState, useEffect } from 'react';
import { DAILY_CHALLENGE_SAMPLE } from '../data/mockData';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Play, Clock, Sparkles, CheckCircle2, Award, Flame, RefreshCw } from 'lucide-react';

interface DailyChallengeProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ user, setUser }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    fluencyScore: number;
    confidenceScore: number;
    pronunciationScore: number;
    grammarScore: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    let timer: any;
    if (isRecording && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRecording) {
      setIsRecording(false);
      evaluateChallenge();
    }
    return () => clearInterval(timer);
  }, [isRecording, secondsLeft]);

  const startChallenge = () => {
    setSecondsLeft(30);
    setSpokenTranscript('');
    setScoreResult(null);
    setIsRecording(true);

    // Simulate mic transcript stream
    setTimeout(() => {
      setSpokenTranscript("In the morning, I usually wake up early at 6 AM. Having a consistent morning routine gives me energy and focus for the entire day. I drink water and do a quick 10-minute stretch.");
    }, 5000);
  };

  const evaluateChallenge = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: spokenTranscript || "I wake up early, brush my teeth, and prepare a refreshing breakfast to stay focused.",
          topic: DAILY_CHALLENGE_SAMPLE.topic
        })
      });
      const data = await response.json();
      setScoreResult(data);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Award XP
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 50,
        coins: prev.coins + 15,
        completedTodayMinutes: Math.min(prev.dailyGoalMinutes, prev.completedTodayMinutes + 5)
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Challenge Hero Header */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-indigo-500/20 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">Daily 30-Second Challenge</span>
          </div>
          <span className="text-xs font-bold text-slate-400">{DAILY_CHALLENGE_SAMPLE.date}</span>
        </div>

        <h1 className="text-2xl font-black text-white">{DAILY_CHALLENGE_SAMPLE.topic}</h1>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          {DAILY_CHALLENGE_SAMPLE.promptText}
        </p>

        {/* Target Keywords checklist */}
        <div className="mt-4 pt-3 border-t border-amber-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Target Bonus Words to Include:
          </span>
          <div className="flex flex-wrap gap-2">
            {DAILY_CHALLENGE_SAMPLE.targetKeywords.map((kw, idx) => (
              <span key={idx} className="text-xs bg-slate-900/80 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono font-medium">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recording Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
        {/* Timer Circle */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="72" cy="72" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#f59e0b"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * secondsLeft) / 30}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-white">{secondsLeft}s</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
          </div>
        </div>

        {/* Live Transcript Display */}
        {spokenTranscript && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 leading-relaxed">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Live Audio Transcription:</span>
            "{spokenTranscript}"
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startChallenge}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-sm transition shadow-xl shadow-amber-500/20"
            >
              <Mic className="w-5 h-5" /> Start 30s Recording
            </button>
          ) : (
            <button
              onClick={() => setSecondsLeft(0)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-500/30 animate-pulse"
            >
              <MicOff className="w-4 h-4" /> Stop & Evaluate Now
            </button>
          )}
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {isEvaluating && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2 animate-pulse">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
          <p className="font-bold text-white text-sm">Evaluating Fluency, Confidence, Pronunciation & Grammar...</p>
        </div>
      )}

      {scoreResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Challenge Evaluation Report
            </h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              +50 XP Earned!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fluency</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{scoreResult.fluencyScore}%</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{scoreResult.confidenceScore}%</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pronunciation</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">{scoreResult.pronunciationScore}%</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Grammar</span>
              <div className="text-2xl font-black text-purple-400 mt-1">{scoreResult.grammarScore}%</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            <strong className="block text-amber-400 mb-1 font-bold">Coach Evaluation Feedback:</strong>
            {scoreResult.feedback}
          </div>
        </div>
      )}
    </div>
  );
};
