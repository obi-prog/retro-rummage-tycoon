import { GameEvent, TrendData, ItemCategory } from '@/types/game';

export const generateRandomEvent = (day: number, level: number): GameEvent | null => {
  const eventChance = Math.min(0.3 + (level * 0.1), 0.7);
  
  if (Math.random() > eventChance) return null;

  const events = [
    {
      id: 'police_check',
      type: 'police_check' as const,
      title: 'Polis Kontrolü',
      description: 'Polis sahte ürün kontrolü yapıyor.',
      effect: { type: 'police_raid' },
      duration: 1
    },
    {
      id: 'celebrity_visit',
      type: 'celebrity' as const,
      title: 'Ünlü Ziyareti',
      description: 'Bir ünlü mağazanı ziyaret etti!',
      effect: { type: 'reputation_boost', amount: 10 },
      duration: 1
    }
  ];

  return events[Math.floor(Math.random() * events.length)];
};

export const generateTrendBurst = (): TrendData => {
  const categories: ItemCategory[] = ['cassette_record', 'walkman_electronics', 'watch'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const bonus = 20 + Math.floor(Math.random() * 30);
  const duration = 2 + Math.floor(Math.random() * 3);
  
  return { category, bonus, duration };
};

export const getTrendMessage = (trend: TrendData): string => {
  return `🔥 TREND: ${trend.category} +${trend.bonus}% bonus! (${trend.duration} days)`;
};

export const processEventEffects = (event: GameEvent, gameState: any) => {
  return {
    messages: ['Event processed'],
    stateChanges: {}
  };
};