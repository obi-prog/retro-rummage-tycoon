// Global sound event emitter for game actions
type SoundEventType = 'sell' | 'buy' | 'coin' | 'levelUp' | 'notification' | 'error' | 'click';

type SoundEventListener = (eventType: SoundEventType, data?: any) => void;

class SoundEventEmitter {
  private listeners: SoundEventListener[] = [];

  subscribe(listener: SoundEventListener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(eventType: SoundEventType, data?: any) {
    this.listeners.forEach(listener => {
      try {
        listener(eventType, data);
      } catch (error) {
        console.warn('Sound event listener error:', error);
      }
    });
  }
}

export const soundEventEmitter = new SoundEventEmitter();