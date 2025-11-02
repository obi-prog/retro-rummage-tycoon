import { Mission, MissionRequirement, MissionReward } from '@/types/missions';
import { LevelConfig } from '@/types/game';

// Level configurations with customer limits and unlock requirements
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, cashTarget: 1000, reputationTarget: 10, specialGoal: "Make your first sales", unlocks: ['cassette_record', 'walkman_electronics'], minCustomers: 3, maxCustomers: 5, baseProfit: 800, difficulty: { fakeChance: 0.1, customerPatience: 80, dailyExpenses: 50 } },
  { level: 2, cashTarget: 2500, reputationTarget: 25, specialGoal: "Discover more categories", unlocks: ['watch', 'toy'], minCustomers: 3, maxCustomers: 6, baseProfit: 1100, difficulty: { fakeChance: 0.15, customerPatience: 75, dailyExpenses: 75 } },
  { level: 3, cashTarget: 5000, reputationTarget: 50, specialGoal: "Improve bargaining mastery", unlocks: ['comic', 'poster'], minCustomers: 4, maxCustomers: 7, baseProfit: 1500, difficulty: { fakeChance: 0.2, customerPatience: 70, dailyExpenses: 100 } },
  { level: 4, cashTarget: 8000, reputationTarget: 80, specialGoal: "Discover rare items", unlocks: ['camera', 'rarePool'], minCustomers: 4, maxCustomers: 8, baseProfit: 2000, difficulty: { fakeChance: 0.25, customerPatience: 65, dailyExpenses: 125 } },
  { level: 5, cashTarget: 12000, reputationTarget: 120, specialGoal: "Reach expert level", unlocks: ['mystery_box', 'vipCustomers'], minCustomers: 5, maxCustomers: 9, baseProfit: 2700, difficulty: { fakeChance: 0.3, customerPatience: 60, dailyExpenses: 150 } }
];

interface PlayerState {
  level: number;
  cash: number;
  reputation: number;
  inventorySize: number;
  unlocks: string[];
  dailySuccessStreak: number;
}

interface QuestValidationResult {
  valid: boolean;
  adjustedTarget?: number;
  rerollReason?: string;
}

// Helper functions
export const getAvgCustomers = (level: number): number => {
  const config = LEVEL_CONFIGS.find(c => c.level === level) || LEVEL_CONFIGS[0];
  return Math.round((config.minCustomers + config.maxCustomers) / 2);
};

export const clamp = (x: number, lo: number, hi: number): number => {
  return Math.max(lo, Math.min(hi, x));
};

export const hasUnlock = (key: string, playerUnlocks: string[]): boolean => {
  return playerUnlocks.includes(key);
};

export const canUseCategory = (category: string, playerUnlocks: string[]): boolean => {
  return hasUnlock(category, playerUnlocks);
};

