import { useState } from 'react';
import { ArrowLeft, Lock, Users, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';

interface PrivatePublicSortingProps {
  onBack: () => void;
}

interface Item {
  id: number;
  text: Record<'en' | 'ms' | 'zh', string>;
  emoji: string;
  isPrivate: boolean;
  category: 'body' | 'info' | 'activity' | 'place';
}

const items: Item[] = [
  // Private
  { id: 1, text: { en: 'Going to the bathroom', ms: 'Pergi ke tandas', zh: '上厕所' }, emoji: '🚽', isPrivate: true, category: 'activity' },
  { id: 2, text: { en: 'Your body under clothes', ms: 'Bahagian badan di bawah pakaian', zh: '衣服下的身体部位' }, emoji: '👕', isPrivate: true, category: 'body' },
  { id: 3, text: { en: 'Your home address', ms: 'Alamat rumah anda', zh: '你的家庭住址' }, emoji: '🏠', isPrivate: true, category: 'info' },
  { id: 4, text: { en: 'Your password', ms: 'Kata laluan anda', zh: '你的密码' }, emoji: '🔑', isPrivate: true, category: 'info' },
  { id: 5, text: { en: 'Getting dressed', ms: 'Memakai pakaian', zh: '换衣服' }, emoji: '👔', isPrivate: true, category: 'activity' },
  { id: 6, text: { en: 'Taking a bath', ms: 'Mandi', zh: '洗澡' }, emoji: '🛁', isPrivate: true, category: 'activity' },
  { id: 7, text: { en: 'Your bedroom', ms: 'Bilik tidur anda', zh: '你的卧室' }, emoji: '🛏️', isPrivate: true, category: 'place' },
  { id: 8, text: { en: 'Family secrets', ms: 'Rahsia keluarga', zh: '家庭秘密' }, emoji: '🤫', isPrivate: true, category: 'info' },
  { id: 9, text: { en: 'Changing clothes', ms: 'Menukar pakaian', zh: '换衣服' }, emoji: '👗', isPrivate: true, category: 'activity' },
  { id: 10, text: { en: 'Your phone number', ms: 'Nombor telefon anda', zh: '你的电话号码' }, emoji: '📱', isPrivate: true, category: 'info' },
  
  // Public
  { id: 11, text: { en: 'Waving hello', ms: 'Melambai hai', zh: '挥手打招呼' }, emoji: '👋', isPrivate: false, category: 'activity' },
  { id: 12, text: { en: 'Playing at the park', ms: 'Bermain di taman', zh: '在公园玩耍' }, emoji: '🏞️', isPrivate: false, category: 'activity' },
  { id: 13, text: { en: 'Your first name', ms: 'Nama pertama anda', zh: '你的名字' }, emoji: '📛', isPrivate: false, category: 'info' },
  { id: 14, text: { en: 'Eating lunch', ms: 'Makan tengah hari', zh: '吃午餐' }, emoji: '🍱', isPrivate: false, category: 'activity' },
  { id: 15, text: { en: 'Doing homework in class', ms: 'Buat kerja rumah di kelas', zh: '在课堂做作业' }, emoji: '📚', isPrivate: false, category: 'activity' },
  { id: 16, text: { en: 'Playing with friends', ms: 'Bermain dengan kawan', zh: '和朋友玩耍' }, emoji: '⚽', isPrivate: false, category: 'activity' },
  { id: 17, text: { en: 'Your favorite color', ms: 'Warna kegemaran anda', zh: '你最喜欢的颜色' }, emoji: '🎨', isPrivate: false, category: 'info' },
  { id: 18, text: { en: 'Riding your bike', ms: 'Menunggang basikal', zh: '骑自行车' }, emoji: '🚲', isPrivate: false, category: 'activity' },
  { id: 19, text: { en: 'Singing a song', ms: 'Menyanyi lagu', zh: '唱歌' }, emoji: '🎵', isPrivate: false, category: 'activity' },
  { id: 20, text: { en: 'Drawing a picture', ms: 'Melukis gambar', zh: '画画' }, emoji: '✏️', isPrivate: false, category: 'activity' },
];

export function PrivatePublicSorting({ onBack }: PrivatePublicSortingProps) {
  const { language } = useLanguage();
  const t = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'private' | 'public' | null>(null);

  const currentItem = items[currentIndex];

  const handleCategorySelect = (category: 'private' | 'public') => {
    if (feedback || selectedCategory) return;

    setSelectedCategory(category);
    const isCorrect = (category === 'private') === currentItem.isPrivate;

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
      setSelectedCategory(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 2500);
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

  if (gameComplete) {
    const percentage = Math.round((score / items.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="mb-4 text-green-700">{t.pp_completeTitle}</h2>
          <p className="text-2xl mb-4">{t.pp_completeScore.replace('{score}', String(score)).replace('{total}', String(items.length))}</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="bg-green-50 border-4 border-green-300 rounded-3xl p-8 mb-8">
            <h3 className="mb-4 text-green-700">{t.pp_remember}</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <p><strong>{t.privateLabel}:</strong> {t.pp_tip_privatePlaces}</p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p><strong>{t.publicLabel}:</strong> {t.pp_tip_publicOkay}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setGameComplete(false);
              }}
              className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg z-10">
        <span>{currentIndex + 1}/{items.length}</span>
      </div>

      <div className="max-w-3xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-green-700">{t.pp_title}</h2>

        <div className="bg-white rounded-3xl p-10 shadow-lg mb-8 text-center">
          <div className="text-8xl mb-6">{currentItem.emoji}</div>
          <h3 className="mb-4">{currentItem.text[language]}</h3>
          <p className="text-gray-600 mb-8">{t.pp_question}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => handleCategorySelect('private')}
            disabled={feedback !== null || selectedCategory !== null}
            className={`bg-purple-100 border-4 border-purple-400 text-purple-700 rounded-3xl p-10 transition-all
              ${!feedback && !selectedCategory ? 'hover:bg-purple-200 hover:scale-105 active:scale-95' : 'opacity-60'}
              ${feedback === 'correct' && currentItem.isPrivate ? 'ring-8 ring-green-500 scale-110' : ''}
            `}
          >
            <Lock className="w-20 h-20 mx-auto mb-4" strokeWidth={2.5} />
            <h3 className="mb-2">{t.privateLabel}</h3>
            <p className="text-sm opacity-80">{t.privateDesc}</p>
          </button>

          <button
            onClick={() => handleCategorySelect('public')}
            disabled={feedback !== null || selectedCategory !== null}
            className={`bg-blue-100 border-4 border-blue-400 text-blue-700 rounded-3xl p-10 transition-all
              ${!feedback && !selectedCategory ? 'hover:bg-blue-200 hover:scale-105 active:scale-95' : 'opacity-60'}
              ${feedback === 'correct' && !currentItem.isPrivate ? 'ring-8 ring-green-500 scale-110' : ''}
            `}
          >
            <Users className="w-20 h-20 mx-auto mb-4" strokeWidth={2.5} />
            <h3 className="mb-2">{t.publicLabel}</h3>
            <p className="text-sm opacity-80">{t.publicDesc}</p>
          </button>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-green-700 mb-3">{t.correct}</h3>
            <p className="text-xl">
              {currentItem.isPrivate 
                ? t.pp_correctPrivate.replace('{item}', currentItem.text[language])
                : t.pp_correctPublic.replace('{item}', currentItem.text[language])
              }
            </p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="bg-orange-50 border-4 border-orange-500 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-orange-700 mb-3">{t.oops}</h3>
            <p className="text-xl">
              {currentItem.isPrivate 
                ? t.pp_incorrectPrivate.replace('{item}', currentItem.text[language])
                : t.pp_incorrectPublic.replace('{item}', currentItem.text[language])
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
