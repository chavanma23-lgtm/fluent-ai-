import {
  RoleplayScenario,
  VocabularyWord,
  ReadingArticle,
  ListeningLesson,
  MockInterviewScenario,
  DailyChallenge,
  Level,
  UserGoal,
  SystemDocumentation,
  SupportedLanguage,
  UserProfile
} from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  // Major International Languages
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur-PK', name: 'Urdu', flag: '🇵🇰' },
  { code: 'or-IN', name: 'Odia', flag: '🇮🇳' },
  { code: 'as-IN', name: 'Assamese', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'he-IL', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Mandarin Chinese', flag: '🇨🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 'B1' as Level,
  goal: 'general' as UserGoal,
  targetLanguage: 'English',
  nativeLanguage: 'Spanish',
  streak: 7,
  xp: 1250,
  dailyGoalMinutes: 15,
  completedTodayMinutes: 10,
  coins: 340,
  unlockedBadges: ['First Conversation', '7-Day Streak', 'Grammar Master', 'Pronunciation Star', 'Global Impact Pledge'],
  weakAreas: ['Past Perfect Tense', 'Word Stress on 3-syllable nouns', 'Prepositions of place'],
  savedWords: [],
  impactPoints: 450,
  completedImpactPledges: ['500 XP = Clean Water Access Sponsor']
};

