import { useState } from 'react';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { getCharacterImage } from '../utils/imageUtils';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';

interface SafeContactGameProps {
  onBack: () => void;
}

type Language = 'en' | 'ms' | 'zh';

interface Scenario {
  id: number;
  situation: Record<Language, string>;
  person: Record<Language, string>;
  personEmoji: string;
  circleColor: string;
  action: Record<Language, string>;
  isSafe: boolean;
  explanation: Record<Language, string>;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: {
      en: 'Your mom gives you a hug',
      ms: 'Ibu anda memberi anda pelukan',
      zh: '妈妈给你一个拥抱'
    },
    person: { en: 'Mom', ms: 'Ibu', zh: '妈妈' },
    personEmoji: '👩',
    circleColor: 'blue',
    action: { en: 'Hug', ms: 'Pelukan', zh: '拥抱' },
    isSafe: true,
    explanation: {
      en: 'Family hugs are safe and loving!',
      ms: 'Pelukan keluarga adalah selamat dan penuh kasih!',
      zh: '家人的拥抱是安全和有爱的！'
    }
  },
  {
    id: 2,
    situation: {
      en: 'A stranger at the park tries to hold your hand',
      ms: 'Orang asing di taman cuba memegang tangan anda',
      zh: '公园里的陌生人试图牵你的手'
    },
    person: { en: 'Stranger', ms: 'Orang Asing', zh: '陌生人' },
    personEmoji: '🧑',
    circleColor: 'red',
    action: { en: 'Hold hands', ms: 'Pegang tangan', zh: '牵手' },
    isSafe: false,
    explanation: {
      en: 'Never hold hands with strangers. Say no and find a trusted adult.',
      ms: 'Jangan sekali-kali pegang tangan orang asing. Katakan tidak dan cari orang dewasa yang dipercayai.',
      zh: '绝对不要和陌生人牵手。说不，并找一个信任的成年人。'
    }
  },
  {
    id: 3,
    situation: {
      en: 'Your doctor checks your heartbeat',
      ms: 'Doktor anda memeriksa degupan jantung anda',
      zh: '医生检查你的心跳'
    },
    person: { en: 'Doctor', ms: 'Doktor', zh: '医生' },
    personEmoji: '👨‍⚕️',
    circleColor: 'orange',
    action: { en: 'Medical check', ms: 'Pemeriksaan perubatan', zh: '医疗检查' },
    isSafe: true,
    explanation: {
      en: 'Doctors can check you, but a parent should be there too.',
      ms: 'Doktor boleh memeriksa anda, tetapi ibu bapa perlu ada bersama.',
      zh: '医生可以检查你，但家长也应该在场。'
    }
  },
  {
    id: 4,
    situation: {
      en: 'Someone you just met asks to tickle you',
      ms: 'Seseorang yang baru anda kenal mahu menggeletek anda',
      zh: '刚认识的人想要挠你痒痒'
    },
    person: { en: 'New Person', ms: 'Orang Baru', zh: '新认识的人' },
    personEmoji: '🧔',
    circleColor: 'red',
    action: { en: 'Tickle', ms: 'Geli-geli', zh: '挠痒痒' },
    isSafe: false,
    explanation: {
      en: 'Only family and very close friends you trust can tickle you, and only if you say yes!',
      ms: 'Hanya keluarga dan kawan rapat yang dipercayai boleh menggeletek anda, dan hanya jika anda berkata ya!',
      zh: '只有你信任的家人和非常亲密的朋友才能挠你痒痒，而且只有你同意才行！'
    }
  },
  {
    id: 5,
    situation: {
      en: 'Your teacher gives you a high-five',
      ms: 'Guru anda memberi anda high-five',
      zh: '老师和你击掌'
    },
    person: { en: 'Teacher', ms: 'Guru', zh: '老师' },
    personEmoji: '👨‍🏫',
    circleColor: 'orange',
    action: { en: 'High-five', ms: 'High-five', zh: '击掌' },
    isSafe: true,
    explanation: {
      en: 'High-fives are a safe way to celebrate!',
      ms: 'High-five adalah cara selamat untuk meraikan!',
      zh: '击掌是一种安全的庆祝方式！'
    }
  },
  {
    id: 6,
    situation: {
      en: 'Your best friend wants to play tag',
      ms: 'Kawan baik anda mahu bermain kejar-kejar',
      zh: '你最好的朋友想玩追逐游戏'
    },
    person: { en: 'Best Friend', ms: 'Kawan Baik', zh: '好朋友' },
    personEmoji: '👦',
    circleColor: 'green',
    action: { en: 'Tag game', ms: 'Permainan kejar-kejar', zh: '追逐游戏' },
    isSafe: true,
    explanation: {
      en: 'Playing games like tag with friends is fun and safe!',
      ms: 'Bermain permainan seperti kejar-kejar dengan kawan adalah seronok dan selamat!',
      zh: '和朋友玩追逐游戏既有趣又安全！'
    }
  },
  {
    id: 7,
    situation: {
      en: "Someone you don't know well asks to take a photo of you alone",
      ms: 'Seseorang yang anda tidak kenal dengan baik mahu mengambil gambar anda bersendirian',
      zh: '不太熟悉的人想单独给你拍照'
    },
    person: { en: 'Acquaintance', ms: 'Kenalan', zh: '认识的人' },
    personEmoji: '👨‍💼',
    circleColor: 'yellow',
    action: { en: 'Take photo alone', ms: 'Ambil gambar bersendirian', zh: '单独拍照' },
    isSafe: false,
    explanation: {
      en: "Photos should only be taken by trusted adults or with your parent's permission.",
      ms: 'Gambar hanya boleh diambil oleh orang dewasa yang dipercayai atau dengan izin ibu bapa anda.',
      zh: '只有值得信赖的成年人或经过家长允许才能拍照。'
    }
  },
  {
    id: 8,
    situation: {
      en: 'Grandpa asks for a hug goodbye',
      ms: 'Datuk minta pelukan perpisahan',
      zh: '爷爷想要一个道别的拥抱'
    },
    person: { en: 'Grandpa', ms: 'Datuk', zh: '爷爷' },
    personEmoji: '👴',
    circleColor: 'blue',
    action: { en: 'Goodbye hug', ms: 'Pelukan perpisahan', zh: '道别拥抱' },
    isSafe: true,
    explanation: {
      en: 'Hugging family is safe, but you can always say if you prefer a wave or high-five!',
      ms: 'Pelukan keluarga adalah selamat, tetapi anda boleh sentiasa katakan jika anda lebih suka lambai atau high-five!',
      zh: '拥抱家人是安全的，但如果你想挥手或击掌也可以说！'
    }
  },
  {
    id: 9,
    situation: {
      en: 'A stranger offers you candy and asks you to get in their car',
      ms: 'Orang asing menawarkan gula-gula dan minta anda masuk ke kereta mereka',
      zh: '陌生人给你糖果并让你上他们的车'
    },
    person: { en: 'Stranger', ms: 'Orang Asing', zh: '陌生人' },
    personEmoji: '🚗',
    circleColor: 'red',
    action: { en: 'Get in car', ms: 'Masuk kereta', zh: '上车' },
    isSafe: false,
    explanation: {
      en: 'Never go anywhere with strangers! Find a trusted adult immediately.',
      ms: 'Jangan sesekali pergi ke mana-mana dengan orang asing! Cari orang dewasa yang dipercayai dengan segera.',
      zh: '永远不要和陌生人去任何地方！立即找一个值得信赖的成年人。'
    }
  },
  {
    id: 10,
    situation: {
      en: 'Your coach helps you stretch before practice',
      ms: 'Jurulatih anda membantu anda meregangkan badan sebelum latihan',
      zh: '教练在练习前帮助你做拉伸'
    },
    person: { en: 'Coach', ms: 'Jurulatih', zh: '教练' },
    personEmoji: '⚽',
    circleColor: 'orange',
    action: { en: 'Stretching help', ms: 'Bantuan regangan', zh: '拉伸帮助' },
    isSafe: true,
    explanation: {
      en: 'Coaches can help with sports activities in safe, public places.',
      ms: 'Jurulatih boleh membantu dengan aktiviti sukan di tempat awam yang selamat.',
      zh: '教练可以在安全的公共场所帮助进行体育活动。'
    }
  }
];

