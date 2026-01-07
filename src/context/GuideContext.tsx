import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PointerTarget } from '../components/GuidedPointer';

interface GameProgress {
  gameId: string;
  isComplete: boolean;
  score?: number;
  nextGameId?: string;
}

interface GuideContextType {
  // Pointer state
  currentPointer: PointerTarget | null;
  isPointerEnabled: boolean;
  
  // Show a pointer at a specific target
  showPointer: (target: PointerTarget) => void;
  hidePointer: () => void;
  
  // Game completion tracking
  markGameComplete: (gameId: string, nextGameId?: string) => void;
  getNextGame: (currentGameId: string) => string | null;
  isGameComplete: (gameId: string) => boolean;
  
  // Guide mode - for first-time users
  isGuideModeActive: boolean;
  startGuideMode: () => void;
  stopGuideMode: () => void;
  
  // Pointer visibility setting
  setPointerEnabled: (enabled: boolean) => void;
}

const GuideContext = createContext<GuideContextType | null>(null);

// Game flow configuration - defines the order of games/submodules
const GAME_FLOW: Record<string, string> = {
  // Module 1 flow
  'circles': 'safecontact',
  'safecontact': 'module2', // Go to next module after completing module 1
  
  // Module 2 flow
  'safetyScenarios': 'infoVault',
  'infoVault': 'module3', // Go to next module after completing module 2
  
  // Module 3 flow
  'spaceBubble': 'whatWouldYouDo',
  'whatWouldYouDo': 'complete', // All done!
};

// Messages to show when pointing to next game
const NEXT_GAME_MESSAGES: Record<string, Record<string, string>> = {
  en: {
    'safecontact': 'Great job! Try Safe Contact next! 🤝',
    'module2': 'Amazing! Now try Safety Decisions! 🛡️',
    'safetyScenarios': 'Excellent! Try Safety Scenarios! 🎯',
    'infoVault': 'Well done! Try Info Vault next! 🔒',
    'module3': 'Fantastic! Now try My Body Space! 🫧',
    'spaceBubble': 'Awesome! Try Space Bubble! 🛡️',
    'whatWouldYouDo': 'Great! Try What Would You Do! 🤔',
    'complete': 'You finished everything! 🎉',
  },
  ms: {
    'safecontact': 'Bagus! Cuba Sentuhan Selamat! 🤝',
    'module2': 'Hebat! Cuba Keputusan Keselamatan! 🛡️',
    'safetyScenarios': 'Cemerlang! Cuba Senario Keselamatan! 🎯',
    'infoVault': 'Syabas! Cuba Peti Maklumat! 🔒',
    'module3': 'Fantastik! Cuba Ruang Badan Saya! 🫧',
    'spaceBubble': 'Hebat! Cuba Gelembung Ruang! 🛡️',
    'whatWouldYouDo': 'Bagus! Cuba Apa Yang Anda Akan Buat! 🤔',
    'complete': 'Anda selesai semua! 🎉',
  },
  zh: {
    'safecontact': '做得好！试试安全接触！🤝',
    'module2': '太棒了！现在试试安全决策！🛡️',
    'safetyScenarios': '很好！试试安全场景！🎯',
    'infoVault': '干得好！接下来试试信息保险箱！🔒',
    'module3': '太棒了！现在试试我的身体空间！🫧',
    'spaceBubble': '真棒！试试空间气泡！🛡️',
    'whatWouldYouDo': '很好！试试你会怎么做！🤔',
    'complete': '你完成了所有内容！🎉',
  }
};

interface GuideProviderProps {
  children: ReactNode;
}

export function GuideProvider({ children }: GuideProviderProps) {
  const [currentPointer, setCurrentPointer] = useState<PointerTarget | null>(null);
  const [isPointerEnabled, setPointerEnabled] = useState(() => {
    const saved = localStorage.getItem('pointerGuidesEnabled');
    return saved !== 'false'; // Default to true
  });
  const [isGuideModeActive, setGuideModeActive] = useState(false);
  const [completedGames, setCompletedGames] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('completedGames');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const showPointer = useCallback((target: PointerTarget) => {
    if (isPointerEnabled) {
      setCurrentPointer(target);
    }
  }, [isPointerEnabled]);

  const hidePointer = useCallback(() => {
    setCurrentPointer(null);
  }, []);

  const markGameComplete = useCallback((gameId: string, _nextGameId?: string) => {
    setCompletedGames(prev => {
      const newSet = new Set([...prev, gameId]);
      localStorage.setItem('completedGames', JSON.stringify([...newSet]));
      return newSet;
    });
  }, []);

  const getNextGame = useCallback((currentGameId: string): string | null => {
    return GAME_FLOW[currentGameId] || null;
  }, []);

  const isGameComplete = useCallback((gameId: string): boolean => {
    return completedGames.has(gameId);
  }, [completedGames]);

  const startGuideMode = useCallback(() => {
    setGuideModeActive(true);
    localStorage.setItem('guideModeActive', 'true');
  }, []);

  const stopGuideMode = useCallback(() => {
    setGuideModeActive(false);
    localStorage.setItem('guideModeActive', 'false');
  }, []);

  const handleSetPointerEnabled = useCallback((enabled: boolean) => {
    setPointerEnabled(enabled);
    localStorage.setItem('pointerGuidesEnabled', String(enabled));
  }, []);

  const value: GuideContextType = {
    currentPointer,
    isPointerEnabled,
    showPointer,
    hidePointer,
    markGameComplete,
    getNextGame,
    isGameComplete,
    isGuideModeActive,
    startGuideMode,
    stopGuideMode,
    setPointerEnabled: handleSetPointerEnabled,
  };

  return (
    <GuideContext.Provider value={value}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}

// Helper hook for game completion with navigation pointer
export function useGameCompletion(gameId: string) {
  const { markGameComplete } = useGuide();

  const completeGame = useCallback(() => {
    markGameComplete(gameId);
    // Save which game was just played so we can point to the other one next time
    localStorage.setItem('lastPlayedGame', gameId);
  }, [gameId, markGameComplete]);

  return { completeGame };
}

export { GAME_FLOW, NEXT_GAME_MESSAGES };
