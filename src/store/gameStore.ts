import { create } from 'zustand';
import { GameState, Item, Customer, ItemCategory, Language, DailyStats } from '@/types/game';
import { Mission } from '@/types/missions';
import { detectLanguage } from '@/utils/localization';
import { generateDailyMissions, generateWeeklyMissions, generateAchievementMissions, calculateLevelProgress, updateMissionProgress } from '@/utils/missionSystem';
import { generateRandomEvent, generateTrendBurst, processEventEffects } from '@/utils/eventSystem';

interface GameStore extends GameState {
  // Actions
  initGame: () => void;
  setLanguage: (lang: Language) => void;
  addCash: (amount: number) => void;
  spendCash: (amount: number) => boolean;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  sellItem: (item: Item, price: number) => void;
  buyItem: (item: Item, price: number) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  advanceDay: () => void;
  updateReputation: (amount: number) => void;
  updateTrust: (amount: number) => void;
  tickTime: () => void;
  // New enhanced actions
  addExperience: (amount: number) => void;
  claimMissionReward: (missionId: string) => void;
  upgradeSkill: (skillId: string) => void;
  processNegotiation: (success: boolean) => void;
  detectFakeItem: () => void;
  dismissEvent: (eventId: string) => void;
  triggerRandomEvent: () => void;
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
      name: 'Klasik Rock Albümü',
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
  timeLeft: 180, // 3 minutes
  inventory: generateStartingItems(),
  shopItems: [],
  currentCustomer: null,
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
  dailyStats: {
    itemsSold: 0,
    itemsBought: 0,
    cashEarned: 0,
    negotiationsWon: 0,
    fakeItemsDetected: 0
  },

  // Actions
  initGame: () => {
    const initialMissions = [
      ...generateDailyMissions(1),
      ...generateWeeklyMissions(1),
      ...generateAchievementMissions(1)
    ];
    set({
      level: 1,
      cash: 500,
      reputation: 10,
      trust: 50,
      day: 1,
      timeLeft: 180, // 3 minutes
      inventory: generateStartingItems(),
      shopItems: [],
      currentCustomer: null,
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
      dailyStats: {
        itemsSold: 0,
        itemsBought: 0,
        cashEarned: 0,
        negotiationsWon: 0,
        fakeItemsDetected: 0
      },
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
      
      return {
        inventory: state.inventory.filter(i => i.id !== item.id),
        cash: state.cash + price,
        reputation: state.reputation + 1,
        missions: earnedMissions,
        dailyStats: {
          ...state.dailyStats,
          itemsSold: state.dailyStats.itemsSold + 1,
          cashEarned: state.dailyStats.cashEarned + price
        }
      };
    });
  },

  buyItem: (item: Item, price: number) => {
    const { cash } = get();
    if (cash >= price) {
      set(state => {
        const updatedMissions = updateMissionProgress(state.missions, 'buy_items', 1);
        
        return {
          inventory: [...state.inventory, item],
          cash: state.cash - price,
          reputation: state.reputation + 1,
          missions: updatedMissions,
          dailyStats: {
            ...state.dailyStats,
            itemsBought: state.dailyStats.itemsBought + 1
          }
        };
      });
      return true;
    }
    return false;
  },

  setCurrentCustomer: (customer: Customer | null) => {
    set({ currentCustomer: customer });
  },

  advanceDay: () => {
    set(state => {
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
      
      return {
        day: state.day + 1,
        timeLeft: 180 + (state.level * 15), // 3 minutes + bonus time per level
        cash: state.cash - state.dailyExpenses,
        missions: [...newDailyMissions, ...keepWeeklyMissions, ...allAchievements],
        trends: updatedTrends,
        events: updatedEvents,
        dailyStats: {
          itemsSold: 0,
          itemsBought: 0,
          cashEarned: 0,
          negotiationsWon: 0,
          fakeItemsDetected: 0
        }
      };
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
        
        return {
          timeLeft: 180 + (state.level * 15), // 3 minutes + bonus time per level
          day: state.day + 1,
          cash: state.cash - state.dailyExpenses,
          missions: [...newDailyMissions, ...keepWeeklyMissions, ...allAchievements],
          trends: updatedTrends,
          events: updatedEvents,
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
  }
}));