import { useState, useEffect, useRef } from 'react';

export interface SoundSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  currentMusicTrack: string;
}

const defaultSettings: SoundSettings = {
  masterVolume: 0.7,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,
  currentMusicTrack: 'ambient',
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
  menu: '/audio/music/retro-pop-menu.mp3',
  game: '/audio/music/retro-pop-game.mp3',
  classic: '/audio/music/menu-theme.mp3',
  ambient: '/audio/music/deep-abstract-ambient.mp3'
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
    const createBackgroundMusic = () => {
      const audio = new Audio(musicTracks[settings.currentMusicTrack as keyof typeof musicTracks] || musicTracks.menu);
      audio.loop = true;
      audio.volume = settings.musicVolume * settings.masterVolume;
      return audio;
    };

    if (settings.musicEnabled) {
      if (musicRef.current) {
        musicRef.current.pause();
      }
      musicRef.current = createBackgroundMusic();
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, [settings.musicEnabled, settings.currentMusicTrack]);

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

  const changeMusicTrack = (track: string) => {
    updateSettings({ currentMusicTrack: track });
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
    changeMusicTrack,
    musicTracks,
    playCoinSound,
    playSellSound,
    playBuySound,
    playClickSound,
    playNotificationSound,
    playErrorSound,
    playLevelUpSound,
  };
};