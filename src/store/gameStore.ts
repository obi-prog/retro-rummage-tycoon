import { create } from 'zustand';
import { GameState, Item, Customer, ItemCategory, Language } from '@/types/game';
import { detectLanguage } from '@/utils/localization';

interface GameStore extends GameState {
  // Actions
  initGame: () => void;
  setLanguage: (lang: Language) => void;
  addCash: (amount: number) => void;
  spendCash: (amount: number) => boolean;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  sellItem: (item: Item, price: number) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  advanceDay: () => void;
  updateReputation: (amount: number) => void;
  updateTrust: (amount: number) => void;
  tickTime: () => void;
}

const generateStartingItems = (): Item[] => {
  return [
    {
      id: '1',
      name: 'Vintage Walkman',
      category: 'walkman_electronics',
      baseValue: 150,
      condition: 75,
      authenticity: 'authentic',
      rarity: 'rare',
      trendBonus: 0,
      image: '🎧'
    },
    {
      id: '2',
      name: 'Classic Rock Album',
      category: 'cassette_record',
      baseValue: 80,
      condition: 60,
      authenticity: 'authentic',
      rarity: 'common',
      trendBonus: 0,
      image: '💿'
    }
  ];
};

export const useGameStore = create<GameStore>()((set, get) => ({
  // Initial state
  level: 1,
  cash: 500,
  reputation: 10,
  trust: 50,
  day: 1,
  timeLeft: 120,
  inventory: generateStartingItems(),
  shopItems: [],
  currentCustomer: null,
  events: [],
  trends: [],
  dailyExpenses: 50,
  language: detectLanguage(),

  // Actions
  initGame: () => {
    set({
      level: 1,
      cash: 500,
      reputation: 10,
      trust: 50,
      day: 1,
      timeLeft: 120,
      inventory: generateStartingItems(),
      shopItems: [],
      currentCustomer: null,
      events: [],
      trends: [],
      dailyExpenses: 50,
      language: detectLanguage(),
    });
  },

  setLanguage: (lang: Language) => {
    set({ language: lang });
  },

  addCash: (amount: number) => {
    set(state => ({ cash: state.cash + amount }));
  },

  spendCash: (amount: number) => {
    const { cash } = get();
    if (cash >= amount) {
      set({ cash: cash - amount });
      return true;
    }
    return false;
  },

  addToInventory: (item: Item) => {
    set(state => ({
      inventory: [...state.inventory, item]
    }));
  },

  removeFromInventory: (itemId: string) => {
    set(state => ({
      inventory: state.inventory.filter(item => item.id !== itemId)
    }));
  },

  sellItem: (item: Item, price: number) => {
    set(state => ({
      inventory: state.inventory.filter(i => i.id !== item.id),
      cash: state.cash + price,
      reputation: state.reputation + 1
    }));
  },

  setCurrentCustomer: (customer: Customer | null) => {
    set({ currentCustomer: customer });
  },

  advanceDay: () => {
    set(state => ({
      day: state.day + 1,
      timeLeft: 120 + (state.level * 10), // Longer days as you progress
      cash: state.cash - state.dailyExpenses
    }));
  },

  updateReputation: (amount: number) => {
    set(state => ({
      reputation: Math.max(0, Math.min(100, state.reputation + amount))
    }));
  },

  updateTrust: (amount: number) => {
    set(state => ({
      trust: Math.max(0, Math.min(100, state.trust + amount))
    }));
  },

  tickTime: () => {
    set(state => {
      const newTime = Math.max(0, state.timeLeft - 1);
      if (newTime === 0) {
        // Day ended
        return {
          timeLeft: 120 + (state.level * 10),
          day: state.day + 1,
          cash: state.cash - state.dailyExpenses
        };
      }
      return { timeLeft: newTime };
    });
  }
}));