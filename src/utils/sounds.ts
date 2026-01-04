/**
 * Sound effects utility for the app
 * Uses Web Audio API to generate fun celebratory sounds
 * Also supports playing audio files for variety
 */

type SoundType = 'correct' | 'incorrect';

// Audio file paths for correct answers (from public folder)
const correctAudioFiles = [
  '/audio/videoplayback.m4a',
  '/audio/clapping.m4a',
];

// Different celebratory sound patterns for correct answers
const correctSoundPatterns = [
  // Pattern 1: Happy "Yay!" ascending tones
  {
    name: 'yay1',
    notes: [
      { freq: 523.25, duration: 0.1, delay: 0 },    // C5
      { freq: 659.25, duration: 0.1, delay: 0.1 },  // E5
      { freq: 783.99, duration: 0.2, delay: 0.2 },  // G5
    ],
    waveform: 'sine' as OscillatorType,
  },
  // Pattern 2: Cheerful "Ta-da!" fanfare
  {
    name: 'tada',
    notes: [
      { freq: 392, duration: 0.15, delay: 0 },      // G4
      { freq: 523.25, duration: 0.15, delay: 0.15 }, // C5
      { freq: 659.25, duration: 0.25, delay: 0.3 },  // E5
    ],
    waveform: 'triangle' as OscillatorType,
  },
  // Pattern 3: Exciting victory chime
  {
    name: 'victory',
    notes: [
      { freq: 440, duration: 0.08, delay: 0 },       // A4
      { freq: 554.37, duration: 0.08, delay: 0.08 }, // C#5
      { freq: 659.25, duration: 0.08, delay: 0.16 }, // E5
      { freq: 880, duration: 0.3, delay: 0.24 },     // A5
    ],
    waveform: 'sine' as OscillatorType,
  },
  // Pattern 4: Playful "Ding-ding-ding!"
  {
    name: 'dingding',
    notes: [
      { freq: 880, duration: 0.1, delay: 0 },       // A5
      { freq: 880, duration: 0.1, delay: 0.12 },    // A5
      { freq: 1046.5, duration: 0.2, delay: 0.24 }, // C6
    ],
    waveform: 'sine' as OscillatorType,
  },
  // Pattern 5: Happy bouncy tune
  {
    name: 'bouncy',
    notes: [
      { freq: 587.33, duration: 0.1, delay: 0 },    // D5
      { freq: 698.46, duration: 0.1, delay: 0.1 },  // F5
      { freq: 880, duration: 0.15, delay: 0.2 },    // A5
      { freq: 1046.5, duration: 0.2, delay: 0.35 }, // C6
    ],
    waveform: 'triangle' as OscillatorType,
  },
];

// Incorrect sound pattern (gentler, encouraging)
const incorrectSoundPattern = {
  notes: [
    { freq: 300, duration: 0.15, delay: 0 },
    { freq: 250, duration: 0.2, delay: 0.15 },
  ],
  waveform: 'triangle' as OscillatorType,
};

/**
 * Play a random celebratory sound effect for correct answers
 * or a gentle "try again" sound for incorrect answers
 */
export const playSound = (type: SoundType): void => {
  try {
    if (type === 'correct') {
      // Total options: audio files + synthesized patterns
      const totalOptions = correctAudioFiles.length + correctSoundPatterns.length;
      const randomChoice = Math.floor(Math.random() * totalOptions);
      
      // If random choice is within audio files range, play audio file
      if (randomChoice < correctAudioFiles.length) {
        const audioFile = correctAudioFiles[randomChoice];
        const audio = new Audio(audioFile);
        audio.volume = 0.5;
        audio.play().catch(e => {
          console.log('Audio playback failed, falling back to synthesized sound:', e);
          playSynthesizedCorrectSound();
        });
        return;
      }
      
      // Otherwise play synthesized sound
      playSynthesizedCorrectSound();
    } else {
      // Incorrect - play gentle "try again" sound
      playSynthesizedIncorrectSound();
    }
  } catch (e) {
    console.log('Audio not supported:', e);
  }
};

/**
 * Play a synthesized correct sound using Web Audio API
 */
const playSynthesizedCorrectSound = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.log('Audio not supported');
      return;
    }

    const audioContext = new AudioContextClass();
    const pattern = correctSoundPatterns[Math.floor(Math.random() * correctSoundPatterns.length)];
    
    pattern.notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = pattern.waveform;
      
      const startTime = audioContext.currentTime + note.delay;
      const endTime = startTime + note.duration;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
      
      oscillator.start(startTime);
      oscillator.stop(endTime + 0.1);
    });
  } catch (e) {
    console.log('Synthesized audio not supported:', e);
  }
};

/**
 * Play a synthesized incorrect sound using Web Audio API
 */
const playSynthesizedIncorrectSound = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.log('Audio not supported');
      return;
    }

    const audioContext = new AudioContextClass();
    
    incorrectSoundPattern.notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = incorrectSoundPattern.waveform;
      
      const startTime = audioContext.currentTime + note.delay;
      const endTime = startTime + note.duration;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
      
      oscillator.start(startTime);
      oscillator.stop(endTime + 0.1);
    });
  } catch (e) {
    console.log('Synthesized audio not supported:', e);
  }
};

/**
 * Play only a random correct/celebratory sound
 */
export const playCorrectSound = (): void => {
  playSound('correct');
};

/**
 * Play only the incorrect/try again sound
 */
export const playIncorrectSound = (): void => {
  playSound('incorrect');
};
