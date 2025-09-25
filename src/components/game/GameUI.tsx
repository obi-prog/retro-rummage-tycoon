import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Coins, Heart, Trophy, Star, Zap } from 'lucide-react';
import { Inventory } from './Inventory';
import { Shop } from './Shop';
import { AppraisalTool } from './AppraisalTool';
import { MissionsPanel } from './MissionsPanel';
import { EventsPanel } from './EventsPanel';
import { SkillsPanel } from './SkillsPanel';
import { FinancialLedger } from './FinancialLedger';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { useSoundContext } from '@/contexts/SoundContext';
import { useEffect } from 'react';
import { getLevelConfig } from '@/utils/levelSystem';

export const GameUI = () => {
  const { 
    level, 
    cash, 
    reputation, 
    trust, 
    day, 
    timeLeft, 
    language,
    experience,
    unlocks,
    showLevelUpModal,
    setShowLevelUpModal,
    skillPoints
  } = useGameStore();

  const { settings } = useSoundContext();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExperienceToNext = () => {
    return (level * 100) - experience;
  };

  const getLevelProgress = () => {
    const currentLevelXP = (level - 1) * 100;
    const nextLevelXP = level * 100;
    return ((experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  const levelConfig = getLevelConfig(level);
  const nextLevelConfig = getLevelConfig(level + 1);

  // Apply level background color dynamically
  useEffect(() => {
    document.body.style.backgroundColor = levelConfig.bgColor;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [levelConfig.bgColor]);

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Level & XP */}
        <Card className="bg-gradient-to-r from-retro-orange to-retro-pink shadow-lg">
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">{t('level', language)} {level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="font-bold">Hafta {Math.ceil(day / 7)} Gün {((day - 1) % 7) + 1}</span>
              </div>
            </div>
            
            {/* Experience Progress */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-white text-xs">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>XP</span>
                </div>
                <span>{experience} / {level * 100} ({getExperienceToNext()} kaldı)</span>
              </div>
              <Progress value={getLevelProgress()} className="h-1.5 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Time */}
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-retro-cyan" />
              <div>
                <div className="text-xs text-muted-foreground">Time Left</div>
                <div className="font-bold text-lg">{formatTime(timeLeft)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash & Progress */}
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-cash-green" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{t('cash', language)}</div>
                <div className="font-bold text-lg text-cash-green">${cash.toLocaleString()}</div>
                {nextLevelConfig && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Hedef: ${nextLevelConfig.targetCash.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reputation and Trust */}
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-3 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-retro-pink" />
                  <span className="text-xs font-medium">{t('reputation', language)}</span>
                </div>
                <span className="text-xs font-bold">{reputation}/100</span>
              </div>
              <Progress value={reputation} className="h-1" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-retro-yellow" />
                  <span className="text-xs font-medium">{t('trust', language)}</span>
                </div>
                <span className="text-xs font-bold">{trust}/100</span>
              </div>
              <Progress value={trust} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        newLevel={level}
        newUnlocks={unlocks}
        skillPointsEarned={1}
        language={language}
      />

      {/* Game Tabs */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="inventory">📦 Envanter</TabsTrigger>
          <TabsTrigger value="missions">🎯 Görevler</TabsTrigger>
          <TabsTrigger value="skills">⚡ Yetenekler</TabsTrigger>
          <TabsTrigger value="events">📰 Olaylar</TabsTrigger>
          <TabsTrigger value="financials">💰 Mali Durum</TabsTrigger>
          <TabsTrigger value="appraisal">🔍 Değerlendirme</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Inventory />
        </TabsContent>

        <TabsContent value="missions">
          <MissionsPanel />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsPanel isModal={false} />
        </TabsContent>

        <TabsContent value="events">
          <EventsPanel />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialLedger />
        </TabsContent>

        <TabsContent value="appraisal">
          <div className="text-center p-8">
            <p className="text-muted-foreground">Değerlendirme aracı seçilen eşyalarla kullanılabilir</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};