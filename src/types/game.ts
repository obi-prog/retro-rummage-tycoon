export type Language = 'en' | 'de' | 'tr';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  baseValue: number;
  condition: number; // 0-100
  authenticity: 'authentic' | 'fake' | 'suspicious';
  rarity: 'common' | 'rare' | 'very_rare' | 'legendary';
  trendBonus: number; // percentage
  storyTag?: string;
  image: string;
}

export type ItemCategory = 
  | 'cassette_record' 
  | 'walkman_electronics' 
  | 'watch' 
  | 'toy' 
  | 'comic' 
  | 'poster' 
  | 'camera' 
  | 'mystery_box';

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  patience: number;
  budget: number;
  knowledge: number;
  preferences: ItemCategory[];
  avatar: string;
}

export type CustomerType = 
  | 'collector'
  | 'student' 
  | 'trader'
  | 'nostalgic'
  | 'hunter'
  | 'tourist'
  | 'expert';

export interface GameState {
  level: number;
  cash: number;
  reputation: number;
  trust: number;
  day: number;
  timeLeft: number; // seconds
  inventory: Item[];
  shopItems: Item[];
  currentCustomer: Customer | null;
  events: GameEvent[];
  trends: TrendData[];
  dailyExpenses: number;
  language: Language;
}

export interface GameEvent {
  id: string;
  type: 'police_check' | 'thief' | 'trend_burst' | 'weather' | 'rival' | 'celebrity';
  title: string;
  description: string;
  effect: any;
  duration?: number;
}

export interface TrendData {
  category: ItemCategory;
  bonus: number; // percentage
  duration: number; // days
}

export interface LevelConfig {
  level: number;
  cashTarget: number;
  reputationTarget: number;
  specialGoal: string;
  unlocks: string[];
  difficulty: {
    fakeChance: number;
    customerPatience: number;
    dailyExpenses: number;
  };
}

export interface Offer {
  price: number;
  item: Item;
  customerResponse: 'accept' | 'reject' | 'counter' | 'thinking';
}