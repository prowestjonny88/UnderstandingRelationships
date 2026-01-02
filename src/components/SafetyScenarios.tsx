import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Star, RotateCcw, Home, Volume2, ArrowDown, PlayCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SafetyScenariosProps {
  onBack: () => void;
}

type GameState = 'intro' | 'playing' | 'feedback' | 'complete';
type Language = 'en' | 'ms' | 'zh';

// Translation Dictionary
const translations = {
  en: {
    title: "Safe or Unsafe?",
    subtitle: "Learn to spot safe and unsafe situations!",
    learnTitle: "Let's Learn First!",
    safeConcept: "Safe",
    safeDesc: "Makes you feel happy and comfortable. Like hugging Mom or Dad.",
    unsafeConcept: "Unsafe",
    unsafeDesc: "Makes you feel scared or confused. Like a stranger asking you to go with them.",
    startGame: "Start Game!",
    safeBtn: "SAFE",
    unsafeBtn: "UNSAFE",
    question: "Is this SAFE or UNSAFE?",
    correct: "Correct!",
    wrong: "Let's Learn Together",
    next: "Next Question",
    results: "See My Results!",
    score: "You scored",
    playAgain: "Play Again",
    backMenu: "Back to Menu",
    safeLabel: "This is SAFE",
    unsafeLabel: "This is UNSAFE"
  },
  ms: {
    title: "Selamat atau Tidak?",
    subtitle: "Belajar mengenal situasi selamat!",
    learnTitle: "Jom Belajar Dulu!",
    safeConcept: "Selamat",
    safeDesc: "Rasa gembira dan selesa. Seperti memeluk Ibu atau Bapa.",
    unsafeConcept: "Tidak Selamat",
    unsafeDesc: "Rasa takut atau keliru. Seperti orang asing mengajak ikut.",
    startGame: "Mula Main!",
    safeBtn: "SELAMAT",
    unsafeBtn: "TIDAK SELAMAT",
    question: "Adakah ini SELAMAT atau TIDAK?",
    correct: "Betul!",
    wrong: "Jom Belajar Bersama",
    next: "Soalan Seterusnya",
    results: "Lihat Keputusan!",
    score: "Markah anda",
    playAgain: "Main Semula",
    backMenu: "Kembali ke Menu",
    safeLabel: "Ini SELAMAT",
    unsafeLabel: "Ini TIDAK SELAMAT"
  },
  zh: {
    title: "安全还是危险？",
    subtitle: "学习分辨安全和危险的情况！",
    learnTitle: "先来学习一下！",
    safeConcept: "安全",
    safeDesc: "让你感到开心和舒服。比如拥抱爸爸妈妈。",
    unsafeConcept: "危险",
    unsafeDesc: "让你感到害怕或困惑。比如陌生人让你跟他走。",
    startGame: "开始游戏！",
    safeBtn: "安全",
    unsafeBtn: "危险",
    question: "这是安全还是危险的？",
    correct: "答对了！",
    wrong: "我们要一起学习",
    next: "下一题",
    results: "查看结果！",
    score: "你的得分",
    playAgain: "再玩一次",
    backMenu: "返回菜单",
    safeLabel: "这是安全的",
    unsafeLabel: "这是危险的"
  }
};

interface Scenario {
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  explanation: Record<Language, string>;
  emoji: string;
  isSafe: boolean;
  category: 'stranger' | 'touch' | 'online' | 'sharing' | 'permission';
}

const scenarioPool: Scenario[] = [
  {
    id: 1,
    title: { en: 'Lost Puppy Help', ms: 'Bantuan Anak Anjing Hilang', zh: '帮忙找小狗' },
    description: { 
      en: 'A stranger asks you to help find their lost puppy in their car.',
      ms: 'Orang asing minta tolong cari anak anjing dalam kereta mereka.',
      zh: '一个陌生人让你去他的车里帮忙找小狗。'
    },
    emoji: '🐕',
    isSafe: false,
    explanation: {
      en: 'Never go anywhere with a stranger! Tell a parent.',
      ms: 'Jangan ikut orang asing! Beritahu ibu bapa.',
      zh: '绝对不要跟陌生人走！告诉父母。'
    },
    category: 'stranger'
  },
  {
    id: 2,
    title: { en: 'Stranger Offers Ride', ms: 'Orang Asing Tawar Tumpang', zh: '陌生人让你搭车' },
    description: {
      en: 'Someone you don\'t know offers to give you a ride home.',
      ms: 'Seseorang yang tidak dikenali menawar untuk menghantar anda pulang.',
      zh: '你不认识的人提议开车送你回家。'
    },
    emoji: '🚗',
    isSafe: false,
    explanation: {
      en: 'Never get in cars with strangers! Say "No" and run away.',
      ms: 'Jangan naik kereta orang asing! Katakan "Tidak" dan lari.',
      zh: '绝对不要上陌生人的车！说“不”并跑开。'
    },
    category: 'stranger'
  },
  {
    id: 11,
    title: { en: 'Grandma Wants a Hug', ms: 'Nenek Nak Peluk', zh: '奶奶想抱抱' },
    description: {
      en: 'Your grandma asks if you want a hug hello.',
      ms: 'Nenek anda bertanya jika anda mahu pelukan.',
      zh: '你的奶奶问你想要一个拥抱吗。'
    },
    emoji: '👵',
    isSafe: true,
    explanation: {
      en: 'Hugs from family members you trust are safe!',
      ms: 'Pelukan daripada ahli keluarga yang dipercayai adalah selamat!',
      zh: '和你信任的家人拥抱是安全的！'
    },
    category: 'touch'
  },
  {
    id: 12,
    title: { en: 'Doctor Check-Up', ms: 'Pemeriksaan Doktor', zh: '医生检查' },
    description: {
      en: 'The doctor checks your heartbeat while your parent is there.',
      ms: 'Doktor memeriksa degupan jantung anda semasa ibu bapa ada bersama.',
      zh: '父母在场时，医生检查你的心跳。'
    },
    emoji: '👨‍⚕️',
    isSafe: true,
    explanation: {
      en: 'Doctors are safe helpers when parents are present.',
      ms: 'Doktor adalah penolong selamat apabila ibu bapa ada bersama.',
      zh: '父母在场时，医生是安全的帮手。'
    },
    category: 'permission'
  }
];

