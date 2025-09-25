import { useState, useEffect, useRef } from 'react';

export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  sfxEnabled: boolean;
}

const defaultSettings: SoundSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  sfxEnabled: true,
};

// Music and sound effect paths
const soundEffects = {
  coin: '/audio/sound-effects/coin.wav',
  sell: '/audio/sound-effects/sell.wav',
  buy: '/audio/sound-effects/buy.wav',
  click: '/audio/sound-effects/click.wav',
  notification: '/audio/sound-effects/notification.wav',
  error: '/audio/sound-effects/error.wav',
  levelUp: '/audio/sound-effects/levelup.wav',
};


export const useSound = () => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('sokak-bitpazari-sound-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const sfxCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sokak-bitpazari-sound-settings', JSON.stringify(settings));
  }, [settings]);


  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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