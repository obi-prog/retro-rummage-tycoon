import { Mission, MissionRequirement } from '@/types/missions';

export const generateDailyMissions = (level: number): Mission[] => {
  const dailyMissions: Mission[] = [];
  
  // Level 1-3: Basic missions
  if (level <= 3) {
    dailyMissions.push(
      {
        id: 'daily_sales_basic',
        title: 'Günlük Satış',
        description: `${2 + level} ürün sat`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 2 + level, current: 0 }],
        rewards: [{ type: 'cash', amount: 50 * level }, { type: 'experience', amount: 25 }],
        progress: 0,
        maxProgress: 2 + level,
        completed: false,
        level: 1
      },
      {
        id: 'daily_cash_basic',
        title: 'Para Kazanma',
        description: `${100 * level}₺ kazan`,
        type: 'daily' as const,
        requirements: [{ type: 'earn_cash' as const, target: 100 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 30 }, { type: 'reputation', amount: 1 }],
        progress: 0,
        maxProgress: 100 * level,
        completed: false,
        level: 1
      }
    );
  }
  
  // Level 4-6: Intermediate missions
  if (level >= 4 && level <= 6) {
    dailyMissions.push(
      {
        id: 'daily_sales_intermediate',
        title: 'Satış Uzmanı',
        description: `${3 + level} ürün sat`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 3 + level, current: 0 }],
        rewards: [{ type: 'cash', amount: 75 * level }, { type: 'experience', amount: 40 }],
        progress: 0,
        maxProgress: 3 + level,
        completed: false,
        level: 4
      },
      {
        id: 'daily_negotiate',
        title: 'Pazarlık Ustası',
        description: '3 başarılı pazarlık yap',
        type: 'daily' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 3, current: 0 }],
        rewards: [{ type: 'experience', amount: 50 }, { type: 'reputation', amount: 2 }],
        progress: 0,
        maxProgress: 3,
        completed: false,
        level: 4
      },
      {
        id: 'daily_fake_detector',
        title: 'Sahte Dedektifi',
        description: '2 sahte ürün tespit et',
        type: 'daily' as const,
        requirements: [{ type: 'identify_fake' as const, target: 2, current: 0 }],
        rewards: [{ type: 'experience', amount: 60 }, { type: 'cash', amount: 200 }],
        progress: 0,
        maxProgress: 2,
        completed: false,
        level: 4
      }
    );
  }
  
  // Level 7+: Advanced missions
  if (level >= 7) {
    dailyMissions.push(
      {
        id: 'daily_sales_expert',
        title: 'Satış Ekspertisi',
        description: `${5 + Math.floor(level/2)} ürün sat`,
        type: 'daily' as const,
        requirements: [{ type: 'sell_items' as const, target: 5 + Math.floor(level/2), current: 0 }],
        rewards: [{ type: 'cash', amount: 100 * level }, { type: 'experience', amount: 60 }],
        progress: 0,
        maxProgress: 5 + Math.floor(level/2),
        completed: false,
        level: 7
      },
      {
        id: 'daily_big_earner',
        title: 'Büyük Kazanç',
        description: `${500 * level}₺ kazan`,
        type: 'daily' as const,
        requirements: [{ type: 'earn_cash' as const, target: 500 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 80 }, { type: 'reputation', amount: 3 }],
        progress: 0,
        maxProgress: 500 * level,
        completed: false,
        level: 7
      },
      {
        id: 'daily_reputation_builder',
        title: 'İtibar İnşası',
        description: '5 itibar puan kazan',
        type: 'daily' as const,
        requirements: [{ type: 'reputation' as const, target: 5, current: 0 }],
        rewards: [{ type: 'experience', amount: 100 }, { type: 'cash', amount: 300 }],
        progress: 0,
        maxProgress: 5,
        completed: false,
        level: 7
      }
    );
  }
  
  // Return random 2-3 missions for the day
  const shuffled = dailyMissions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, level <= 3 ? 2 : 3);
};

