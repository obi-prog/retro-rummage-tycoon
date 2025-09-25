import { useGameStore } from '@/store/gameStore';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Görevler</h2>
        {readyToClaim.length > 0 && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse border-0">
            {readyToClaim.length} ödül bekliyor! 🎁
          </Badge>
        )}
      </div>

      {/* Mission Cards */}
      <div className="space-y-3">
        {activeMissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-gray-500 font-medium">Tüm görevler tamamlandı!</div>
            <div className="text-sm text-gray-400 mt-1">Harikasın! Yeni görevler için bekle</div>
          </div>
        ) : (
          activeMissions.map(mission => (
            <Card 
              key={mission.id} 
              className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-purple-50/50 border-purple-200/50 min-h-[44px]"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Mission Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🎯</span>
                        <h4 className="font-semibold text-gray-800">{mission.title}</h4>
                        <Badge 
                          variant={mission.type === 'daily' ? 'default' : 'secondary'} 
                          className={`text-xs font-medium ${
                            mission.type === 'daily' 
                              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-0' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0'
                          }`}
                        >
                          {mission.type === 'daily' ? 'Günlük' : 'Haftalık'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{mission.description}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>İlerleme</span>
                      <span className="font-medium">{mission.progress}/{mission.maxProgress}</span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Rewards */}
                  {mission.rewards && mission.rewards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500 font-medium">Ödüller:</span>
                      {mission.rewards.map((reward, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          {reward.type === 'cash' && `💰 $${reward.amount}`}
                          {reward.type === 'reputation' && `⭐ ${reward.amount}`}
                          {reward.type === 'experience' && `🔥 ${reward.amount} XP`}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Claim Button */}
                  {mission.completed && (
                    <div className="pt-2">
                      <Button
                        onClick={() => claimMissionReward(mission.id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-11 transition-all duration-200 hover:scale-105"
                      >
                        🎁 Ödülü Topla!
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};