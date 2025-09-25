import { t } from './localization';

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
    name: 'Pazarlık',
    description: 'Müşterilerle daha iyi anlaşmalar yap',
    icon: '🤝'
  },
  {
    id: 'market_insight',
    name: 'Analiz & Bilgi', 
    description: 'Piyasa değerlerini daha iyi anla',
    icon: '📊'
  },
  {
    id: 'inventory_logistics',
    name: 'Envanter & Lojistik',
    description: 'Depo yönetimini optimize et',
    icon: '📦'
  },
  {
    id: 'speed_flow',
    name: 'Hız & İş Akışı',
    description: 'Daha hızlı ve verimli çalış',
    icon: '⚡'
  },
  {
    id: 'prestige_luck',
    name: 'Prestij & Şans',
    description: 'İtibar ve şansını artır',
    icon: '⭐'
  }
];

export const allSkills: Skill[] = [
  // Pazarlık (Negotiation) Skills
  {
    id: 'sharp_negotiator',
    name: 'Keskin Pazarlıkçı',
    description: 'Müşteri ilk teklifi daha avantajlı yapar.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '🎯',
    effects: ['İlk teklif %10 daha iyi (seviye başına)']
  },
  {
    id: 'sweet_talker',
    name: 'Tatlı Dil',
    description: 'Müşteri daha fazla karşı teklif verir.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '😊',
    effects: ['Karşı teklif şansı +15% (seviye başına)']
  },
  {
    id: 'cool_headed',
    name: 'Soğukkanlı',
    description: 'Reddedilen tekliflerde itibar kaybı azalır.',
    category: 'negotiation',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 3,
    icon: '🧊',
    effects: ['İtibar kaybı %20 azalır (seviye başına)']
  },

  // Analiz & Bilgi (Market Insight) Skills
  {
    id: 'market_master',
    name: 'Piyasa Ustası',
    description: 'Tahmini piyasa değeri doğruluğu artar.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '💰',
    effects: ['Değer tahmini +10% doğruluk (seviye başına)']
  },
  {
    id: 'collection_knowledge',
    name: 'Koleksiyon Bilgisi',
    description: 'Nadir ürünlerin gerçek değerini daha iyi gösterir.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '🔍',
    effects: ['Nadir ürün değer hassasiyeti +25% (seviye başına)']
  },
  {
    id: 'risk_analysis',
    name: 'Risk Analizi',
    description: 'Satın alma sonrası fiyat düşüşü riski azalır.',
    category: 'market_insight',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '⚠️',
    effects: ['Fiyat düşüş riski %15 azalır (seviye başına)']
  },

  // Envanter & Lojistik (Inventory & Logistics) Skills
  {
    id: 'warehouse_expansion',
    name: 'Depo Genişletme',
    description: 'Envanter kapasitesine slot ekler.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 1,
    unlockLevel: 1,
    icon: '📦',
    effects: ['Envanter kapasitesi +1 slot (seviye başına)']
  },
  {
    id: 'quick_organization',
    name: 'Hızlı Düzenleme',
    description: 'Ürün listesinde işlem süreleri kısalır.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '📋',
    effects: ['İşlem süresi %20 kısalır (seviye başına)']
  },
  {
    id: 'insured_storage',
    name: 'Sigortalı Depo',
    description: 'Eşya değer kaybı şansı azalır.',
    category: 'inventory_logistics',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '🛡️',
    effects: ['Değer kaybı şansı %10 azalır (seviye başına)']
  },

  // Hız & İş Akışı (Speed & Flow) Skills
  {
    id: 'fast_buyer',
    name: 'Hızlı Alıcı',
    description: 'Yeni müşteri geliş süresi kısalır.',
    category: 'speed_flow',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 2,
    unlockLevel: 2,
    icon: '🏃',
    effects: ['Müşteri geliş süresi %10 kısalır (seviye başına)']
  },
  {
    id: 'busy_market',
    name: 'Yoğun Pazar',
    description: 'Günlük müşteri sayısı artar.',
    category: 'speed_flow',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 3,
    unlockLevel: 3,
    icon: '👥',
    effects: ['Günlük müşteri sayısı +1 (seviye başına)']
  },

  // Prestij & Şans (Prestige & Luck) Skills
  {
    id: 'charismatic',
    name: 'Karizmatik',
    description: 'İtibar artışı daha hızlı olur.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 4,
    costPerLevel: 2,
    unlockLevel: 3,
    icon: '✨',
    effects: ['İtibar artışı %25 daha hızlı (seviye başına)']
  },
  {
    id: 'lucky_day',
    name: 'Şanslı Gün',
    description: 'Nadir ürün çıkma ihtimali artar.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 5,
    costPerLevel: 2,
    unlockLevel: 4,
    icon: '🍀',
    effects: ['Nadir ürün şansı +2% (seviye başına)']
  },
  {
    id: 'vip_connections',
    name: 'VIP Bağlantıları',
    description: 'VIP müşteri gelme şansı artar.',
    category: 'prestige_luck',
    currentLevel: 0,
    maxLevel: 3,
    costPerLevel: 3,
    unlockLevel: 5,
    icon: '👑',
    effects: ['VIP müşteri şansı +10% (seviye başına)']
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