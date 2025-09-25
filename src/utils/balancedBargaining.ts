import { Customer, Item } from '@/types/game';
import { calculateItemValue } from '@/utils/gameLogic';

export interface BargainConfig {
  offerMin: number;
  offerMax: number;
  toleranceThreshold: number;
  maxRounds: number;
}

// Helper functions
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const getRarityMultiplier = (rarity: string): number => {
  switch (rarity) {
    case 'common': return 0.9;
    case 'rare': return 1.2;
    case 'very_rare': return 1.4;
    case 'legendary': return 1.5;
    default: return 1.0;
  }
};

export const calculateLevelBasedOfferRange = (
  playerLevel: number,
  buyPrice: number,
  marketPrice: number,
  rarityMultiplier: number
): BargainConfig => {
  // 1) Base Range
  const baseMin = buyPrice * 0.9;
  const baseMax = marketPrice * 1.1;
  
  // 2) Level Difficulty Scaling
  const difficulty = clamp(0.05 * (playerLevel - 1), 0, 0.25);
  
  // 3) Calculate offer range
  const offerMin = lerp(baseMin, buyPrice * 0.6, difficulty);
  const offerMax = lerp(baseMax, marketPrice * 0.8, difficulty);
  
  // 4) Apply rarity adjustment (+5% wider range for rare items)
  const rarityAdjustment = rarityMultiplier > 1 ? 0.05 : 0;
  const adjustedMin = offerMin * (1 - rarityAdjustment);
  const adjustedMax = offerMax * (1 + rarityAdjustment);
  
  // 5) Tolerance threshold decreases by ~2% per level
  const baseTolerance = 0.15; // 15% base tolerance
  const toleranceThreshold = Math.max(0.05, baseTolerance - (playerLevel - 1) * 0.02);
  
  return {
    offerMin: Math.max(buyPrice * 0.6, adjustedMin),
    offerMax: Math.min(marketPrice * 1.05, adjustedMax),
    toleranceThreshold,
    maxRounds: 3
  };
};

export const generateBalancedInitialOffer = (
  customer: Customer,
  item: Item,
  playerLevel: number
): number => {
  const marketPrice = calculateItemValue(item);
  const buyPrice = item.purchasePrice || marketPrice * 0.7; // Fallback if no purchase price
  const rarityMultiplier = getRarityMultiplier(item.rarity);
  
  const config = calculateLevelBasedOfferRange(playerLevel, buyPrice, marketPrice, rarityMultiplier);
  
  // Customer type modifiers
  let customerModifier = 1.0;
  switch (customer.type) {
    case 'collector':
      customerModifier = item.rarity === 'legendary' ? 1.1 : 0.95;
      break;
    case 'student':
      customerModifier = 0.8;
      break;
    case 'trader':
      customerModifier = 0.85;
      break;
    case 'nostalgic':
      customerModifier = 1.05;
      break;
    case 'hunter':
      customerModifier = 0.75;
      break;
    case 'tourist':
      customerModifier = 0.9;
      break;
    case 'expert':
      customerModifier = 0.95;
      break;
  }
  
  // Generate offer within the calculated range
  const offerRange = config.offerMax - config.offerMin;
  const randomFactor = Math.random();
  const baseOffer = config.offerMin + (offerRange * randomFactor);
  
  // Apply customer modifier and budget constraint
  const adjustedOffer = baseOffer * customerModifier;
  const budgetConstrainedOffer = Math.min(adjustedOffer, customer.budget * 0.8);
  
  return Math.floor(clamp(budgetConstrainedOffer, config.offerMin, config.offerMax));
};

