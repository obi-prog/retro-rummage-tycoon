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
  purchasePrice?: number; // What you paid for this item
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
  intent: 'buy' | 'sell'; // Customer wants to buy from you or sell to you
  carriedItem?: Item; // Item they want to sell (if intent is 'sell')
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
  // New enhanced features
  experience: number;
  skillPoints: number;
  missions: any[];
  completedMissions: string[];
  playerSkills: Record<string, number>;
  lastEventDay: number;
  negotiationCount: number;
  // Customer counting system
  customersServed: number;
  dailyCustomerLimit: number;
  dailyStats: DailyStats;
  // Financial tracking
  financialRecords: FinancialRecord[];
  dailyFinancials: DailyFinancials[];
  weeklyExpenses: {
    rent: number;
    tax: number;
    utilities: number;
  };
}


export interface FinancialRecord {
  id: string;
  date: number; // day number
  type: 'income' | 'expense';
  category: 'sales' | 'purchases' | 'rent' | 'tax' | 'fine' | 'utilities' | 'other';
  amount: number;
  description: string;
}

export interface DailyFinancials {
  day: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  records: FinancialRecord[];
}

export interface DailyStats {
  itemsSold: number;
  itemsBought: number;
  cashEarned: number;
  negotiationsWon: number;
  fakeItemsDetected: number;
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