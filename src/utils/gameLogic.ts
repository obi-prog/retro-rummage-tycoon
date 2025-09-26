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

// Global translation context - will be set by useTranslatedItems hook
let currentI18nContext: any = null;

export const setI18nContext = (context: any) => {
  currentI18nContext = context;
};

const generateRandomItem = (): Item => {
  const categories: ItemCategory[] = ['cassette_record', 'walkman_electronics', 'watch', 'toy', 'comic', 'poster', 'camera'];
  const rarities: Array<'common' | 'rare' | 'very_rare' | 'legendary'> = ['common', 'rare', 'very_rare', 'legendary'];
  const authenticities: Array<'authentic' | 'fake' | 'suspicious'> = ['authentic', 'fake', 'suspicious'];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const authenticity = authenticities[Math.floor(Math.random() * authenticities.length)];
  
  // Get translated item names
  const getItemNames = () => {
    if (currentI18nContext) {
      const names = currentI18nContext.t(`items.names.${category}`, '');
      if (names && Array.isArray(names)) {
        return names;
      }
    }
    
    // Fallback to English names
    const itemNames = {
      cassette_record: ['Vintage LP', 'Rock Album', 'Jazz Collection', 'Classical Set'],
      walkman_electronics: ['Retro Walkman', 'Vintage Radio', 'Old Headphones', 'Cassette Player'],
      watch: ['Pocket Watch', 'Vintage Rolex', 'Antique Timepiece', 'Classic Watch'],
      toy: ['Action Figure', 'Vintage Doll', 'Model Car', 'Board Game'],
      comic: ['First Edition Comic', 'Vintage Magazine', 'Rare Issue', 'Collector Comic'],
      poster: ['Movie Poster', 'Concert Poster', 'Vintage Ad', 'Art Print'],
      camera: ['Film Camera', 'Vintage Polaroid', 'Old Lens', 'Photo Equipment']
    };
    return itemNames[category];
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
  
  const itemNames = getItemNames();
  
  return {
    id: Math.random().toString(36).substring(7),
    name: itemNames[Math.floor(Math.random() * itemNames.length)],
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
    carriedItem: generateRandomItem() // All customers have an item to negotiate
  };
};

// Function to determine the customer's reaction to a counter offer
const getCustomerReaction = (customer: Customer, offer: number, itemValue: number): string => {
  const priceDifference = Math.abs(offer - itemValue);
  const isClose = priceDifference < itemValue * 0.1; // Within 10%
  const isFair = offer >= itemValue * 0.9 && offer <= itemValue * 1.1; // Between 90% and 110% of itemValue

  if (customer.type === 'expert' && !isFair) {
    return "I know the value of this item, and your offer isn't fair.";
  }

  if (customer.patience < 50 && !isClose) {
    return "I don't have time for games. Make a serious offer.";
  }

  return "Let me think about that...";
};

// Function to generate a counter offer from the customer
const generateCounterOffer = (customer: Customer, itemValue: number): number => {
  const minOffer = Math.max(10, Math.floor(itemValue * 0.6)); // Ensure offer is at least 10
  const maxOffer = Math.floor(itemValue * 1.2);
  const offerRange = maxOffer - minOffer;
  let counterOffer = Math.floor(minOffer + Math.random() * offerRange);

  // Adjust counter offer based on customer type
  if (customer.type === 'collector') {
    counterOffer = Math.max(counterOffer, Math.floor(itemValue * 0.8));
  } else if (customer.type === 'hunter') {
    counterOffer = Math.min(counterOffer, Math.floor(itemValue * 0.9));
  }

  return counterOffer;
};

// Function to simulate customer acceptance
const willCustomerAccept = (customer: Customer, offer: number, itemValue: number): boolean => {
  const priceDifference = Math.abs(offer - itemValue);
  const isClose = priceDifference < itemValue * 0.15; // Within 15%

  if (customer.type === 'expert' && offer < itemValue) {
    return false;
  }

  if (customer.patience > 70 && isClose) {
    return true;
  }

  return Math.random() < 0.3; // 30% chance of acceptance
};

// Dynamic haggling responses based on price direction and customer role
const haggleResponses = {
  // Price decreased (player lowered offer)
  priceDown: {
    en: [
      "That's getting closer to what I had in mind!",
      "Now we're talking!",
      "Better, but I think we can do even better.",
      "I appreciate the adjustment, but...",
      "You're moving in the right direction."
    ],
    tr: [
      "Bu daha mantıklı bir fiyat!",
      "İşte şimdi konuşuyoruz!",
      "Daha iyi, ama biraz daha olabilir.",
      "Ayarlamayı takdir ediyorum, ama...",
      "Doğru yönde ilerliyorsun."
    ],
    de: [
      "Das kommt dem näher, was ich mir vorgestellt hatte!",
      "Jetzt reden wir!",
      "Besser, aber ich denke, wir können noch besser werden.",
      "Ich schätze die Anpassung, aber...",
      "Sie bewegen sich in die richtige Richtung."
    ]
  },
  
  // Price increased (player raised offer)
  priceUp: {
    en: [
      "Hmm, that's going the wrong way...",
      "Now you're pushing it a bit far.",
      "I wasn't expecting that direction.",
      "That's a bit steep for me.",
      "You're moving away from my comfort zone."
    ],
    tr: [
      "Hmm, bu yanlış yönde gidiyor...",
      "Şimdi biraz fazla zorluyorsun.",
      "Bu yönü beklemiyordum.",
      "Bu bana biraz fazla geldi.",
      "Konfor alanımdan uzaklaşıyorsun."
    ],
    de: [
      "Hmm, das geht in die falsche Richtung...",
      "Jetzt treibst du es etwas zu weit.",
      "Ich hatte nicht diese Richtung erwartet.",
      "Das ist mir etwas zu steil.",
      "Sie entfernen sich von meiner Komfortzone."
    ]
  },
  
  // Very close to agreement
  veryClose: {
    en: [
      "We're almost there! Just a tiny bit more...",
      "So close I can taste it!",
      "Just a few dollars and we have a deal!",
      "You're practically reading my mind now.",
      "One more small adjustment and it's perfect!"
    ],
    tr: [
      "Neredeyse anlaştık! Sadece biraz daha...",
      "O kadar yakın ki tadını alabiliyorum!",
      "Sadece birkaç dolar daha ve anlaştık!",
      "Artık aklımı okuyorsun adeta.",
      "Bir küçük ayarlama daha ve mükemmel!"
    ],
    de: [
      "Wir sind fast da! Nur noch ein kleines bisschen...",
      "So nah, dass ich es schmecken kann!",
      "Nur noch ein paar Dollar und wir haben einen Deal!",
      "Sie lesen praktisch meine Gedanken.",
      "Noch eine kleine Anpassung und es ist perfekt!"
    ]
  },
  
  // Extreme offers (too high or too low)
  extreme: {
    en: [
      "That's way off what I was thinking...",
      "I think we're on completely different pages here.",
      "That's not even in the ballpark!",
      "Are we talking about the same item?",
      "I think there's been a misunderstanding."
    ],
    tr: [
      "Bu düşündüğümden çok farklı...",
      "Sanırım tamamen farklı şeyler düşünüyoruz.",
      "Bu hiç yakınında bile değil!",
      "Aynı üründen mi bahsediyoruz?",
      "Sanırım bir yanlış anlaşılma var."
    ],
    de: [
      "Das ist weit weg von dem, was ich dachte...",
      "Ich denke, wir reden völlig aneinander vorbei.",
      "Das ist nicht mal ansatzweise richtig!",
      "Sprechen wir über dasselbe Teil?",
      "Ich denke, da gab es ein Missverständnis."
    ]
  }
};

// Calculate the current market value of an item
export const calculateItemValue = (item: Item): number => {
  const conditionMultiplier = item.condition / 100;
  const rarityMultipliers = {
    common: 1,
    rare: 1.5,
    very_rare: 2.5,
    legendary: 4
  };
  
  return Math.floor(item.baseValue * conditionMultiplier * rarityMultipliers[item.rarity] + item.trendBonus);
};

// Generate haggle response based on customer behavior and offer history
export const generateHaggleResponse = (
  customer: Customer,
  item: Item,
  playerOffer: number,
  previousOffer: number,
  haggleCount: number = 0,
  language: string = 'en'
): { 
  response: string; 
  counterOffer?: number; 
  accepted: boolean; 
  customerMessage: string;
} => {
  
  // Use balanced bargaining system if available
  try {
    const balancedBargaining = require('./balancedBargaining');
    if (balancedBargaining.generateBalancedCounterOffer) {
      const result = balancedBargaining.generateBalancedCounterOffer(
        customer, 
        item, 
        playerOffer, 
        previousOffer, 
        1, // player level - could be passed as parameter
        haggleCount
      );
      
      if (result) {
        return {
          response: result.message || "Let me think about that...",
          counterOffer: result.accepted ? undefined : result.counterOffer,
          accepted: result.accepted,
          customerMessage: result.message || ""
        };
      }
    }
  } catch (error) {
    console.log('Balanced bargaining system not available, using fallback logic');
  }

  const itemValue = calculateItemValue(item);
  const tolerance = customer.knowledge > 70 ? 0.1 : 0.2; // Experts are pickier
  const acceptableRange = {
    min: itemValue * (1 - tolerance),
    max: itemValue * (1 + tolerance)
  };

  // Determine price direction
  const priceDirection = playerOffer > previousOffer ? 'up' : 'down';
  const priceDifference = Math.abs(playerOffer - itemValue);
  const isVeryClose = priceDifference < itemValue * 0.05; // Within 5%
  const isExtreme = priceDifference > itemValue * 0.5; // More than 50% off

  // Get appropriate response category
  let responseCategory: string;
  if (isExtreme) {
    responseCategory = 'extreme';
  } else if (isVeryClose) {
    responseCategory = 'veryClose';
  } else {
    responseCategory = priceDirection === 'up' ? 'priceUp' : 'priceDown';
  }

  // Get response in the specified language
  const responses = haggleResponses[responseCategory as keyof typeof haggleResponses];
  const languageResponses = responses[language as keyof typeof responses] || responses.en;
  const response = languageResponses[Math.floor(Math.random() * languageResponses.length)];

  // Decide if customer accepts or makes counter-offer
  const customerAccepts = playerOffer >= acceptableRange.min && playerOffer <= acceptableRange.max;
  
  if (customerAccepts || haggleCount >= 3) {
    return {
      response,
      accepted: true,
      customerMessage: response
    };
  }

  // Generate counter-offer
  const targetPrice = itemValue + (Math.random() - 0.5) * itemValue * 0.1;
  const counterOffer = Math.floor(
    playerOffer + (targetPrice - playerOffer) * (customer.patience / 100) * 0.7
  );

  return {
    response,
    counterOffer: Math.max(1, counterOffer),
    accepted: false,
    customerMessage: response
  };
};

// Generate customer's initial offer for an item
export const generateCustomerInitialOffer = (
  customer: Customer, 
  itemValue: number, 
  playerLevel: number = 1
): number => {
  
  // Try using balanced bargaining system first
  try {
    const balancedBargaining = require('./balancedBargaining');
    if (balancedBargaining.generateBalancedInitialOffer) {
      const offer = balancedBargaining.generateBalancedInitialOffer(
        customer, 
        { value: itemValue, rarity: 'common' }, // Simplified item for this function
        playerLevel
      );
      if (offer && offer > 0) {
        return offer;
      }
    }
  } catch (error) {
    console.log('Balanced bargaining system not available, using fallback logic');
  }

  // Fallback logic
  const multiplier = customer.intent === 'buy' ? 0.7 + Math.random() * 0.3 : 0.8 + Math.random() * 0.4;
  return Math.floor(itemValue * multiplier);
};

// Generate initial message when customer approaches
export const generateInitialMessage = (
  customer: Customer, 
  item: Item, 
  offer: number
): string => {
  const greetings = [
    "Hey there!",
    "Excuse me,",
    "Hi,",
    "Hello!"
  ];
  
  const buyMessages = [
    `I'm interested in this ${item.name}. Would you take $${offer} for it?`,
    `This ${item.name} caught my eye. How about $${offer}?`,
    `I'd love to buy this ${item.name}. $${offer} sound fair?`
  ];
  
  const sellMessages = [
    `I have this ${item.name} I'd like to sell. I'm asking $${offer} for it.`,
    `Would you be interested in this ${item.name}? I'm looking for $${offer}.`,
    `I've got this ${item.name} for sale. $${offer} and it's yours.`
  ];
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const messages = customer.intent === 'buy' ? buyMessages : sellMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return `${greeting} ${message}`;
};
