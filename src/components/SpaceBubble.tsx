import { useState } from 'react';
import { ArrowLeft, Check, X, Star, Home, RotateCcw, Shield, Volume2 } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';

interface SpaceBubbleProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface Scenario {
  id: number;
  emoji: string;
  situation: Record<Language, string>;
  person: Record<Language, string>;
  distance: 'too-close' | 'okay';
  explanation: Record<Language, string>;
  visualDistance: 'inside-bubble' | 'near-bubble' | 'far-away';
}

const scenarioPool: Scenario[] = [
  // TOO CLOSE
  {
    id: 1,
    emoji: '🧑',
    situation: {
      en: 'A stranger standing inside your hula hoop',
      ms: 'Orang asing berdiri di dalam gelung hula anda',
      zh: '陌生人站在你的呼啦圈里'
    },
    person: {
      en: 'Stranger',
      ms: 'Orang Asing',
      zh: '陌生人'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Strangers should not stand this close to you. This is your personal space bubble!',
      ms: 'Orang asing tidak sepatutnya berdiri begitu dekat dengan anda. Ini adalah ruang peribadi anda!',
      zh: '陌生人不应该站得这么近。这是你的私人空间！'
    }
  },
  {
    id: 2,
    emoji: '👦',
    situation: {
      en: 'A classmate leaning on your shoulder without asking',
      ms: 'Rakan sekelas bersandar di bahu anda tanpa bertanya',
      zh: '同学没有询问就靠在你的肩膀上'
    },
    person: {
      en: 'Classmate',
      ms: 'Rakan Sekelas',
      zh: '同学'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Even friends and classmates should ask before touching you. Your body belongs to you!',
      ms: 'Walaupun kawan dan rakan sekelas perlu bertanya sebelum menyentuh anda. Badan anda milik anda!',
      zh: '即使是朋友和同学也应该在接触你之前先征求同意。你的身体属于你自己！'
    }
  },
  {
    id: 3,
    emoji: '🧔',
    situation: {
      en: 'Someone you don\'t know well standing very close to you in line',
      ms: 'Seseorang yang anda tidak kenal dengan baik berdiri sangat dekat dengan anda dalam barisan',
      zh: '你不太认识的人在排队时站得离你很近'
    },
    person: {
      en: 'Acquaintance',
      ms: 'Kenalan',
      zh: '认识的人'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'People should give you space in line. It\'s okay to ask them to step back.',
      ms: 'Orang lain perlu memberi anda ruang dalam barisan. Tidak mengapa untuk minta mereka berundur.',
      zh: '排队时别人应该给你留出空间。你可以要求他们退后。'
    }
  },
  {
    id: 4,
    emoji: '👨',
    situation: {
      en: 'A stranger reaching to touch your hair',
      ms: 'Orang asing cuba menyentuh rambut anda',
      zh: '陌生人伸手要摸你的头发'
    },
    person: {
      en: 'Stranger',
      ms: 'Orang Asing',
      zh: '陌生人'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Your hair and body are private. Strangers should not touch you without permission.',
      ms: 'Rambut dan badan anda adalah peribadi. Orang asing tidak boleh menyentuh anda tanpa izin.',
      zh: '你的头发和身体是私人的。陌生人不应该未经允许就触摸你。'
    }
  },
  {
    id: 5,
    emoji: '👧',
    situation: {
      en: 'Someone looking over your shoulder at your paper without asking',
      ms: 'Seseorang melihat kertas anda dari belakang tanpa bertanya',
      zh: '有人没有询问就在你背后看你的试卷'
    },
    person: {
      en: 'Classmate',
      ms: 'Rakan Sekelas',
      zh: '同学'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Your work is yours. People should respect your space and ask before looking.',
      ms: 'Kerja anda adalah milik anda. Orang lain perlu menghormati ruang anda dan bertanya sebelum melihat.',
      zh: '你的作业是你的。别人应该尊重你的空间，看之前要先问。'
    }
  },
  {
    id: 6,
    emoji: '🧑‍🦱',
    situation: {
      en: 'A new kid sitting in your lap',
      ms: 'Kanak-kanak baru duduk di pangkuan anda',
      zh: '新来的小孩坐在你的腿上'
    },
    person: {
      en: 'New acquaintance',
      ms: 'Kenalan Baru',
      zh: '新认识的人'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Your lap is your personal space! People need your permission to be this close.',
      ms: 'Pangkuan anda adalah ruang peribadi anda! Orang lain perlukan izin anda untuk begitu dekat.',
      zh: '你的腿是你的私人空间！别人需要你的许可才能这么近。'
    }
  },
  {
    id: 7,
    emoji: '👨‍💼',
    situation: {
      en: 'A stranger at the store standing right next to you',
      ms: 'Orang asing di kedai berdiri betul-betul di sebelah anda',
      zh: '商店里的陌生人紧挨着你站'
    },
    person: {
      en: 'Stranger',
      ms: 'Orang Asing',
      zh: '陌生人'
    },
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Strangers should keep their distance. It\'s okay to move away if someone is too close.',
      ms: 'Orang asing perlu menjaga jarak. Tidak mengapa untuk bergerak jika seseorang terlalu dekat.',
      zh: '陌生人应该保持距离。如果有人太近，你可以走开。'
    }
  },

  // OKAY
  {
    id: 8,
    emoji: '👫',
    situation: {
      en: 'Your friend sitting next to you on a bench',
      ms: 'Kawan anda duduk di sebelah anda di bangku',
      zh: '你的朋友坐在你旁边的长椅上'
    },
    person: {
      en: 'Friend',
      ms: 'Kawan',
      zh: '朋友'
    },
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: {
      en: 'Friends can sit near you! This is a comfortable distance for people you know and trust.',
      ms: 'Kawan boleh duduk dekat anda! Ini adalah jarak yang selesa untuk orang yang anda kenal dan percaya.',
      zh: '朋友可以坐在你旁边！对于你认识和信任的人来说，这是一个舒适的距离。'
    }
  },
  {
    id: 9,
    emoji: '👩‍🏫',
    situation: {
      en: 'Your teacher standing at the whiteboard',
      ms: 'Guru anda berdiri di papan putih',
      zh: '你的老师站在白板前'
    },
    person: {
      en: 'Teacher',
      ms: 'Guru',
      zh: '老师'
    },
    distance: 'okay',
    visualDistance: 'far-away',
    explanation: {
      en: 'Perfect! Teachers often stand at a comfortable distance when teaching the class.',
      ms: 'Sempurna! Guru sering berdiri pada jarak yang selesa semasa mengajar kelas.',
      zh: '完美！老师在教课时通常站在一个舒适的距离。'
    }
  },
  {
    id: 10,
    emoji: '👩',
    situation: {
      en: 'Mom giving you a hug',
      ms: 'Ibu memberi anda pelukan',
      zh: '妈妈给你一个拥抱'
    },
    person: {
      en: 'Mom',
      ms: 'Ibu',
      zh: '妈妈'
    },
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Hugs from family you trust and love are okay! They are in your closest circle.',
      ms: 'Pelukan daripada keluarga yang anda percaya dan sayangi adalah baik! Mereka dalam lingkaran terdekat anda.',
      zh: '来自你信任和爱的家人的拥抱是可以的！他们在你最亲密的圈子里。'
    }
  },
  {
    id: 11,
    emoji: '👨‍⚕️',
    situation: {
      en: 'The doctor checking your heartbeat (with your parent there)',
      ms: 'Doktor memeriksa degupan jantung anda (dengan ibu bapa anda di situ)',
      zh: '医生在检查你的心跳（你的父母在场）'
    },
    person: {
      en: 'Doctor',
      ms: 'Doktor',
      zh: '医生'
    },
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Doctors need to be close to help you, but a parent should always be there too!',
      ms: 'Doktor perlu dekat untuk membantu anda, tetapi ibu bapa perlu sentiasa ada bersama!',
      zh: '医生需要靠近来帮助你，但父母应该始终在场！'
    }
  },
  {
    id: 12,
    emoji: '👦',
    situation: {
      en: 'Your teammate giving you a high-five after a game',
      ms: 'Rakan sepasukan memberi high-five selepas permainan',
      zh: '你的队友在比赛后和你击掌'
    },
    person: {
      en: 'Teammate',
      ms: 'Rakan Sepasukan',
      zh: '队友'
    },
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: {
      en: 'High-fives are great! Quick, friendly touches during games are usually okay.',
      ms: 'High-five adalah baik! Sentuhan cepat dan mesra semasa permainan biasanya tidak mengapa.',
      zh: '击掌很棒！比赛中快速友好的触碰通常是可以的。'
    }
  },
  {
    id: 13,
    emoji: '👨',
    situation: {
      en: 'Dad holding your hand in the parking lot',
      ms: 'Ayah memegang tangan anda di tempat letak kereta',
      zh: '爸爸在停车场牵着你的手'
    },
    person: {
      en: 'Dad',
      ms: 'Ayah',
      zh: '爸爸'
    },
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Family members you trust can hold your hand to keep you safe!',
      ms: 'Ahli keluarga yang anda percaya boleh memegang tangan anda untuk menjaga keselamatan anda!',
      zh: '你信任的家人可以牵着你的手来保护你的安全！'
    }
  },
  {
    id: 14,
    emoji: '📬',
    situation: {
      en: 'Waving to the mailman from the porch',
      ms: 'Melambai kepada posmen dari beranda',
      zh: '从门廊向邮递员挥手'
    },
    person: {
      en: 'Mailman',
      ms: 'Posmen',
      zh: '邮递员'
    },
    distance: 'okay',
    visualDistance: 'far-away',
    explanation: {
      en: 'Perfect! Friendly waves from a distance are great. You\'re staying safe in your own space.',
      ms: 'Sempurna! Lambaian mesra dari jarak jauh adalah baik. Anda kekal selamat di ruang anda sendiri.',
      zh: '完美！从远处友好地挥手很好。你在自己的空间里保持安全。'
    }
  },
  {
    id: 15,
    emoji: '👧',
    situation: {
      en: 'A classmate sitting at their own desk next to yours',
      ms: 'Rakan sekelas duduk di meja mereka sendiri di sebelah anda',
      zh: '同学坐在你旁边他们自己的桌子上'
    },
    person: {
      en: 'Classmate',
      ms: 'Rakan Sekelas',
      zh: '同学'
    },
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: {
      en: 'Good! Each person has their own space. This is a comfortable classroom distance.',
      ms: 'Bagus! Setiap orang mempunyai ruang mereka sendiri. Ini adalah jarak yang selesa dalam kelas.',
      zh: '好！每个人都有自己的空间。这是教室里舒适的距离。'
    }
  },
  {
    id: 16,
    emoji: '👵',
    situation: {
      en: 'Grandma asking "Can I have a hug?"',
      ms: 'Nenek bertanya "Boleh saya peluk?"',
      zh: '奶奶问"我可以抱抱你吗？"'
    },
    person: {
      en: 'Grandma',
      ms: 'Nenek',
      zh: '奶奶'
    },
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: {
      en: 'Great! She asked first! You can say yes or no. Both answers are okay.',
      ms: 'Bagus! Dia bertanya dulu! Anda boleh kata ya atau tidak. Kedua-dua jawapan adalah baik.',
      zh: '太好了！她先问了！你可以说是或不。两个答案都可以。'
    }
  },
  {
    id: 17,
    emoji: '⚽',
    situation: {
      en: 'Playing tag on the playground, someone gently tags your arm',
      ms: 'Bermain kejar-kejar di taman permainan, seseorang sentuh lengan anda dengan lembut',
      zh: '在操场上玩捉人游戏，有人轻轻碰了你的手臂'
    },
    person: {
      en: 'Friend',
      ms: 'Kawan',
      zh: '朋友'
    },
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'This is part of the game! Quick, gentle touches during games you agreed to play are okay.',
      ms: 'Ini adalah sebahagian daripada permainan! Sentuhan cepat dan lembut semasa permainan yang anda setuju untuk bermain adalah tidak mengapa.',
      zh: '这是游戏的一部分！在你同意参与的游戏中，快速轻柔的触碰是可以的。'
    }
  },
  {
    id: 18,
    emoji: '👨‍🏫',
    situation: {
      en: 'The school nurse checking your temperature',
      ms: 'Jururawat sekolah memeriksa suhu anda',
      zh: '校医在量你的体温'
    },
    person: {
      en: 'Nurse',
      ms: 'Jururawat',
      zh: '护士'
    },
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: {
      en: 'Healthcare helpers at school can check on you when you\'re not feeling well. That\'s their job!',
      ms: 'Pembantu kesihatan di sekolah boleh memeriksa anda apabila anda tidak sihat. Itu tugas mereka!',
      zh: '学校的医护人员可以在你不舒服时检查你。那是他们的工作！'
    }
  },
];

