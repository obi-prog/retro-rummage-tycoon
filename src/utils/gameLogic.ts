import { Customer, CustomerType, Item, ItemCategory } from '@/types/game';

const customerNames = [
  'Alex', 'Sam', 'Morgan', 'Casey', 'Taylor', 'Jordan', 'Avery', 'Riley', 'Quinn', 'Sage'
];

// Generate 2D character avatars as SVG strings
const generate2DAvatar = (type: CustomerType): string => {
  const avatars = {
    collector: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#F4A460"/>
        <rect x="35" y="50" width="30" height="40" fill="#4169E1" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 45 40 Q 50 45 55 40" stroke="#000" stroke-width="2" fill="none"/>
        <rect x="30" y="60" width="10" height="5" fill="#8B4513"/>
        <rect x="60" y="60" width="10" height="5" fill="#8B4513"/>
        <rect x="40" y="85" width="20" height="8" fill="#654321" rx="2"/>
      </svg>
    `)}`,
    student: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#FFB6C1"/>
        <rect x="35" y="50" width="30" height="40" fill="#32CD32" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 45 40 Q 50 43 55 40" stroke="#000" stroke-width="2" fill="none"/>
        <rect x="35" y="25" width="30" height="8" fill="#FFD700" rx="3"/>
        <circle cx="50" cy="90" r="5" fill="#FF69B4"/>
      </svg>
    `)}`,
    trader: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#DEB887"/>
        <rect x="35" y="50" width="30" height="40" fill="#2F4F4F" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 45 38 L 55 38" stroke="#000" stroke-width="2"/>
        <rect x="32" y="55" width="8" height="15" fill="#8B4513"/>
        <rect x="40" y="85" width="20" height="8" fill="#000" rx="2"/>
      </svg>
    `)}`,
    nostalgic: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#F5DEB3"/>
        <rect x="35" y="50" width="30" height="40" fill="#8B4513" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 45 40 Q 50 38 55 40" stroke="#000" stroke-width="2" fill="none"/>
        <rect x="30" y="20" width="40" height="5" fill="#C0C0C0" rx="2"/>
        <circle cx="50" cy="88" r="6" fill="#C0C0C0"/>
      </svg>
    `)}`,
    hunter: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#CD853F"/>
        <rect x="35" y="50" width="30" height="40" fill="#228B22" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 48 40 L 52 40" stroke="#000" stroke-width="2"/>
        <rect x="30" y="25" width="40" height="5" fill="#8B4513" rx="2"/>
        <circle cx="50" cy="88" r="4" fill="#FFD700"/>
      </svg>
    `)}`,
    tourist: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#FFE4B5"/>
        <rect x="35" y="50" width="30" height="40" fill="#FF6347" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <circle cx="50" cy="40" r="3" fill="#FF69B4"/>
        <rect x="25" y="28" width="50" height="6" fill="#FFD700" rx="3"/>
        <rect x="42" y="85" width="16" height="10" fill="#000" rx="2"/>
      </svg>
    `)}`,
    expert: `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="15" fill="#D2B48C"/>
        <rect x="35" y="50" width="30" height="40" fill="#191970" rx="5"/>
        <circle cx="42" cy="32" r="2" fill="#000"/>
        <circle cx="58" cy="32" r="2" fill="#000"/>
        <path d="M 46 40 Q 50 42 54 40" stroke="#000" stroke-width="2" fill="none"/>
        <rect x="40" y="28" width="20" height="3" fill="#000" rx="1"/>
        <circle cx="35" y="30" r="6" fill="none" stroke="#000" stroke-width="1"/>
        <circle cx="65" y="30" r="6" fill="none" stroke="#000" stroke-width="1"/>
        <polygon points="45,85 55,85 52,92 48,92" fill="#8B4513"/>
      </svg>
    `)}`,
  };
  return avatars[type];
};

const generateRandomItem = (): Item => {
  const categories: ItemCategory[] = ['cassette_record', 'walkman_electronics', 'watch', 'toy', 'comic', 'poster', 'camera'];
  const rarities: Array<'common' | 'rare' | 'very_rare' | 'legendary'> = ['common', 'rare', 'very_rare', 'legendary'];
  const authenticities: Array<'authentic' | 'fake' | 'suspicious'> = ['authentic', 'fake', 'suspicious'];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const authenticity = authenticities[Math.floor(Math.random() * authenticities.length)];
  
  const itemNames = {
    cassette_record: ['Vintage LP', 'Rock Album', 'Jazz Collection', 'Classical Set'],
    walkman_electronics: ['Retro Walkman', 'Vintage Radio', 'Old Headphones', 'Cassette Player'],
    watch: ['Pocket Watch', 'Vintage Rolex', 'Antique Timepiece', 'Classic Watch'],
    toy: ['Action Figure', 'Vintage Doll', 'Model Car', 'Board Game'],
    comic: ['First Edition Comic', 'Vintage Magazine', 'Rare Issue', 'Collector Comic'],
    poster: ['Movie Poster', 'Concert Poster', 'Vintage Ad', 'Art Print'],
    camera: ['Film Camera', 'Vintage Polaroid', 'Old Lens', 'Photo Equipment']
  };
  
  const images = {
    cassette_record: '💿',
    walkman_electronics: '📻',
    watch: '⌚',
    toy: '🧸',
    comic: '📚',
    poster: '🖼️',
    camera: '📷'
  };
  
  return {
    id: Math.random().toString(36).substring(7),
    name: itemNames[category][Math.floor(Math.random() * itemNames[category].length)],
    category,
    baseValue: Math.floor(Math.random() * 500) + 50,
    condition: Math.floor(Math.random() * 40) + 60,
    authenticity,
    rarity,
    trendBonus: 0,
    image: images[category]
  };
};

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
  const intent: 'buy' | 'sell' = Math.random() > 0.6 ? 'buy' : 'sell'; // 60% buyers, 40% sellers
  
  return {
    id: Math.random().toString(36).substring(7),
    name: customerNames[Math.floor(Math.random() * customerNames.length)],
    type,
    patience: stats.patience + Math.floor(Math.random() * 21) - 10,
    budget: stats.budget + Math.floor(Math.random() * 201) - 100,
    knowledge: stats.knowledge,
    preferences: [],
    avatar: generate2DAvatar(type),
    intent,
    carriedItem: intent === 'sell' ? generateRandomItem() : undefined
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
    message: `How about $${counterOffer}?`,
    reputationChange: 0,
    trustChange: 0,
    counter: counterOffer
  };
};

export const calculateItemValue = (item: Item): number => {
  const conditionMultiplier = 1 + (item.condition / 100);
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    very_rare: 2.5,
    legendary: 4
  }[item.rarity];
  
  return Math.floor(item.baseValue * conditionMultiplier * rarityMultiplier * (1 + item.trendBonus / 100));
};

export const generateCustomerInitialOffer = (customer: Customer, itemValue: number): number => {
  // Customer offer based on their type and budget
  const offerMultiplier = {
    collector: 0.7 + Math.random() * 0.2, // 70-90% of value
    student: 0.5 + Math.random() * 0.2, // 50-70% of value  
    trader: 0.6 + Math.random() * 0.2, // 60-80% of value
    nostalgic: 0.8 + Math.random() * 0.15, // 80-95% of value
    hunter: 0.4 + Math.random() * 0.2, // 40-60% of value
    tourist: 0.7 + Math.random() * 0.2, // 70-90% of value
    expert: 0.8 + Math.random() * 0.15 // 80-95% of value
  }[customer.type];

  const budgetConstrainedOffer = Math.min(customer.budget * 0.8, itemValue * offerMultiplier);
  return Math.floor(budgetConstrainedOffer);
};

export const generateInitialMessage = (customer: Customer, item: Item, offer: number): string => {
  const messages = {
    collector: [
      `I like this ${item.name}. Would you take $${offer} for it?`,
      `This ${item.name} would complete my collection. I can offer $${offer}.`,
      `I've been searching for this ${item.name}. My offer is $${offer}.`
    ],
    student: [
      `Hey, I'm interested in the ${item.name}. How about $${offer}?`,
      `I don't have much money, but I can offer $${offer} for the ${item.name}.`,
      `Would you accept $${offer} for the ${item.name}? I'm a student.`
    ],
    trader: [
      `I can resell this ${item.name}. My best offer is $${offer}.`,
      `For business purposes, I'll give you $${offer} for the ${item.name}.`,
      `Straight business - $${offer} for the ${item.name}.`
    ],
    nostalgic: [
      `This ${item.name} brings back memories. $${offer} is what I can offer.`,
      `I used to have one of these ${item.name}s. Would you take $${offer}?`,
      `Nostalgic value here - $${offer} for the ${item.name}.`
    ],
    hunter: [
      `Found it! I'll give you $${offer} for this ${item.name}.`,
      `I've been hunting for this ${item.name}. $${offer} is my offer.`,
      `Perfect find! $${offer} for the ${item.name}.`
    ],
    tourist: [
      `This ${item.name} would be a great souvenir. $${offer}?`,
      `I'm visiting and love this ${item.name}. How about $${offer}?`,
      `Tourist here - would you take $${offer} for the ${item.name}?`
    ],
    expert: [
      `I know the value of this ${item.name}. $${offer} is a fair price.`,
      `Based on market analysis, $${offer} is reasonable for this ${item.name}.`,
      `My expert assessment puts this ${item.name} at $${offer}.`
    ]
  };

  const customerMessages = messages[customer.type];
  return customerMessages[Math.floor(Math.random() * customerMessages.length)];
};