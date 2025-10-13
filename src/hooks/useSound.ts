import { useState, useEffect, useRef } from 'react';

export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  sfxEnabled: boolean;
  musicVolume: number;
  musicEnabled: boolean;
}

const defaultSettings: SoundSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  sfxEnabled: true,
  musicVolume: 0.5,
  musicEnabled: true,
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

const musicTracks = {
  menu: '/audio/music/menu-theme.mp3',
  game: '/audio/music/game-theme.mp3',
};


export const useSound = () => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('sokak-bitpazari-sound-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const sfxCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<'menu' | 'game' | null>(null);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sokak-bitpazari-sound-settings', JSON.stringify(settings));
  }, [settings]);

  // Update music volume when settings change
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = settings.musicVolume * settings.masterVolume;
      if (!settings.musicEnabled) {
        musicRef.current.pause();
      } else if (currentTrackRef.current) {
        musicRef.current.play().catch(console.warn);
      }
    }
  }, [settings.musicVolume, settings.masterVolume, settings.musicEnabled]);


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


  const playMusic = (track: 'menu' | 'game') => {
    if (!settings.musicEnabled) return;

    // If same track is already playing, don't restart
    if (currentTrackRef.current === track && musicRef.current && !musicRef.current.paused) {
      return;
    }

    // Stop current music if playing
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }

    // Create and play new track
    musicRef.current = new Audio(musicTracks[track]);
    musicRef.current.loop = true;
    musicRef.current.volume = settings.musicVolume * settings.masterVolume;
    currentTrackRef.current = track;
    
    musicRef.current.play().catch(console.warn);
  };

  const stopMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      currentTrackRef.current = null;
    }
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
    playMusic,
    stopMusic,
    playCoinSound,
    playSellSound,
    playBuySound,
    playClickSound,
    playNotificationSound,
    playErrorSound,
    playLevelUpSound,
  };
};