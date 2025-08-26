import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Coins, Heart, Trophy, Star } from 'lucide-react';

export const GameUI = () => {
  const { 
    level, 
    cash, 
    reputation, 
    trust, 
    day, 
    timeLeft, 
    language 
  } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-4">
      {/* Top Bar - Level and Day */}
      <Card className="bg-gradient-to-r from-retro-orange to-retro-pink shadow-lg">
        <CardContent className="p-3">
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
        </CardContent>
      </Card>

      {/* Time and Cash */}
      <div className="grid grid-cols-2 gap-2">
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

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-cash-green" />
              <div>
                <div className="text-xs text-muted-foreground">{t('cash', language)}</div>
                <div className="font-bold text-lg text-cash-green">{cash}₳</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reputation and Trust */}
      <Card className="bg-card/90 backdrop-blur-sm">
        <CardContent className="p-3 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-retro-pink" />
                <span className="text-sm font-medium">{t('reputation', language)}</span>
              </div>
              <span className="text-sm font-bold">{reputation}/100</span>
            </div>
            <Progress value={reputation} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-retro-yellow" />
                <span className="text-sm font-medium">{t('trust', language)}</span>
              </div>
              <span className="text-sm font-bold">{trust}/100</span>
            </div>
            <Progress value={trust} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};