// Quest scaling rules
export const scaleQuestTarget = (
  questType: 'daily_sales' | 'daily_profit' | 'daily_category' | 'weekly_sales' | 'weekly_profit' | 'main_total_profit' | 'main_total_sales' | 'negotiation_master' | 'rare_collect',
  player: PlayerState,
  questData?: { category?: string }
): { target: number; valid: boolean; rerollReason?: string } => {
  const config = LEVEL_CONFIGS.find(c => c.level === player.level) || LEVEL_CONFIGS[0];
  const avgCustomers = getAvgCustomers(player.level);

  switch (questType) {
    case 'daily_sales': {
      // Rule 1: Daily Sales Quest
      const baseTarget = Math.ceil(avgCustomers * 0.7);
      const target = clamp(baseTarget, 3, avgCustomers);
      return { target, valid: true };
    }

    case 'daily_profit': {
      // Rule 2: Daily Profit Quest
      const mult = Math.pow(1.35, player.level - 1);
      const target = Math.round(config.baseProfit * mult);
      return { target, valid: true };
    }

    case 'daily_category': {
      // Rule 3: Daily Category Quest
      if (!questData?.category || !canUseCategory(questData.category, player.unlocks)) {
        return { target: 0, valid: false, rerollReason: `Category ${questData?.category} not unlocked` };
      }
      const target = player.level >= 4 ? 2 : 1;
      return { target, valid: true };
    }

    case 'weekly_sales': {
      // Rule 4: Weekly Sales Quest
      const target = clamp(avgCustomers * 4, avgCustomers * 3, avgCustomers * 5);
      return { target, valid: true };
    }

    case 'weekly_profit': {
      // Rule 5: Weekly Profit Quest
      const mult = Math.pow(1.2, player.level - 1);
      const target = Math.round(config.baseProfit * 4 * mult);
      return { target, valid: true };
    }

    case 'main_total_profit': {
      // Rule 6: Main Quest - Total Profit
      const mult = Math.pow(1.35, player.level - 1);
      const target = Math.round(config.baseProfit * 10 * mult);
      return { target, valid: true };
    }

    case 'main_total_sales': {
      // Rule 6: Main Quest - Total Sales (cumulative)
      const target = Math.round(avgCustomers * player.level * 5);
      return { target, valid: true };
    }

    case 'rare_collect': {
      // Rule 6: Rare Collection (only if rarePool unlocked)
      if (!hasUnlock('rarePool', player.unlocks)) {
        return { target: 0, valid: false, rerollReason: 'rarePool not unlocked' };
      }
      const target = Math.max(1, Math.floor(player.level / 2));
      return { target, valid: true };
    }

    case 'negotiation_master': {
      // Rule 6: Negotiation Master (scales with level)
      const target = Math.max(3, Math.round(avgCustomers * 0.8 * player.level));
      return { target, valid: true };
    }

    default:
      return { target: 1, valid: true };
  }
};

// Apply adaptive difficulty based on success streak
export const applyAdaptiveDifficulty = (baseTarget: number, questType: string, successStreak: number, level: number): number => {
  let adjustedTarget = baseTarget;
  
  // Increase difficulty for successful streaks
  if (successStreak >= 3) {
    adjustedTarget = Math.round(baseTarget * 1.1); // +10%
  }
  
  // Decrease difficulty for missed days (negative streak)
  if (successStreak <= -2) {
    adjustedTarget = Math.round(baseTarget * 0.9); // -10%
  }
  
  // Clamp to level constraints for daily quests
  if (questType.includes('daily_sales')) {
    const config = LEVEL_CONFIGS.find(c => c.level === level) || LEVEL_CONFIGS[0];
    adjustedTarget = clamp(adjustedTarget, 3, config.maxCustomers);
  }
  
  return adjustedTarget;
};

// Validate quest and auto-reroll if needed
export const validateQuest = (quest: Mission, player: PlayerState): QuestValidationResult => {
  const config = LEVEL_CONFIGS.find(c => c.level === player.level) || LEVEL_CONFIGS[0];
  
  // Check if quest target exceeds level constraints
  if (quest.type === 'daily' && quest.requirements[0]?.type === 'sell_items') {
    if (quest.requirements[0].target > config.maxCustomers) {
      return {
        valid: false,
        adjustedTarget: config.maxCustomers,
        rerollReason: `Daily sales target ${quest.requirements[0].target} exceeds max customers ${config.maxCustomers}`
      };
    }
  }
  
  // Check inventory constraints
  if (quest.requirements[0]?.type === 'buy_items') {
    if (quest.requirements[0].target > player.inventorySize) {
      return {
        valid: false,
        rerollReason: `Buy quest target ${quest.requirements[0].target} exceeds inventory size ${player.inventorySize}`
      };
    }
  }
  
  // Check minimum targets for daily quests
  if (quest.type === 'daily' && quest.requirements[0]?.target < 1) {
    return {
      valid: false,
      rerollReason: 'Daily quest target cannot be less than 1'
    };
  }
  
  return { valid: true };
};

