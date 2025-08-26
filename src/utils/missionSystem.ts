import { Mission, MissionRequirement } from '@/types/missions';

export const generateDailyMissions = (level: number): Mission[] => {
  return [
    {
      id: 'daily_sales',
      title: 'Günlük Satış',
      description: '3 ürün sat',
      type: 'daily' as const,
      requirements: [{ type: 'sell_items' as const, target: 3, current: 0 }],
      rewards: [{ type: 'cash', amount: 100 }],
      progress: 0,
      maxProgress: 3,
      completed: false,
      level: 1
    }
  ];
};

export const generateWeeklyMissions = (level: number): Mission[] => {
  return [];
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