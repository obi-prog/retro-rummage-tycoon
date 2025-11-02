import { Mission, MissionRequirement } from '@/types/missions';
import { generateAdaptiveQuest, rerollQuest, LEVEL_CONFIGS } from '@/utils/adaptiveQuests';

export const generateDailyMissions = (level: number, playerState?: any): Mission[] => {
  const dailyMissions: Mission[] = [];
  
  // Create default player state if not provided
  const defaultPlayerState = {
    level,
    cash: 10000,
    reputation: 10,
    inventorySize: 10,
    unlocks: ['cassette_record', 'walkman_electronics', 'watch', 'toy', 'comic', 'poster', 'camera'],
    dailySuccessStreak: 0
  };
  
  const player = playerState || defaultPlayerState;
  
  // Generate adaptive quests based on level
  const questTemplates = ['daily_basic_sales', 'daily_profit'];
  
  // Add rare item quest for level 4+
  if (level >= 4) {
    questTemplates.push('daily_rare');
  }
  
  // Generate quests
  for (const template of questTemplates) {
    const quest = generateAdaptiveQuest('daily', template, player);
    if (quest) {
      dailyMissions.push(quest);
    } else {
      // Try to reroll
      const rerolledQuest = rerollQuest('daily', player);
      if (rerolledQuest) {
        dailyMissions.push(rerolledQuest);
      }
    }
  }
  
  // Fallback: Generate at least one mission
  if (dailyMissions.length === 0) {
    dailyMissions.push(
      {
        id: 'daily_sales_fallback',
        title: 'Daily Sales',
        description: `Sell 3 items`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 3, current: 0 }],
        rewards: [{ type: 'cash', amount: 50 * level }, { type: 'experience', amount: 25 }],
        progress: 0,
        maxProgress: 3,
        completed: false,
        level
      },
      {
        id: 'daily_cash_basic',
        title: 'Earn Money',
        description: `Earn $${100 * level}`,
        type: 'daily' as const,
        requirements: [{ type: 'earn_cash' as const, target: 100 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 30 }, { type: 'reputation', amount: 1 }],
        progress: 0,
        maxProgress: 100 * level,
        completed: false,
        level: 1
      },
      {
        id: 'daily_buy_basic',
        title: 'Shopping',
        description: `Buy ${level + 1} items`,
        type: 'daily' as const,
        requirements: [{ type: 'buy_items' as const, target: level + 1, current: 0 }],
        rewards: [{ type: 'experience', amount: 20 }, { type: 'cash', amount: 30 }],
        progress: 0,
        maxProgress: level + 1,
        completed: false,
        level: 1
      }
    );
  }
  
  // Level 4-6: Intermediate missions (4 daily missions)
  if (level >= 4 && level <= 6) {
    dailyMissions.push(
      {
        id: 'daily_sales_intermediate',
        title: 'Sales Expert',
        description: `Sell ${3 + level} items`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 3 + level, current: 0 }],
        rewards: [{ type: 'cash', amount: 75 * level }, { type: 'experience', amount: 40 }],
        progress: 0,
        maxProgress: 3 + level,
        completed: false,
        level: 4
      },
      {
        id: 'daily_negotiate',
        title: 'Bargaining Master',
        description: 'Make 3 successful negotiations',
        type: 'daily' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 3, current: 0 }],
        rewards: [{ type: 'experience', amount: 50 }, { type: 'reputation', amount: 2 }],
        progress: 0,
        maxProgress: 3,
        completed: false,
        level: 4
      },
      {
        id: 'daily_fake_detector',
        title: 'Fake Detective',
        description: 'Identify 2 fake items',
        type: 'daily' as const,
        requirements: [{ type: 'identify_fake' as const, target: 2, current: 0 }],
        rewards: [{ type: 'experience', amount: 60 }, { type: 'cash', amount: 200 }],
        progress: 0,
        maxProgress: 2,
        completed: false,
        level: 4
      },
      {
        id: 'daily_reputation_gain',
        title: 'Reputation Gain',
        description: 'Gain 2 reputation points',
        type: 'daily' as const,
        requirements: [{ type: 'reputation' as const, target: 2, current: 0 }],
        rewards: [{ type: 'experience', amount: 45 }, { type: 'cash', amount: 150 }],
        progress: 0,
        maxProgress: 2,
        completed: false,
        level: 4
      }
    );
  }
  
  // Level 7+: Advanced missions (5 daily missions)
  if (level >= 7) {
    dailyMissions.push(
      {
        id: 'daily_sales_expert',
        title: 'Sales Expertise',
        description: `Sell ${5 + Math.floor(level/2)} items`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 5 + Math.floor(level/2), current: 0 }],
        rewards: [{ type: 'cash', amount: 100 * level }, { type: 'experience', amount: 60 }],
        progress: 0,
        maxProgress: 5 + Math.floor(level/2),
        completed: false,
        level: 7
      },
      {
        id: 'daily_big_earner',
        title: 'Big Earnings',
        description: `Earn $${500 * level}`,
        type: 'daily' as const,
        requirements: [{ type: 'earn_cash' as const, target: 500 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 80 }, { type: 'reputation', amount: 3 }],
        progress: 0,
        maxProgress: 500 * level,
        completed: false,
        level: 7
      },
      {
        id: 'daily_reputation_builder',
        title: 'Reputation Building',
        description: 'Gain 5 reputation points',
        type: 'daily' as const,
        requirements: [{ type: 'reputation' as const, target: 5, current: 0 }],
        rewards: [{ type: 'experience', amount: 100 }, { type: 'cash', amount: 300 }],
        progress: 0,
        maxProgress: 5,
        completed: false,
        level: 7
      },
      {
        id: 'daily_master_negotiator',
        title: 'Master Negotiator',
        description: 'Make 6 successful negotiations',
        type: 'daily' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 6, current: 0 }],
        rewards: [{ type: 'experience', amount: 90 }, { type: 'reputation', amount: 4 }],
        progress: 0,
        maxProgress: 6,
        completed: false,
        level: 7
      },
      {
        id: 'daily_smart_buyer',
        title: 'Smart Buyer',
        description: `Buy ${3 + Math.floor(level/3)} items`,
        type: 'daily' as const,
        requirements: [{ type: 'buy_items' as const, target: 3 + Math.floor(level/3), current: 0 }],
        rewards: [{ type: 'experience', amount: 70 }, { type: 'cash', amount: 250 }],
        progress: 0,
        maxProgress: 3 + Math.floor(level/3),
        completed: false,
        level: 7
      }
    );
  }
  
  // Return all available daily missions for the level
  return dailyMissions;
};