// Generate adaptive quest templates
export const generateAdaptiveQuest = (
  questType: 'daily' | 'weekly' | 'main' | 'challenge',
  questTemplate: string,
  player: PlayerState
): Mission | null => {
  const questId = `${questType}_${questTemplate}_${Date.now()}`;
  
  // Quest template mappings
  const questTemplates = {
    // Daily templates
    daily_basic_sales: {
      scalingType: 'daily_sales' as const,
      title: 'Daily Sales',
      description: (target: number) => `Sell ${target} items`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'sell_items', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'cash', amount: 50 * level },
        { type: 'experience', amount: 25 }
      ]
    },
    daily_profit: {
      scalingType: 'daily_profit' as const,
      title: 'Daily Profit',
      description: (target: number) => `Earn $${target} profit`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'earn_cash', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'experience', amount: 30 },
        { type: 'reputation', amount: 1 }
      ]
    },
    daily_rare: {
      scalingType: 'daily_category' as const,
      title: 'Rare Collection',
      description: (target: number) => `Buy ${target} rare items`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'buy_items', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'experience', amount: 60 },
        { type: 'cash', amount: 200 }
      ],
      category: 'rarePool'
    },
    // Weekly templates
    weekly_sales: {
      scalingType: 'weekly_sales' as const,
      title: 'Weekly Sales Goal',
      description: (target: number) => `Sell ${target} items`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'sell_items', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'cash', amount: 500 * level },
        { type: 'experience', amount: 200 }
      ]
    },
    weekly_profit: {
      scalingType: 'weekly_profit' as const,
      title: 'Weekly Income',
      description: (target: number) => `Earn $${target}`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'earn_cash', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'experience', amount: 250 },
        { type: 'reputation', amount: 5 }
      ]
    },
    // Main quest templates
    main_total_profit: {
      scalingType: 'main_total_profit' as const,
      title: 'Big Profit',
      description: (target: number) => `Earn total $${target} profit`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'earn_cash', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'experience', amount: 500 },
        { type: 'cash', amount: 1000 }
      ]
    },
    negotiation_master: {
      scalingType: 'negotiation_master' as const,
      title: 'Negotiation Master',
      description: (target: number) => `Make ${target} successful negotiations`,
      requirements: (target: number): MissionRequirement[] => [{ type: 'negotiate_success', target, current: 0 }],
      rewards: (level: number): MissionReward[] => [
        { type: 'experience', amount: 300 },
        { type: 'reputation', amount: 10 }
      ]
    }
  };
  
  const template = questTemplates[questTemplate as keyof typeof questTemplates];
  if (!template) return null;
  
  // Scale the quest target
  const scalingResult = scaleQuestTarget(
    template.scalingType,
    player,
    { category: 'category' in template ? template.category : undefined }
  );
  
  if (!scalingResult.valid) {
    console.log(`Quest ${questTemplate} rerolled: ${scalingResult.rerollReason}`);
    return null; // Quest should be rerolled
  }
  
  // Apply adaptive difficulty
  const finalTarget = applyAdaptiveDifficulty(
    scalingResult.target,
    template.scalingType,
    player.dailySuccessStreak,
    player.level
  );
  
  // Create the quest
  const quest: Mission = {
    id: questId,
    title: template.title,
    description: template.description(finalTarget),
    type: questType,
    requirements: template.requirements(finalTarget),
    rewards: template.rewards(player.level),
    progress: 0,
    maxProgress: finalTarget,
    completed: false,
    level: player.level
  };
  
  // Final validation
  const validation = validateQuest(quest, player);
  if (!validation.valid) {
    if (validation.adjustedTarget) {
      // Auto-adjust if possible
      quest.requirements[0].target = validation.adjustedTarget;
      quest.maxProgress = validation.adjustedTarget;
      quest.description = template.description(validation.adjustedTarget);
    } else {
      console.log(`Quest ${questTemplate} failed validation: ${validation.rerollReason}`);
      return null;
    }
  }
  
  return quest;
};

// Auto-reroll invalid quest
export const rerollQuest = (questType: 'daily' | 'weekly' | 'main' | 'challenge', player: PlayerState): Mission | null => {
  const availableTemplates = {
    daily: ['daily_basic_sales', 'daily_profit', 'daily_rare'],
    weekly: ['weekly_sales', 'weekly_profit'],
    main: ['main_total_profit', 'negotiation_master'],
    challenge: ['negotiation_master', 'main_total_profit']
  };
  
  const templates = availableTemplates[questType];
  
  // Try each template until one is valid
  for (const template of templates) {
    const quest = generateAdaptiveQuest(questType, template, player);
    if (quest) return quest;
  }
  
  console.warn(`Could not generate valid ${questType} quest for player level ${player.level}`);
  return null;
};