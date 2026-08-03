export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type UserGoal = 'general' | 'business' | 'ielts' | 'travel' | 'interview' | 'social';

export type NavTab = 'home' | 'speak' | 'practice' | 'simulators' | 'vocabulary' | 'skills' | 'community' | 'progress' | 'profile' | 'admin' | 'gmail';

export interface SupportedLanguage {
  code: string; // BCP 47 code e.g. 'en-US', 'es-ES'
  name: string;
  flag: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: Level;
  goal: UserGoal;
  targetLanguage: string;
  nativeLanguage: string;
  streak: number;
  xp: number;
  dailyGoalMinutes: number;
  completedTodayMinutes: number;
  coins: number;
  unlockedBadges: string[];
  weakAreas: string[];
  savedWords: VocabularyWord[];
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  hasUsedTrial?: boolean;
  isPro?: boolean;
  proTransactionId?: string;
  impactPoints?: number;
  completedImpactPledges?: string[];
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  level: Level;
  mastery: number; // 0-100
  lastReviewed?: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioUrl?: string;
  grammarCorrection?: {
    original: string;
    corrected: string;
    explanation: string;
  };
  pronunciationScore?: number;
  suggestedPhrases?: string[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  category: string;
  role: string;
  aiRole: string;
  description: string;
  difficulty: Level;
  iconName: string;
  objectives: string[];
  initialGreeting: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'sentence-builder' | 'speaking' | 'listening';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  audioText?: string;
}

export interface ReadingArticle {
  id: string;
  title: string;
  category: string;
  level: Level;
  readTimeMinutes: number;
  content: string;
  keyVocabulary: string[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface ListeningLesson {
  id: string;
  title: string;
  topic: string;
  level: Level;
  audioScript: string;
  speakerName: string;
  accent: 'American' | 'British' | 'Australian';
  dictationSentence: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  topic: string;
  promptText: string;
  minSeconds: number;
  targetKeywords: string[];
}

export interface PronunciationResult {
  overallScore: number;
  clarityScore: number;
  fluencyScore: number;
  wordBreakdown: {
    word: string;
    score: number;
    phonetic: string;
    stressCorrect: boolean;
    issue?: string;
  }[];
  improvementTip: string;
}

export interface GrammarCorrectionResult {
  score: number;
  errorsFound: number;
  correctedText: string;
  explanations: {
    originalSegment: string;
    correctedSegment: string;
    rule: string;
  }[];
  betterAlternatives: string[];
}

export interface WritingAnalysis {
  clarityScore: number;
  grammarScore: number;
  vocabularyScore: number;
  tone: string;
  revisedText: string;
  strengths: string[];
  keyFeedback: string[];
}

export interface MockInterviewScenario {
  id: string;
  title: string;
  type: 'HR' | 'Technical' | 'IELTS' | 'TOEFL' | 'Group Discussion';
  companyOrExam: string;
  questions: string[];
  evaluationCriteria: string[];
}

export interface SystemDocumentation {
  prd: string;
  userFlow: string;
  architecture: string;
  databaseSchema: string;
  apiDocs: string;
  deploymentGuide: string;
}
