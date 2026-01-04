import { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Users, RotateCcw, Star } from 'lucide-react';
import { playSound } from '../utils/sounds';

interface SocialScenarioProps {
  onBack: () => void;
}

type GameState = 'setup' | 'choice' | 'feedback-incorrect' | 'feedback-correct' | 'complete';

const scenarios = [
  {
    id: 1,
    title: 'Stranger at the Park',
    scene: '🏞️',
    character: '🧑',
    circleType: 'red',
    prompt: "Hi! I lost my puppy. Can you help me look for it in my car?",
    choices: [
      { id: 'go', label: 'Go with them', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Find my parent', icon: Users, safe: true },
    ],
    incorrectFeedback: "We never go anywhere with someone from the Red Circle (Strangers).",
    correctFeedback: "Great job! Always find a trusted adult when a stranger asks you to go somewhere.",
  },
  {
    id: 2,
    title: 'Friend Wants Your Password',
    scene: '🏫',
    character: '👦',
    circleType: 'green',
    prompt: "Can you tell me your tablet password so I can play on it?",
    choices: [
      { id: 'yes', label: 'Tell them', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Ask a grown-up', icon: Users, safe: true },
    ],
    incorrectFeedback: "Passwords are private! Even friends from the Green Circle shouldn't know them.",
    correctFeedback: "Perfect! Passwords should stay private, even from friends.",
  },
];

export function SocialScenario({ onBack }: SocialScenarioProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [score, setScore] = useState(0);

  const currentScenario = scenarios[currentScenarioIndex];

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
    if (currentScenarioIndex < scenarios.length - 1) {
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
    };
    return colors[circleType] || '';
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-8xl mb-8">🎉</div>
          <h2 className="mb-4 text-purple-700">All Scenarios Complete!</h2>
          <p className="text-2xl mb-8">You scored {score} out of {scenarios.length}!</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentScenarioIndex(0);
                setScore(0);
                setGameState('setup');
              }}
              className="px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg">
        <span>Score: {score}</span>
      </div>

      <h2 className="text-center mb-8 pt-8 text-blue-700">
        Safety Stories
      </h2>

      <div className="max-w-4xl mx-auto">
        {/* Setup/Scene Screen */}
        {gameState === 'setup' && (
          <div className="text-center">
            <h3 className="mb-8">{currentScenario.title}</h3>
            
            <div className="bg-white rounded-3xl p-12 shadow-lg mb-8">
              <div className="text-8xl mb-8">{currentScenario.scene}</div>
              <div className="text-6xl mb-8">{currentScenario.character}</div>
              
              <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-8 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-blue-300">
                  <span className="text-sm">They say:</span>
                </div>
                <p className="mt-4 text-xl">{currentScenario.prompt}</p>
              </div>
            </div>

            <button
              onClick={() => setGameState('choice')}
              className="px-12 py-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 text-xl"
            >
              What should you do?
            </button>
          </div>
        )}

        {/* Choice Screen */}
        {gameState === 'choice' && (
          <div className="text-center">
            <h3 className="mb-8">What should you do?</h3>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-4xl">{currentScenario.scene}</div>
                <div className="text-4xl">{currentScenario.character}</div>
              </div>
              <p className="text-gray-600 italic">"{currentScenario.prompt}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentScenario.choices.map((choice) => {
                const Icon = choice.icon;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.safe)}
                    className="bg-white border-4 border-gray-300 rounded-3xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                    <p className="text-xl">{choice.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Incorrect Feedback */}
        {gameState === 'feedback-incorrect' && (
          <div className="text-center">
            <div className="bg-red-50 border-8 border-red-500 rounded-3xl p-12 shadow-2xl mb-8 animate-pulse">
              <div className="text-8xl mb-6">⚠️</div>
              <h3 className="mb-6 text-red-700">Wait! Let's think about this...</h3>
              
              <div className={`inline-block border-4 rounded-2xl p-6 mb-6 ${getCircleColor(currentScenario.circleType)}`}>
                <div className="text-4xl mb-4">{currentScenario.character}</div>
                <p className="capitalize">{currentScenario.circleType} Circle</p>
              </div>
              
              <p className="text-xl mb-8">{currentScenario.incorrectFeedback}</p>
            </div>

            <button
              onClick={handleTryAgain}
              className="px-12 py-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 text-xl flex items-center gap-3 mx-auto"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
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
              <h3 className="mb-6 text-green-700">Safe Choice! Great Job!</h3>
              
              <div className="text-6xl mb-6">✅</div>
              
              <p className="text-xl mb-8">{currentScenario.correctFeedback}</p>
            </div>

            <button
              onClick={handleNextScenario}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
