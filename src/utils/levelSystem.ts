export interface LevelConfig {
  level: number;
  minCustomers: number;
  maxCustomers: number;
  targetCash: number;
  targetRep: number;
  unlocks: string[];
  bgColor: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    minCustomers: 3,
    maxCustomers: 5,
    targetCash: 2000,
    targetRep: 20,
    unlocks: [],
    bgColor: '#F5F7FA'
  },
  {
    level: 2,
    minCustomers: 4,
    maxCustomers: 6,
    targetCash: 5000,
    targetRep: 30,
    unlocks: ['verify'],
    bgColor: '#E8F7EE'
  },
  {
    level: 3,
    minCustomers: 5,
    maxCustomers: 7,
    targetCash: 9000,
    targetRep: 35,
    unlocks: ['repair'],
    bgColor: '#FFF3E6'
  },
  {
    level: 4,
    minCustomers: 6,
    maxCustomers: 8,
    targetCash: 15000,
    targetRep: 40,
    unlocks: ['newCats'],
    bgColor: '#EAF0FF'
  },
  {
    level: 5,
    minCustomers: 7,
    maxCustomers: 9,
    targetCash: 25000,
    targetRep: 45,
    unlocks: ['shelfExpand'],
    bgColor: '#F9E8FF'
  },
  {
    level: 6,
    minCustomers: 8,
    maxCustomers: 10,
    targetCash: 40000,
    targetRep: 50,
    unlocks: ['trendCal'],
    bgColor: '#EFFFF8'
  },
  {
    level: 7,
    minCustomers: 8,
    maxCustomers: 10,
    targetCash: 60000,
    targetRep: 55,
    unlocks: ['npcHelper'],
    bgColor: '#FFF0F3'
  },
  {
    level: 8,
    minCustomers: 9,
    maxCustomers: 11,
    targetCash: 85000,
    targetRep: 60,
    unlocks: ['advRepair'],
    bgColor: '#F0FFF2'
  }
];

export const getLevelConfig = (level: number): LevelConfig => {
  return LEVEL_CONFIGS.find(config => config.level === level) || LEVEL_CONFIGS[0];
};

export const getRandomCustomerLimit = (level: number): number => {
  const config = getLevelConfig(level);
  return Math.floor(Math.random() * (config.maxCustomers - config.minCustomers + 1)) + config.minCustomers;
};

export const checkLevelUpConditions = (cash: number, reputation: number, level: number): boolean => {
  const config = getLevelConfig(level);
  return cash >= config.targetCash && reputation >= config.targetRep;
};

export const getNextLevelUnlocks = (level: number): string[] => {
  const nextConfig = getLevelConfig(level + 1);
  return nextConfig ? nextConfig.unlocks : [];
};

// Day closing messages
export const DAY_CLOSING_MESSAGES = {
  tr: [
    "Gün sona eriyor, kasayı topla...",
    "Müşteriler gitti, dükkanı kapat...",
    "Günün yorgunluğu üzerimde...",
    "Başarılı bir gün geçti...",
    "Yarın yeni umutlarla...",
    "Kapıları kilitle, gün bitti...",
    "Sokaklar sessizleşiyor...",
    "Gün batıyor, işler bitiyor..."
  ],
  en: [
    "Day is ending, count the till...",
    "Customers gone, close the shop...",
    "Feeling the day's fatigue...",
    "Had a successful day...",
    "Tomorrow brings new hope...",
    "Lock the doors, day is done...",
    "Streets are getting quiet...",
    "Sun is setting, work is finished..."
  ],
  de: [
    "Der Tag geht zu Ende, die Kasse zählen...",
    "Kunden weg, den Laden schließen...",
    "Die Müdigkeit des Tages spüren...",
    "Hatte einen erfolgreichen Tag...",
    "Morgen bringt neue Hoffnung...",
    "Türen abschließen, Tag ist vorbei...",
    "Die Straßen werden ruhig...",
    "Sonne geht unter, Arbeit ist beendet..."
  ]
};

export const getRandomDayClosingMessage = (language: string = 'tr'): string => {
  const messages = DAY_CLOSING_MESSAGES[language as keyof typeof DAY_CLOSING_MESSAGES] || DAY_CLOSING_MESSAGES.tr;
  return messages[Math.floor(Math.random() * messages.length)];
};