export const SAMPLE_VOCABULARY: VocabularyWord[] = [
  {
    id: 'v1',
    word: 'Eloquence',
    phonetic: '/ˈel.ə.kwəns/',
    definition: 'Fluent or persuasive speaking or writing.',
    partOfSpeech: 'noun',
    example: 'Her speech was delivered with remarkable eloquence and passion.',
    synonyms: ['fluency', 'articulation', 'expressiveness'],
    antonyms: ['ineptitude', 'ineloquence'],
    level: 'B2',
    mastery: 85
  },
  {
    id: 'v2',
    word: 'Meticulous',
    phonetic: '/məˈtɪk.jə.ləs/',
    definition: 'Showing great attention to detail; very careful and precise.',
    partOfSpeech: 'adjective',
    example: 'He gave meticulous attention to every aspect of the project.',
    synonyms: ['thorough', 'diligent', 'precise'],
    antonyms: ['careless', 'sloppy'],
    level: 'B2',
    mastery: 60
  },
  {
    id: 'v3',
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪk.jə.leɪt/',
    definition: 'Having or showing the ability to speak fluently and coherently.',
    partOfSpeech: 'adjective',
    example: 'An articulate speaker who can express complex ideas simply.',
    synonyms: ['expressive', 'clear', 'coherent'],
    antonyms: ['inarticulate', 'hesitant'],
    level: 'B1',
    mastery: 90
  },
  {
    id: 'v4',
    word: 'Ambiguity',
    phonetic: '/ˌæm.bɪˈɡjuː.ə.ti/',
    definition: 'The quality of being open to more than one interpretation.',
    partOfSpeech: 'noun',
    example: 'We must eliminate ambiguity in our business proposal.',
    synonyms: ['uncertainty', 'vagueness', 'obscurity'],
    antonyms: ['clarity', 'certainty'],
    level: 'C1',
    mastery: 45
  },
  {
    id: 'v5',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    partOfSpeech: 'adjective',
    example: 'Children are remarkably resilient and adapt quickly to new environments.',
    synonyms: ['tough', 'adaptable', 'buoyant'],
    antonyms: ['fragile', 'vulnerable'],
    level: 'B1',
    mastery: 75
  },
  {
    id: 'v6',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    definition: 'Dealing with things sensibly and realistically based on practical considerations.',
    partOfSpeech: 'adjective',
    example: 'We need a pragmatic solution to solve our operational bottlenecks.',
    synonyms: ['practical', 'sensible', 'realistic'],
    antonyms: ['idealistic', 'unpractical'],
    level: 'B2',
    mastery: 50
  }
];

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'rp1',
    title: 'Ordering at a Fine Dining Restaurant',
    category: 'Dining & Hospitality',
    role: 'Customer',
    aiRole: 'Head Waiter (James)',
    description: 'Practice asking about menu specials, dietary requirements, and pairing drinks.',
    difficulty: 'A2',
    iconName: 'Utensils',
    objectives: [
      'Ask for daily chef recommendations',
      'Specify a dietary allergy or preference',
      'Request the check politely'
    ],
    initialGreeting: "Good evening! Welcome to Bistro Lumière. May I offer you a table by the window or would you prefer a cozy booth?"
  },
  {
    id: 'rp2',
    title: 'Job Interview for Senior Software Engineer',
    category: 'Career & Business',
    role: 'Job Candidate',
    aiRole: 'Hiring Manager (Sarah)',
    description: 'Answer behavioral questions, explain past work experience, and ask insightful questions.',
    difficulty: 'B2',
    iconName: 'Briefcase',
    objectives: [
      'Describe a challenging project you successfully delivered',
      'Explain how you deal with technical conflict',
      'Ask two strategic questions about company culture'
    ],
    initialGreeting: "Hi! Thanks for joining us today. To start off, could you briefly introduce yourself and tell me what excites you about this role?"
  },
  {
    id: 'rp3',
    title: 'Lost Luggage at the International Airport',
    category: 'Travel & Aviation',
    role: 'Passenger',
    aiRole: 'Baggage Service Agent (David)',
    description: 'Report missing baggage, describe its appearance, and fill out a trace claim.',
    difficulty: 'B1',
    iconName: 'Plane',
    objectives: [
      'State your flight number and luggage details',
      'Describe the suitcase color, brand, and tag',
      'Ask for reimbursement or emergency toiletry kit'
    ],
    initialGreeting: "Hello, Baggage Assistance. I see you look concerned. How can I assist you today?"
  },
  {
    id: 'rp4',
    title: 'Checking into a Boutique Hotel',
    category: 'Travel & Hospitality',
    role: 'Guest',
    aiRole: 'Front Desk Agent (Elena)',
    description: 'Check in, request a higher floor, and inquire about breakfast options.',
    difficulty: 'A2',
    iconName: 'Hotel',
    objectives: [
      'Provide reservation confirmation',
      'Request a room with a view',
      'Confirm breakfast hours and Wi-Fi code'
    ],
    initialGreeting: "Welcome to Grand Horizon Hotel! How can I assist with your stay today?"
  },
  {
    id: 'rp5',
    title: 'Doctor Appointment - Describing Symptoms',
    category: 'Healthcare',
    role: 'Patient',
    aiRole: 'Doctor (Dr. Aris)',
    description: 'Describe physical discomfort, duration, and ask for medical advice.',
    difficulty: 'B1',
    iconName: 'Stethoscope',
    objectives: [
      'Explain your main symptoms clearly',
      'Mention how many days you have felt unwell',
      'Ask about treatment and prescription instructions'
    ],
    initialGreeting: "Good morning! Come in and take a seat. What brings you to the clinic today?"
  },
  {
    id: 'rp6',
    title: 'Negotiating a Salary & Benefits Package',
    category: 'Business',
    role: 'Employee / Candidate',
    aiRole: 'VP of Human Resources (Mark)',
    description: 'Politely negotiate salary expectations, remote flexibility, and professional development budgets.',
    difficulty: 'C1',
    iconName: 'DollarSign',
    objectives: [
      'Acknowledge the offer appreciatively',
      'Propose a revised compensation grounded in market research',
      'Secure agreement on flexible working arrangements'
    ],
    initialGreeting: "We are thrilled to offer you the position! Have you had time to review the offer letter we emailed yesterday?"
  },
  {
    id: 'rp7',
    title: 'UN Youth Climate & Sustainability Summit',
    category: 'Global Impact & Environment',
    role: 'Youth Delegate',
    aiRole: 'UN Environmental Committee Chair (Dr. Amara)',
    description: 'Present a 2-minute proposal on local clean water and renewable energy transition to international leaders.',
    difficulty: 'B2',
    iconName: 'Globe',
    objectives: [
      'Articulate key environmental metrics in your target language',
      'Propose a realistic community action plan',
      'Answer questions on funding and volunteer engagement'
    ],
    initialGreeting: "Welcome to the UN Climate & Sustainability Forum! Delegate, please present your community's proposal for renewable energy transition."
  },
  {
    id: 'rp8',
    title: 'Emergency Medical Triage & Disaster Relief',
    category: 'Humanitarian & Healthcare',
    role: 'Volunteer Medical Interpreter',
    aiRole: 'Field Operations Lead (Dr. Kenji)',
    description: 'Provide clear translation and emergency communication during humanitarian relief operations.',
    difficulty: 'B1',
    iconName: 'HeartPulse',
    objectives: [
      'Translate urgent symptoms and allergy information clearly',
      'Explain dosage instructions calmly',
      'Provide reassuring words to affected families'
    ],
    initialGreeting: "Thank you for stepping up as a volunteer interpreter! We have incoming patients. Are you ready to assist with rapid medical triage?"
  },
  {
    id: 'rp9',
    title: 'Refugee Integration & Cultural Welcome Center',
    category: 'Global Empathy & Integration',
    role: 'Community Navigator',
    aiRole: 'New Resident (Fatima)',
    description: 'Guide newly arrived international families through municipal services, school enrollment, and public transport.',
    difficulty: 'A2',
    iconName: 'Users',
    objectives: [
      'Explain how to apply for local healthcare and library cards',
      'Give clear directions for transit routes',
      'Share warm cultural etiquette tips and words of encouragement'
    ],
    initialGreeting: "Hello! We just arrived yesterday. Could you help us understand how to register our children for local school and public healthcare?"
  },
  {
    id: 'rp10',
    title: 'Cross-Border EdTech & Global Literacy Pitch',
    category: 'Education & Social Good',
    role: 'Social Entrepreneur',
    aiRole: 'Global Impact Investor (Elena)',
    description: 'Pitch a low-bandwidth AI education tool for rural schools in developing nations.',
    difficulty: 'C1',
    iconName: 'BookOpen',
    objectives: [
      'Deliver an engaging elevator pitch on educational access',
      'Demonstrate social return on investment (SROI)',
      'Outline offline-first mobile accessibility'
    ],
    initialGreeting: "I love supporting social impact startups! Tell me about your platform and how it solves educational inequality."
  }
];

