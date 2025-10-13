import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSound, SoundSettings } from '@/hooks/useSound';
import { soundEventEmitter } from '@/utils/soundEvents';

interface SoundContextType {
  settings: SoundSettings;
  updateSettings: (settings: Partial<SoundSettings>) => void;
  playMusic: (track: 'menu' | 'game') => void;
  stopMusic: () => void;
  playCoinSound: () => void;
  playSellSound: () => void;
  playBuySound: () => void;
  playClickSound: () => void;
  playNotificationSound: () => void;
  playErrorSound: () => void;
  playLevelUpSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const soundHook = useSound();

  // Listen for global sound events from game actions
  useEffect(() => {
    const unsubscribe = soundEventEmitter.subscribe((eventType, data) => {
      switch (eventType) {
        case 'sell':
          soundHook.playSellSound();
          break;
        case 'buy':
          soundHook.playBuySound();
          break;
        case 'coin':
          soundHook.playCoinSound();
          break;
        case 'levelUp':
          soundHook.playLevelUpSound();
          break;
        case 'notification':
          soundHook.playNotificationSound();
          break;
        case 'error':
          soundHook.playErrorSound();
          break;
        case 'click':
          soundHook.playClickSound();
          break;
      }
    });

    return unsubscribe;
  }, [soundHook]);

  return (
    <SoundContext.Provider value={soundHook}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};