export function SpaceBubble({ onBack }: SpaceBubbleProps) {
  const { language } = useLanguage();
  const t = useTranslation();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [userChoice, setUserChoice] = useState<'too-close' | 'okay' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const startGame = (length: number) => {
    const shuffled = [...scenarioPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedScenarios(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForChoice(false);
  };

  const currentScenario = selectedScenarios[currentIndex];

  const handleDecideNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: 'too-close' | 'okay') => {
    if (!waitingForChoice) return;

    setUserChoice(choice);
    const correct = choice === currentScenario.distance;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    
    setGameState('feedback');
  };

  const handleContinue = () => {
    if (currentIndex < selectedScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGameState('playing');
      setWaitingForChoice(false);
      setUserChoice(null);
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

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🫧</div>
            <h2 className="mb-4 text-orange-700">{t.spaceBubble}</h2>
            <p className="text-xl text-gray-700 mb-2">{t.learnAboutPersonalSpace}</p>
            <p className="text-gray-600">{t.chooseScenariosToSort}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-center mb-6">{t.chooseGameLength}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[5, 10, 15].map((length) => (
                <button
                  key={length}
                  onClick={() => setSessionLength(length)}
                  className={`p-6 rounded-2xl border-4 transition-all hover:scale-105 ${
                    sessionLength === length
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">{t.scenarios}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(sessionLength)}
              className="w-full py-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all hover:scale-105 text-xl"
            >
              {t.startGame}
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="mb-3 text-blue-800">{t.understandingPersonalSpace}:</h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-1 text-orange-600" />
                <span><strong>{t.yourSpaceBubble}:</strong> {t.imagineABubble}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 text-green-600" />
                <span><strong>{t.justRight}:</strong> {t.familyAndFriendsCanBeClose}</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 mt-1 text-red-600" />
                <span><strong>{t.tooClose}:</strong> {t.strangersAndPeopleWithout}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (gameState === 'complete') {
    const percentage = Math.round((score / sessionLength) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-orange-700">{t.youProtectedYourBubble}</h2>
            <p className="text-3xl mb-6">{t.youGot}</p>
            <p className="text-6xl mb-8">
              <span className="text-orange-600">{score}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{sessionLength}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-16 h-16 transition-all ${
                    star <= stars
                      ? 'text-yellow-400 fill-yellow-400 animate-pulse'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-xl text-gray-600">
              {percentage >= 90
                ? t.youKnowAboutPersonalSpace
                : percentage >= 70
                ? t.greatJobLearningBoundaries
                : t.keepPracticingGettingBetter}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              {t.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (gameState === 'feedback') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div 
            className={`rounded-3xl p-12 shadow-2xl border-8 text-center ${
              isCorrect 
                ? 'bg-green-50 border-green-500' 
                : 'bg-orange-50 border-orange-500'
            }`}
          >
            <div className="text-9xl mb-6">
              {isCorrect ? '✅' : '🤔'}
            </div>
            
            <h3 className={`mb-6 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? t.correct : t.letsLearnTogether}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentScenario.emoji}</div>
              <p className="text-2xl mb-4">{currentScenario.situation[language]}</p>
              
              {!isCorrect && userChoice && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700">
                    {t.youChose}: <strong>{userChoice === 'too-close' ? t.tooClose : t.justRight}</strong>
                  </p>
                </div>
              )}
              
              <div 
                className={`p-4 rounded-xl border-4 ${
                  currentScenario.distance === 'too-close'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  {currentScenario.distance === 'too-close' ? (
                    <>
                      <X className="w-8 h-8 text-red-600" />
                      <span className="text-2xl text-red-700">{t.tooClose}!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-8 h-8 text-green-600" />
                      <span className="text-2xl text-green-700">{t.justRight}!</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentScenario.explanation[language]}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                {t.personalSpaceCanBeTricky}
              </p>
            )}

            <button
              onClick={handleContinue}
              className={`px-12 py-6 text-white rounded-full text-xl transition-all hover:scale-105 ${
                isCorrect 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {currentIndex < selectedScenarios.length - 1 ? t.nextScenario : t.seeResults}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <span className="text-lg">
            {t.scenario} <span className="text-orange-600">{currentIndex + 1}</span> / {sessionLength}
          </span>
        </div>

        <button
          onClick={onBack}
          className="p-4 bg-red-50 border-2 border-red-300 rounded-full hover:bg-red-100 transition-all hover:scale-105"
        >
          <Home className="w-6 h-6 text-red-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-orange-400 to-pink-600 h-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="max-w-2xl mx-auto mb-6">
        <div 
          className={`rounded-2xl p-4 text-center transition-all ${
            waitingForChoice 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-orange-50 border-2 border-orange-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }} />
            <p style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }}>
              {waitingForChoice 
                ? t.isThisPersonTooClose 
                : t.thinkAboutScenario}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">{t.imagineThisScenario}:</p>
            <div className="text-9xl mb-4">{currentScenario.emoji}</div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
              <p className="text-lg">{currentScenario.situation[language]}</p>
            </div>
            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full">
              <span className="text-sm text-purple-700">{currentScenario.person[language]}</span>
            </div>
          </div>

          <button
            onClick={handleDecideNow}
            disabled={waitingForChoice}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForChoice
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
            }`}
          >
            {waitingForChoice ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                {t.nowMakeYourChoice}
              </span>
            ) : (
              t.decideNow
            )}
          </button>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Too Close Button */}
          <button
            onClick={() => handleChoice('too-close')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-red-400 hover:bg-red-50 hover:border-red-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <X className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-red-700">{t.tooClose}!</h4>
              <p className="text-sm text-gray-600">{t.thisPersonIsInvading}</p>
            </div>
          </button>

          {/* Just Right Button */}
          <button
            onClick={() => handleChoice('okay')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-green-400 hover:bg-green-50 hover:border-green-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-green-700">{t.justRight}!</h4>
              <p className="text-sm text-gray-600">{t.thisDistanceIsComfortable}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