export const MOCK_INTERVIEWS: MockInterviewScenario[] = [
  {
    id: 'mi1',
    title: 'General HR Screening Interview',
    type: 'HR',
    companyOrExam: 'Tech Global Corp',
    questions: [
      'Tell me about yourself and your career path so far.',
      'Why do you want to work for our company specifically?',
      'Describe a time you faced a tight deadline and how you handled it.',
      'Where do you see yourself professionally in three years?'
    ],
    evaluationCriteria: [
      'Grammar Accuracy & Range',
      'Fluency & Pacing',
      'Confidence & Tone',
      'Relevance & Conciseness'
    ]
  },
  {
    id: 'mi2',
    title: 'IELTS Speaking Test (Parts 1 - 3)',
    type: 'IELTS',
    companyOrExam: 'IELTS Academic Exam',
    questions: [
      'Part 1: Do you prefer working or studying in the morning or evening? Why?',
      'Part 2: Describe a memorable journey you took. You should say: where you went, who you went with, what you did, and explain why it was memorable.',
      'Part 3: How has modern travel technology changed the way people explore new places?'
    ],
    evaluationCriteria: [
      'Fluency & Coherence (Band 1-9)',
      'Lexical Resource / Vocabulary (Band 1-9)',
      'Grammatical Range & Accuracy (Band 1-9)',
      'Pronunciation & Intonation (Band 1-9)'
    ]
  },
  {
    id: 'mi3',
    title: 'TOEFL Speaking Task 1 & 2',
    type: 'TOEFL',
    companyOrExam: 'ETS TOEFL iBT',
    questions: [
      'Independent Task: Some people prefer to study alone, while others prefer to study in groups. Which do you prefer and why?',
      'Integrated Task: Summarize the university announcement regarding campus library hours and state the student speaker opinion.'
    ],
    evaluationCriteria: [
      'Delivery (Clarity, Pace, Intonation)',
      'Language Use (Grammar, Word Choice)',
      'Topic Development (Completeness, Progression)'
    ]
  },
  {
    id: 'mi4',
    title: 'Technical Leader System Design Interview',
    type: 'Technical',
    companyOrExam: 'Silicon Valley Enterprise',
    questions: [
      'How do you explain complex technical architecture to non-technical stakeholders?',
      'Describe an instance where a project failed or stalled, and what you learned.',
      'How do you mentor junior developers on your engineering team?'
    ],
    evaluationCriteria: [
      'Technical Communication Clarity',
      'Structural Logic',
      'Vocabulary Precision'
    ]
  }
];

