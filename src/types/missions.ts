export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  requirements: MissionRequirement[];
  rewards: MissionReward[];
  progress: number;
  maxProgress: number;
  completed: boolean;
  level: number; // Minimum level required
}

export interface MissionRequirement {
  type: 'sell_items' | 'earn_cash' | 'reputation' | 'identify_fake' | 'buy_items' | 'negotiate_success';
  target: number;
  current: number;
}

export interface MissionReward {
  type: 'cash' | 'reputation' | 'experience' | 'item';
  amount?: number;
  itemId?: string;
}

export interface LevelProgress {
  currentLevel: number;
  experience: number;
  experienceToNext: number;
  skillPoints: number;
}

export interface GameSkill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number; // Skill points needed
  effects: string[];
}