import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { ModuleMenu } from './components/ModuleMenu';
import { CircleSorter } from './components/CircleSorter';
import { SafeContactGame } from './components/SafeContactGame';
import { PrivatePublicSorting } from './components/PrivatePublicSorting';
import { ScenarioQuiz } from './components/ScenarioQuiz';
import { SafetyScenarios } from './components/SafetyScenarios';
import { InfoVault } from './components/InfoVault';
import { SpaceBubble } from './components/SpaceBubble';
import { WhatWouldYouDo } from './components/WhatWouldYouDo';
import { PermissionRequest } from './components/PermissionRequest';
import { ParentSettings } from './components/ParentSettings';
import { LanguageProvider } from './context/LanguageContext';

type Screen = 'main' | 'module1' | 'module2' | 'module3' | 
  'circles' | 'safecontact' | 'privatePublic' | 'scenarioQuiz' | 'safetyScenarios' | 'infoVault' |
  'spaceBubble' | 'whatWouldYouDo' | 'parentSettings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    // Check if we've already shown permissions
    const hasShownPermissions = localStorage.getItem('permissionsShown') === 'true';
    
    // Show permission request on first load if not already shown
    if (!hasShownPermissions) {
      setShowPermissions(true);
    }
  }, []);

  const handlePermissionComplete = (granted: boolean) => {
    localStorage.setItem('permissionsShown', 'true');
    setShowPermissions(false);
    
    if (granted) {
      // Try to resume audio context if available
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
        }
      } catch (e) {
        console.log('Audio context initialization:', e);
      }
    }
  };

  if (showPermissions) {
    return (
      <LanguageProvider>
        <PermissionRequest 
          onComplete={handlePermissionComplete}
          onSkip={() => handlePermissionComplete(false)}
        />
      </LanguageProvider>
    );
  }

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {currentScreen === 'main' && (
        <MainMenu onNavigate={handleNavigate} />
      )}
      
      {currentScreen === 'module1' && (
        <ModuleMenu 
          moduleNumber={1}
          title="Relationship Circles and Safety"
          color="purple"
          games={[
            { id: 'circles', title: 'Circle Sorter', description: 'Sort people by relationship', icon: '👥' },
            { id: 'safecontact', title: 'Safe Touch', description: 'Learn about safe contact', icon: '🤝' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'module2' && (
        <ModuleMenu 
          moduleNumber={2}
          title="Private vs Public Behaviour"
          color="green"
          games={[
            { id: 'safetyScenarios', title: 'Safe or Unsafe?', description: 'Learn to spot safe situations', icon: '🛡️' },
            { id: 'infoVault', title: 'The Info Vault', description: 'Learn what to share', icon: '🔒' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'module3' && (
        <ModuleMenu 
          moduleNumber={3}
          title="Respect and Assertiveness"
          color="orange"
          games={[
            { id: 'spaceBubble', title: 'Respect Space', description: 'Learn about boundaries', icon: '🛡️' },
            { id: 'whatWouldYouDo', title: 'What Would You Do?', description: 'Group scenarios', icon: '👫' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}

      {currentScreen === 'circles' && (
        <CircleSorter onBack={() => setCurrentScreen('module1')} />
      )}
      
      {currentScreen === 'safecontact' && (
        <SafeContactGame onBack={() => setCurrentScreen('module1')} />
      )}
      
      {currentScreen === 'privatePublic' && (
        <PrivatePublicSorting onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'scenarioQuiz' && (
        <ScenarioQuiz onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'safetyScenarios' && (
        <SafetyScenarios onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'infoVault' && (
        <InfoVault onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'spaceBubble' && (
        <SpaceBubble onBack={() => setCurrentScreen('module3')} />
      )}
      
      {currentScreen === 'whatWouldYouDo' && (
        <WhatWouldYouDo onBack={() => setCurrentScreen('module3')} />
      )}

      {currentScreen === 'parentSettings' && (
        <ParentSettings onBack={() => setCurrentScreen('main')} />
      )}
    </div>
    </LanguageProvider>
  );
}