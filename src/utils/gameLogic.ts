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

// Dynamic haggling responses based on price direction and customer role
const haggleResponses = {
  // Price decreased (player lowered offer)
  priceDecreased: {
    seller: [
      { TR: "Bu daha da düştü, böyle olmaz.", EN: "You lowered it, that won't work.", DE: "Du hast den Preis gesenkt, das funktioniert nicht." },
      { TR: "Fiyatı indirdin, bu yanlış yön.", EN: "You lowered the price, wrong direction.", DE: "Du hast den Preis reduziert, falsche Richtung." },
      { TR: "Böyle pazarlık olmaz, yukarı çıkar.", EN: "That's not how you negotiate, go up.", DE: "So verhandelt man nicht, geh nach oben." }
    ],
    buyer: [
      { TR: "Sen fiyatı yükseltmelisin, düşürme.", EN: "You should raise the price, don't lower it.", DE: "Du solltest den Preis erhöhen, nicht senken." },
      { TR: "Yanlış yöne gidiyorsun, artırmalısın.", EN: "You're going the wrong way, increase it.", DE: "Du gehst in die falsche Richtung, erhöhe es." },
      { TR: "Düşürme, ben alıcıyım artırmalısın.", EN: "Don't lower it, I'm a buyer, you should increase.", DE: "Senke es nicht, ich bin Käufer, du solltest erhöhen." }
    ]
  },
  // Price increased (player raised offer)
  priceIncreased: {
    seller: [
      { TR: "İşte böyle, yaklaşıyorsun.", EN: "That's it, you're getting closer.", DE: "Das ist es, du kommst näher." },
      { TR: "Şimdi konuşmaya başlıyoruz.", EN: "Now we're starting to talk.", DE: "Jetzt fangen wir an zu reden." },
      { TR: "Doğru yöne gidiyorsun, devam et.", EN: "You're going the right direction, continue.", DE: "Du gehst in die richtige Richtung, mach weiter." }
    ],
    buyer: [
      { TR: "Artırıyorsun ama hâlâ az.", EN: "You're increasing but it's still low.", DE: "Du erhöhst, aber es ist immer noch wenig." },
      { TR: "Yükseltiyor ama yeterli değil.", EN: "Going up but not enough.", DE: "Es geht nach oben, aber nicht genug." },
      { TR: "Doğru yön ama daha cesur ol.", EN: "Right direction but be bolder.", DE: "Richtige Richtung, aber sei mutiger." }
    ]
  },
  // Price unchanged
  priceUnchanged: {
    seller: [
      { TR: "Aynı teklifte kaldın, biraz daha oynayalım.", EN: "You stayed with the same offer, let's play more.", DE: "Du bist bei demselben Angebot geblieben, lass uns mehr spielen." },
      { TR: "Değiştirmediğin için ısrarcısın demek.", EN: "Since you didn't change, you must be persistent.", DE: "Da du nicht geändert hast, musst du hartnäckig sein." },
      { TR: "Aynı rakam, başka bir şey dene.", EN: "Same number, try something else.", DE: "Gleiche Zahl, versuche etwas anderes." }
    ],
    buyer: [
      { TR: "Aynı fiyat, hareket et artık.", EN: "Same price, make a move already.", DE: "Gleicher Preis, mach endlich einen Zug." },
      { TR: "Tekrarladın, yeni bir teklif ver.", EN: "You repeated, give a new offer.", DE: "Du hast wiederholt, mache ein neues Angebot." },
      { TR: "Değişiklik yok, cesur ol.", EN: "No change, be brave.", DE: "Keine Änderung, sei mutig." }
    ]
  },
  // Very close to base price (90%+)
  veryClose: [
    { TR: "Neredeyse anlaşıyoruz, az kaldı.", EN: "We're almost there, just a bit more.", DE: "Wir sind fast da, nur noch ein bisschen." },
    { TR: "Çok yaklaştık, son bir hamle.", EN: "Very close now, one last move.", DE: "Sehr nah jetzt, ein letzter Zug." },
    { TR: "İşte şimdi ciddi konuşuyoruz.", EN: "Now we're talking seriously.", DE: "Jetzt reden wir ernsthaft." }
  ],
  // Very low offer (under 50%)
  veryLow: [
    { TR: "Bu çok düşük, ciddi değil.", EN: "This is too low, not serious.", DE: "Das ist zu niedrig, nicht ernst." },
    { TR: "Şaka mı bu? Çok az.", EN: "Is this a joke? Too little.", DE: "Ist das ein Scherz? Zu wenig." },
    { TR: "Bu rakamla ciddiye alamam.", EN: "I can't take this amount seriously.", DE: "Ich kann diesen Betrag nicht ernst nehmen." }
  ],
  // Very high offer (over 120% - good for customer)
  veryHigh: [
    { TR: "Bu beklediğimden bile iyi, hemen kabul edebilirim.", EN: "This is even better than expected, I can accept right away.", DE: "Das ist sogar besser als erwartet, ich kann sofort akzeptieren." },
    { TR: "Vay canına, bu harika bir teklif!", EN: "Wow, this is a great offer!", DE: "Wow, das ist ein tolles Angebot!" },
    { TR: "Bu kadar cömert olacağını beklemiyordum.", EN: "I didn't expect you to be this generous.", DE: "Ich hatte nicht erwartet, dass du so großzügig bist." }
  ]
};

