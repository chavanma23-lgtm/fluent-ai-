import React, { useState } from 'react';
import { GrammarCorrectionResult, UserProfile } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, Copy, Check, ArrowRight, BookOpen } from 'lucide-react';

interface GrammarLabProps {
  user?: UserProfile;
}

export const GrammarLab: React.FC<GrammarLabProps> = ({ user }) => {
  const targetLanguage = user?.targetLanguage || 'English';
  const nativeLanguage = user?.nativeLanguage || 'English';

  const [text, setText] = useState("Yesterday I go to market and buyed three apples for my sister who live in Chicago.");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<GrammarCorrectionResult | null>({
    score: 65,
    errorsFound: 3,
    correctedText: "Yesterday I went to the market and bought three apples for my sister who lives in Chicago.",
    explanations: [
      {
        originalSegment: "I go to market",
        correctedSegment: "I went to the market",
        rule: "Past tense required for past events ('Yesterday'). Also add article 'the' before market."
      },
      {
        originalSegment: "buyed",
        correctedSegment: "bought",
        rule: "'Buy' is an irregular verb. Its past tense form is 'bought', not 'buyed'."
      },
      {
        originalSegment: "sister who live",
        correctedSegment: "sister who lives",
        rule: "Subject-verb agreement: 'Sister' is third-person singular ('she'), so the verb requires an 's' ('lives')."
      }
    ],
    betterAlternatives: [
      "Yesterday I stopped by the market and picked up three apples for my sister living in Chicago.",
      "During my trip to the market yesterday, I got three apples for my sister, who resides in Chicago."
    ]
  });

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage, nativeLanguage })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCorrected = () => {
    if (result?.correctedText) {
      navigator.clipboard.writeText(result.correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400">
            Grammar & Expression Refiner
          </span>
        </div>
        <h1 className="text-2xl font-black text-white">Grammar & Native Phrasing Lab</h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste any sentence, email, or essay to detect syntax errors, learn grammar rules, and upgrade to native-sounding English.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Text to Check</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          placeholder="Paste or type English text here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm leading-relaxed"
        />

        <div className="flex justify-between items-center">
          <button
            onClick={() => setText("Me and my friend was wanting to visit the museum last weekend but it was closed.")}
            className="text-xs text-indigo-400 hover:underline font-medium"
          >
            Try sample sentence
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analyzing Grammar...' : 'Refine & Correct'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-black text-purple-400 text-lg">
                {result.score}%
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Grammar Health Score</h3>
                <p className="text-xs text-slate-400">{result.errorsFound} issue(s) detected and explained</p>
              </div>
            </div>

            <button
              onClick={copyCorrected}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Corrected'}
            </button>
          </div>

          {/* Corrected Text Box */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-[11px] uppercase font-extrabold text-emerald-400 tracking-wider">
              Perfected Version
            </span>
            <p className="text-base font-semibold text-emerald-200">{result.correctedText}</p>
          </div>

          {/* Detailed Explanations */}
          {result.explanations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Grammar Rule Explanations
              </h4>
              <div className="space-y-3">
                {result.explanations.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="line-through text-rose-400 font-semibold">{exp.originalSegment}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-emerald-400 font-bold">{exp.correctedSegment}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      💡 {exp.rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Native Alternatives */}
          {result.betterAlternatives.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Native Speaker Expressions
              </h4>
              <div className="space-y-2">
                {result.betterAlternatives.map((alt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 font-medium">
                    ✨ "{alt}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
