import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Gift, Zap } from 'lucide-react';
import { getLevelConfig } from '@/utils/levelSystem';
import { Language } from '@/types/game';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newUnlocks: string[];
  skillPointsEarned: number;
  language: Language;
}

const getUnlockDisplayName = (unlock: string, language: Language) => {
  const unlockNames = {
    verify: { tr: 'Orijinallik Testi', en: 'Authenticity Check', de: 'Echtheitsprüfung' },
    repair: { tr: 'Tamir Atölyesi', en: 'Repair Workshop', de: 'Reparaturwerkstatt' },
    newCats: { tr: 'Yeni Kategoriler', en: 'New Categories', de: 'Neue Kategorien' },
    shelfExpand: { tr: 'Raf Genişletme', en: 'Shelf Expansion', de: 'Regal-Erweiterung' },
    trendCal: { tr: 'Trend Takvimi', en: 'Trend Calendar', de: 'Trend-Kalender' },
    npcHelper: { tr: 'Asistan Yardımcı', en: 'NPC Helper', de: 'NPC-Helfer' },
    advRepair: { tr: 'Gelişmiş Tamir', en: 'Advanced Repair', de: 'Erweiterte Reparatur' }
  };
  
  return unlockNames[unlock as keyof typeof unlockNames]?.[language] || unlock;
};

const getLocalizedText = (key: string, language: Language): string => {
  const texts = {
    level_up: { tr: 'Seviye Atla', en: 'Level Up', de: 'Level Aufstieg' },
    level: { tr: 'Seviye', en: 'Level', de: 'Level' },
    unlocked: { tr: 'açıldı', en: 'unlocked', de: 'freigeschaltet' },
    skill_points: { tr: 'Yetenek Puanı', en: 'Skill Points', de: 'Fähigkeitspunkte' },
    new_features: { tr: 'Yeni Özellikler', en: 'New Features', de: 'Neue Funktionen' },
    congratulations: { tr: 'Tebrikler', en: 'Congratulations', de: 'Herzlichen Glückwunsch' },
    new_day_starting: { tr: 'Yeni gün başlıyor', en: 'New day is starting', de: 'Ein neuer Tag beginnt' },
    continue: { tr: 'Devam Et', en: 'Continue', de: 'Weiter' }
  };
  
  return texts[key as keyof typeof texts]?.[language] || key;
};

export const LevelUpModal = ({ 
  isOpen, 
  onClose, 
  newLevel, 
  newUnlocks, 
  skillPointsEarned, 
  language 
}: LevelUpModalProps) => {
  const config = getLevelConfig(newLevel);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto animate-in fade-in-0 zoom-in-95">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-16 h-16 text-gradient-primary animate-pulse" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-retro-orange to-retro-pink text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {newLevel}
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-retro-orange via-retro-pink to-retro-cyan bg-clip-text text-transparent">
            🎉 {getLocalizedText('level_up', language)}!
          </DialogTitle>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {getLocalizedText('level', language)} {newLevel} {getLocalizedText('unlocked', language)}!
          </Badge>
        </DialogHeader>

        <div className="space-y-4">
          {/* Skill Points Earned */}
          <Card className="bg-gradient-to-r from-retro-cyan/10 to-retro-blue/10 border-retro-cyan/20">
            <CardContent className="p-4 flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-retro-cyan" />
              <span className="font-bold">+{skillPointsEarned} {getLocalizedText('skill_points', language)}</span>
            </CardContent>
          </Card>

          {/* New Unlocks */}
          {newUnlocks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Gift className="w-4 h-4 text-retro-orange" />
                <span>{getLocalizedText('new_features', language)}:</span>
              </div>
              <div className="space-y-1">
                {newUnlocks.map((unlock, index) => (
                  <Card key={index} className="bg-gradient-to-r from-retro-orange/10 to-retro-pink/10 border-retro-orange/20">
                    <CardContent className="p-3 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-retro-orange" />
                      <span className="text-sm font-medium">
                        {getUnlockDisplayName(unlock, language)}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Level Goals */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>{getLocalizedText('congratulations', language)}!</p>
            <p>{getLocalizedText('new_day_starting', language)}</p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90 text-white px-8 py-2 rounded-full font-bold shadow-lg animate-pulse"
          >
            {getLocalizedText('continue', language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};