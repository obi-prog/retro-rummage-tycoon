import { Customer, CustomerType, Item, ItemCategory } from '@/types/game';

// Import customer avatars
import customer1 from '@/assets/avatars/customer-1.jpg';
import customer2 from '@/assets/avatars/customer-2.jpg';
import customer3 from '@/assets/avatars/customer-3.jpg';
import customer4 from '@/assets/avatars/customer-4.jpg';
import customer5 from '@/assets/avatars/customer-5.jpg';
import customer6 from '@/assets/avatars/customer-6.jpg';
import customer7 from '@/assets/avatars/customer-7.jpg';
import customer8 from '@/assets/avatars/customer-8.jpg';

// Array of customer avatars for random selection
const customerAvatars = [
  customer1, customer2, customer3, customer4, 
  customer5, customer6, customer7, customer8
];

const customerNames = [
  'Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Amy', 'Chris', 'Kate',
  'Tom', 'Jane', 'Ben', 'Lucy', 'Mark', 'Anna', 'Jack', 'Zoe', 'Sam', 'Maya'
];

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

export const generateCustomer = (forceSellerIntent?: boolean): Customer => {
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
  // If forceSellerIntent is true, always make customer a seller; otherwise use normal logic
  const intent: 'buy' | 'sell' = forceSellerIntent ? 'sell' : (Math.random() > 0.6 ? 'buy' : 'sell'); // 60% buyers, 40% sellers
  
  return {
    id: Math.random().toString(36).substring(7),
    name: customerNames[Math.floor(Math.random() * customerNames.length)],
    type,
    patience: stats.patience + Math.floor(Math.random() * 21) - 10,
    budget: stats.budget + Math.floor(Math.random() * 201) - 100,
    knowledge: stats.knowledge,
    preferences: [],
    avatar: customerAvatars[Math.floor(Math.random() * customerAvatars.length)],
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
    const farewellMessages = [
      "Sanırım anlaşamayacağız, başka bir zaman görüşürüz.",
      "Bu fiyatlarla olmaz, iyi günler dilerim.",
      "Bu iş bugünlük buraya kadar, hoşça kalın.",
      "Fikirlerimiz uyuşmuyor, şimdilik vazgeçiyorum.",
      "Belki başka bir üründe anlaşırız, şimdilik hoşça kal."
    ];
    
    return {
      accepted: false,
      message: farewellMessages[Math.floor(Math.random() * farewellMessages.length)],
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
  
  // Varied rejection responses
  const rejectionMessages = [
    "Bu fiyat çok düşük, biraz daha yükseltmelisiniz.",
    "Bu teklif içimi hiç açmadı, daha iyi bir rakam bekliyorum.",
    "Bu rakamla anlaşamayız, biraz daha cömert olun.",
    "Hmm… değerinin altında, biraz daha artırın lütfen.",
    "Bunu kabul edemem, fiyatı biraz yukarı çekmelisiniz."
  ];
  
  // Counter offer
  const counterOffer = Math.floor(itemValue * (acceptanceThreshold - 0.1));
  const randomMessage = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
  
  return {
    accepted: false,
    message: `${randomMessage} $${counterOffer} nasıl?`,
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