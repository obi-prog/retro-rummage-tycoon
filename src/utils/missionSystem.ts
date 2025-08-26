import { Mission, MissionRequirement } from '@/types/missions';

export const generateDailyMissions = (level: number): Mission[] => {
  const dailyMissions: Mission[] = [];
  
  // Level 1-3: Basic missions (3 daily missions)
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
        description: `${100 * level}$ kazan`,
        type: 'daily' as const,
        requirements: [{ type: 'earn_cash' as const, target: 100 * level, current: 0 }],
        rewards: [{ type: 'experience', amount: 30 }, { type: 'reputation', amount: 1 }],
        progress: 0,
        maxProgress: 100 * level,
        completed: false,
        level: 1
      },
      {
        id: 'daily_buy_basic',
        title: 'Alışveriş',
        description: `${level + 1} ürün satın al`,
        type: 'daily' as const,
        requirements: [{ type: 'buy_items' as const, target: level + 1, current: 0 }],
        rewards: [{ type: 'experience', amount: 20 }, { type: 'cash', amount: 30 }],
        progress: 0,
        maxProgress: level + 1,
        completed: false,
        level: 1
      }
    );
  }
  
  // Level 4-6: Intermediate missions (4 daily missions)
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
      },
      {
        id: 'daily_reputation_gain',
        title: 'İtibar Kazanımı',
        description: '2 itibar puan kazan',
        type: 'daily' as const,
        requirements: [{ type: 'reputation' as const, target: 2, current: 0 }],
        rewards: [{ type: 'experience', amount: 45 }, { type: 'cash', amount: 150 }],
        progress: 0,
        maxProgress: 2,
        completed: false,
        level: 4
      }
    );
  }
  
  // Level 7+: Advanced missions (5 daily missions)
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
        description: `${500 * level}$ kazan`,
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
      },
      {
        id: 'daily_master_negotiator',
        title: 'Usta Pazarlıkçı',
        description: '6 başarılı pazarlık yap',
        type: 'daily' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 6, current: 0 }],
        rewards: [{ type: 'experience', amount: 90 }, { type: 'reputation', amount: 4 }],
        progress: 0,
        maxProgress: 6,
        completed: false,
        level: 7
      },
      {
        id: 'daily_smart_buyer',
        title: 'Akıllı Alıcı',
        description: `${3 + Math.floor(level/3)} ürün satın al`,
        type: 'daily' as const,
        requirements: [{ type: 'buy_items' as const, target: 3 + Math.floor(level/3), current: 0 }],
        rewards: [{ type: 'experience', amount: 70 }, { type: 'cash', amount: 250 }],
        progress: 0,
        maxProgress: 3 + Math.floor(level/3),
        completed: false,
        level: 7
      }
    );
  }
  
  // Return all available daily missions for the level
  return dailyMissions;
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
        description: '1000$ kazan',
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
        description: `${3000 * level}$ kazan`,
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
  
  // Return all weekly missions for the level
  return weeklyMissions;
};

