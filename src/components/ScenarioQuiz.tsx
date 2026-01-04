import { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Users, RotateCcw, Star, PlayCircle, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { playSound } from '../utils/sounds';

interface ScenarioQuizProps {
  onBack: () => void;
}

type GameState = 'intro' | 'setup' | 'choice' | 'feedback-incorrect' | 'feedback-correct' | 'complete';
type Language = 'en' | 'ms' | 'zh';

interface Choice {
  id: string;
  label: Record<Language, string>;
  icon: typeof ThumbsUp;
  safe: boolean;
}

interface Scenario {
  id: number;
  title: Record<Language, string>;
  scene: string;
  character: string;
  circleType: string;
  prompt: Record<Language, string>;
  choices: Choice[];
  incorrectFeedback: Record<Language, string>;
  correctFeedback: Record<Language, string>;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: {
      en: 'Stranger at the Park',
      ms: 'Orang Asing di Taman',
      zh: '公园里的陌生人'
    },
    scene: '🏞️',
    character: '🧑',
    circleType: 'red',
    prompt: {
      en: "Hi! I lost my puppy. Can you help me look for it in my car?",
      ms: "Hai! Saya kehilangan anak anjing saya. Boleh bantu saya cari di kereta saya?",
      zh: "嗨！我的小狗不见了。你能帮我在我的车里找找吗？"
    },
    choices: [
      { id: 'go', label: { en: 'Go with them', ms: 'Ikut mereka', zh: '跟他们走' }, icon: ThumbsUp, safe: false },
      { id: 'no', label: { en: "Say 'No'", ms: "Kata 'Tidak'", zh: "说「不」" }, icon: ThumbsDown, safe: true },
      { id: 'parent', label: { en: 'Find my parent', ms: 'Cari ibu bapa saya', zh: '找我的父母' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "We never go anywhere with someone from the Red Circle (Strangers).",
      ms: "Kita tidak pernah pergi ke mana-mana dengan orang dari Bulatan Merah (Orang Asing).",
      zh: "我们绝不和红圈（陌生人）中的人去任何地方。"
    },
    correctFeedback: {
      en: "Great job! Always find a trusted adult when a stranger asks you to go somewhere.",
      ms: "Bagus! Sentiasa cari orang dewasa yang dipercayai apabila orang asing meminta anda pergi ke suatu tempat.",
      zh: "做得好！当陌生人要你去某个地方时，一定要找一个值得信赖的成年人。"
    },
  },
  {
    id: 2,
    title: {
      en: 'Friend Wants Your Password',
      ms: 'Kawan Mahu Kata Laluan Anda',
      zh: '朋友想要你的密码'
    },
    scene: '🏫',
    character: '👦',
    circleType: 'green',
    prompt: {
      en: "Can you tell me your tablet password so I can play on it?",
      ms: "Boleh beritahu saya kata laluan tablet anda supaya saya boleh main?",
      zh: "你能告诉我你平板电脑的密码让我玩一下吗？"
    },
    choices: [
      { id: 'yes', label: { en: 'Tell them', ms: 'Beritahu mereka', zh: '告诉他们' }, icon: ThumbsUp, safe: false },
      { id: 'no', label: { en: "Say 'No'", ms: "Kata 'Tidak'", zh: "说「不」" }, icon: ThumbsDown, safe: true },
      { id: 'parent', label: { en: 'Ask a grown-up', ms: 'Tanya orang dewasa', zh: '问大人' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "Passwords are private! Even friends from the Green Circle shouldn't know them.",
      ms: "Kata laluan adalah peribadi! Walaupun kawan dari Bulatan Hijau tidak sepatutnya tahu.",
      zh: "密码是私密的！即使是绿圈的朋友也不应该知道。"
    },
    correctFeedback: {
      en: "Perfect! Passwords should stay private, even from friends.",
      ms: "Sempurna! Kata laluan perlu dirahsiakan, walaupun dari kawan.",
      zh: "完美！密码应该保密，即使是朋友也不能告诉。"
    },
  },
  {
    id: 3,
    title: {
      en: 'Someone Asks Where You Live',
      ms: 'Seseorang Tanya Di Mana Anda Tinggal',
      zh: '有人问你住在哪里'
    },
    scene: '🏬',
    character: '👨‍💼',
    circleType: 'yellow',
    prompt: {
      en: "What's your address? I want to send you a birthday card!",
      ms: "Apa alamat anda? Saya mahu hantar kad hari jadi untuk anda!",
      zh: "你的地址是什么？我想给你寄生日卡！"
    },
    choices: [
      { id: 'tell', label: { en: 'Tell them my address', ms: 'Beritahu alamat saya', zh: '告诉他们我的地址' }, icon: ThumbsUp, safe: false },
      { id: 'no', label: { en: "Say 'No thanks'", ms: "Kata 'Tidak terima kasih'", zh: "说「不用了谢谢」" }, icon: ThumbsDown, safe: true },
      { id: 'parent', label: { en: 'Ask my parent first', ms: 'Tanya ibu bapa saya dahulu', zh: '先问我父母' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "Your address is private information. Only share it with trusted adults.",
      ms: "Alamat anda adalah maklumat peribadi. Hanya kongsi dengan orang dewasa yang dipercayai.",
      zh: "你的地址是私人信息。只能和值得信赖的成年人分享。"
    },
    correctFeedback: {
      en: "Smart! Always check with your parents before sharing your address.",
      ms: "Bijak! Sentiasa semak dengan ibu bapa sebelum berkongsi alamat anda.",
      zh: "聪明！在分享你的地址之前一定要先问问父母。"
    },
  },
  {
    id: 4,
    title: {
      en: 'Uncomfortable Touch',
      ms: 'Sentuhan Tidak Selesa',
      zh: '不舒服的触碰'
    },
    scene: '🏫',
    character: '👤',
    circleType: 'yellow',
    prompt: {
      en: "Someone keeps tickling you even though you asked them to stop.",
      ms: "Seseorang terus menggeletek anda walaupun anda minta mereka berhenti.",
      zh: "即使你让他们停下来，有人还是一直挠你痒痒。"
    },
    choices: [
      { id: 'laugh', label: { en: 'Just laugh it off', ms: 'Ketawa sahaja', zh: '只是笑一笑' }, icon: ThumbsUp, safe: false },
      { id: 'stop', label: { en: 'Say STOP firmly', ms: 'Kata BERHENTI dengan tegas', zh: '坚定地说「停止」' }, icon: ThumbsDown, safe: true },
      { id: 'adult', label: { en: 'Tell a teacher', ms: 'Beritahu cikgu', zh: '告诉老师' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "You have the right to say stop! Your body belongs to you.",
      ms: "Anda berhak untuk berkata berhenti! Badan anda milik anda.",
      zh: "你有权说停止！你的身体属于你自己。"
    },
    correctFeedback: {
      en: "Excellent! Always speak up when something makes you uncomfortable.",
      ms: "Cemerlang! Sentiasa bersuara apabila sesuatu membuatkan anda tidak selesa.",
      zh: "太棒了！当有事情让你不舒服时，一定要说出来。"
    },
  },
  {
    id: 5,
    title: {
      en: 'Secret Gift',
      ms: 'Hadiah Rahsia',
      zh: '秘密礼物'
    },
    scene: '🎁',
    character: '🧔',
    circleType: 'yellow',
    prompt: {
      en: "Here's a present, but don't tell your parents. It's our secret!",
      ms: "Ini hadiah untuk anda, tapi jangan beritahu ibu bapa. Ini rahsia kita!",
      zh: "这是给你的礼物，但不要告诉你的父母。这是我们的秘密！"
    },
    choices: [
      { id: 'take', label: { en: 'Take it and keep the secret', ms: 'Ambil dan simpan rahsia', zh: '拿着并保守秘密' }, icon: ThumbsUp, safe: false },
      { id: 'no', label: { en: "Say 'No thank you'", ms: "Kata 'Tidak terima kasih'", zh: "说「不用了谢谢」" }, icon: ThumbsDown, safe: true },
      { id: 'parent', label: { en: 'Tell my parent', ms: 'Beritahu ibu bapa saya', zh: '告诉我的父母' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "Secrets about gifts are not okay. Safe surprises can be told to parents!",
      ms: "Rahsia tentang hadiah tidak baik. Kejutan yang selamat boleh diberitahu kepada ibu bapa!",
      zh: "关于礼物的秘密是不对的。安全的惊喜可以告诉父母！"
    },
    correctFeedback: {
      en: "Great thinking! Surprises are okay, but secrets like this are not!",
      ms: "Pemikiran yang bagus! Kejutan adalah okay, tetapi rahsia seperti ini tidak!",
      zh: "想得好！惊喜是可以的，但这样的秘密不行！"
    },
  },
  {
    id: 6,
    title: {
      en: 'Online Chat Request',
      ms: 'Permintaan Sembang Dalam Talian',
      zh: '在线聊天请求'
    },
    scene: '💻',
    character: '👾',
    circleType: 'red',
    prompt: {
      en: "Someone you don't know sends you a message asking to video chat.",
      ms: "Seseorang yang anda tidak kenal menghantar mesej mahu video call.",
      zh: "一个你不认识的人发消息想和你视频聊天。"
    },
    choices: [
      { id: 'chat', label: { en: 'Start the video chat', ms: 'Mulakan video call', zh: '开始视频聊天' }, icon: ThumbsUp, safe: false },
      { id: 'ignore', label: { en: 'Ignore and block', ms: 'Abaikan dan sekat', zh: '忽略并屏蔽' }, icon: ThumbsDown, safe: true },
      { id: 'parent', label: { en: 'Tell a parent', ms: 'Beritahu ibu bapa', zh: '告诉父母' }, icon: Users, safe: true },
    ],
    incorrectFeedback: {
      en: "Never chat with strangers online! Tell a trusted adult.",
      ms: "Jangan sesekali sembang dengan orang asing dalam talian! Beritahu orang dewasa yang dipercayai.",
      zh: "永远不要和网上的陌生人聊天！告诉一个值得信赖的成年人。"
    },
    correctFeedback: {
      en: "Smart choice! Only chat with people you know in real life with parent permission.",
      ms: "Pilihan bijak! Hanya sembang dengan orang yang anda kenal dalam kehidupan sebenar dengan izin ibu bapa.",
      zh: "聪明的选择！只有在父母允许的情况下才能和现实生活中认识的人聊天。"
    },
  },
];

export function ScenarioQuiz({ onBack }: ScenarioQuizProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [score, setScore] = useState(0);
  const { language } = useLanguage();
  const t = useTranslation();

  const startGame = () => {
    const randomLength = Math.floor(Math.random() * 4) + 5; // Random 5-8
    const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, randomLength);
    setSelectedScenarios(selected);
    setCurrentScenarioIndex(0);
    setScore(0);
    setGameState('setup');
  };

  const currentScenario = selectedScenarios[currentScenarioIndex];

  const handleChoice = (safe: boolean) => {
    if (safe) {
      setGameState('feedback-correct');
      setScore(score + 1);
      playSound('correct');
    } else {
      setGameState('feedback-incorrect');
      playSound('incorrect');
    }
  };

  const handleTryAgain = () => {
    setGameState('choice');
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < selectedScenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setGameState('setup');
    } else {
      setGameState('complete');
    }
  };



  const getCircleColor = (circleType: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 border-red-500 text-red-700',
      green: 'bg-green-100 border-green-500 text-green-700',
      blue: 'bg-blue-100 border-blue-500 text-blue-700',
      yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    };
    return colors[circleType] || '';
  };

  const getCircleName = (circleType: string) => {
    const names: Record<string, string> = {
      red: t.circleStrangers,
      green: t.circleFriends,
      blue: t.circleFamily,
      yellow: t.circleAcquaintances,
    };
    return names[circleType] || circleType;
  };

  if (gameState === 'complete') {
    const percentage = Math.round((score / selectedScenarios.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-8">🎉</div>
          <h2 className="mb-4 text-green-700">{t.greatJob}</h2>
          <p className="text-2xl mb-4">{t.youGot} {score} {t.outOf} {selectedScenarios.length}!</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                startGame();
              }}
              className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all hover:scale-105"
            >
              {t.backToModule}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-4xl w-full text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-8">{t.letsLearnFirst}</h2>
            <p className="text-xl text-gray-600 mb-8">{t.learnAboutScenarios}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Safe Choices */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-green-200">
              <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2 text-center">{t.safe}</h3>
              <p className="text-gray-600 text-center">{t.safeChoiceDesc}</p>
              <Check className="w-12 h-12 text-green-500 mx-auto mt-4" />
            </div>

            {/* Unsafe Choices */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-red-200">
              <div className="bg-red-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsDown className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2 text-center">{t.notSafe}</h3>
              <p className="text-gray-600 text-center">{t.unsafeChoiceDesc}</p>
              <X className="w-12 h-12 text-red-500 mx-auto mt-4" />
            </div>
          </div>

          <button
            onClick={() => startGame()}
            className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-2xl font-bold shadow-lg flex items-center justify-center gap-3 mx-auto"
          >
            <PlayCircle className="w-8 h-8" />
            {t.startGame}
          </button>
        </div>
      </div>
    );
  }

  // Guard against no current scenario
  if (!currentScenario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg z-10">
        <span>{t.scenario} {currentScenarioIndex + 1}/{selectedScenarios.length}</span>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-green-700">
          {t.game_safetyScenarios}
        </h2>

        {/* Setup/Scene Screen */}
        {gameState === 'setup' && (
          <div className="text-center">
            <h3 className="mb-8">{currentScenario.title[language]}</h3>
            
            <div className="bg-white rounded-3xl p-12 shadow-lg mb-8">
              <div className="text-8xl mb-8">{currentScenario.scene}</div>
              <div className="text-6xl mb-8">{currentScenario.character}</div>
              
              <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-8 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-blue-300">
                  <span className="text-sm">{t.situationLabel}:</span>
                </div>
                <p className="mt-4 text-xl">{currentScenario.prompt[language]}</p>
              </div>
            </div>

            <button
              onClick={() => setGameState('choice')}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              {t.whatWouldYouDo}
            </button>
          </div>
        )}

        {/* Choice Screen */}
        {gameState === 'choice' && (
          <div className="text-center">
            <h3 className="mb-8">{t.whatWouldYouDo}</h3>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-4xl">{currentScenario.scene}</div>
                <div className="text-4xl">{currentScenario.character}</div>
              </div>
              <p className="text-gray-600 italic">"{currentScenario.prompt[language]}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentScenario.choices.map((choice) => {
                const Icon = choice.icon;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.safe)}
                    className="bg-white border-4 border-gray-300 rounded-3xl p-8 hover:border-green-400 hover:bg-green-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                    <p className="text-xl">{choice.label[language]}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Incorrect Feedback */}
        {gameState === 'feedback-incorrect' && (
          <div className="text-center">
            <div className="bg-orange-50 border-8 border-orange-500 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="text-8xl mb-6">🤔</div>
              <h3 className="mb-6 text-orange-700">{t.letsLearnTogether}</h3>
              
              <div className={`inline-block border-4 rounded-2xl p-6 mb-6 ${getCircleColor(currentScenario.circleType)}`}>
                <div className="text-4xl mb-4">{currentScenario.character}</div>
                <p>{getCircleName(currentScenario.circleType)} {t.circleLabel}</p>
              </div>
              
              <p className="text-xl mb-8">{currentScenario.incorrectFeedback[language]}</p>
            </div>

            <button
              onClick={handleTryAgain}
              className="px-12 py-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 text-xl flex items-center gap-3 mx-auto"
            >
              <RotateCcw className="w-6 h-6" />
              {t.playAgain}
            </button>
          </div>
        )}

        {/* Correct Feedback */}
        {gameState === 'feedback-correct' && (
          <div className="text-center">
            <div className="bg-green-50 border-8 border-green-500 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Star className="w-20 h-20 text-white fill-white" />
              </div>
              <h3 className="mb-6 text-green-700">{t.greatChoice}</h3>
              
              <div className="text-6xl mb-6">✅</div>
              
              <p className="text-xl mb-8">{currentScenario.correctFeedback[language]}</p>
            </div>

            <button
              onClick={handleNextScenario}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              {currentScenarioIndex < scenarios.length - 1 ? t.nextScenario : t.seeResults}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