export function SafetyScenarios({ onBack }: SafetyScenariosProps) {
  const { language } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [sessionLength] = useState<number>(5); // Fixed to 5 questions
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const t = translations[language];

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.voiceEnabled !== undefined) setVoiceEnabled(parsed.voiceEnabled);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const startSession = () => {
    // Fill pool with duplicates if not enough questions for demo (since we only defined 4 fully translated)
    let pool = [...scenarioPool];
    while(pool.length < sessionLength) {
        pool = [...pool, ...scenarioPool];
    }
    
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, sessionLength);
    setSelectedScenarios(selected);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowFeedback(false);
  };

  const currentScenario = selectedScenarios[currentIndex];

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Set voice language
    utterance.lang = language === 'ms' ? 'ms-MY' : language === 'zh' ? 'zh-CN' : 'en-US';
    setTimeout(() => window.speechSynthesis.speak(utterance), 100);
  };

  const handleAnswer = (userSaysIsSafe: boolean) => {
    const correct = userSaysIsSafe === currentScenario.isSafe;
    setLastAnswerCorrect(correct);
    if (correct) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    setShowFeedback(true);
    
    if (voiceEnabled) {
      speakText(currentScenario.explanation[language]);
    }
  };

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    if (currentIndex < selectedScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      setGameState('complete');
    }
  };

  const playSound = (type: 'correct' | 'incorrect') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'correct') {
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        oscillator.frequency.value = 200;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
      
      oscillator.start(audioContext.currentTime);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Intro / Learning Phase
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-4xl w-full text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-8">{t.learnTitle}</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Safe Concept */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-green-200">
                    <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                        <span className="text-6xl">👪</span> 
                        {/* Placeholder for video: <video src="..." className="w-full h-full object-cover" /> */}
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">{t.safeConcept}</h3>
                    <p className="text-gray-600">{t.safeDesc}</p>
                    <Check className="w-12 h-12 text-green-500 mx-auto mt-4" />
                </div>

                {/* Unsafe Concept */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-red-200">
                    <div className="bg-red-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                        <span className="text-6xl">👤</span>
                         {/* Placeholder for video: <video src="..." className="w-full h-full object-cover" /> */}
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">{t.unsafeConcept}</h3>
                    <p className="text-gray-600">{t.unsafeDesc}</p>
                    <X className="w-12 h-12 text-red-500 mx-auto mt-4" />
                </div>
            </div>

            <button
              onClick={startSession}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-2xl font-bold shadow-lg flex items-center justify-center gap-3 mx-auto"
            >
              <PlayCircle className="w-8 h-8" />
              {t.startGame}
            </button>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-green-700 font-bold text-4xl">{t.results}</h2>
            <p className="text-3xl mb-6">{t.score}</p>
            <p className="text-6xl mb-8 font-bold text-green-600">
              {score} / {sessionLength}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('intro')}
              className="px-8 py-5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              {t.backMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-4 bg-white rounded-full shadow-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <span className="text-lg font-bold">
            {currentIndex + 1} / {sessionLength}
          </span>
        </div>
        <div className="w-14" /> {/* Spacer */}
      </div>

      <div className="max-w-3xl mx-auto">
        {!showFeedback ? (
          // Question Screen
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl mb-8 border-4 border-blue-100">
              <div className="text-9xl mb-6 animate-bounce">{currentScenario.emoji}</div>
              <h3 className="mb-6 text-gray-800 text-2xl font-bold">{currentScenario.title[language]}</h3>
              <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl p-6">
                <p className="text-2xl text-gray-800">{currentScenario.description[language]}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <p className="text-2xl font-bold text-purple-700">{t.question}</p>
              
              {/* Guidance Arrows */}
              <div className="animate-bounce">
                <ArrowDown className="w-8 h-8 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                  onClick={() => handleAnswer(true)}
                  className="group bg-white border-b-8 border-green-500 rounded-3xl p-8 hover:bg-green-50 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-12 h-12 text-white" strokeWidth={4} />
                  </div>
                  <p className="text-2xl font-bold text-green-700">{t.safeBtn}</p>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className="group bg-white border-b-8 border-red-500 rounded-3xl p-8 hover:bg-red-50 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-12 h-12 text-white" strokeWidth={4} />
                  </div>
                  <p className="text-2xl font-bold text-red-700">{t.unsafeBtn}</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Feedback Screen
          <div className="text-center">
            <div className={`rounded-3xl p-12 shadow-2xl mb-8 border-8 ${lastAnswerCorrect ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
              <div className="text-9xl mb-6">{lastAnswerCorrect ? '✅' : '🤔'}</div>
              <h3 className={`mb-6 text-3xl font-bold ${lastAnswerCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                {lastAnswerCorrect ? t.correct : t.wrong}
              </h3>

              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${currentScenario.isSafe ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                <span className="font-bold text-xl">{currentScenario.isSafe ? t.safeLabel : t.unsafeLabel}</span>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6">
                <p className="text-2xl text-gray-700 leading-relaxed font-medium">
                  {currentScenario.explanation[language]}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`px-12 py-6 text-white rounded-full transition-all hover:scale-105 text-xl font-bold shadow-lg ${lastAnswerCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              {t.next} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}