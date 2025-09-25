import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  skillCategories, 
  getSkillsByCategory, 
  getAvailableSkills, 
  calculateSkillUpgradeCost,
  canUpgradeSkill,
  isSkillMaxLevel,
  type SkillCategory 
} from '@/utils/skillSystem';
import { t } from '@/utils/localization';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface SkillsPanelProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const SkillsPanel = ({ onClose, isModal = true }: SkillsPanelProps) => {
  const { skillPoints, playerSkills, upgradeSkill, experience, level } = useGameStore();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('negotiation');
  
  const availableSkills = getAvailableSkills(level);

  const getSkillLevel = (skillId: string) => playerSkills[skillId] || 0;

  const handleUpgradeSkill = (skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId);
    if (!skill) return;

    const currentLevel = getSkillLevel(skillId);
    const upgradeCost = calculateSkillUpgradeCost({ ...skill, currentLevel });

    if (canUpgradeSkill({ ...skill, currentLevel }, skillPoints)) {
      upgradeSkill(skillId);
      toast({
        title: "Yetenek Geliştirildi! ✨",
        description: `${skill.name} Seviye ${currentLevel + 1}'e yükseltildi!`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Yetersiz Puan",
        description: `Bu yeteneği geliştirmek için ${upgradeCost} puana ihtiyacın var.`,
        variant: "destructive",
      });
    }
  };

  const skillsByCategory = getSkillsByCategory(selectedCategory);
  const availableSkillsInCategory = skillsByCategory.filter(skill => 
    availableSkills.some(available => available.id === skill.id)
  );

  const SkillsContent = () => (
    <>
      {/* Header */}
      <div className={`${isModal ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 p-6' : 'mb-6'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📒</span>
            <div>
              <h1 className="text-2xl font-bold neon-title">Yetenekler</h1>
              <p className="text-muted-foreground text-sm">Skill Points ile yeteneklerini geliştir</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2 text-base font-bold">
              ⚡ {skillPoints} Puan
            </Badge>
            {isModal && onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-11 w-11 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Experience Info */}
        <div className="mt-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-3 border border-border/30">
          <div className="text-sm text-foreground">
            <span className="font-medium">Deneyim:</span> {experience} XP • 
            <span className="font-medium ml-2">Seviye:</span> {level}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Her 2 seviyede 1 yetenek puanı kazanırsın
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={isModal ? 'p-6' : ''}>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory)}>
          {/* Category Tabs */}
          <TabsList className="grid w-full grid-cols-5 mb-6 h-auto p-1 bg-muted/30">
            {skillCategories.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-1 p-3 min-h-[60px] text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-center leading-tight">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Skills Content */}
          <div className={`${isModal ? 'max-h-[60vh]' : 'max-h-[50vh]'} overflow-y-auto pr-2`}>
            {skillCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0 space-y-4">
                {/* Category Description */}
                <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 border border-border/30">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>

                {/* Skills Grid */}
                <div className="space-y-3">
                  {availableSkillsInCategory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔒</div>
                      <div className="text-muted-foreground font-medium">Bu kategoride henüz yetenek yok</div>
                      <div className="text-sm text-muted-foreground mt-1">Daha yüksek seviyeye çık</div>
                    </div>
                  ) : (
                    availableSkillsInCategory.map(skill => {
                      const currentLevel = getSkillLevel(skill.id);
                      const upgradeCost = calculateSkillUpgradeCost({ ...skill, currentLevel });
                      const canUpgrade = canUpgradeSkill({ ...skill, currentLevel }, skillPoints);
                      const isMaxLevel = isSkillMaxLevel({ ...skill, currentLevel });
                      const isLocked = level < skill.unlockLevel;
                      
                      return (
                        <Card 
                          key={skill.id} 
                          className={`group transition-all duration-300 min-h-[44px] border border-border/50 ${
                            isLocked 
                              ? 'opacity-50 bg-muted/20' 
                              : 'hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-card to-card/80'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Skill Header */}
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="text-2xl">{skill.icon}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-foreground">{skill.name}</h4>
                                      {isLocked && (
                                        <Badge variant="outline" className="text-xs">
                                          Seviye {skill.unlockLevel}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`font-medium min-w-[60px] text-center ${
                                    isMaxLevel 
                                      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200' 
                                      : 'bg-muted/50 text-muted-foreground border-border'
                                  }`}
                                >
                                  {currentLevel}/{skill.maxLevel}
                                </Badge>
                              </div>
                              
                              {/* Effects */}
                              <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Etkiler:</div>
                                <div className="text-xs text-foreground">
                                  {skill.effects.join(', ')}
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>İlerleme</span>
                                  <span>{currentLevel} / {skill.maxLevel}</span>
                                </div>
                                <Progress 
                                  value={(currentLevel / skill.maxLevel) * 100} 
                                  className="h-2"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {!isLocked && !isMaxLevel && (
                                  <Button
                                    onClick={() => handleUpgradeSkill(skill.id)}
                                    disabled={!canUpgrade}
                                    className={`flex-1 font-semibold h-11 transition-all duration-200 ${
                                      canUpgrade
                                        ? 'bg-gradient-to-r from-primary to-accent hover:scale-105 text-primary-foreground'
                                        : 'opacity-50'
                                    }`}
                                  >
                                    ⬆️ Geliştir ({upgradeCost} SP)
                                  </Button>
                                )}

                                {isMaxLevel && (
                                  <div className="flex-1 text-center py-3">
                                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-4 py-2">
                                      ✅ Maksimum Seviye
                                    </Badge>
                                  </div>
                                )}

                                {isLocked && (
                                  <div className="flex-1 text-center py-3">
                                    <Badge variant="outline" className="px-4 py-2">
                                      🔒 Seviye {skill.unlockLevel} Gerekli
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            ))}
          </div>

          {/* Footer */}
          {skillPoints === 0 && availableSkills.length > 0 && (
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="text-amber-700 text-sm font-medium">
                  🌟 Seviye atlayarak daha fazla yetenek puanı kazan!
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </>
  );

  if (!isModal) {
    return <SkillsContent />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-2xl border border-border/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <SkillsContent />
      </div>
    </div>
  );
};