export const generateBalancedCounterOffer = (
  customer: Customer,
  item: Item,
  playerOffer: number,
  lastCustomerOffer: number,
  playerLevel: number,
  round: number
): { accepted: boolean; counterOffer?: number; message: string; emoji: string } => {
  const marketPrice = calculateItemValue(item);
  const buyPrice = item.purchasePrice || marketPrice * 0.7;
  const rarityMultiplier = getRarityMultiplier(item.rarity);
  
  const config = calculateLevelBasedOfferRange(playerLevel, buyPrice, marketPrice, rarityMultiplier);
  
  // Calculate price difference percentage
  const priceDifference = Math.abs(playerOffer - marketPrice) / marketPrice;
  
  // Determine reaction based on tolerance
  let emoji = '🤔';
  let reactionType = 'neutral';
  
  if (priceDifference < config.toleranceThreshold) {
    emoji = '☺️';
    reactionType = 'positive';
  } else if (priceDifference > 0.15) {
    emoji = '😠';
    reactionType = 'negative';
  }
  
  // Auto-fail after max rounds with >20% gap
  if (round >= config.maxRounds && priceDifference > 0.2) {
    return {
      accepted: false,
      message: "Anlaşamayacağız, iyi günler.",
      emoji: '😤'
    };
  }
  
  // Accept if within reasonable range
  if (customer.intent === 'buy') {
    // Customer buying from player
    if (playerOffer <= customer.budget && priceDifference <= config.toleranceThreshold) {
      return {
        accepted: true,
        message: getAcceptanceMessage(customer, 'buy'),
        emoji: '😊'
      };
    }
    
    // Generate counter-offer
    let counterOffer: number;
    if (playerOffer < lastCustomerOffer) {
      // Player lowered price, customer reduces offer slightly
      counterOffer = lastCustomerOffer - Math.floor(marketPrice * (0.01 + Math.random() * 0.02));
    } else {
      // Player raised or kept price, customer moves toward middle
      const midPoint = (playerOffer + marketPrice) / 2;
      counterOffer = Math.floor(midPoint + (Math.random() * marketPrice * 0.02));
    }
    
    // Ensure counter stays in valid range
    counterOffer = Math.floor(clamp(counterOffer, config.offerMin, config.offerMax));
    counterOffer = Math.min(counterOffer, customer.budget * 0.9);
    
    return {
      accepted: false,
      counterOffer,
      message: getCounterOfferMessage(reactionType, 'buy'),
      emoji
    };
  } else {
    // Customer selling to player
    if (playerOffer >= config.offerMin && priceDifference <= config.toleranceThreshold) {
      return {
        accepted: true,
        message: getAcceptanceMessage(customer, 'sell'),
        emoji: '😊'
      };
    }
    
    // Generate counter-offer for selling
    let counterOffer: number;
    if (playerOffer > lastCustomerOffer) {
      // Player raised offer, customer asks for slightly more
      counterOffer = lastCustomerOffer + Math.floor(marketPrice * (0.01 + Math.random() * 0.02));
    } else {
      // Player lowered or kept offer, customer reduces ask slightly
      const midPoint = (playerOffer + marketPrice) / 2;
      counterOffer = Math.floor(midPoint - (Math.random() * marketPrice * 0.02));
    }
    
    // Ensure counter stays in valid range
    counterOffer = Math.floor(clamp(counterOffer, config.offerMin, config.offerMax));
    
    return {
      accepted: false,
      counterOffer,
      message: getCounterOfferMessage(reactionType, 'sell'),
      emoji
    };
  }
};

const getAcceptanceMessage = (customer: Customer, intent: 'buy' | 'sell'): string => {
  const buyMessages = [
    "Tamamdır, anlaştık!",
    "Harika, bunu alıyorum!",
    "Süper, işte paran.",
    "Tam istediğim fiyat.",
    "Deal, kaşla göz arasında!"
  ];
  
  const sellMessages = [
    "Tamamdır, satıyorum!",
    "Anlaştık, al bakalım.",
    "Deal, işte ürün.",
    "Bu fiyata razıyım.",
    "Tamam, sende kalsın."
  ];
  
  const messages = intent === 'buy' ? buyMessages : sellMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};

const getCounterOfferMessage = (reactionType: string, intent: 'buy' | 'sell'): string => {
  const positiveMessages = {
    buy: ["Yaklaştın, biraz daha düşük olabilir.", "Neredeyse tamam, az daha inin."],
    sell: ["İyi teklif, biraz daha artırsan süper.", "Yaklaştık, ufak bir artış yeter."]
  };
  
  const neutralMessages = {
    buy: ["Makul ama daha iyi olur.", "Orta yerde buluşalım."],
    sell: ["Fena değil ama biraz daha artırsan iyi olur.", "Makul ama mükemmel değil."]
  };
  
  const negativeMessages = {
    buy: ["Çok pahalı, daha düşük olmalı.", "Bu kadar vermem, indir."],
    sell: ["Çok düşük, daha fazla ver.", "Bu kadar ucuza satmam."]
  };
  
  let messageSet;
  switch (reactionType) {
    case 'positive': messageSet = positiveMessages[intent]; break;
    case 'negative': messageSet = negativeMessages[intent]; break;
    default: messageSet = neutralMessages[intent];
  }
  
  return messageSet[Math.floor(Math.random() * messageSet.length)];
};