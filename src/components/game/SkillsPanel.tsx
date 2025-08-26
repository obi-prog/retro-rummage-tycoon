import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAvailableSkills } from '@/utils/missionSystem';
import { t } from '@/utils/localization';

export const SkillsPanel = () => {
  const { skillPoints, playerSkills, upgradeSkill, experience, language } = useGameStore();
  const availableSkills = getAvailableSkills();

  const getSkillLevel = (skillId: string) => playerSkills[skillId] || 0;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-retro-cyan/10 to-retro-purple/10 border-retro-cyan/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            🎓 Yetenekler
            <Badge className="bg-retro-cyan text-white">
              {skillPoints} Puan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground mb-3">
            Deneyim: {experience} XP • Her 2 seviyede 1 yetenek puanı kazanırsın
          </div>
          
          {availableSkills.map(skill => {
            const currentLevel = getSkillLevel(skill.id);
            const canUpgrade = currentLevel < skill.maxLevel && skillPoints >= skill.cost;
            
            return (
              <Card key={skill.id} className="bg-card/50">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{skill.name}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {skill.description}
                      </div>
                      <div className="text-xs text-retro-cyan">
                        {skill.effects.join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">
                        {currentLevel}/{skill.maxLevel}
                      </Badge>
                      {canUpgrade && (
                        <Button
                          size="sm"
                          onClick={() => upgradeSkill(skill.id)}
                          className="bg-retro-cyan hover:bg-retro-cyan/90 text-white h-6 px-2 text-xs"
                        >
                          Geliştir ({skill.cost} puan)
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Progress 
                    value={(currentLevel / skill.maxLevel) * 100} 
                    className="h-1"
                  />
                </CardContent>
              </Card>
            );
          })}
          
          {skillPoints === 0 && (
            <div className="text-center text-muted-foreground py-2">
              <div className="text-sm">Seviye atlayarak yetenek puanı kazan!</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};