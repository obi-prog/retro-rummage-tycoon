import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent } from '@/components/ui/card';
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
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'very_rare': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConditionText = (condition: number) => {
    if (condition < 25) return t('broken', language);
    if (condition < 50) return t('damaged', language);
    if (condition < 75) return t('good', language);
    return t('excellent', language);
  };

  const getConditionColor = (condition: number) => {
    if (condition < 25) return 'bg-red-500';
    if (condition < 50) return 'bg-orange-500';
    if (condition < 75) return 'bg-yellow-500';
    return 'bg-green-500';
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
    <div className="space-y-4">
      {/* Header with capacity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Envanter</h2>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            {inventory.length} / 10
          </Badge>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-3">
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <div className="text-gray-500 font-medium">Envanter boş</div>
            <div className="text-sm text-gray-400 mt-1">Müşterilerden ürün satın al</div>
          </div>
        ) : (
          inventory.map((item) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-orange-200/50 min-h-[44px]"
              onClick={() => onItemSelect?.(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Item Image */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform duration-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Name and Rarity */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                      <Badge className={`text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                        {t(item.rarity as any, language)}
                      </Badge>
                    </div>
                    
                    {/* Category */}
                    <div className="text-sm text-gray-600">
                      {t(item.category as any, language)}
                    </div>
                    
                    {/* Condition Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{getConditionText(item.condition)}</span>
                        <span className="font-medium">{item.condition}%</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getConditionColor(item.condition)}`}
                            style={{ width: `${item.condition}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Authenticity Warning */}
                    {item.authenticity !== 'authentic' && (
                      <Badge variant="destructive" className="text-xs bg-red-100 text-red-700 border-red-200">
                        {item.authenticity === 'fake' ? '⚠️ Sahte' : '❓ Şüpheli'}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                      <span>💵</span>
                      <span>${calculateSellPrice(item)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};