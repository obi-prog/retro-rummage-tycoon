import { GameState } from '@/types/game';

const SAVE_KEY = 'sokak_bitpazari_save';

export interface SaveData {
  gameState: GameState;
  timestamp: number;
  version: string;
}

export const saveGame = (gameState: GameState): boolean => {
  try {
    const saveData: SaveData = {
      gameState,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Oyun kaydetme hatası:', error);
    return false;
  }
};

export const loadGame = (): GameState | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;
    
    const saveData: SaveData = JSON.parse(savedData);
    
    // Version kontrol (gelecekte kullanılabilir)
    if (!saveData.version) {
      console.warn('Eski sürüm kayıt dosyası bulundu');
    }
    
    return saveData.gameState;
  } catch (error) {
    console.error('Oyun yükleme hatası:', error);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    return savedData !== null;
  } catch (error) {
    console.error('Kayıt dosyası kontrol hatası:', error);
    return false;
  }
};

export const deleteSave = (): boolean => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Kayıt dosyası silme hatası:', error);
    return false;
  }
};

export const getSaveInfo = (): { timestamp: number; day: number; level: number; cash: number } | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;
    
    const saveData: SaveData = JSON.parse(savedData);
    return {
      timestamp: saveData.timestamp,
      day: saveData.gameState.day,
      level: saveData.gameState.level,
      cash: saveData.gameState.cash
    };
  } catch (error) {
    console.error('Kayıt bilgisi alma hatası:', error);
    return null;
  }
};