export function SafeContactGame({ onBack }: SafeContactGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation();

  const currentScenario = scenarios[currentIndex];

  const handleChoice = (userSaysIsSafe: boolean) => {
    if (feedback) return;

    const isCorrect = userSaysIsSafe === currentScenario.isSafe;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      playSound(523.25, 0.2);
    } else {
      setFeedback('incorrect');
      playSound(200, 0.3);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 3000);
  };

  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const getCircleInfo = (color: string) => {
    const circles: Record<string, { name: string, bg: string, border: string }> = {
      blue: { name: t.circleFamily, bg: 'bg-blue-100', border: 'border-blue-500' },
      green: { name: t.circleFriends, bg: 'bg-green-100', border: 'border-green-500' },
      yellow: { name: t.circleAcquaintances, bg: 'bg-yellow-100', border: 'border-yellow-500' },
      orange: { name: t.circleHelpers, bg: 'bg-orange-100', border: 'border-orange-500' },
      red: { name: t.circleStrangers, bg: 'bg-red-100', border: 'border-red-500' }
    };
    return circles[color];
  };

  if (gameComplete) {
    const percentage = Math.round((score / scenarios.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="mb-4 text-purple-700">{t.greatJob}</h2>
          <p className="text-2xl mb-4">{t.youGot} {score} {t.outOf} {scenarios.length}</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="bg-purple-50 border-4 border-purple-300 rounded-3xl p-8 mb-8">
            <h3 className="mb-4 text-purple-700">{t.remember}</h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>{t.safetyReminder1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>{t.safetyReminder2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>{t.safetyReminder3}</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setGameComplete(false);
              }}
              className="px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105"
            >
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

  const circleInfo = getCircleInfo(currentScenario.circleColor);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg z-10">
        <span>{t.question} {currentIndex + 1}/{scenarios.length}</span>
      </div>

      <div className="max-w-3xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-purple-700">{t.safeTouchGame}</h2>

        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {(() => {
                const imageSrc = getCharacterImage(currentScenario.person.en, currentScenario.personEmoji);
                if (imageSrc && (currentScenario.person.en === 'Mom' || currentScenario.person.en === 'Dad')) {
                  return (
                    <img
                      src={imageSrc}
                      alt={currentScenario.person[language]}
                      className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const emojiDiv = document.createElement('div');
                          emojiDiv.className = 'text-7xl';
                          emojiDiv.textContent = currentScenario.personEmoji;
                          target.parentElement.appendChild(emojiDiv);
                        }
                      }}
                    />
                  );
                } else {
                  return <div className="text-7xl">{currentScenario.personEmoji}</div>;
                }
              })()}
            </div>
            <div className={`inline-block ${circleInfo.bg} ${circleInfo.border} border-3 rounded-2xl px-6 py-3 mb-4`}>
              <p className="text-sm opacity-70">{circleInfo.name} {t.circleLabel}</p>
              <p>{currentScenario.person[language]}</p>
            </div>
          </div>

          <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-6">
            <p className="text-xl text-center">{currentScenario.situation[language]}</p>
          </div>

          <h3 className="text-center mb-6">{t.isThisSafe}</h3>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleChoice(true)}
              disabled={feedback !== null}
              className={`bg-green-100 border-4 border-green-400 text-green-700 rounded-3xl p-8 transition-all
                ${!feedback ? 'hover:bg-green-200 hover:scale-105 active:scale-95' : 'opacity-60'}
                ${feedback === 'correct' && currentScenario.isSafe ? 'ring-8 ring-green-500 scale-110' : ''}
              `}
            >
              <Check className="w-16 h-16 mx-auto mb-3" strokeWidth={3} />
              <p className="text-xl">{t.safe}</p>
            </button>

            <button
              onClick={() => handleChoice(false)}
              disabled={feedback !== null}
              className={`bg-red-100 border-4 border-red-400 text-red-700 rounded-3xl p-8 transition-all
                ${!feedback ? 'hover:bg-red-200 hover:scale-105 active:scale-95' : 'opacity-60'}
                ${feedback === 'correct' && !currentScenario.isSafe ? 'ring-8 ring-green-500 scale-110' : ''}
              `}
            >
              <X className="w-16 h-16 mx-auto mb-3" strokeWidth={3} />
              <p className="text-xl">{t.notSafe}</p>
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-green-700 mb-4">{t.correct}</h3>
            <p className="text-xl">{currentScenario.explanation[language]}</p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="bg-orange-50 border-4 border-orange-500 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-orange-700 mb-4">{t.letsLearnTogether}</h3>
            <p className="text-xl mb-2">
              {currentScenario.isSafe ? t.safe : t.notSafe}
            </p>
            <p className="text-lg">{currentScenario.explanation[language]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
