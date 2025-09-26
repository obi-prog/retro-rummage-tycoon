import { create } from 'zustand';
import { GameState, Item, Customer, ItemCategory, Language, DailyStats, FinancialRecord, DailyFinancials } from '@/types/game';
import { Mission } from '@/types/missions';
import { detectLanguage } from '@/utils/localization';
import { generateDailyMissions, generateWeeklyMissions, generateAchievementMissions, calculateLevelProgress, updateMissionProgress } from '@/utils/missionSystem';
import { generateRandomEvent, generateTrendBurst, processEventEffects } from '@/utils/eventSystem';
import { saveGame, loadGame, hasSavedGame } from '@/utils/saveGame';
import { soundEventEmitter } from '@/utils/soundEvents';
import { getLevelConfig, getRandomCustomerLimit, checkLevelUpConditions, getNextLevelUnlocks, getRandomDayClosingMessage } from '@/utils/levelSystem';
import { generateCustomer } from '@/utils/gameLogic';

interface GameStore extends GameState {
  // Actions
  initGame: () => void;
  setLanguage: (lang: Language) => void;
  addCash: (amount: number) => void;
  spendCash: (amount: number) => boolean;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  sellItem: (item: Item, price: number) => void;
  buyItem: (item: Item, price: number) => boolean;
  advanceDay: () => void;
  updateReputation: (amount: number) => void;
  updateTrust: (amount: number) => void;
  tickTime: () => void;
  serveCustomer: () => void;
  getDailyCustomerLimit: () => number;
  // New enhanced actions
  addExperience: (amount: number) => void;
  claimMissionReward: (missionId: string) => void;
  upgradeSkill: (skillId: string) => void;
  processNegotiation: (success: boolean) => void;
  updateQuestSuccessStreak: (success: boolean) => void;
  regenerateQuestsIfNeeded: () => void;
  detectFakeItem: () => void;
  dismissEvent: (eventId: string) => void;
  triggerRandomEvent: () => void;
  // Financial actions
  addFinancialRecord: (type: 'income' | 'expense', category: 'sales' | 'purchases' | 'rent' | 'tax' | 'fine' | 'utilities' | 'other', amount: number, description: string) => void;
  calculateDailyExpenses: () => number;
  // End of day modal
  setShowEndOfDayModal: (show: boolean) => void;
  // Save/Load actions
  saveGameState: () => boolean;
  loadGameState: () => boolean;
  hasSavedGame: () => boolean;
  autoSave: () => void;
  // Level system actions
  startNewDay: () => void;
  onCustomerFinished: () => void;
  endOfDay: () => void;
  checkLevelUp: () => void;
  prefetchNextCustomer: () => void;
  showNextCustomer: () => void;
  onDealResolved: () => void;
  incrementOfferCount: () => void;
  setShowLevelUpModal: (show: boolean) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  setIsLoadingNextCustomer: (loading: boolean) => void;
}

const getDailyCustomerLimitByLevel = (level: number): number => {
  if (level >= 1 && level <= 3) {
    return 5; // Level 1-3: max 5 customers
  } else if (level >= 4 && level <= 8) {
    return 4 + Math.floor(Math.random() * 4); // Level 4-8: 4-7 customers (random)
  } else if (level >= 9 && level <= 12) {
    return 5 + Math.floor(Math.random() * 4); // Level 9-12: 5-8 customers (random)
  } else {
    return 8; // Level 13+: 8 customers
  }
};

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
      name: 'Klasik Rock Albümü',
      category: 'cassette_record',
      baseValue: 80,
      condition: 60,
      authenticity: 'authentic',
      rarity: 'common',
      trendBonus: 0,
      image: '💿'
    },
    {
      id: '3',
      name: 'Retro Saat',
      category: 'watch',
      baseValue: 200,
      condition: 80,
      authenticity: 'authentic',
      rarity: 'rare',
      trendBonus: 0,
      image: '⌚'
    },
    {
      id: '4',
      name: 'Oyuncak Araba',
      category: 'toy',
      baseValue: 60,
      condition: 70,
      authenticity: 'authentic',
      rarity: 'common',
      trendBonus: 0,
      image: '🧸'
    },
    {
      id: '5',
      name: 'Film Kamerası',
      category: 'camera',
      baseValue: 300,
      condition: 85,
      authenticity: 'authentic',
      rarity: 'very_rare',
      trendBonus: 0,
      image: '📷'
    }
  ];
};

