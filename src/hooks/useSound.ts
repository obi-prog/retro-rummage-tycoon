import { useState, useEffect, useRef } from 'react';

export interface SoundSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

const defaultSettings: SoundSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,
};

// Sound effect URLs - using web-based retro sounds
const soundEffects = {
  coin: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  sell: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  buy: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
  levelUp: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zfPZjDkIHGS57OKeQQIYarfux2kgBjiS2O7TfCMFKHzH8N2OSAoXY7jux2scCT2SzfLUfjAGJXfJ8OKLQQoZbLvv4aKLK',
};

export const useSound = () => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('sokak-bitpazari-sound-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sfxCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sokak-bitpazari-sound-settings', JSON.stringify(settings));
  }, [settings]);

  // Initialize background music
  useEffect(() => {
    // Create a simple retro-style background music using Web Audio API
    // For now, we'll use a placeholder
    const createBackgroundMusic = () => {
      const audio = new Audio();
      // This would be a retro 80s-style background track
      // For demo purposes, we'll create a simple tone sequence
      audio.loop = true;
      audio.volume = settings.musicVolume * settings.masterVolume;
      return audio;
    };

    if (settings.musicEnabled) {
      musicRef.current = createBackgroundMusic();
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, [settings.musicEnabled]);

  // Update music volume when settings change
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = settings.musicVolume * settings.masterVolume;
    }
  }, [settings.musicVolume, settings.masterVolume]);

  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const playMusic = () => {
    if (musicRef.current && settings.musicEnabled) {
      musicRef.current.play().catch(console.warn);
    }
  };

  const pauseMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
    }
  };

  const playSound = (soundType: keyof typeof soundEffects) => {
    if (!settings.sfxEnabled) return;

    // Get or create audio element for this sound
    let audio = sfxCache.current.get(soundType);
    if (!audio) {
      audio = new Audio(soundEffects[soundType]);
      sfxCache.current.set(soundType, audio);
    }

    audio.volume = settings.sfxVolume * settings.masterVolume;
    audio.currentTime = 0; // Reset to beginning
    audio.play().catch(console.warn);
  };

  // Convenience methods for common game sounds
  const playCoinSound = () => playSound('coin');
  const playSellSound = () => playSound('sell');
  const playBuySound = () => playSound('buy');
  const playClickSound = () => playSound('click');
  const playNotificationSound = () => playSound('notification');
  const playErrorSound = () => playSound('error');
  const playLevelUpSound = () => playSound('levelUp');

  return {
    settings,
    updateSettings,
    playMusic,
    pauseMusic,
    playSound,
    playCoinSound,
    playSellSound,
    playBuySound,
    playClickSound,
    playNotificationSound,
    playErrorSound,
    playLevelUpSound,
  };
};