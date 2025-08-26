import { Item, Customer } from '@/types/game';

export interface AppraisalResult {
  isAuthentic: boolean;
  confidence: number; // 0-100%
  detectedFeatures: string[];
  recommendation: 'buy' | 'avoid' | 'investigate';
}

export const performAppraisal = (item: Item, playerSkill: number = 0): AppraisalResult => {
  const baseSkill = 30; // Base detection accuracy
  const totalSkill = Math.min(baseSkill + (playerSkill * 15), 95); // Max 95% accuracy
  
  const isActuallyAuthentic = item.authenticity === 'authentic';
  const randomFactor = Math.random() * 100;
  
  // Determine if the appraisal is correct
  const correctDetection = randomFactor < totalSkill;
  const detectedAsAuthentic = correctDetection ? isActuallyAuthentic : !isActuallyAuthentic;
  
  // Calculate confidence based on item properties and skill
  let confidence = totalSkill;
  
  // Adjust confidence based on item condition and rarity
  if (item.condition < 50) confidence -= 10;
  if (item.rarity === 'legendary') confidence -= 15;
  if (item.authenticity === 'suspicious') confidence -= 20;
  
  confidence = Math.max(30, Math.min(95, confidence + (Math.random() - 0.5) * 20));
  
  // Generate detected features
  const features = generateDetectedFeatures(item, detectedAsAuthentic, confidence);
  
  // Make recommendation
  let recommendation: 'buy' | 'avoid' | 'investigate';
  if (confidence > 80 && detectedAsAuthentic) {
    recommendation = 'buy';
  } else if (confidence > 80 && !detectedAsAuthentic) {
    recommendation = 'avoid';
  } else {
    recommendation = 'investigate';
  }
  
  return {
    isAuthentic: detectedAsAuthentic,
    confidence: Math.round(confidence),
    detectedFeatures: features,
    recommendation
  };
};

const generateDetectedFeatures = (item: Item, detectedAsAuthentic: boolean, confidence: number): string[] => {
  const features = [];
  
  if (detectedAsAuthentic) {
    if (confidence > 70) {
      features.push('Orijinal malzeme kullanımı');
      features.push('Dönem uyumlu üretim detayları');
    }
    if (item.condition > 70) {
      features.push('İyi korunmuş orijinal ambalaj');
    }
    if (item.rarity !== 'common') {
      features.push('Seri numarası doğrulandı');
    }
  } else {
    if (confidence > 70) {
      features.push('Şüpheli malzeme kalitesi');
      features.push('Dönem dışı üretim belirtileri');
    }
    if (item.condition < 80) {
      features.push('Yeniden boyama/onarım izleri');
    }
    features.push('Seri numarası tutarsızlığı');
  }
  
  // Add some neutral observations
  features.push(`Durum: ${item.condition}%`);
  features.push(`Kategori: ${getCategoryName(item.category)}`);
  
  return features;
};

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    'cassette_record': 'Kaset/Plak',
    'walkman_electronics': 'Walkman/Elektronik',
    'watch': 'Saat',
    'toy': 'Oyuncak',
    'comic': 'Çizgi Roman',
    'poster': 'Poster',
    'camera': 'Kamera',
    'mystery_box': 'Gizemli Kutu'
  };
  return names[category] || category;
};

export const generateFakeItem = (baseItem: Partial<Item>): Item => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: baseItem.name || 'Şüpheli Ürün',
    category: baseItem.category || 'toy',
    baseValue: (baseItem.baseValue || 100) * (0.3 + Math.random() * 0.4), // 30-70% of real value
    condition: Math.floor(60 + Math.random() * 35), // 60-95% condition
    authenticity: Math.random() > 0.3 ? 'fake' : 'suspicious', // Mostly fake, some suspicious
    rarity: baseItem.rarity || 'common',
    trendBonus: 0,
    image: baseItem.image || '❓',
    storyTag: 'potentially_fake'
  };
};

export const getFakeDetectionReward = (difficulty: 'easy' | 'medium' | 'hard'): { cash: number; reputation: number; experience: number } => {
  const rewards = {
    easy: { cash: 50, reputation: 2, experience: 10 },
    medium: { cash: 100, reputation: 5, experience: 25 },
    hard: { cash: 200, reputation: 10, experience: 50 }
  };
  
  return rewards[difficulty];
};