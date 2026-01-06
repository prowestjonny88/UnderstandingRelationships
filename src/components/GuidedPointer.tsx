import { useState, useEffect, useCallback } from 'react';

export interface PointerTarget {
  id: string;
  selector?: string; // CSS selector to find the element
  position?: { x: number | string; y: number | string }; // Or fixed position
  message?: string;
  messagePosition?: 'top' | 'bottom' | 'left' | 'right';
  pulseColor?: string;
  autoAdvance?: boolean; // Automatically hide after interaction
  delay?: number; // Delay before showing (ms)
  showNextArrow?: boolean; // Show arrow indicating "next" action
  character?: 'bear' | 'star' | 'bunny' | 'owl'; // Cute helper character
}

interface GuidedPointerProps {
  target: PointerTarget | null;
  onTargetClick?: () => void;
  isVisible?: boolean;
}

export function GuidedPointer({ 
  target, 
  isVisible = true,
}: GuidedPointerProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  // Find and track target element position
  const updatePosition = useCallback(() => {
    if (!target) {
      setPosition(null);
      return;
    }

    if (target.selector) {
      const element = document.querySelector(target.selector);
      console.log('GuidedPointer: Looking for element with selector', target.selector, 'found:', element);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementRect(rect);
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
        console.log('GuidedPointer: Position set to', rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } else if (target.position) {
      setPosition({
        x: typeof target.position.x === 'string' 
          ? parseFloat(target.position.x) / 100 * window.innerWidth 
          : target.position.x,
        y: typeof target.position.y === 'string'
          ? parseFloat(target.position.y) / 100 * window.innerHeight
          : target.position.y
      });
    }
  }, [target]);

  useEffect(() => {
    if (!target) {
      setIsShowing(false);
      return;
    }

    const delay = target.delay || 0;
    const timer = setTimeout(() => {
      setIsShowing(true);
      updatePosition();
    }, delay);

    return () => clearTimeout(timer);
  }, [target, updatePosition]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isShowing) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);
    
    // Update position periodically for dynamic content
    const interval = setInterval(handleUpdate, 100);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      clearInterval(interval);
    };
  }, [isShowing, updatePosition]);

  if (!target || !position || !isVisible || !isShowing) {
    return null;
  }

  const pulseColor = target.pulseColor || 'rgba(255, 193, 7, 0.8)';

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes pointer-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pointer-tap {
          0%, 100% { transform: scale(1) rotate(-15deg); }
          50% { transform: scale(0.9) rotate(-15deg) translateY(5px); }
        }
        @keyframes glow-ring {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.05);
            opacity: 1;
          }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes float-character {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          25% { transform: translateY(-8px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(5deg); }
          75% { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes message-pop {
          0% { transform: scale(0.8) translateX(-50%); opacity: 0; }
          50% { transform: scale(1.05) translateX(-50%); }
          100% { transform: scale(1) translateX(-50%); opacity: 1; }
        }
        .pointer-hand {
          animation: pointer-tap 0.6s ease-in-out infinite;
        }
        .glow-ring {
          animation: glow-ring 1.5s ease-in-out infinite;
        }
        .float-char {
          animation: float-character 3s ease-in-out infinite;
        }
        .sparkle-1 { animation: sparkle 1.5s ease-in-out infinite; }
        .sparkle-2 { animation: sparkle 1.5s ease-in-out infinite 0.3s; }
        .sparkle-3 { animation: sparkle 1.5s ease-in-out infinite 0.6s; }
        .sparkle-4 { animation: sparkle 1.5s ease-in-out infinite 0.9s; }
        .ripple-effect {
          animation: ripple 1.5s ease-out infinite;
        }
        .message-bubble {
          animation: message-pop 0.4s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        {/* Glowing highlight around target element */}
        {elementRect && (
          <>
            {/* Multiple ripple effects */}
            <div
              className="absolute rounded-3xl ripple-effect pointer-events-none"
              style={{
                left: elementRect.left - 12,
                top: elementRect.top - 12,
                width: elementRect.width + 24,
                height: elementRect.height + 24,
                border: `3px solid ${pulseColor}`,
              }}
            />
            <div
              className="absolute rounded-3xl ripple-effect pointer-events-none"
              style={{
                left: elementRect.left - 12,
                top: elementRect.top - 12,
                width: elementRect.width + 24,
                height: elementRect.height + 24,
                border: `3px solid ${pulseColor}`,
                animationDelay: '0.5s',
              }}
            />
            
            {/* Main glow ring */}
            <div
              className="absolute rounded-3xl glow-ring pointer-events-none"
              style={{
                left: elementRect.left - 8,
                top: elementRect.top - 8,
                width: elementRect.width + 16,
                height: elementRect.height + 16,
                border: `4px solid ${pulseColor}`,
                boxShadow: `
                  0 0 20px ${pulseColor},
                  0 0 40px ${pulseColor},
                  inset 0 0 20px ${pulseColor.replace('0.8', '0.2')}
                `,
                background: `radial-gradient(ellipse at center, ${pulseColor.replace('0.8', '0.1')} 0%, transparent 70%)`,
              }}
            />
          </>
        )}

        {/* Sparkles around the target */}
        {elementRect && (
          <>
            <div className="absolute sparkle-1 text-2xl" style={{ left: elementRect.left - 20, top: elementRect.top - 15 }}>✨</div>
            <div className="absolute sparkle-2 text-xl" style={{ left: elementRect.right + 10, top: elementRect.top - 10 }}>⭐</div>
            <div className="absolute sparkle-3 text-2xl" style={{ left: elementRect.right + 5, top: elementRect.bottom - 5 }}>✨</div>
            <div className="absolute sparkle-4 text-xl" style={{ left: elementRect.left - 15, top: elementRect.bottom + 5 }}>💫</div>
          </>
        )}

        {/* Animated pointing hand - simple version without character or message */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: position.x + 20,
            top: position.y + 20,
          }}
        >
          <div 
            className="pointer-hand origin-bottom-right text-4xl drop-shadow-lg"
          >
            👆
          </div>
        </div>

        {/* Touch indicator at center of target */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-8 h-8 rounded-full"
            style={{
              background: `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
              animation: 'ripple 1s ease-out infinite',
            }}
          />
        </div>
      </div>
    </>
  );
}

// Hook to manage guided pointer state
export interface PointerStep {
  id: string;
  target: PointerTarget;
  condition?: () => boolean;
  onComplete?: () => void;
}

export function useGuidedPointer(steps: PointerStep[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentStep = steps[currentStepIndex];
  const currentTarget = currentStep?.target || null;

  const startGuide = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsActive(true);
  }, []);

  const stopGuide = useCallback(() => {
    setIsActive(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      currentStep.onComplete?.();
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsActive(false);
    }
  }, [currentStep, currentStepIndex, steps.length]);

  const goToStep = useCallback((stepId: string) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index !== -1) {
      setCurrentStepIndex(index);
      setIsActive(true);
    }
  }, [steps]);

  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep?.id === stepId) {
      nextStep();
    }
  }, [currentStep, nextStep]);

  return {
    currentTarget: isActive ? currentTarget : null,
    currentStep: isActive ? currentStep : null,
    isActive,
    completedSteps,
    startGuide,
    stopGuide,
    nextStep,
    goToStep,
    markStepComplete,
    progress: {
      current: currentStepIndex + 1,
      total: steps.length,
      percentage: ((currentStepIndex + 1) / steps.length) * 100
    }
  };
}

// Pre-built pointer configurations for common scenarios
export const pointerPresets = {
  // For "click here to continue" actions
  continueButton: (message?: string): PointerTarget => ({
    id: 'continue-btn',
    selector: '[data-guide="continue"], .continue-button',
    message: message || 'Tap here!',
    messagePosition: 'top',
    pulseColor: 'rgba(34, 197, 94, 0.8)',
    character: 'star'
  }),

  // For "go back" actions
  backButton: (message?: string): PointerTarget => ({
    id: 'back-btn',
    selector: '[data-guide="back"], .back-button',
    message: message || 'Go back',
    messagePosition: 'right',
    pulseColor: 'rgba(156, 163, 175, 0.8)',
    character: 'owl'
  }),

  // For game answers
  answerOption: (selector: string, message?: string): PointerTarget => ({
    id: 'answer-option',
    selector,
    message: message || 'Try this one!',
    messagePosition: 'top',
    pulseColor: 'rgba(59, 130, 246, 0.8)',
    character: 'bunny'
  }),

  // For next module navigation
  nextModule: (selector: string, moduleName?: string): PointerTarget => ({
    id: 'next-module',
    selector,
    message: moduleName ? `Try ${moduleName}!` : 'Next game!',
    messagePosition: 'bottom',
    pulseColor: 'rgba(168, 85, 247, 0.8)',
    showNextArrow: true,
    character: 'star'
  }),

  // For starting a game
  startGame: (message?: string): PointerTarget => ({
    id: 'start-game',
    selector: '[data-guide="start"], .start-button',
    message: message || 'Start here!',
    messagePosition: 'bottom',
    pulseColor: 'rgba(251, 191, 36, 0.8)',
    character: 'bear'
  })
};