export const generateAchievementMissions = (level: number): Mission[] => {
  const achievements: Mission[] = [];
  
  // Level-based achievement missions that stay available until completed
  if (level >= 1) {
    achievements.push(
      {
        id: 'achievement_first_sale',
        title: 'İlk Satış',
        description: 'İlk ürününü sat',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 1, current: 0 }],
        rewards: [{ type: 'experience', amount: 50 }, { type: 'cash', amount: 100 }],
        progress: 0,
        maxProgress: 1,
        completed: false,
        level: 1
      },
      {
        id: 'achievement_money_maker',
        title: 'Para Babası',
        description: 'Toplam 1000$ kazan',
        type: 'achievement' as const,
        requirements: [{ type: 'earn_cash' as const, target: 1000, current: 0 }],
        rewards: [{ type: 'experience', amount: 100 }, { type: 'reputation', amount: 5 }],
        progress: 0,
        maxProgress: 1000,
        completed: false,
        level: 1
      }
    );
  }
  
  if (level >= 2) {
    achievements.push(
      {
        id: 'achievement_sales_specialist',
        title: 'Satış Uzmanı',
        description: 'Toplam 25 ürün sat',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 25, current: 0 }],
        rewards: [{ type: 'experience', amount: 150 }, { type: 'cash', amount: 300 }],
        progress: 0,
        maxProgress: 25,
        completed: false,
        level: 2
      },
      {
        id: 'achievement_negotiation_pro',
        title: 'Pazarlık Profesyoneli',
        description: 'Toplam 15 başarılı pazarlık yap',
        type: 'achievement' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 15, current: 0 }],
        rewards: [{ type: 'experience', amount: 200 }, { type: 'reputation', amount: 8 }],
        progress: 0,
        maxProgress: 15,
        completed: false,
        level: 2
      }
    );
  }
  
  if (level >= 3) {
    achievements.push(
      {
        id: 'achievement_fake_detector',
        title: 'Sahte Dedektifi',
        description: 'Toplam 10 sahte ürün tespit et',
        type: 'achievement' as const,
        requirements: [{ type: 'identify_fake' as const, target: 10, current: 0 }],
        rewards: [{ type: 'experience', amount: 250 }, { type: 'cash', amount: 500 }],
        progress: 0,
        maxProgress: 10,
        completed: false,
        level: 3
      },
      {
        id: 'achievement_reputation_builder',
        title: 'İtibar İnşacısı',
        description: 'Toplam 50 itibar puan kazan',
        type: 'achievement' as const,
        requirements: [{ type: 'reputation' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 300 }, { type: 'cash', amount: 750 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 3
      }
    );
  }
  
  if (level >= 4) {
    achievements.push(
      {
        id: 'achievement_big_spender',
        title: 'Büyük Alıcı',
        description: 'Toplam 50 ürün satın al',
        type: 'achievement' as const,
        requirements: [{ type: 'buy_items' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 350 }, { type: 'reputation', amount: 10 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 4
      },
      {
        id: 'achievement_millionaire',
        title: 'Milyoner',
        description: 'Toplam 10000$ kazan',
        type: 'achievement' as const,
        requirements: [{ type: 'earn_cash' as const, target: 10000, current: 0 }],
        rewards: [{ type: 'experience', amount: 500 }, { type: 'cash', amount: 2000 }],
        progress: 0,
        maxProgress: 10000,
        completed: false,
        level: 4
      }
    );
  }
  
  if (level >= 5) {
    achievements.push(
      {
        id: 'achievement_sales_master',
        title: 'Satış Ustası',
        description: 'Toplam 100 ürün sat',
        type: 'achievement' as const,
        requirements: [{ type: 'sell_items' as const, target: 100, current: 0 }],
        rewards: [{ type: 'experience', amount: 600 }, { type: 'reputation', amount: 15 }],
        progress: 0,
        maxProgress: 100,
        completed: false,
        level: 5
      },
      {
        id: 'achievement_negotiation_legend',
        title: 'Pazarlık Efsanesi',
        description: 'Toplam 50 başarılı pazarlık yap',
        type: 'achievement' as const,
        requirements: [{ type: 'negotiate_success' as const, target: 50, current: 0 }],
        rewards: [{ type: 'experience', amount: 700 }, { type: 'cash', amount: 1500 }],
        progress: 0,
        maxProgress: 50,
        completed: false,
        level: 5
      }
    );
  }
  
  return achievements.filter(achievement => !achievement.completed);
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
      description: 'Pazarlık başarı oranını artırır',
      level: 0,
      maxLevel: 5,
      cost: 1,
      effects: ['Pazarlık başarı oranı +15% (seviye başına)']
    },
    {
      id: 'fake_detector',
      name: 'Sahte Dedektifi',
      description: 'Sahte ürünleri tespit etme yeteneği',
      level: 0,
      maxLevel: 5,
      cost: 2,
      effects: ['Sahte ürün tespit oranı +20% (seviye başına)']
    },
    {
      id: 'value_assessor',
      name: 'Değer Uzmanı',
      description: 'Ürün değerlerini daha iyi tahmin etme',
      level: 0,
      maxLevel: 3,
      cost: 2,
      effects: ['Ürün değer tahmini +10% doğruluk (seviye başına)']
    },
    {
      id: 'customer_psychology',
      name: 'Müşteri Psikolojisi',
      description: 'Müşteri davranışlarını anlama',
      level: 0,
      maxLevel: 4,
      cost: 3,
      effects: ['Müşteri sabır süresi +20 saniye (seviye başına)', 'Müşteri bütçesi %5 görünür']
    },
    {
      id: 'trend_spotter',
      name: 'Trend Avcısı',
      description: 'Trend ürünlerini erken fark etme',
      level: 0,
      maxLevel: 3,
      cost: 2,
      effects: ['Trend başlangıcında %25 bonus fiyat (seviye başına)']
    },
    {
      id: 'reputation_builder',
      name: 'İtibar İnşacısı',
      description: 'İtibar kazanımını artırır',
      level: 0,
      maxLevel: 4,
      cost: 1,
      effects: ['Her işlemde +1 bonus itibar (seviye başına)']
    },
    {
      id: 'cash_flow_master',
      name: 'Nakit Akış Ustası',
      description: 'Günlük giderleri azaltır',
      level: 0,
      maxLevel: 3,
      cost: 3,
      effects: ['Günlük giderler %15 azalır (seviye başına)']
    },
    {
      id: 'inventory_manager',
      name: 'Envanter Yöneticisi',
      description: 'Daha fazla ürün taşıma kapasitesi',
      level: 0,
      maxLevel: 5,
      cost: 2,
      effects: ['Envanter kapasitesi +3 slot (seviye başına)']
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