export const generateHaggleResponse = (
  customer: Customer, 
  item: Item, 
  offeredPrice: number, 
  haggleCount: number,
  previousOffer?: number,
  playerLevel: number = 1
) => {
  // Try using balanced bargaining system first
  try {
    const { generateBalancedCounterOffer } = require('./balancedBargaining');
    const lastOffer = previousOffer || generateCustomerInitialOffer(customer, calculateItemValue(item), playerLevel);
    
    const result = generateBalancedCounterOffer(
      customer, 
      item, 
      offeredPrice, 
      lastOffer, 
      playerLevel, 
      haggleCount
    );
    
    if (result.accepted) {
      return {
        accepted: true,
        message: result.message,
        reputationChange: 2,
        trustChange: 1,
        counter: null
      };
    } else if (result.counterOffer) {
      return {
        accepted: false,
        message: `${result.emoji} ${result.message} $${result.counterOffer} nasıl?`,
        reputationChange: 0,
        trustChange: 0,
        counter: result.counterOffer
      };
    } else {
      // Auto-fail case
      return {
        accepted: false,
        message: result.message,
        reputationChange: -1,
        trustChange: 0,
        counter: null
      };
    }
  } catch (error) {
    console.warn('Falling back to original haggle system:', error);
  }

  // Fallback to original system
  const itemValue = calculateItemValue(item);
  const basePrice = customer.intent === 'sell' 
    ? generateCustomerInitialOffer(customer, itemValue, playerLevel)
    : itemValue;
  
  const priceRatio = offeredPrice / itemValue;
  
  // Determine price direction if previous offer exists
  let priceDirection: 'increased' | 'decreased' | 'unchanged' | 'first' = 'first';
  if (previousOffer !== undefined) {
    if (offeredPrice > previousOffer) priceDirection = 'increased';
    else if (offeredPrice < previousOffer) priceDirection = 'decreased';
    else priceDirection = 'unchanged';
  }
  
  // Determine price category relative to base price
  const priceToBaseRatio = offeredPrice / basePrice;
  let priceCategory: 'veryLow' | 'low' | 'close' | 'veryHigh' | 'normal' = 'normal';
  
  if (priceToBaseRatio < 0.5) priceCategory = 'veryLow';
  else if (priceToBaseRatio >= 0.9 && priceToBaseRatio <= 1.1) priceCategory = 'close';
  else if (priceToBaseRatio > 1.2) priceCategory = 'veryHigh';
  else if (priceToBaseRatio < 0.8) priceCategory = 'low';
  
  // Generate dynamic response message
  let responseMessage = "";
  const language = 'TR'; // Can be made configurable later
  
  // Priority: Special price categories first, then direction-based responses
  if (priceCategory === 'close' && haggleResponses.veryClose) {
    const messages = haggleResponses.veryClose;
    responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
  } else if (priceCategory === 'veryLow' && haggleResponses.veryLow) {
    const messages = haggleResponses.veryLow;
    responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
  } else if (priceCategory === 'veryHigh' && haggleResponses.veryHigh) {
    const messages = haggleResponses.veryHigh;
    responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
  } else if (priceDirection !== 'first') {
    // Use direction-based responses
    const roleKey = customer.intent === 'sell' ? 'seller' : 'buyer';
    
    if (priceDirection === 'decreased' && haggleResponses.priceDecreased[roleKey]) {
      const messages = haggleResponses.priceDecreased[roleKey];
      responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
    } else if (priceDirection === 'increased' && haggleResponses.priceIncreased[roleKey]) {
      const messages = haggleResponses.priceIncreased[roleKey];
      responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
    } else if (priceDirection === 'unchanged' && haggleResponses.priceUnchanged[roleKey]) {
      const messages = haggleResponses.priceUnchanged[roleKey];
      responseMessage = messages[Math.floor(Math.random() * messages.length)][language];
    }
  }
  
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
  
  // Use dynamic response if available, otherwise fall back to default
  if (!responseMessage) {
    const rejectionMessages = [
      "Bu fiyat çok düşük, biraz daha yükseltmelisiniz.",
      "Bu teklif içimi hiç açmadı, daha iyi bir rakam bekliyorum.",
      "Bu rakamla anlaşamayız, biraz daha cömert olun.",
      "Hmm… değerinin altında, biraz daha artırın lütfen.",
      "Bunu kabul edemem, fiyatı biraz yukarı çekmelisiniz."
    ];
    responseMessage = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
  }
  
  // Counter offer
  const counterOffer = Math.floor(itemValue * (acceptanceThreshold - 0.1));
  
  return {
    accepted: false,
    message: `${responseMessage} $${counterOffer} nasıl?`,
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

export const generateCustomerInitialOffer = (customer: Customer, itemValue: number, playerLevel: number = 1): number => {
  // Import the balanced bargaining system
  const { generateBalancedInitialOffer } = require('./balancedBargaining');
  
  // Create a mock item for the calculation if we only have itemValue
  const mockItem = {
    baseValue: itemValue,
    condition: 80,
    rarity: 'common',
    trendBonus: 0,
    purchasePrice: itemValue * 0.7
  } as any;
  
  try {
    return generateBalancedInitialOffer(customer, mockItem, playerLevel);
  } catch (error) {
    // Fallback to original logic if new system fails
    const offerMultiplier = {
      collector: 0.7 + Math.random() * 0.2,
      student: 0.5 + Math.random() * 0.2, 
      trader: 0.6 + Math.random() * 0.2,
      nostalgic: 0.8 + Math.random() * 0.15,
      hunter: 0.4 + Math.random() * 0.2,
      tourist: 0.7 + Math.random() * 0.2,
      expert: 0.8 + Math.random() * 0.15
    }[customer.type];

    const budgetConstrainedOffer = Math.min(customer.budget * 0.8, itemValue * offerMultiplier);
    return Math.floor(budgetConstrainedOffer);
  }
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