export const READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'ra1',
    title: 'The Neuroscience of Language Acquisition',
    category: 'Science & Education',
    level: 'B2',
    readTimeMinutes: 4,
    content: `Learning a second language as an adult was once thought to be drastically harder than doing so as a child. However, recent neuroimaging studies demonstrate that adult brains retain remarkable neuroplasticity. When we engage in active speaking practice and spaced repetition, the brain forms dense new neural pathways in Broca's and Wernicke's areas.

Key to rapid fluency is the shift from passive listening to active production. When learners attempt to form sentences, they force their neural circuits to retrieve vocabulary under time constraints, building cognitive automaticity over time.`,
    keyVocabulary: ['neuroplasticity', 'retireve', 'automaticity', 'neural pathways'],
    comprehensionQuestions: [
      {
        question: 'What does recent neuroimaging prove about adult brains?',
        options: [
          'Adult brains cannot learn new grammar rules',
          'Adult brains retain neuroplasticity and can form new neural pathways',
          'Children and adults learn languages using identical brain areas',
          'Passive listening is superior to active speaking'
        ],
        correctIndex: 1
      },
      {
        question: 'What is essential for achieving rapid fluency?',
        options: [
          'Memorizing entire dictionaries',
          'Shifting from passive listening to active production',
          'Reading without speaking out loud',
          'Avoiding conversation until advanced level'
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'ra2',
    title: 'Mastering Small Talk in International Business',
    category: 'Business & Career',
    level: 'B1',
    readTimeMinutes: 3,
    content: `In global business settings, small talk is not just pleasant conversation—it is a vital bonding mechanism. Before diving into agendas or negotiations, international professionals often spend five to ten minutes discussing neutral topics like travel, local cuisine, weekend activities, or weather.

To excel at small talk, use open-ended questions that start with 'How', 'What', or 'Why'. Instead of asking 'Did you have a good flight?', ask 'How was your journey over here?' This gives the speaker room to elaborate.`,
    keyVocabulary: ['bonding', 'neutral', 'open-ended', 'elaborate'],
    comprehensionQuestions: [
      {
        question: 'Why is small talk important in international business?',
        options: [
          'It replaces the need for formal contracts',
          'It serves as a vital bonding mechanism before negotiations',
          'It fills time when meetings start late',
          'It tests language grammar strictly'
        ],
        correctIndex: 1
      }
    ]
  }
];

export const LISTENING_LESSONS: ListeningLesson[] = [
  {
    id: 'll1',
    title: 'Coffee Shop Order & Casual Conversation',
    topic: 'Daily Life',
    level: 'A2',
    audioScript: "Barista: Hi there! What can I get started for you today?\nCustomer: Good morning! Could I please get a medium oat milk latte with vanilla syrup?\nBarista: Sure thing! Would you like that hot or iced?\nCustomer: Iced, please. And could I also get a blueberry muffin?\nBarista: You got it! That will be $8.50 altogether.",
    speakerName: 'Emma',
    accent: 'American',
    dictationSentence: "Could I please get a medium oat milk latte with vanilla syrup?",
    questions: [
      {
        question: 'What milk substitute did the customer order?',
        options: ['Almond milk', 'Oat milk', 'Soy milk', 'Whole milk'],
        correctIndex: 1
      },
      {
        question: 'Was the drink ordered hot or iced?',
        options: ['Hot', 'Iced', 'Room temperature', 'Blended'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'll2',
    title: 'Keynote Presentation: Remote Work Culture',
    topic: 'Business',
    level: 'B2',
    audioScript: "Welcome everyone. Today we are exploring how asynchronous communication fosters deeper productivity across time zones. When team members document thoughts thoroughly instead of relying on constant synchronous meetings, decision clarity increases exponentially.",
    speakerName: 'Oliver',
    accent: 'British',
    dictationSentence: "Asynchronous communication fosters deeper productivity across time zones.",
    questions: [
      {
        question: 'What does asynchronous communication foster according to the speaker?',
        options: [
          'Deeper productivity across time zones',
          'More frequent video calls',
          'Faster email responses',
          'Strict 9-to-5 work hours'
        ],
        correctIndex: 0
      }
    ]
  }
];

export const DAILY_CHALLENGE_SAMPLE: DailyChallenge = {
  id: 'dc-today',
  date: new Date().toISOString().split('T')[0],
  topic: 'Describe Your Morning Routine',
  promptText: 'Speak for 30 seconds about your morning habits. What is the first thing you do when you wake up, and why is it important to start your day right?',
  minSeconds: 30,
  targetKeywords: ['routine', 'refreshing', 'habit', 'energy', 'focus']
};

export const SYSTEM_DOCUMENTATION: SystemDocumentation = {
  prd: `# FluentAI — Product Requirement Document (PRD)

## 1. Executive Summary
FluentAI is a cross-platform (Web & Android) AI-powered English learning application designed to help learners attain natural, conversational English fluency. Inspired by Duolingo, ELSA Speak, Speak, and Cambly, FluentAI merges real-time AI voice conversation, instant pronunciation score detection, grammar feedback, and structured roleplays into an accessible mobile-first interface.

## 2. Core Value Proposition
- **24/7 AI Tutor**: Unlimited real-time speaking practice without judgment or scheduling constraints.
- **Micro-Feedback**: Instant phonetic breakdown (0-100 score), stress detection, and grammar explanation for every utterance.
- **Contextual Learning**: 10+ real-world roleplays (airport, job interview, doctor) and CEFR-aligned learning paths (A1 - C2).
- **Gamified Consistency**: Daily streaks, XP points, coin rewards, and weekly global leaderboards.

## 3. Key User Personas
1. **The Job Seeker**: Needs mock interviews, professional vocabulary, and confidence for English tech/business interviews.
2. **The Student (IELTS/TOEFL)**: Requires structured speaking test practice with Band score evaluations.
3. **The Global Professional**: Seeks email/essay writing correction and nuanced small talk skills.
4. **The Beginner Learner**: Focuses on basic vocabulary, daily challenges, and low-pressure roleplays.

## 4. Functional Scope
- AI Voice/Text Practice (\`/api/chat\`)
- Pronunciation Assessment & Phonetic Guidance (\`/api/pronunciation\`)
- Grammar Analysis & Native Alternatives (\`/api/grammar\`)
- Spaced Repetition Vocabulary Builder
- 10 Real-world Conversation Simulators & Roleplays
- Daily 30-Second Speaking Challenge with 4-metric evaluation
- Writing Correction & Reading/Listening Practice modules
- AI Personal Coach (Luna) generating tailored study plans
- Documentation Viewer for PRD, User Flow, Architecture, DB Schema, and API Spec.`,

  userFlow: `
[User Open FluentAI]
       │
       ├──► 1. Onboarding & Placement (Level Selection A1-C2 & Target Goal)
       │
       ├──► 2. Home Dashboard (Daily Streak, XP, AI Coach Recommendations)
       │       │
       │       ├──► AI Speaking Practice (Voice/Text Chat with Instant Feedback)
       │       ├──► Daily 30-Sec Speaking Challenge (Mic Recording -> 4 Metric Eval)
       │       ├──► Pronunciation Coach (Word Stress & Phonetic Score)
       │       ├──► Grammar Correction Lab (Text/Speech Refiner)
       │       ├──► Roleplay Simulator (6+ Interactive Scenarios)
       │       ├──► Vocabulary Builder (Flashcards & Spaced Repetition)
       │       ├──► Mock Interview Room (HR, IELTS, Technical)
       │       ├──► Skills Lab (Writing, Reading, Listening, Games)
       │       └──► AI Coach Study Plan Generator
       │
       └──► 3. Progress & Analytics (Weekly Charts, Achievements, Leaderboard)
`,

  architecture: `
# Architecture & Tech Stack Blueprint

## Frontend Layer
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Responsive Mobile Frame / Web Layout
- **Animations**: Motion (framer-motion v12)
- **Audio API**: Web Audio API (PCM Recording / Web Speech Synthesis / Gemini TTS fallback)

## Backend & AI Layer
- **Server**: Express.js (Node.js runtime on port 3000)
- **AI SDK**: @google/genai (Gemini 3.6 Flash for conversation & reasoning, Gemini 3.1 Flash TTS Preview for speech)
- **Security**: Server-side proxy API routes to keep API keys hidden from client browser.

## Data Layer
- **Client Persistence**: LocalStorage sync for user XP, streak, saved vocabulary, and practice logs.
- **Cloud Scale**: Designed for PostgreSQL / Firestore synchronization schema.
`,

  databaseSchema: `
-- PostgreSQL Database Schema for FluentAI

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    cefr_level VARCHAR(10) DEFAULT 'B1',
    goal VARCHAR(50) DEFAULT 'general',
    streak_count INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    coins INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vocabulary_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    definition TEXT,
    part_of_speech VARCHAR(50),
    example_sentence TEXT,
    mastery_score INT DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mode VARCHAR(50) NOT NULL, -- 'free_chat', 'roleplay', 'interview', 'challenge'
    title VARCHAR(255),
    pronunciation_avg_score FLOAT,
    grammar_avg_score FLOAT,
    duration_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE practice_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user' or 'ai'
    content TEXT NOT NULL,
    grammar_correction JSONB,
    pronunciation_breakdown JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`,

  apiDocs: `
# FluentAI Server API Specification

1. POST /api/chat
   Request: { messages: Array<{role: string, content: string}>, mode: string, level: string, scenario?: string }
   Response: { reply: string, grammarCorrection?: { original, corrected, explanation }, pronunciationEstimate: number }

2. POST /api/pronunciation
   Request: { text: string, userTranscription: string }
   Response: { overallScore: number, wordBreakdown: Array<{ word, score, phonetic, stressCorrect }>, improvementTip: string }

3. POST /api/grammar
   Request: { text: string }
   Response: { score: number, errorsFound: number, correctedText: string, explanations: Array<{ originalSegment, correctedSegment, rule }>, betterAlternatives: string[] }

4. POST /api/coach
   Request: { level: string, goal: string, weakAreas: string[] }
   Response: { studyPlan: Array<{ day: string, focus: string, tasks: string[] }>, motivationalQuote: string, recommendedModules: string[] }

5. POST /api/challenge
   Request: { userText: string, topic: string }
   Response: { fluencyScore: number, confidenceScore: number, pronunciationScore: number, grammarScore: number, feedback: string }
`,

  deploymentGuide: `# Google Play Store Release & Production Deployment Guide

## 1. Google Play Store Release Checklist
- [x] **Data Safety Form**: Account creation, speech transcription, learning metrics disclosed under Google Cloud Firestore & Gemini API server processing.
- [x] **User Account Deletion Policy**: Account & Data deletion workflow available directly inside app modal under "Data & Deletion" tab.
- [x] **Target Audience & Content Rating**: Recommended ESRB Everyone / PEGI 3 (Educational Language App). Questionnaire submitted.
- [x] **In-App Subscriptions (Play Billing)**: Integrated Pro Membership tier ($9.99/mo) with full cancelation disclaimers.
- [x] **Privacy Policy & Terms**: Hosted in-app and at public URL endpoint.
- [x] **Android Manifest Permissions**: Restricted strictly to \`android.permission.INTERNET\`, \`android.permission.RECORD_AUDIO\`, and \`android.permission.MODIFY_AUDIO_SETTINGS\`.

## 2. Signed Android App Bundle (.aab) Build Guide
1. **Keystore Generation**:
   \`\`\`bash
   keytool -genkey -v -keystore release-key.jks -alias fluentai-key -keyalg RSA -keysize 2048 -validity 10000
   \`\`\`
2. **Capacitor / TWA Production Android Config**:
   \`\`\`bash
   # Add Android platform
   npx cap add android
   # Copy built web assets to android project
   npm run build
   npx cap copy android
   npx cap open android
   \`\`\`
3. **Gradle Release Build (\`android/app/build.gradle\`)**:
   \`\`\`groovy
   android {
       compileSdkVersion 34
       defaultConfig {
           applicationId "com.fluentai.speaking.coach"
           minSdkVersion 24
           targetSdkVersion 34
           versionCode 100
           versionName "1.0.0"
       }
       signingConfigs {
           release {
               storeFile file("release-key.jks")
               storePassword System.getenv("KEYSTORE_PASSWORD")
               keyAlias "fluentai-key"
               keyPassword System.getenv("KEY_PASSWORD")
           }
       }
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
               signingConfig signingConfigs.release
           }
       }
   }
   \`\`\`
4. **Generate Bundle**:
   \`\`\`bash
   cd android && ./gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   \`\`\`

## 3. Web & Cloud Run Server Deployment
1. Set secret \`GEMINI_API_KEY\` in Cloud Run environment configuration.
2. Build command: \`npm run build\`
3. Production start command: \`node dist/server.cjs\` on port \`3000\`.
4. Automated GitHub Actions CI/CD pipeline triggers linting, testing, Docker container build, and Cloud Run deployment on git push to \`main\`.
`
};