export const generateWeeklyMissions = (level: number, playerState?: any): Mission[] => {
  const weeklyMissions: Mission[] = [];
  
  // Create default player state if not provided
  const defaultPlayerState = {
    level,
    cash: 10000,
    reputation: 10,
    inventorySize: 10,
    unlocks: ['cassette_record', 'walkman_electronics', 'watch', 'toy', 'comic', 'poster', 'camera'],
    dailySuccessStreak: 0
  };
  
  const player = playerState || defaultPlayerState;
  
  // Generate adaptive weekly quests
  const questTemplates = ['weekly_sales', 'weekly_profit'];
  
  // Generate quests
  for (const template of questTemplates) {
    const quest = generateAdaptiveQuest('weekly', template, player);
    if (quest) {
      weeklyMissions.push(quest);
    } else {
      // Try to reroll
      const rerolledQuest = rerollQuest('weekly', player);
      if (rerolledQuest) {
        weeklyMissions.push(rerolledQuest);
      }
    }
  }
  
  // Fallback: Generate at least one mission
  if (weeklyMissions.length === 0) {
    weeklyMissions.push(
      {
        id: 'weekly_sales_fallback',
        title: 'Weekly Sales Goal',
        description: 'Sell 15 items',
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 15, current: 0 }],
        rewards: [{ type: 'cash', amount: 500 }, { type: 'experience', amount: 200 }],
        progress: 0,
        maxProgress: 15,
        completed: false,
        level
      },
      {
        id: 'weekly_cash_beginner',
        title: 'Weekly Income',
        description: 'Earn $1000',
        type: 'weekly' as const,
        requirements: [{ type: 'earn_cash' as const, target: 1000, current: 0 }],
        rewards: [{ type: 'experience', amount: 250 }, { type: 'reputation', amount: 5 }],
        progress: 0,
        maxProgress: 1000,
        completed: false,
        level: 1
      }
    );
  }
  
  // Level 3-5: Intermediate weekly missions
  if (level >= 3 && level <= 5) {
    weeklyMissions.push(
      {
        id: 'weekly_sales_intermediate',
        title: 'Sales Professional',
        description: `Sell ${20 + (level * 5)} items`,
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 20 + (level * 5), current: 0 }],
        rewards: [{ type: 'cash', amount: 750 * level }, { type: 'experience', amount: 300 }],
        progress: 0,
        maxProgress: 20 + (level * 5),
        completed: false,
        level: 3
      },
      {
        id: 'weekly_negotiator',
        title: 'Bargaining Champion',
        description: 'Make 20 successful negotiations',
        type: 'weekly' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 20, current: 0 }],
        rewards: [{ type: 'experience', amount: 400 }, { type: 'reputation', amount: 8 }],
        progress: 0,
        maxProgress: 20,
        completed: false,
        level: 3
      },
      {
        id: 'weekly_buyer',
        title: 'Buyer Expert',
        description: 'Buy 10 items',
        type: 'weekly' as const,
        requirements: [{ type: 'buy_items' as const, target: 10, current: 0 }],
        rewards: [{ type: 'experience', amount: 300 }, { type: 'cash', amount: 400 }],
        progress: 0,
        maxProgress: 10,
        completed: false,
        level: 3
      }
    );
  }
  
  // Level 6+: Advanced weekly missions
  if (level >= 6) {
    weeklyMissions.push(
      {
        id: 'weekly_master_trader',
        title: 'Master Trader',
        description: `Sell ${30 + (level * 3)} items`,
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 30 + (level * 3), current: 0 }],
        rewards: [{ type: 'cash', amount: 1000 * level }, { type: 'experience', amount: 500 }],
        progress: 0,
        maxProgress: 30 + (level * 3),
        completed: false,
        level: 6
      },
      {
        id: 'weekly_big_money',
        title: 'Big Money',
        description: `Earn $${3000 * level}`,
        type: 'weekly' as const,
        requirements: [{ type: 'earn_cash' as const, target: 3000 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 600 }, { type: 'reputation', amount: 12 }],
        progress: 0,
        maxProgress: 3000 * level,
        completed: false,
        level: 6
      },
      {
        id: 'weekly_fake_hunter',
        title: 'Fake Hunter',
        description: 'Identify 8 fake items',
        type: 'weekly' as const,
        requirements: [{ type: 'identify_fake' as const, target: 8, current: 0 }],
        rewards: [{ type: 'experience', amount: 700 }, { type: 'cash', amount: 1500 }],
        progress: 0,
        maxProgress: 8,
        completed: false,
        level: 6
      },
      {
        id: 'weekly_reputation_master',
        title: 'Reputation Master',
        description: 'Gain 25 reputation points',
        type: 'weekly' as const,
        requirements: [{ type: 'reputation' as const, target: 25, current: 0 }],
        rewards: [{ type: 'experience', amount: 800 }, { type: 'cash', amount: 2000 }],
        progress: 0,
        maxProgress: 25,
        completed: false,
        level: 6
      }
    );
  }
  
  // Return all weekly missions for the level
  return weeklyMissions;
};

