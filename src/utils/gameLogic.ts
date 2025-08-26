import { Customer, CustomerType, Item, ItemCategory } from '@/types/game';

const customerNames = [
  'Alex', 'Sam', 'Morgan', 'Casey', 'Taylor', 'Jordan', 'Avery', 'Riley', 'Quinn', 'Sage'
];

const customerAvatars = ['👤', '👨', '👩', '🧑', '👴', '👵', '🎨', '🎭', '🎪', '🎯'];

export const generateCustomer = (): Customer => {
  const types: CustomerType[] = ['collector', 'student', 'trader', 'nostalgic', 'hunter', 'tourist', 'expert'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const baseStats = {
    collector: { budget: 1000, patience: 80, knowledge: 90 },
    student: { budget: 200, patience: 60, knowledge: 40 },
    trader: { budget: 800, patience: 40, knowledge: 70 },
    nostalgic: { budget: 600, patience: 90, knowledge: 50 },
    hunter: { budget: 300, patience: 30, knowledge: 60 },
    tourist: { budget: 500, patience: 70, knowledge: 30 },
    expert: { budget: 1500, patience: 50, knowledge: 95 }
  };

  const stats = baseStats[type];
  
  return {
    id: Math.random().toString(36).substring(7),
    name: customerNames[Math.floor(Math.random() * customerNames.length)],
    type,
    patience: stats.patience + Math.floor(Math.random() * 21) - 10, // ±10 variation
    budget: stats.budget + Math.floor(Math.random() * 201) - 100, // ±100 variation
    knowledge: stats.knowledge,
    preferences: [], // Will be implemented later
    avatar: customerAvatars[Math.floor(Math.random() * customerAvatars.length)]
  };
};

export const generateHaggleResponse = (
  customer: Customer, 
  item: Item, 
  offeredPrice: number, 
  haggleCount: number
) => {
  const itemValue = calculateItemValue(item);
  const priceRatio = offeredPrice / itemValue;
  
  // Customer-specific behavior
  let acceptanceThreshold = 0.8; // Base threshold
  let patienceDecrease = 10;
  
  switch (customer.type) {
    case 'collector':
      acceptanceThreshold = item.rarity === 'legendary' ? 1.2 : 0.9;
      patienceDecrease = 5;
      break;
    case 'student':
      acceptanceThreshold = 0.7;
      patienceDecrease = 15;
      break;
    case 'trader':
      acceptanceThreshold = 0.6;
      patienceDecrease = 20;
      break;
    case 'hunter':
      acceptanceThreshold = 0.5;
      patienceDecrease = 25;
      break;
    case 'expert':
      if (item.authenticity === 'fake') {
        return {
          accepted: false,
          message: "This is a fake! I'm not interested.",
          reputationChange: -5,
          trustChange: -10,
          counter: null
        };
      }
      acceptanceThreshold = 0.85;
      patienceDecrease = 8;
      break;
  }
  
  // Adjust for haggle count
  acceptanceThreshold -= haggleCount * 0.05;
  patienceDecrease += haggleCount * 5;
  
  const newPatience = Math.max(0, customer.patience - patienceDecrease);
  
  if (priceRatio >= acceptanceThreshold && offeredPrice <= customer.budget) {
    return {
      accepted: true,
      message: "Deal! I'll take it.",
      reputationChange: 2,
      trustChange: 1,
      counter: null
    };
  }
  
  if (newPatience <= 10) {
    return {
      accepted: false,
      message: "I'm done negotiating. Too expensive.",
      reputationChange: -1,
      trustChange: 0,
      counter: null
    };
  }
  
  if (offeredPrice > customer.budget) {
    return {
      accepted: false,
      message: "That's more than I can afford.",
      reputationChange: 0,
      trustChange: 0,
      counter: Math.floor(customer.budget * 0.9)
    };
  }
  
  // Counter offer
  const counterOffer = Math.floor(itemValue * (acceptanceThreshold - 0.1));
  return {
    accepted: false,
    message: `How about ${counterOffer}₳?`,
    reputationChange: 0,
    trustChange: 0,
    counter: counterOffer
  };
};

const calculateItemValue = (item: Item): number => {
  const conditionMultiplier = 1 + (item.condition / 100);
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    very_rare: 2.5,
    legendary: 4
  }[item.rarity];
  
  return Math.floor(item.baseValue * conditionMultiplier * rarityMultiplier * (1 + item.trendBonus / 100));
};