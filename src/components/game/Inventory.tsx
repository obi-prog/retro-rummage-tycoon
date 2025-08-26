import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Item } from '@/types/game';

interface InventoryProps {
  onItemSelect?: (item: Item) => void;
}

export const Inventory = ({ onItemSelect }: InventoryProps) => {
  const { inventory, language } = useGameStore();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-muted';
      case 'rare': return 'bg-retro-cyan';
      case 'very_rare': return 'bg-retro-purple';
      case 'legendary': return 'bg-retro-orange';
      default: return 'bg-muted';
    }
  };

  const getConditionText = (condition: number) => {
    if (condition < 25) return t('broken', language);
    if (condition < 50) return t('damaged', language);
    if (condition < 75) return t('good', language);
    return t('excellent', language);
  };

  const calculateSellPrice = (item: Item) => {
    const conditionMultiplier = 1 + (item.condition / 100);
    const rarityMultiplier = {
      common: 1,
      rare: 1.5,
      very_rare: 2.5,
      legendary: 4
    }[item.rarity];
    
    return Math.floor(item.baseValue * conditionMultiplier * rarityMultiplier * (1 + item.trendBonus / 100));
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            📦 {t('inventory', language)}
            <Badge variant="secondary">{inventory.length}/10</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inventory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No items in inventory
            </div>
          ) : (
            inventory.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow bg-background border-border"
                onClick={() => onItemSelect?.(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <Badge 
                          className={`text-xs ${getRarityColor(item.rarity)}`}
                        >
                          {t(item.rarity as any, language)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{getConditionText(item.condition)}</span>
                            <span>{item.condition}%</span>
                          </div>
                          <Progress value={item.condition} className="h-1" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {t(item.category as any, language)}
                          </span>
                          <span className="font-bold text-cash-green text-sm">
                            {calculateSellPrice(item)}₳
                          </span>
                        </div>
                        
                        {item.authenticity !== 'authentic' && (
                          <Badge variant="destructive" className="text-xs">
                            {item.authenticity === 'fake' ? '⚠️ Fake' : '❓ Suspicious'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};