export const generateAchievementMissions = (level: number): Mission[] => {
  const achievements: Mission[] = [];
  
  // Level-based achievement missions that stay available until completed
  if (level >= 1) {
    achievements.push(
      {
        id: 'achievement_first_sale',
        title: 'First Sale',
        description: 'Sell your first item',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 1, current: 0 }],
        rewards: [{ type: 'experience', amount: 50 }, { type: 'cash', amount: 100 }],
        progress: 0,
        maxProgress: 1,
        completed: false,
        level: 1
      },
      {
        id: 'achievement_money_maker',
        title: 'Money Maker',
        description: 'Earn total $1000',
        type: 'achievement' as const,
        requirements: [{ type: 'earn_cash' as const, target: 1000, current: 0 }],
        rewards: [{ type: 'experience', amount: 100 }, { type: 'reputation', amount: 5 }],
        progress: 0,
        maxProgress: 1000,
        completed: false,
        level: 1
      }
    );
  }
  
  if (level >= 2) {
    achievements.push(
      {
        id: 'achievement_sales_specialist',
        title: 'Sales Specialist',
        description: 'Sell total 25 items',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 25, current: 0 }],
        rewards: [{ type: 'experience', amount: 150 }, { type: 'cash', amount: 300 }],
        progress: 0,
        maxProgress: 25,
        completed: false,
        level: 2
      },
      {
        id: 'achievement_negotiation_pro',
        title: 'Negotiation Professional',
        description: 'Make total 15 successful negotiations',
        type: 'achievement' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 15, current: 0 }],
        rewards: [{ type: 'experience', amount: 200 }, { type: 'reputation', amount: 8 }],
        progress: 0,
        maxProgress: 15,
        completed: false,
        level: 2
      }
    );
  }
  
  if (level >= 3) {
    achievements.push(
      {
        id: 'achievement_fake_detector',
        title: 'Fake Detective',
        description: 'Identify total 10 fake items',
        type: 'achievement' as const,
        requirements: [{ type: 'identify_fake' as const, target: 10, current: 0 }],
        rewards: [{ type: 'experience', amount: 250 }, { type: 'cash', amount: 500 }],
        progress: 0,
        maxProgress: 10,
        completed: false,
        level: 3
      },
      {
        id: 'achievement_reputation_builder',
        title: 'Reputation Builder',
        description: 'Gain total 50 reputation points',
        type: 'achievement' as const,
        requirements: [{ type: 'reputation' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 300 }, { type: 'cash', amount: 750 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 3
      }
    );
  }
  
  if (level >= 4) {
    achievements.push(
      {
        id: 'achievement_big_spender',
        title: 'Big Spender',
        description: 'Buy total 50 items',
        type: 'achievement' as const,
        requirements: [{ type: 'buy_items' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 350 }, { type: 'reputation', amount: 10 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 4
      },
      {
        id: 'achievement_millionaire',
        title: 'Millionaire',
        description: 'Earn total $10000',
        type: 'achievement' as const,
        requirements: [{ type: 'earn_cash' as const, target: 10000, current: 0 }],
        rewards: [{ type: 'experience', amount: 500 }, { type: 'cash', amount: 2000 }],
        progress: 0,
        maxProgress: 10000,
        completed: false,
        level: 4
      }
    );
  }
  
  if (level >= 5) {
    achievements.push(
      {
        id: 'achievement_sales_master',
        title: 'Sales Master',
        description: 'Sell total 100 items',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 100, current: 0 }],
        rewards: [{ type: 'experience', amount: 600 }, { type: 'reputation', amount: 15 }],
        progress: 0,
        maxProgress: 100,
        completed: false,
        level: 5
      },
      {
        id: 'achievement_negotiation_legend',
        title: 'Negotiation Legend',
        description: 'Make total 50 successful negotiations',
        type: 'achievement' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 700 }, { type: 'cash', amount: 1500 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 5
      }
    );
  }
  
  return achievements.filter(achievement => !achievement.completed);
};

export const calculateLevelProgress = (experience: number) => {
  const currentLevel = Math.floor(experience / 100) + 1;
  return {
    currentLevel,
    experience,
    experienceToNext: (currentLevel * 100) - experience,
    skillPoints: Math.floor(currentLevel / 2)
  };
};

export const getAvailableSkills = () => {
  return [
    {
      id: 'negotiation_master',
      name: 'Negotiation Master',
      description: 'Increases negotiation success rate',
      level: 0,
      maxLevel: 5,
      cost: 1,
      effects: ['Negotiation success rate +15% (per level)']
    },
    {
      id: 'fake_detector',
      name: 'Fake Detective',
      description: 'Ability to identify fake items',
      level: 0,
      maxLevel: 5,
      cost: 2,
      effects: ['Fake item detection rate +20% (per level)']
    },
    {
      id: 'value_assessor',
      name: 'Value Expert',
      description: 'Better estimation of item values',
      level: 0,
      maxLevel: 3,
      cost: 2,
      effects: ['Item value estimation +10% accuracy (per level)']
    },
    {
      id: 'customer_psychology',
      name: 'Customer Psychology',
      description: 'Understanding customer behavior',
      level: 0,
      maxLevel: 4,
      cost: 3,
      effects: ['Customer patience +20 seconds (per level)', 'Customer budget 5% visible']
    },
    {
      id: 'trend_spotter',
      name: 'Trend Hunter',
      description: 'Early detection of trending items',
      level: 0,
      maxLevel: 3,
      cost: 2,
      effects: ['25% bonus price at trend start (per level)']
    },
    {
      id: 'reputation_builder',
      name: 'Reputation Builder',
      description: 'Increases reputation gain',
      level: 0,
      maxLevel: 4,
      cost: 1,
      effects: ['+1 bonus reputation per transaction (per level)']
    },
    {
      id: 'cash_flow_master',
      name: 'Cash Flow Master',
      description: 'Reduces daily expenses',
      level: 0,
      maxLevel: 3,
      cost: 3,
      effects: ['Daily expenses reduced by 15% (per level)']
    },
    {
      id: 'inventory_manager',
      name: 'Inventory Manager',
      description: 'Increased item carrying capacity',
      level: 0,
      maxLevel: 5,
      cost: 2,
      effects: ['Inventory capacity +3 slots (per level)']
    }
  ];
};

export const updateMissionProgress = (missions: Mission[], type: string, amount: number = 1): Mission[] => {
  return missions.map(mission => {
    const requirement = mission.requirements.find(req => req.type === type);
    if (requirement && !mission.completed) {
      const newCurrent = Math.min(requirement.current + amount, requirement.target);
      return {
        ...mission,
        requirements: mission.requirements.map(req =>
          req.type === type ? { ...req, current: newCurrent } : req
        ),
        progress: newCurrent,
        completed: newCurrent >= requirement.target
      };
    }
    return mission;
  });
};