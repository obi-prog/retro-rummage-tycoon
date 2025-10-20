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
          <div className="w-full mb-4 -mx-1">
            <TabsList className="flex w-auto h-auto p-1 bg-muted/30 gap-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
              <div className="flex gap-1 px-1">
                {skillCategories.map(category => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center gap-1 p-2 min-h-[56px] min-w-[72px] flex-shrink-0 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all whitespace-nowrap"
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-center leading-tight text-[10px]">{category.name}</span>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </div>

          {/* Skills Content */}
          <div className={`${isModal ? 'max-h-[55vh]' : 'max-h-[45vh]'} overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent`}>
            {skillCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0 space-y-3">
                {/* Category Description */}
                <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-3 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl flex-shrink-0">{category.icon}</span>
                    <h3 className="text-base font-semibold text-foreground">{category.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">{category.description}</p>
                </div>

                {/* Skills Grid */}
                <div className="space-y-2.5">
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
                          className={`group transition-all duration-200 border border-border/50 ${
                            isLocked 
                              ? 'opacity-50 bg-muted/20' 
                              : 'active:scale-[0.98] bg-gradient-to-r from-card to-card/80'
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2.5">
                              {/* Skill Header */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  <span className="text-xl flex-shrink-0">{skill.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold text-sm text-foreground break-words">{skill.name}</h4>
                                      {isLocked && (
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 flex-shrink-0">
                                          Sev {skill.unlockLevel}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5 break-words leading-relaxed">{skill.description}</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`font-medium text-[10px] px-2 py-0.5 flex-shrink-0 ${
                                    isMaxLevel 
                                      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200' 
                                      : 'bg-muted/50 text-muted-foreground border-border'
                                  }`}
                                >
                                  {currentLevel}/{skill.maxLevel}
                                </Badge>
                              </div>
                              
                              {/* Effects */}
                              <div className="bg-muted/30 p-2 rounded-md border border-border/30">
                                <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Etkiler:</div>
                                <div className="text-[10px] text-foreground break-words leading-relaxed">
                                  {skill.effects.join(', ')}
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                  <span>İlerleme</span>
                                  <span>{currentLevel}/{skill.maxLevel}</span>
                                </div>
                                <Progress 
                                  value={(currentLevel / skill.maxLevel) * 100} 
                                  className="h-1.5"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {!isLocked && !isMaxLevel && (
                                  <Button
                                    onClick={() => handleUpgradeSkill(skill.id)}
                                    disabled={!canUpgrade}
                                    className={`flex-1 font-semibold h-9 text-xs transition-all duration-200 ${
                                      canUpgrade
                                        ? 'bg-gradient-to-r from-primary to-accent active:scale-95 text-primary-foreground'
                                        : 'opacity-50'
                                    }`}
                                  >
                                    ⬆️ Geliştir ({upgradeCost} SP)
                                  </Button>
                                )}

                                {isMaxLevel && (
                                  <div className="flex-1 text-center py-2">
                                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-[10px]">
                                      ✅ Maksimum
                                    </Badge>
                                  </div>
                                )}

                                {isLocked && (
                                  <div className="flex-1 text-center py-2">
                                    <Badge variant="outline" className="px-3 py-1 text-[10px]">
                                      🔒 Sev {skill.unlockLevel} Gerekli
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
            <div className="mt-3 text-center">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3">
                <div className="text-amber-700 text-xs font-medium break-words">
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-2xl border border-border/50 w-full max-w-lg max-h-[92vh] overflow-hidden">
        <SkillsContent />
      </div>
    </div>
  );
};