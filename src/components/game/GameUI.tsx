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

export const GameUI = () => {
  const { 
    level, 
    cash, 
    reputation, 
    trust, 
    day, 
    timeLeft, 
    language,
    experience 
  } = useGameStore();

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
                <span className="font-bold">{t('day', language)} {day}</span>
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

        {/* Cash */}
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-cash-green" />
              <div>
                <div className="text-xs text-muted-foreground">{t('cash', language)}</div>
                <div className="font-bold text-lg text-cash-green">${cash}</div>
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

      {/* Game Tabs */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="inventory">📦 Envanter</TabsTrigger>
          <TabsTrigger value="shop">🛒 Dükkan</TabsTrigger>
          <TabsTrigger value="missions">🎯 Görevler</TabsTrigger>
          <TabsTrigger value="skills">⚡ Yetenekler</TabsTrigger>
          <TabsTrigger value="events">📰 Olaylar</TabsTrigger>
          <TabsTrigger value="financials">💰 Mali Durum</TabsTrigger>
          <TabsTrigger value="appraisal">🔍 Değerlendirme</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Inventory />
        </TabsContent>

        <TabsContent value="shop">
          <Shop />
        </TabsContent>

        <TabsContent value="missions">
          <MissionsPanel />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsPanel />
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