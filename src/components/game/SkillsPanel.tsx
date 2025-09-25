import { useGameStore } from '@/store/gameStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAvailableSkills } from '@/utils/missionSystem';
import { t } from '@/utils/localization';

export const SkillsPanel = () => {
  const { skillPoints, playerSkills, upgradeSkill, experience, language } = useGameStore();
  const availableSkills = getAvailableSkills();

  const getSkillLevel = (skillId: string) => playerSkills[skillId] || 0;

  const getSkillIcon = (skillId: string) => {
    const icons: Record<string, string> = {
      'negotiation': '🤝',
      'appraisal': '🔍',
      'charm': '😊',
      'intimidation': '😠',
      'fake_detection': '🕵️',
      'business': '💼',
      'luck': '🍀',
      'patience': '⏰'
    };
    return icons[skillId] || '⚡';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Yetenekler</h2>
        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
          {skillPoints} Puan
        </Badge>
      </div>

      {/* Experience Info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200/50">
        <div className="text-sm text-blue-700">
          <span className="font-medium">Toplam Deneyim:</span> {experience} XP
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Her 2 seviyede 1 yetenek puanı kazanırsın
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-3">
        {availableSkills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎓</div>
            <div className="text-gray-500 font-medium">Henüz yetenek yok</div>
            <div className="text-sm text-gray-400 mt-1">Seviye atla ve yetenekleri aç</div>
          </div>
        ) : (
          availableSkills.map(skill => {
            const currentLevel = getSkillLevel(skill.id);
            const canUpgrade = currentLevel < skill.maxLevel && skillPoints >= skill.cost;
            
            return (
              <Card 
                key={skill.id} 
                className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-cyan-50/50 border-cyan-200/50 min-h-[44px]"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Skill Header */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getSkillIcon(skill.id)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{skill.name}</h4>
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-white/80 text-cyan-700 border-cyan-200 font-medium"
                      >
                        {currentLevel}/{skill.maxLevel}
                      </Badge>
                    </div>
                    
                    {/* Effects */}
                    <div className="bg-cyan-50/50 p-2 rounded border border-cyan-100">
                      <div className="text-xs text-cyan-700 font-medium mb-1">Etkiler:</div>
                      <div className="text-xs text-cyan-600">
                        {skill.effects.join(', ')}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Seviye</span>
                        <span>{currentLevel} / {skill.maxLevel}</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(currentLevel / skill.maxLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Button */}
                    {canUpgrade && (
                      <Button
                        onClick={() => upgradeSkill(skill.id)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-11 transition-all duration-200 hover:scale-105"
                      >
                        ⬆️ Geliştir ({skill.cost} puan)
                      </Button>
                    )}

                    {currentLevel >= skill.maxLevel && (
                      <div className="text-center py-2">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                          ✅ Maksimum Seviye
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* No Skill Points Message */}
      {skillPoints === 0 && availableSkills.length > 0 && (
        <div className="text-center py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-amber-700 text-sm font-medium">
              🌟 Seviye atlayarak yetenek puanı kazan!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};