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

// Import item images
import cassetteRecordImg from '@/assets/items/cassette-record.jpg';
import walkmanElectronicsImg from '@/assets/items/walkman-electronics.jpg';
import watchImg from '@/assets/items/watch.jpg';
import toyImg from '@/assets/items/toy.jpg';
import comicImg from '@/assets/items/comic.jpg';
import posterImg from '@/assets/items/poster.jpg';
import cameraImg from '@/assets/items/camera.jpg';

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
    cassette_record: cassetteRecordImg,
    walkman_electronics: walkmanElectronicsImg,
    watch: watchImg,
    toy: toyImg,
    comic: comicImg,
    poster: posterImg,
    camera: cameraImg
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

// Dynamic haggling responses - now uses i18n context for translations
const getHaggleResponse = (category: 'priceDown' | 'priceUp' | 'veryClose' | 'extreme' | 'negotiation', locale: string = 'en'): string => {
  if (!currentI18nContext) {
    // Fallback responses
    const fallbackResponses = {
      priceDown: ["That's getting closer!", "Now we're talking!"],
      priceUp: ["Hmm, that's going the wrong way...", "Now you're pushing it."],
      veryClose: ["We're almost there!", "So close!"],
      extreme: ["That's way off...", "Are we talking about the same item?"],
      negotiation: ["Let me think about that...", "Hmm..."]
    };
    const responses = fallbackResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Map haggle categories to dialogue keys
  const categoryMap = {
    priceDown: 'dialogue.negotiation',
    priceUp: 'dialogue.negotiation', 
    veryClose: 'dialogue.negotiation',
    extreme: 'dialogue.negotiation',
    negotiation: 'dialogue.negotiation'
  };
  
  const dialogueKey = categoryMap[category];
  const dialogues = currentI18nContext.getNestedTranslation(dialogueKey, [
    "That offer's too low, raise it a bit.",
    "You're getting closer, but add a little more.",
    "Hmm… I'm almost convinced.",
    "Alright, that works for me.",
    "No, I changed my mind."
  ]);
  
  if (Array.isArray(dialogues)) {
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }
  
  return dialogues;
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
  let responseCategory: 'priceDown' | 'priceUp' | 'veryClose' | 'extreme' | 'negotiation';
  if (isExtreme) {
    responseCategory = 'extreme';
  } else if (isVeryClose) {
    responseCategory = 'veryClose';
  } else {
    responseCategory = priceDirection === 'up' ? 'priceUp' : 'priceDown';
  }

  // Get response using i18n context
  const locale = currentI18nContext?.locale || language;
  const response = getHaggleResponse(responseCategory, locale);

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
  // Get current locale from i18n context
  const locale = currentI18nContext?.locale || 'en';
  
  // Get translated greetings
  const greetings = currentI18nContext?.getNestedTranslation('dialogue.greeting', [
    "Hi! I have something I'd like to sell.",
    "Would you take a look at this item?",
    "Maybe this will catch your interest!"
  ]);
  
  // Get dialogue arrays based on customer intent
  const buyDialogues = currentI18nContext?.getNestedTranslation('dialogue.buy_dialogues', [
    "This might be exactly what I'm looking for.",
    "Not bad, but the price is a bit high.",
    "Can you offer a better price?",
    "Deal! I'm buying it right now!"
  ]);
  
  const sellDialogues = currentI18nContext?.getNestedTranslation('dialogue.sell_dialogues', [
    "This item is rare, lowering the price is hard.",
    "I can't sell it below its value.",
    "It's well kept, but the price feels high.",
    "Deal! It's yours!"
  ]);
  
  const randomTalks = currentI18nContext?.getNestedTranslation('dialogue.random_talks', [
    "I used to have this when I was a kid!",
    "This reminds me of my grandfather's shop.",
    "Leave me some profit too, what do you say?",
    "I love bargaining, let's see what happens!"
  ]);
  
  // Select random greeting
  const greeting = Array.isArray(greetings) 
    ? greetings[Math.floor(Math.random() * greetings.length)]
    : greetings;
  
  // Select message based on customer intent
  const dialogues = customer.intent === 'buy' ? buyDialogues : sellDialogues;
  const dialogue = Array.isArray(dialogues)
    ? dialogues[Math.floor(Math.random() * dialogues.length)]
    : dialogues;
  
  // Sometimes add a random talk (30% chance)
  if (Math.random() < 0.3 && Array.isArray(randomTalks)) {
    const randomTalk = randomTalks[Math.floor(Math.random() * randomTalks.length)];
    return `${greeting} ${randomTalk}`;
  }
  
  return `${greeting} ${dialogue}`;
};