export const generateWeeklyMissions = (level: number): Mission[] => {
  const weeklyMissions: Mission[] = [];
  
  // Level 1-2: Beginner weekly missions
  if (level <= 2) {
    weeklyMissions.push(
      {
        id: 'weekly_sales_beginner',
        title: 'Haftalık Satış Hedefi',
        description: '15 ürün sat',
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 15, current: 0 }],
        rewards: [{ type: 'cash', amount: 500 }, { type: 'experience', amount: 200 }],
        progress: 0,
        maxProgress: 15,
        completed: false,
        level: 1
      },
      {
        id: 'weekly_cash_beginner',
        title: 'Haftalık Gelir',
        description: '1000₺ kazan',
        type: 'weekly' as const,
        requirements: [{ type: 'earn_cash' as const, target: 1000, current: 0 }],
        rewards: [{ type: 'experience', amount: 250 }, { type: 'reputation', amount: 5 }],
        progress: 0,
        maxProgress: 1000,
        completed: false,
        level: 1
      }
    );
  }
  
  // Level 3-5: Intermediate weekly missions
  if (level >= 3 && level <= 5) {
    weeklyMissions.push(
      {
        id: 'weekly_sales_intermediate',
        title: 'Satış Profesyoneli',
        description: `${20 + (level * 5)} ürün sat`,
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 20 + (level * 5), current: 0 }],
        rewards: [{ type: 'cash', amount: 750 * level }, { type: 'experience', amount: 300 }],
        progress: 0,
        maxProgress: 20 + (level * 5),
        completed: false,
        level: 3
      },
      {
        id: 'weekly_negotiator',
        title: 'Pazarlık Şampiyonu',
        description: '20 başarılı pazarlık yap',
        type: 'weekly' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 20, current: 0 }],
        rewards: [{ type: 'experience', amount: 400 }, { type: 'reputation', amount: 8 }],
        progress: 0,
        maxProgress: 20,
        completed: false,
        level: 3
      },
      {
        id: 'weekly_buyer',
        title: 'Alıcı Uzmanı',
        description: '10 ürün satın al',
        type: 'weekly' as const,
        requirements: [{ type: 'buy_items' as const, target: 10, current: 0 }],
        rewards: [{ type: 'experience', amount: 300 }, { type: 'cash', amount: 400 }],
        progress: 0,
        maxProgress: 10,
        completed: false,
        level: 3
      }
    );
  }
  
  // Level 6+: Advanced weekly missions
  if (level >= 6) {
    weeklyMissions.push(
      {
        id: 'weekly_master_trader',
        title: 'Usta Tüccar',
        description: `${30 + (level * 3)} ürün sat`,
        type: 'weekly' as const,
        requirements: [{ type: 'sell_items' as const, target: 30 + (level * 3), current: 0 }],
        rewards: [{ type: 'cash', amount: 1000 * level }, { type: 'experience', amount: 500 }],
        progress: 0,
        maxProgress: 30 + (level * 3),
        completed: false,
        level: 6
      },
      {
        id: 'weekly_big_money',
        title: 'Büyük Para',
        description: `${3000 * level}₺ kazan`,
        type: 'weekly' as const,
        requirements: [{ type: 'earn_cash' as const, target: 3000 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 600 }, { type: 'reputation', amount: 12 }],
        progress: 0,
        maxProgress: 3000 * level,
        completed: false,
        level: 6
      },
      {
        id: 'weekly_fake_hunter',
        title: 'Sahte Avcısı',
        description: '8 sahte ürün tespit et',
        type: 'weekly' as const,
        requirements: [{ type: 'identify_fake' as const, target: 8, current: 0 }],
        rewards: [{ type: 'experience', amount: 700 }, { type: 'cash', amount: 1500 }],
        progress: 0,
        maxProgress: 8,
        completed: false,
        level: 6
      },
      {
        id: 'weekly_reputation_master',
        title: 'İtibar Ustası',
        description: '25 itibar puan kazan',
        type: 'weekly' as const,
        requirements: [{ type: 'reputation' as const, target: 25, current: 0 }],
        rewards: [{ type: 'experience', amount: 800 }, { type: 'cash', amount: 2000 }],
        progress: 0,
        maxProgress: 25,
        completed: false,
        level: 6
      }
    );
  }
  
  // Return 1-2 weekly missions based on level
  const shuffled = weeklyMissions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, level <= 3 ? 1 : 2);
};

export const calculateLevelProgress = (experience: number) => {
  const currentLevel = Math.floor(experience / 100) + 1;
  return {
    currentLevel,
    experience,
    experienceToNext: (currentLevel * 100) - experience,
    skillPoints: Math.floor(currentLevel / 2)
  };
};

export const getAvailableSkills = () => {
  return [
    {
      id: 'negotiation_master',
      name: 'Pazarlık Ustası',
      description: 'Daha iyi pazarlık',
      level: 0,
      maxLevel: 3,
      cost: 1,
      effects: ['Pazarlık başarı oranı +20%']
    }
  ];
};

export const updateMissionProgress = (missions: Mission[], type: string, amount: number = 1): Mission[] => {
  return missions.map(mission => {
    const requirement = mission.requirements.find(req => req.type === type);
    if (requirement && !mission.completed) {
      const newCurrent = Math.min(requirement.current + amount, requirement.target);
      return {
        ...mission,
        requirements: mission.requirements.map(req =>
          req.type === type ? { ...req, current: newCurrent } : req
        ),
        progress: newCurrent,
        completed: newCurrent >= requirement.target
      };
    }
    return mission;
  });
};