export const useGameStore = create<GameStore>()((set, get) => ({
  // Initial state
  level: 1,
  cash: 1000,
  reputation: 10,
  trust: 50,
  day: 1,
  timeLeft: 0, // No timer - use customer counter instead
  dailySuccessStreak: 0,
  inventory: generateStartingItems(),
  shopItems: [],
  events: [],
  trends: [],
  dailyExpenses: 50,
  language: 'tr', // Set to Turkish by default
  // New enhanced state
  experience: 0,
  skillPoints: 0,
  missions: [],
  completedMissions: [],
  playerSkills: {},
  lastEventDay: 0,
  negotiationCount: 0,
  // Customer counting system
  customersServed: 0,
  dailyCustomerLimit: 5, // Default for level 1
  dailyStats: {
    itemsSold: 0,
    itemsBought: 0,
    cashEarned: 0,
    negotiationsWon: 0,
    fakeItemsDetected: 0
  },
  financialRecords: [],
  dailyFinancials: [],
  weeklyExpenses: {
    rent: 100,
    tax: 25,
    utilities: 30
  },
  showEndOfDayModal: false,
  // Level system state
  unlocks: [],
  dayCustomerCount: 0,
  offerCount: 0,
  isLoadingNextCustomer: false,
  currentCustomer: null,
  nextCustomer: null,
  showLevelUpModal: false,

  // Actions
  initGame: () => {
    const initialMissions = [
      ...generateDailyMissions(1),
      ...generateWeeklyMissions(1),
      ...generateAchievementMissions(1)
    ];
    set({
      level: 1,
      cash: 10000,
      reputation: 10,
      trust: 50,
      day: 1,
      timeLeft: 0, // No timer
      inventory: generateStartingItems(),
      shopItems: [],
      events: [],
      trends: [],
      dailyExpenses: 50,
      language: 'tr',
      experience: 0,
      skillPoints: 0,
      missions: initialMissions,
      completedMissions: [],
      playerSkills: {},
      lastEventDay: 0,
      negotiationCount: 0,
      customersServed: 0,
      dailyCustomerLimit: getDailyCustomerLimitByLevel(1), // Level 1
      dailyStats: {
        itemsSold: 0,
        itemsBought: 0,
        cashEarned: 0,
        negotiationsWon: 0,
        fakeItemsDetected: 0
      },
      financialRecords: [],
      dailyFinancials: [],
      weeklyExpenses: {
        rent: 100,
        tax: 25,
        utilities: 30
      },
      showEndOfDayModal: false,
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
    set(state => {
      const updatedMissions = updateMissionProgress(state.missions, 'sell_items', 1);
      const earnedMissions = updateMissionProgress(updatedMissions, 'earn_cash', price);
      
      // Add financial record
      const newRecord: FinancialRecord = {
        id: `sale_${Date.now()}_${Math.random()}`,
        date: state.day,
        type: 'income',
        category: 'sales',
        amount: price,
        description: `Satış: ${item.name}`
      };
      
      // Emit sound events for selling
      soundEventEmitter.emit('sell');
      soundEventEmitter.emit('coin');
      
      return {
        inventory: state.inventory.filter(i => i.id !== item.id),
        cash: state.cash + price,
        reputation: state.reputation + 1,
        missions: earnedMissions,
        financialRecords: [...state.financialRecords, newRecord],
        dailyStats: {
          ...state.dailyStats,
          itemsSold: state.dailyStats.itemsSold + 1,
          cashEarned: state.dailyStats.cashEarned + price
        }
      };
    });
    
    // Auto-save after selling
    setTimeout(() => get().autoSave(), 100);
  },

  buyItem: (item: Item, price: number) => {
    const { cash } = get();
    if (cash >= price) {
      set(state => {
        const updatedMissions = updateMissionProgress(state.missions, 'buy_items', 1);
        
        // Add financial record
        const newRecord: FinancialRecord = {
          id: `purchase_${Date.now()}_${Math.random()}`,
          date: state.day,
          type: 'expense',
          category: 'purchases',
          amount: price,
          description: `Satın alma: ${item.name}`
        };
        
        const itemWithPurchasePrice = {
          ...item,
          purchasePrice: price
        };
        
        // Emit sound event for buying
        soundEventEmitter.emit('buy');
        
        return {
          inventory: [...state.inventory, itemWithPurchasePrice],
          cash: state.cash - price,
          reputation: state.reputation + 1,
          missions: updatedMissions,
          financialRecords: [...state.financialRecords, newRecord],
          dailyStats: {
            ...state.dailyStats,
            itemsBought: state.dailyStats.itemsBought + 1
          }
        };
      });
      
      // Auto-save after buying
      setTimeout(() => get().autoSave(), 100);
      return true;
    } else {
      // Emit error sound for insufficient funds
      soundEventEmitter.emit('error');
    }
    return false;
  },


  advanceDay: () => {
    console.log('🎮 AdvanceDay called - starting new day');
    set(state => {
      // Calculate daily expenses with level scaling
      const baseRent = 100 + (state.level - 1) * 25; // Rent increases with level
      const tax = Math.floor(state.cash * 0.05); // 5% tax on current cash
      const utilities = 30 + (state.level - 1) * 10;
      const totalDailyExpenses = baseRent + tax + utilities;
      
      // Add automatic expense records
      const expenseRecords: FinancialRecord[] = [
        {
          id: `rent_${state.day}`,
          date: state.day,
          type: 'expense',
          category: 'rent',
          amount: baseRent,
          description: `Dükkan kirası (${state.level}. seviye)`
        },
        {
          id: `tax_${state.day}`,
          date: state.day,
          type: 'expense',
          category: 'tax',
          amount: tax,
          description: 'Günlük vergi'
        },
        {
          id: `utilities_${state.day}`,
          date: state.day,
          type: 'expense',
          category: 'utilities',
          amount: utilities,
          description: 'Elektrik ve su'
        }
      ];

      // Calculate current day's financial summary
      const currentDayRecords = [
        ...state.financialRecords.filter(r => r.date === state.day),
        ...expenseRecords
      ];
      
      const dayIncome = currentDayRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0);
      
      const dayExpenses = currentDayRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0);

      const dailyFinancial: DailyFinancials = {
        day: state.day,
        totalIncome: dayIncome,
        totalExpenses: dayExpenses,
        netProfit: dayIncome - dayExpenses,
        records: currentDayRecords
      };

      // Reset daily missions and generate new ones
      const newDailyMissions = generateDailyMissions(state.level);
      const keepWeeklyMissions = state.missions.filter(m => m.type === 'weekly' && !state.completedMissions.includes(m.id));
      const keepAchievementMissions = state.missions.filter(m => m.type === 'achievement' && !m.completed);
      const newAchievementMissions = generateAchievementMissions(state.level);
      
      // Merge achievement missions (keep existing + add new ones not already present)
      const allAchievements = [
        ...keepAchievementMissions,
        ...newAchievementMissions.filter(newMission => 
          !keepAchievementMissions.some(existing => existing.id === newMission.id)
        )
      ];
      
      // Reduce trend durations
      const updatedTrends = state.trends.map(t => ({ ...t, duration: t.duration - 1 })).filter(t => t.duration > 0);
      
      // Reduce event durations
      const updatedEvents = state.events.map(e => ({ ...e, duration: e.duration ? e.duration - 1 : 0 })).filter(e => e.duration && e.duration > 0);
      
      // Calculate new daily customer limit based on level
      const newDailyCustomerLimit = getDailyCustomerLimitByLevel(state.level);
      
      const newState = {
        day: state.day + 1,
        timeLeft: 0, // No timer
        customersServed: 0, // Reset customer counter
        dailyCustomerLimit: newDailyCustomerLimit,
        cash: state.cash - totalDailyExpenses,
        missions: [...newDailyMissions, ...keepWeeklyMissions, ...allAchievements],
        trends: updatedTrends,
        events: updatedEvents,
        financialRecords: [...state.financialRecords, ...expenseRecords],
        dailyFinancials: [...state.dailyFinancials, dailyFinancial],
        weeklyExpenses: {
          rent: baseRent,
          tax: tax,
          utilities: utilities
        },
        dailyStats: {
          itemsSold: 0,
          itemsBought: 0,
          cashEarned: 0,
          negotiationsWon: 0,
          fakeItemsDetected: 0
        }
      };
      
      // Auto-save after advancing day
      setTimeout(() => {
        const currentState = get();
        const gameState: GameState = {
          level: currentState.level,
          cash: currentState.cash,
          reputation: currentState.reputation,
          trust: currentState.trust,
          day: currentState.day,
          timeLeft: currentState.timeLeft,
          inventory: currentState.inventory,
          shopItems: currentState.shopItems,
          events: currentState.events,
          trends: currentState.trends,
          dailySuccessStreak: currentState.dailySuccessStreak,
          dailyExpenses: currentState.dailyExpenses,
          language: currentState.language,
          experience: currentState.experience,
          skillPoints: currentState.skillPoints,
          missions: currentState.missions,
          completedMissions: currentState.completedMissions,
          playerSkills: currentState.playerSkills,
          lastEventDay: currentState.lastEventDay,
          negotiationCount: currentState.negotiationCount,
          customersServed: currentState.customersServed,
          dailyCustomerLimit: currentState.dailyCustomerLimit,
          dailyStats: currentState.dailyStats,
          financialRecords: currentState.financialRecords,
          dailyFinancials: currentState.dailyFinancials,
          weeklyExpenses: currentState.weeklyExpenses,
          showEndOfDayModal: currentState.showEndOfDayModal,
          unlocks: currentState.unlocks,
          dayCustomerCount: currentState.dayCustomerCount,
          offerCount: currentState.offerCount,
          isLoadingNextCustomer: currentState.isLoadingNextCustomer,
          currentCustomer: currentState.currentCustomer,
          nextCustomer: currentState.nextCustomer,
          showLevelUpModal: currentState.showLevelUpModal
        };
        saveGame(gameState);
      }, 100);
      
      console.log('🎮 AdvanceDay completed - new day:', newState.day, 'customers served reset to:', newState.customersServed);
      return newState;
    });
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
        // Day ended - same logic as advanceDay
        const newDailyMissions = generateDailyMissions(state.level);
        const keepWeeklyMissions = state.missions.filter(m => m.type === 'weekly' && !state.completedMissions.includes(m.id));
        const keepAchievementMissions = state.missions.filter(m => m.type === 'achievement' && !m.completed);
        const newAchievementMissions = generateAchievementMissions(state.level);
        
        const allAchievements = [
          ...keepAchievementMissions,
          ...newAchievementMissions.filter(newMission => 
            !keepAchievementMissions.some(existing => existing.id === newMission.id)
          )
        ];
        
        const updatedTrends = state.trends.map(t => ({ ...t, duration: t.duration - 1 })).filter(t => t.duration > 0);
        const updatedEvents = state.events.map(e => ({ ...e, duration: e.duration ? e.duration - 1 : 0 })).filter(e => e.duration && e.duration > 0);
        
        // Calculate daily expenses for time-based day advance
        const baseRent = 100 + (state.level - 1) * 25;
        const tax = Math.floor(state.cash * 0.05);
        const utilities = 30 + (state.level - 1) * 10;
        const totalDailyExpenses = baseRent + tax + utilities;
        
        // Add automatic expense records
        const expenseRecords: FinancialRecord[] = [
          {
            id: `rent_${state.day}`,
            date: state.day,
            type: 'expense',
            category: 'rent',
            amount: baseRent,
            description: `Dükkan kirası (${state.level}. seviye)`
          },
          {
            id: `tax_${state.day}`,
            date: state.day,
            type: 'expense',
            category: 'tax',
            amount: tax,
            description: 'Günlük vergi'
          },
          {
            id: `utilities_${state.day}`,
            date: state.day,
            type: 'expense',
            category: 'utilities',
            amount: utilities,
            description: 'Elektrik ve su'
          }
        ];

        // Calculate current day's financial summary
        const currentDayRecords = [
          ...state.financialRecords.filter(r => r.date === state.day),
          ...expenseRecords
        ];
        
        const dayIncome = currentDayRecords
          .filter(r => r.type === 'income')
          .reduce((sum, r) => sum + r.amount, 0);
        
        const dayExpenses = currentDayRecords
          .filter(r => r.type === 'expense')
          .reduce((sum, r) => sum + r.amount, 0);

        const dailyFinancial: DailyFinancials = {
          day: state.day,
          totalIncome: dayIncome,
          totalExpenses: dayExpenses,
          netProfit: dayIncome - dayExpenses,
          records: currentDayRecords
        };

        // Calculate new daily customer limit based on level
        const newDailyCustomerLimit = getDailyCustomerLimitByLevel(state.level);
        
        return {
          timeLeft: 0, // No timer
          day: state.day + 1,
          customersServed: 0, // Reset customer counter
          dailyCustomerLimit: newDailyCustomerLimit,
          cash: state.cash - totalDailyExpenses,
          missions: [...newDailyMissions, ...keepWeeklyMissions, ...allAchievements],
          trends: updatedTrends,
          events: updatedEvents,
          financialRecords: [...state.financialRecords, ...expenseRecords],
          dailyFinancials: [...state.dailyFinancials, dailyFinancial],
          weeklyExpenses: {
            rent: baseRent,
            tax: tax,
            utilities: utilities
          },
          dailyStats: {
            itemsSold: 0,
            itemsBought: 0,
            cashEarned: 0,
            negotiationsWon: 0,
            fakeItemsDetected: 0
          }
        };
      }
      return { timeLeft: newTime };
    });
  },

  // New enhanced actions
  addExperience: (amount: number) => {
    set(state => {
      const newExperience = state.experience + amount;
      const oldProgress = calculateLevelProgress(state.experience);
      const newProgress = calculateLevelProgress(newExperience);
      
      const leveledUp = newProgress.currentLevel > oldProgress.currentLevel;
      
      // Emit sound events
      if (leveledUp) {
        soundEventEmitter.emit('levelUp');
        soundEventEmitter.emit('notification');
      }
      
      return {
        experience: newExperience,
        level: newProgress.currentLevel,
        skillPoints: state.skillPoints + (leveledUp ? newProgress.skillPoints - oldProgress.skillPoints : 0)
      };
    });
  },

  claimMissionReward: (missionId: string) => {
    set(state => {
      const mission = state.missions.find(m => m.id === missionId);
      if (!mission || !mission.completed || state.completedMissions.includes(missionId)) {
        return state;
      }

      let cashBonus = 0;
      let reputationBonus = 0;
      let experienceBonus = 0;

      mission.rewards.forEach(reward => {
        if (reward.type === 'cash') cashBonus += reward.amount || 0;
        if (reward.type === 'reputation') reputationBonus += reward.amount || 0;
        if (reward.type === 'experience') experienceBonus += reward.amount || 0;
      });

      const newExperience = state.experience + experienceBonus;
      const oldProgress = calculateLevelProgress(state.experience);
      const newProgress = calculateLevelProgress(newExperience);
      const leveledUp = newProgress.currentLevel > oldProgress.currentLevel;

      return {
        completedMissions: [...state.completedMissions, missionId],
        cash: state.cash + cashBonus,
        reputation: Math.min(100, state.reputation + reputationBonus),
        experience: newExperience,
        level: newProgress.currentLevel,
        skillPoints: state.skillPoints + (leveledUp ? newProgress.skillPoints - oldProgress.skillPoints : 0)
      };
    });
  },

  upgradeSkill: (skillId: string) => {
    set(state => {
      const currentLevel = state.playerSkills[skillId] || 0;
      const cost = 1; // Basic cost, could be dynamic
      
      if (state.skillPoints >= cost) {
        return {
          playerSkills: {
            ...state.playerSkills,
            [skillId]: currentLevel + 1
          },
          skillPoints: state.skillPoints - cost
        };
      }
      return state;
    });
  },

  processNegotiation: (success: boolean) => {
    set(state => {
      if (success) {
        const updatedMissions = updateMissionProgress(state.missions, 'negotiate_success', 1);
        return {
          missions: updatedMissions,
          negotiationCount: state.negotiationCount + 1,
          dailyStats: {
            ...state.dailyStats,
            negotiationsWon: state.dailyStats.negotiationsWon + 1
          }
        };
      }
      return { negotiationCount: state.negotiationCount + 1 };
    });
  },

  detectFakeItem: () => {
    set(state => {
      const updatedMissions = updateMissionProgress(state.missions, 'identify_fake', 1);
      return {
        missions: updatedMissions,
        dailyStats: {
          ...state.dailyStats,
          fakeItemsDetected: state.dailyStats.fakeItemsDetected + 1
        }
      };
    });
  },

  dismissEvent: (eventId: string) => {
    set(state => ({
      events: state.events.filter(e => e.id !== eventId)
    }));
  },

  triggerRandomEvent: () => {
    set(state => {
      if (state.day === state.lastEventDay) return state; // One event per day max
      
      const event = generateRandomEvent(state.day, state.level);
      if (!event) return state;
      
      // Maybe trigger a trend too
      const shouldAddTrend = Math.random() < 0.3;
      const newTrend = shouldAddTrend ? generateTrendBurst() : null;
      
      return {
        events: [...state.events, event],
        trends: newTrend ? [...state.trends, newTrend] : state.trends,
        lastEventDay: state.day
      };
    });
  },

  // Financial actions
  addFinancialRecord: (type: 'income' | 'expense', category: 'sales' | 'purchases' | 'rent' | 'tax' | 'fine' | 'utilities' | 'other', amount: number, description: string) => {
    set(state => {
      const newRecord: FinancialRecord = {
        id: `${category}_${Date.now()}_${Math.random()}`,
        date: state.day,
        type,
        category,
        amount,
        description
      };
      
      return {
        financialRecords: [...state.financialRecords, newRecord]
      };
    });
  },

  calculateDailyExpenses: () => {
    const { level, cash } = get();
    const baseRent = 100 + (level - 1) * 25;
    const tax = Math.floor(cash * 0.05);
    const utilities = 30 + (level - 1) * 10;
    return baseRent + tax + utilities;
  },

  serveCustomer: () => {
    set(state => {
      const newCustomersServed = state.customersServed + 1;
      
      // Check if day should end
      if (newCustomersServed >= state.dailyCustomerLimit) {
        // Show end of day modal instead of auto advancing
        return {
          customersServed: newCustomersServed,
          currentCustomer: null,
          showEndOfDayModal: true
        };
      }
      
      return {
        customersServed: newCustomersServed,
        currentCustomer: null
      };
    });
  },

  setShowEndOfDayModal: (show: boolean) => {
    set({ showEndOfDayModal: show });
  },

  getDailyCustomerLimit: () => {
    const { level } = get();
    return getDailyCustomerLimitByLevel(level);
  },

  // Save/Load implementations
  saveGameState: () => {
    const state = get();
    const gameState: GameState = {
      level: state.level,
      cash: state.cash,
      reputation: state.reputation,
      trust: state.trust,
      day: state.day,
      timeLeft: state.timeLeft,
      inventory: state.inventory,
      shopItems: state.shopItems,
      events: state.events,
      trends: state.trends,
      dailyExpenses: state.dailyExpenses,
      language: state.language,
      experience: state.experience,
      skillPoints: state.skillPoints,
      missions: state.missions,
      completedMissions: state.completedMissions,
      dailySuccessStreak: state.dailySuccessStreak,
      playerSkills: state.playerSkills,
      lastEventDay: state.lastEventDay,
      negotiationCount: state.negotiationCount,
      customersServed: state.customersServed,
      dailyCustomerLimit: state.dailyCustomerLimit,
      dailyStats: state.dailyStats,
      financialRecords: state.financialRecords,
      dailyFinancials: state.dailyFinancials,
      weeklyExpenses: state.weeklyExpenses,
      showEndOfDayModal: state.showEndOfDayModal,
      unlocks: state.unlocks,
      dayCustomerCount: state.dayCustomerCount,
      offerCount: state.offerCount,
      isLoadingNextCustomer: state.isLoadingNextCustomer,
      currentCustomer: state.currentCustomer,
      nextCustomer: state.nextCustomer,
      showLevelUpModal: state.showLevelUpModal
    };
    
    return saveGame(gameState);
  },

  loadGameState: () => {
    const savedState = loadGame();
    if (savedState) {
      set(savedState);
      return true;
    }
    return false;
  },

  hasSavedGame: () => {
    return hasSavedGame();
  },

  updateQuestSuccessStreak: (success: boolean) => {
    set((state) => ({
      dailySuccessStreak: success 
        ? Math.max(0, state.dailySuccessStreak + 1)
        : Math.min(0, state.dailySuccessStreak - 1)
    }));
  },

  regenerateQuestsIfNeeded: () => {
    const state = get();
    const playerState = {
      level: state.level,
      cash: state.cash,
      reputation: state.reputation,
      inventorySize: state.inventory.length,
      unlocks: ['cassette_record', 'walkman_electronics', 'watch', 'toy', 'comic', 'poster', 'camera', 'rarePool'],
      dailySuccessStreak: state.dailySuccessStreak
    };

    // Regenerate daily missions
    const newDailyMissions = generateDailyMissions(state.level, playerState);
    const newWeeklyMissions = generateWeeklyMissions(state.level, playerState);
    
    // Filter out non-daily/weekly missions and add new ones
    const updatedMissions = [
      ...state.missions.filter(m => m.type !== 'daily' && m.type !== 'weekly'),
      ...newDailyMissions,
      ...newWeeklyMissions
    ];

    set({ missions: updatedMissions });
  },

  // Level system actions
  startNewDay: () => {
    set(state => {
      const config = getLevelConfig(state.level);
      const newDayCustomerLimit = getRandomCustomerLimit(state.level);
      
      return {
        dayCustomerCount: 0,
        offerCount: 0,
        dailyCustomerLimit: newDayCustomerLimit,
        showEndOfDayModal: false,
        isLoadingNextCustomer: false,
        currentCustomer: null,
        nextCustomer: null
      };
    });
  },

  onCustomerFinished: () => {
    set(state => {
      const newDayCustomerCount = state.dayCustomerCount + 1;
      
      if (newDayCustomerCount >= state.dailyCustomerLimit) {
        get().endOfDay();
      }
      
      return {
        dayCustomerCount: newDayCustomerCount,
        offerCount: 0
      };
    });
  },

  endOfDay: () => {
    set(state => {
      // Show closing message briefly
      const closingMessage = getRandomDayClosingMessage(state.language);
      
      // Check for level up first
      setTimeout(() => {
        get().checkLevelUp();
      }, 2000);
      
      return {
        showEndOfDayModal: true
      };
    });
  },

  checkLevelUp: () => {
    set(state => {
      const canLevelUp = checkLevelUpConditions(state.cash, state.reputation, state.level);
      
      if (canLevelUp && state.level < 8) {
        const newLevel = state.level + 1;
        const newUnlocks = getNextLevelUnlocks(state.level);
        const skillPointsEarned = 1;
        
        // Update unlocks array
        const updatedUnlocks = [...new Set([...state.unlocks, ...newUnlocks])];
        
        return {
          level: newLevel,
          unlocks: updatedUnlocks,
          skillPoints: state.skillPoints + skillPointsEarned,
          showLevelUpModal: true,
          showEndOfDayModal: false
        };
      } else {
        // No level up, just start new day
        setTimeout(() => {
          get().startNewDay();
        }, 1000);
        
        return state;
      }
    });
  },

  prefetchNextCustomer: () => {
    set(state => {
      if (state.nextCustomer === null) {
        const newCustomer = generateCustomer();
        return { nextCustomer: newCustomer };
      }
      return state;
    });
  },

  showNextCustomer: () => {
    set(state => {
      if (state.isLoadingNextCustomer) return state;
      
      set({ isLoadingNextCustomer: true });
      
      // Simulate loading delay
      setTimeout(() => {
        const state = get();
        const customer = state.nextCustomer || generateCustomer();
        
        set({
          currentCustomer: customer,
          nextCustomer: null,
          offerCount: 0,
          isLoadingNextCustomer: false
        });
        
        // Prefetch next customer
        get().prefetchNextCustomer();
      }, Math.random() * 600 + 300); // 300-900ms delay
      
      return state;
    });
  },

  onDealResolved: () => {
    // Prefetch next customer and show after delay
    get().prefetchNextCustomer();
    
    setTimeout(() => {
      get().showNextCustomer();
    }, 1500);
  },

  incrementOfferCount: () => {
    set(state => {
      const newOfferCount = state.offerCount + 1;
      
      if (newOfferCount >= 3) {
        // Auto-reject after 3 offers
        setTimeout(() => {
          get().onCustomerFinished();
          get().onDealResolved();
        }, 2000);
      }
      
      return { offerCount: newOfferCount };
    });
  },

  setShowLevelUpModal: (show: boolean) => {
    set({ showLevelUpModal: show });
    
    if (!show) {
      // Start new day when level up modal is closed
      setTimeout(() => {
        get().startNewDay();
      }, 500);
    }
  },

  setCurrentCustomer: (customer: Customer | null) => {
    set({ currentCustomer: customer });
  },

  setIsLoadingNextCustomer: (loading: boolean) => {
    set({ isLoadingNextCustomer: loading });
  },

  // Auto-save with debouncing to prevent excessive saves
  autoSave: (() => {
    let timeoutId: NodeJS.Timeout | null = null;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const state = get();
        if (state.day > 1 || state.cash !== 1000) { // Only auto-save if game has been played
          state.saveGameState();
        }
      }, 1000); // Debounce for 1 second
    };
  })()
}));