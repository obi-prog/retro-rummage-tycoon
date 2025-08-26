import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { t } from '@/utils/localization';

export const MissionsPanel = () => {
  const { missions, completedMissions, claimMissionReward, language } = useGameStore();

  const activeMissions = missions.filter(m => !completedMissions.includes(m.id));
  const readyToClaim = missions.filter(m => m.completed && !completedMissions.includes(m.id));

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-retro-purple/10 to-retro-pink/10 border-retro-purple/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            🎯 Görevler
            {readyToClaim.length > 0 && (
              <Badge variant="destructive" className="bg-retro-orange">
                {readyToClaim.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeMissions.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <div className="text-2xl mb-2">✅</div>
              <div>Tüm görevler tamamlandı!</div>
            </div>
          ) : (
            activeMissions.map(mission => (
              <Card key={mission.id} className="bg-card/50">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">{mission.title}</div>
                      <div className="text-xs text-muted-foreground">{mission.description}</div>
                    </div>
                    <Badge variant={mission.type === 'daily' ? 'default' : 'secondary'} className="text-xs">
                      {mission.type === 'daily' ? 'Günlük' : 'Haftalık'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={(mission.progress / mission.maxProgress) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {mission.progress}/{mission.maxProgress}
                      </span>
                      {mission.completed && (
                        <Button
                          size="sm"
                          onClick={() => claimMissionReward(mission.id)}
                          className="bg-retro-orange hover:bg-retro-orange/90 text-white h-6 px-2 text-xs"
                        >
                          Ödül Al! 🎁
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {mission.rewards && mission.rewards.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {mission.rewards.map((reward, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {reward.type === 'cash' && `💰${reward.amount}₳`}
                          {reward.type === 'reputation' && `⭐${reward.amount}`}
                          {reward.type === 'experience' && `🔥${reward.amount}XP`}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};