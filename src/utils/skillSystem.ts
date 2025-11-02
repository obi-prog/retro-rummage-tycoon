export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  currentLevel: number;
  maxLevel: number;
  costPerLevel: number;
  unlockLevel: number;
  icon: string;
  effects: string[];
}

export type SkillCategory = 
  | 'negotiation' 
  | 'market_insight' 
  | 'inventory_logistics' 
  | 'speed_flow' 
  | 'prestige_luck';

export interface SkillCategoryInfo {
  id: SkillCategory;
  name: string;
  description: string;
  icon: string;
}

export const skillCategories: SkillCategoryInfo[] = [
  {
    id: 'negotiation',
    name: 'Negotiation',
    description: 'Make better deals with customers',
    icon: '🤝'
  },
  {
    id: 'market_insight',
    name: 'Analysis & Knowledge', 
    description: 'Better understand market values',
    icon: '📊'
  },
  {
    id: 'inventory_logistics',
    name: 'Inventory & Logistics',
    description: 'Optimize warehouse management',
    icon: '📦'
  },
  {
    id: 'speed_flow',
    name: 'Speed & Workflow',
    description: 'Work faster and more efficiently',
    icon: '⚡'
  },
  {
    id: 'prestige_luck',
    name: 'Prestige & Luck',
    description: 'Increase your reputation and luck',
    icon: '⭐'
  }
];

export const allSkills: Skill[] = [
  // Negotiation Skills
  {
    id: 'sharp_negotiator',
    name: 'Sharp Negotiator',
    description: 'Customer makes more advantageous first offers.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '🎯',
    effects: ['First offer 10% better (per level)']
  },
  {
    id: 'sweet_talker',
    name: 'Sweet Talker',
    description: 'Customer gives more counter-offers.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '😊',
    effects: ['Counter-offer chance +15% (per level)']
  },
  {
    id: 'cool_headed',
    name: 'Cool-Headed',
    description: 'Reputation loss from rejected deals is reduced.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 3,
    icon: '🧊',
    effects: ['Reputation loss reduced by 20% (per level)']
  },

  // Analysis & Knowledge (Market Insight) Skills
  {
    id: 'market_master',
    name: 'Market Master',
    description: 'Estimated market value accuracy increases.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '💰',
    effects: ['Value estimation +10% accuracy (per level)']
  },
  {
    id: 'collection_knowledge',
    name: 'Collection Knowledge',
    description: 'Better reveals the true value of rare items.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '🔍',
    effects: ['Rare item value precision +25% (per level)']
  },
  {
    id: 'risk_analysis',
    name: 'Risk Analysis',
    description: 'Risk of price drop after purchase is reduced.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '⚠️',
    effects: ['Price drop risk reduced by 15% (per level)']
  },

  // Inventory & Logistics Skills
  {
    id: 'warehouse_expansion',
    name: 'Warehouse Expansion',
    description: 'Adds slots to inventory capacity.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '📦',
    effects: ['Inventory capacity +1 slot (per level)']
  },
  {
    id: 'quick_organization',
    name: 'Quick Organization',
    description: 'Processing times in item list are shortened.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '📋',
    effects: ['Processing time reduced by 20% (per level)']
  },
  {
    id: 'insured_storage',
    name: 'Insured Storage',
    description: 'Item depreciation chance is reduced.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '🛡️',
    effects: ['Depreciation chance reduced by 10% (per level)']
  },

  // Speed & Workflow Skills
  {
    id: 'fast_buyer',
    name: 'Fast Buyer',
    description: 'New customer arrival time is shortened.',
    category: 'speed_flow',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '🏃',
    effects: ['Customer arrival time reduced by 10% (per level)']
  },
  {
    id: 'busy_market',
    name: 'Busy Market',
    description: 'Daily customer count increases.',
    category: 'speed_flow',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '👥',
    effects: ['Daily customer count +1 (per level)']
  },

  // Prestige & Luck Skills
  {
    id: 'charismatic',
    name: 'Charismatic',
    description: 'Reputation gain happens faster.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 3,
    icon: '✨',
    effects: ['Reputation gain 25% faster (per level)']
  },
  {
    id: 'lucky_day',
    name: 'Lucky Day',
    description: 'Chance of rare items appearing increases.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 2,
    unlockLevel: 4,
    icon: '🍀',
    effects: ['Rare item chance +2% (per level)']
  },
  {
    id: 'vip_connections',
    name: 'VIP Connections',
    description: 'Chance of VIP customers arriving increases.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 5,
    icon: '👑',
    effects: ['VIP customer chance +10% (per level)']
  }
];

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return allSkills.filter(skill => skill.category === category);
};

export const getAvailableSkills = (playerLevel: number): Skill[] => {
  return allSkills.filter(skill => playerLevel >= skill.unlockLevel);
};

export const getSkillById = (skillId: string): Skill | undefined => {
  return allSkills.find(skill => skill.id === skillId);
};

export const calculateSkillUpgradeCost = (skill: Skill): number => {
  return skill.costPerLevel * (skill.currentLevel + 1);
};

export const canUpgradeSkill = (skill: Skill, skillPoints: number): boolean => {
  return skill.currentLevel < skill.maxLevel && 
         skillPoints >= calculateSkillUpgradeCost(skill);
};

export const isSkillMaxLevel = (skill: Skill): boolean => {
  return skill.currentLevel >= skill.maxLevel;
};