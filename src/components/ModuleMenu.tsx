import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useGuide } from '../context/GuideContext';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ModuleMenuProps {
  moduleNumber: number;
  title: string;
  color: 'purple' | 'green' | 'orange';
  games: Game[];
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function ModuleMenu({ moduleNumber, title, color, games, onNavigate, onBack }: ModuleMenuProps) {
  const t = useTranslation();
  const { showPointer, hidePointer, isPointerEnabled, isGameComplete } = useGuide();

  // Show pointer to the next uncompleted game when entering module
  useEffect(() => {
    if (!isPointerEnabled || games.length === 0) return;
    
    // Find the first uncompleted game, or if all completed, show the second game (variety)
    let targetGame = games.find(game => !isGameComplete(game.id));
    
    // If all games are completed, point to the one they played less recently (assume second one)
    if (!targetGame && games.length > 1) {
      // Check which was completed last and suggest the other
      const lastPlayedGame = localStorage.getItem('lastPlayedGame');
      if (lastPlayedGame === games[0].id) {
        targetGame = games[1];
      } else {
        targetGame = games[0];
      }
    } else if (!targetGame) {
      targetGame = games[0];
    }
    
    const timer = setTimeout(() => {
      showPointer({
        id: 'next-game',
        selector: `[data-guide="${targetGame!.id}"]`,
        messagePosition: 'top',
        pulseColor: 'rgba(59, 130, 246, 0.8)',
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isPointerEnabled, games, showPointer, isGameComplete]);

  const colorClasses = {
    purple: {
      bg: 'from-purple-100 to-pink-100',
      card: 'from-purple-400 to-pink-400',
      border: 'border-purple-400',
      text: 'text-purple-700',
      hover: 'hover:from-purple-500 hover:to-pink-500'
    },
    green: {
      bg: 'from-green-100 to-blue-100',
      card: 'from-green-400 to-blue-400',
      border: 'border-green-400',
      text: 'text-green-700',
      hover: 'hover:from-green-500 hover:to-blue-500'
    },
    orange: {
      bg: 'from-orange-100 to-yellow-100',
      card: 'from-orange-400 to-yellow-400',
      border: 'border-orange-400',
      text: 'text-orange-700',
      hover: 'hover:from-orange-500 hover:to-yellow-500'
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.bg} p-4 md:p-8 flex items-center justify-center`}>
      <button
        onClick={onBack}
        data-guide="back"
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className={`inline-block px-8 py-3 bg-white rounded-full shadow-lg mb-6 border-4 ${colors.border}`}>
            {/* Replaced hardcoded "Module" with t.moduleLabel */}
            <span className={`text-2xl ${colors.text}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {t.moduleLabel} {moduleNumber}
            </span>
          </div>
          <h2 className="mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{title}</h2>
          <p className="text-xl text-gray-700">Choose a game to play!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <button
              key={game.id}
              data-guide={game.id}
              onClick={() => {
                hidePointer();
                onNavigate(game.id);
              }}
              className={`group relative bg-gradient-to-br ${colors.card} ${colors.hover} rounded-[2.5rem] p-10 shadow-2xl transition-all duration-300 hover:scale-105 border-8 ${colors.border}`}
            >
              <div className="text-9xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              <h3 className="text-white mb-3 drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {game.title}
              </h3>
              <p className="text-white/90 drop-shadow">
                {game.description}
              </p>
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}