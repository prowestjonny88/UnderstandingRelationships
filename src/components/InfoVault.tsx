import { useState } from 'react';
import { ArrowLeft, Lock, Share2, Star, Home, RotateCcw, Check, X, Volume2, Shield, AlertTriangle, PlayCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { playSound } from '../utils/sounds';

interface InfoVaultProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';
type Language = 'en' | 'ms' | 'zh';

interface InfoItem {
  id: number;
  title: Record<Language, string>;
  emoji: string;
  shouldShare: boolean;
  shareWith: Record<Language, string>;
  explanation: Record<Language, string>;
  category: 'personal' | 'feelings' | 'location' | 'online' | 'body';
}

const infoPool: InfoItem[] = [
  // SAFE TO SHARE
  {
    id: 1,
    title: { en: 'Your First Name', ms: 'Nama Pertama Anda', zh: '你的名字' },
    emoji: '👤',
    shouldShare: true,
    shareWith: { en: 'Teacher at school', ms: 'Guru di sekolah', zh: '学校的老师' },
    explanation: { 
      en: 'Your first name is okay to share with teachers and at school. They need to know what to call you!',
      ms: 'Nama pertama anda boleh dikongsi dengan guru dan di sekolah. Mereka perlu tahu apa nama untuk memanggil anda!',
      zh: '你的名字可以告诉老师和在学校分享。他们需要知道怎么称呼你！'
    },
    category: 'personal'
  },
  {
    id: 2,
    title: { en: 'Your Favorite Color', ms: 'Warna Kegemaran Anda', zh: '你最喜欢的颜色' },
    emoji: '🎨',
    shouldShare: true,
    shareWith: { en: 'Friends and classmates', ms: 'Kawan dan rakan sekelas', zh: '朋友和同学' },
    explanation: {
      en: 'Sharing your favorite things with friends is a great way to get to know each other!',
      ms: 'Berkongsi perkara kegemaran dengan kawan adalah cara yang bagus untuk mengenali antara satu sama lain!',
      zh: '和朋友分享你喜欢的东西是互相了解的好方法！'
    },
    category: 'personal'
  },
  {
    id: 3,
    title: { en: 'How You Feel (Sad/Happy)', ms: 'Perasaan Anda (Sedih/Gembira)', zh: '你的感受（开心/难过）' },
    emoji: '😊',
    shouldShare: true,
    shareWith: { en: 'Mom, Dad, or trusted adults', ms: 'Ibu, Ayah, atau orang dewasa yang dipercayai', zh: '妈妈、爸爸或值得信赖的成年人' },
    explanation: {
      en: "It's healthy and important to share your feelings with family and trusted adults!",
      ms: 'Adalah sihat dan penting untuk berkongsi perasaan anda dengan keluarga dan orang dewasa yang dipercayai!',
      zh: '和家人及值得信赖的成年人分享你的感受是健康和重要的！'
    },
    category: 'feelings'
  },
  {
    id: 4,
    title: { en: 'That You Are Hurt', ms: 'Bahawa Anda Terluka', zh: '你受伤了' },
    emoji: '🤕',
    shouldShare: true,
    shareWith: { en: 'Parents, teachers, or school nurse', ms: 'Ibu bapa, guru, atau jururawat sekolah', zh: '父母、老师或校医' },
    explanation: {
      en: 'Always tell a trusted adult if you\'re hurt! They can help you feel better.',
      ms: 'Sentiasa beritahu orang dewasa yang dipercayai jika anda terluka! Mereka boleh membantu anda berasa lebih baik.',
      zh: '如果你受伤了，一定要告诉值得信赖的成年人！他们可以帮助你好起来。'
    },
    category: 'feelings'
  },
  {
    id: 5,
    title: { en: 'What You Ate for Lunch', ms: 'Apa Yang Anda Makan untuk Makan Tengah Hari', zh: '你午餐吃了什么' },
    emoji: '🍎',
    shouldShare: true,
    shareWith: { en: 'Friends and family', ms: 'Kawan dan keluarga', zh: '朋友和家人' },
    explanation: {
      en: 'Talking about what you ate is a normal, safe conversation topic!',
      ms: 'Bercakap tentang apa yang anda makan adalah topik perbualan yang normal dan selamat!',
      zh: '谈论你吃了什么是正常、安全的话题！'
    },
    category: 'personal'
  },
  {
    id: 6,
    title: { en: 'Your Favorite Game', ms: 'Permainan Kegemaran Anda', zh: '你最喜欢的游戏' },
    emoji: '🎮',
    shouldShare: true,
    shareWith: { en: 'Friends and classmates', ms: 'Kawan dan rakan sekelas', zh: '朋友和同学' },
    explanation: {
      en: 'Sharing your interests helps you make friends with people who like the same things!',
      ms: 'Berkongsi minat anda membantu anda berkawan dengan orang yang suka perkara yang sama!',
      zh: '分享你的兴趣可以帮助你和喜欢同样东西的人交朋友！'
    },
    category: 'personal'
  },
  {
    id: 7,
    title: { en: 'Your Age', ms: 'Umur Anda', zh: '你的年龄' },
    emoji: '🎂',
    shouldShare: true,
    shareWith: { en: 'Friends and teachers', ms: 'Kawan dan guru', zh: '朋友和老师' },
    explanation: {
      en: 'Your age is okay to share with people you know like friends, teachers, and classmates.',
      ms: 'Umur anda boleh dikongsi dengan orang yang anda kenal seperti kawan, guru, dan rakan sekelas.',
      zh: '你的年龄可以告诉你认识的人，比如朋友、老师和同学。'
    },
    category: 'personal'
  },
  {
    id: 8,
    title: { en: "Your Pet's Name", ms: 'Nama Haiwan Peliharaan Anda', zh: '你宠物的名字' },
    emoji: '🐕',
    shouldShare: true,
    shareWith: { en: 'Friends and family', ms: 'Kawan dan keluarga', zh: '朋友和家人' },
    explanation: {
      en: 'Talking about your pets is a fun and safe way to share with friends!',
      ms: 'Bercakap tentang haiwan peliharaan anda adalah cara yang menyeronokkan dan selamat untuk berkongsi dengan kawan!',
      zh: '谈论你的宠物是和朋友分享的有趣又安全的方式！'
    },
    category: 'personal'
  },
  {
    id: 9,
    title: { en: 'That You Need Help', ms: 'Bahawa Anda Perlukan Bantuan', zh: '你需要帮助' },
    emoji: '🆘',
    shouldShare: true,
    shareWith: { en: 'Parents, teachers, any trusted adult', ms: 'Ibu bapa, guru, mana-mana orang dewasa yang dipercayai', zh: '父母、老师或任何值得信赖的成年人' },
    explanation: {
      en: "Always tell an adult when you need help! That's what they're there for.",
      ms: 'Sentiasa beritahu orang dewasa apabila anda perlukan bantuan! Itu sebabnya mereka ada.',
      zh: '当你需要帮助时，一定要告诉成年人！这就是他们存在的意义。'
    },
    category: 'feelings'
  },
  {
    id: 10,
    title: { en: 'Your Favorite Book', ms: 'Buku Kegemaran Anda', zh: '你最喜欢的书' },
    emoji: '📚',
    shouldShare: true,
    shareWith: { en: 'Friends, teachers, librarian', ms: 'Kawan, guru, pustakawan', zh: '朋友、老师、图书管理员' },
    explanation: {
      en: 'Sharing what you like to read is a great conversation starter!',
      ms: 'Berkongsi apa yang anda suka baca adalah pembuka perbualan yang bagus!',
      zh: '分享你喜欢读的书是开始对话的好方法！'
    },
    category: 'personal'
  },
  // KEEP SECRET
  {
    id: 11,
    title: { en: 'Your Home Address', ms: 'Alamat Rumah Anda', zh: '你的家庭地址' },
    emoji: '🏠',
    shouldShare: false,
    shareWith: { en: 'Only parents decide who knows', ms: 'Hanya ibu bapa yang memutuskan siapa yang tahu', zh: '只有父母决定谁可以知道' },
    explanation: {
      en: "Your address is private! Only share it if your parents say it's okay. Never tell strangers or people online.",
      ms: 'Alamat anda adalah peribadi! Hanya kongsi jika ibu bapa kata okay. Jangan sekali-kali beritahu orang asing atau orang dalam talian.',
      zh: '你的地址是私密的！只有父母同意才能分享。永远不要告诉陌生人或网上的人。'
    },
    category: 'location'
  },
  {
    id: 12,
    title: { en: 'Your Password', ms: 'Kata Laluan Anda', zh: '你的密码' },
    emoji: '🔐',
    shouldShare: false,
    shareWith: { en: 'Keep it secret from everyone', ms: 'Rahsiakan daripada semua orang', zh: '对所有人保密' },
    explanation: {
      en: 'Passwords should stay private, even from friends! They protect your personal information.',
      ms: 'Kata laluan perlu dirahsiakan, walaupun dari kawan! Mereka melindungi maklumat peribadi anda.',
      zh: '密码应该保密，即使是朋友也不能告诉！它们保护你的个人信息。'
    },
    category: 'online'
  },
  {
    id: 13,
    title: { en: 'Your Phone Number', ms: 'Nombor Telefon Anda', zh: '你的电话号码' },
    emoji: '📱',
    shouldShare: false,
    shareWith: { en: 'Only parents decide who knows', ms: 'Hanya ibu bapa yang memutuskan siapa yang tahu', zh: '只有父母决定谁可以知道' },
    explanation: {
      en: 'Your phone number is private information. Only share it when your parents give permission.',
      ms: 'Nombor telefon anda adalah maklumat peribadi. Hanya kongsi apabila ibu bapa memberi kebenaran.',
      zh: '你的电话号码是私人信息。只有父母允许才能分享。'
    },
    category: 'personal'
  },
  {
    id: 14,
    title: { en: 'Your School Name', ms: 'Nama Sekolah Anda', zh: '你的学校名称' },
    emoji: '🏫',
    shouldShare: false,
    shareWith: { en: 'Never to online strangers', ms: 'Jangan sesekali kepada orang asing dalam talian', zh: '永远不要告诉网上的陌生人' },
    explanation: {
      en: "Don't share your school name with people you only know online. This keeps you safe.",
      ms: 'Jangan kongsi nama sekolah anda dengan orang yang anda hanya kenal dalam talian. Ini memastikan anda selamat.',
      zh: '不要把学校名称告诉你只在网上认识的人。这样可以保护你的安全。'
    },
    category: 'location'
  },
  {
    id: 15,
    title: { en: 'Pictures of Your Body', ms: 'Gambar Badan Anda', zh: '你身体的照片' },
    emoji: '📸',
    shouldShare: false,
    shareWith: { en: 'Only parents or doctor (with parent)', ms: 'Hanya ibu bapa atau doktor (bersama ibu bapa)', zh: '只有父母或医生（父母在场时）' },
    explanation: {
      en: 'Photos of your body are private. Only share with parents or doctors when parents are there.',
      ms: 'Gambar badan anda adalah peribadi. Hanya kongsi dengan ibu bapa atau doktor apabila ibu bapa ada.',
      zh: '你身体的照片是私密的。只有父母在场时才能和父母或医生分享。'
    },
    category: 'body'
  },
  {
    id: 16,
    title: { en: 'Where You Go After School', ms: 'Ke Mana Anda Pergi Selepas Sekolah', zh: '你放学后去哪里' },
    emoji: '🚸',
    shouldShare: false,
    shareWith: { en: 'Never to strangers', ms: 'Jangan sesekali kepada orang asing', zh: '永远不要告诉陌生人' },
    explanation: {
      en: "Don't tell strangers or people online where you go after school. This is private information.",
      ms: 'Jangan beritahu orang asing atau orang dalam talian ke mana anda pergi selepas sekolah. Ini adalah maklumat peribadi.',
      zh: '不要告诉陌生人或网上的人你放学后去哪里。这是私人信息。'
    },
    category: 'location'
  },
  {
    id: 17,
    title: { en: "When You're Home Alone", ms: 'Bila Anda Bersendirian di Rumah', zh: '当你独自在家时' },
    emoji: '🔑',
    shouldShare: false,
    shareWith: { en: 'Never share this', ms: 'Jangan sekali-kali kongsi ini', zh: '永远不要分享' },
    explanation: {
      en: "Never tell anyone when you're home alone. This is important safety information to keep private.",
      ms: 'Jangan sekali-kali beritahu sesiapa bila anda bersendirian di rumah. Ini adalah maklumat keselamatan penting untuk dirahsiakan.',
      zh: '永远不要告诉任何人你独自在家。这是需要保密的重要安全信息。'
    },
    category: 'location'
  },
  {
    id: 18,
    title: { en: "Your Parent's Credit Card", ms: 'Kad Kredit Ibu Bapa Anda', zh: '父母的信用卡' },
    emoji: '💳',
    shouldShare: false,
    shareWith: { en: 'Never share or use this', ms: 'Jangan sekali-kali kongsi atau guna ini', zh: '永远不要分享或使用' },
    explanation: {
      en: 'Credit cards are private! Never share the numbers or use them without permission.',
      ms: 'Kad kredit adalah peribadi! Jangan sekali-kali kongsi nombor atau guna tanpa kebenaran.',
      zh: '信用卡是私密的！永远不要分享号码或未经允许使用。'
    },
    category: 'personal'
  },
  {
    id: 19,
    title: { en: 'Your Full Name and Birthday', ms: 'Nama Penuh dan Hari Lahir Anda', zh: '你的全名和生日' },
    emoji: '🎈',
    shouldShare: false,
    shareWith: { en: 'Not to people online', ms: 'Bukan kepada orang dalam talian', zh: '不要告诉网上的人' },
    explanation: {
      en: "Together, your full name and birthday can be used to find you. Don't share both with strangers or online.",
      ms: 'Bersama-sama, nama penuh dan hari lahir anda boleh digunakan untuk mencari anda. Jangan kongsi kedua-duanya dengan orang asing atau dalam talian.',
      zh: '你的全名和生日加在一起可以用来找到你。不要同时告诉陌生人或在网上分享。'
    },
    category: 'personal'
  },
  {
    id: 20,
    title: { en: 'Family Vacation Plans', ms: 'Rancangan Percutian Keluarga', zh: '家庭度假计划' },
    emoji: '✈️',
    shouldShare: false,
    shareWith: { en: 'Not on social media or to strangers', ms: 'Bukan di media sosial atau kepada orang asing', zh: '不要在社交媒体上或告诉陌生人' },
    explanation: {
      en: "Don't post vacation plans online or tell strangers. Wait until you're back home to share!",
      ms: 'Jangan kongsi rancangan percutian dalam talian atau beritahu orang asing. Tunggu sehingga anda pulang untuk berkongsi!',
      zh: '不要在网上发布度假计划或告诉陌生人。等回家后再分享！'
    },
    category: 'location'
  },
];

export function InfoVault({ onBack }: InfoVaultProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<InfoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [userChoice, setUserChoice] = useState<'share' | 'secret' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation();

  const startGame = () => {
    const randomLength = Math.floor(Math.random() * 4) + 5; // Random 5-8
    const shuffled = [...infoPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, randomLength);
    setSelectedItems(selected);
    setSessionLength(randomLength);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForChoice(false);
  };

  const currentItem = selectedItems[currentIndex];

  const handleDecideNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: 'share' | 'secret') => {
    if (!waitingForChoice) return;

    setUserChoice(choice);
    const correct = 
      (choice === 'share' && currentItem.shouldShare) ||
      (choice === 'secret' && !currentItem.shouldShare);
    
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
    if (currentIndex < selectedItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGameState('playing');
      setWaitingForChoice(false);
      setUserChoice(null);
    } else {
      setGameState('complete');
    }
  };



  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-4xl w-full text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-8">{t.letsLearnFirst}</h2>
            <p className="text-xl text-gray-600 mb-8">{t.learnWhatToShare}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Safe to Share */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-green-200">
              <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2 text-center">{t.safeToShare}</h3>
              <p className="text-gray-600 text-center">{t.thisIsOkayToTell}</p>
              <div className="mt-4 text-center">
                <span className="text-3xl">🎨 👋 📛</span>
              </div>
            </div>

            {/* Keep Secret */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-red-200">
              <div className="bg-red-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2 text-center">{t.keepSecret}</h3>
              <p className="text-gray-600 text-center">{t.thisShouldStayPrivate}</p>
              <div className="mt-4 text-center">
                <span className="text-3xl">🏠 🔑 📱</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => startGame()}
            className="px-12 py-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 text-2xl font-bold shadow-lg flex items-center justify-center gap-3 mx-auto"
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
    const percentage = Math.round((score / sessionLength) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-blue-700">{t.greatJobStayingSafe}</h2>
            <p className="text-3xl mb-6">{t.youSorted}</p>
            <p className="text-6xl mb-8">
              <span className="text-blue-600">{score}</span>
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
                ? t.youKnowHowToProtect
                : percentage >= 70
                ? t.greatJobLearningPrivacy
                : t.keepPracticingLearning}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
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
              {isCorrect ? t.correct : t.letsLearn}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentItem.emoji}</div>
              <p className="text-2xl mb-4">{currentItem.title[language]}</p>
              
              {!isCorrect && userChoice && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700">
                    {t.youChose}: <strong>{userChoice === 'share' ? t.safeToShare : t.keepSecret}</strong>
                  </p>
                </div>
              )}
              
              <div 
                className={`p-4 rounded-xl border-4 ${
                  currentItem.shouldShare
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  {currentItem.shouldShare ? (
                    <>
                      <Share2 className="w-8 h-8 text-green-600" />
                      <span className="text-2xl text-green-700">{t.safeToShare}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-8 h-8 text-red-600" />
                      <span className="text-2xl text-red-700">{t.keepSecret}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>{t.whoToShareWith}:</strong> {currentItem.shareWith[language]}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentItem.explanation[language]}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                {t.privacyRulesCanBeTricky}
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
              {currentIndex < selectedItems.length - 1 ? t.nextItem : t.seeResults}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
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
            {t.items} <span className="text-blue-600">{currentIndex + 1}</span> / {sessionLength}
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
            className="bg-gradient-to-r from-blue-400 to-purple-600 h-full transition-all duration-500"
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
              : 'bg-blue-50 border-2 border-blue-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForChoice ? '#16a34a' : '#2563eb' }} />
            <p style={{ color: waitingForChoice ? '#16a34a' : '#2563eb' }}>
              {waitingForChoice 
                ? t.shouldYouShare 
                : t.tapDecideNow}
            </p>
          </div>
        </div>
      </div>

      {/* Info Item Card */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">{t.thinkAboutThis}:</p>
            <div className="text-9xl mb-4">{currentItem.emoji}</div>
            <h3 className="text-blue-700 mb-2">{currentItem.title[language]}</h3>
            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full">
              <span className="text-sm text-purple-700 capitalize">{currentItem.category} {t.infoCategory}</span>
            </div>
          </div>

          <button
            onClick={handleDecideNow}
            disabled={waitingForChoice}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForChoice
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
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
          {/* Safe to Share Button */}
          <button
            onClick={() => handleChoice('share')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-green-400 hover:bg-green-50 hover:border-green-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Share2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-green-700">{t.safeToShare}</h4>
              <p className="text-sm text-gray-600">{t.thisIsOkayToTell}</p>
            </div>
          </button>

          {/* Keep Secret Button */}
          <button
            onClick={() => handleChoice('secret')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-red-400 hover:bg-red-50 hover:border-red-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-red-700">{t.keepSecret}</h4>
              <p className="text-sm text-gray-600">{t.thisShouldStayPrivate}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
