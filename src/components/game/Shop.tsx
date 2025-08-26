import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Item, Customer } from '@/types/game';
import { generateCustomer, generateHaggleResponse } from '@/utils/gameLogic';

export const Shop = () => {
  const { 
    inventory, 
    currentCustomer, 
    setCurrentCustomer, 
    sellItem, 
    updateReputation, 
    updateTrust,
    language,
    timeLeft 
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [haggleCount, setHaggleCount] = useState(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const tryGenerateCustomer = () => {
      if (!currentCustomer && timeLeft > 0) {
        if (Math.random() < 0.4) { // 40% chance
          const customers: Customer[] = [
            {
              id: '1',
              name: 'Ahmet Koleksiyoncu',
              type: 'collector',
              patience: 80,
              budget: 1000,
              knowledge: 90,
              preferences: ['cassette_record', 'walkman_electronics'],
              avatar: '👨‍💼'
            },
            {
              id: '2',
              name: 'Elif Öğrenci',
              type: 'student',
              patience: 60,
              budget: 200,
              knowledge: 40,
              preferences: ['comic', 'poster'],
              avatar: '👩‍🎓'
            },
            {
              id: '3',
              name: 'Mehmet Nostaljik',
              type: 'nostalgic',
              patience: 70,
              budget: 500,
              knowledge: 60,
              preferences: ['toy', 'watch'],
              avatar: '👴'
            }
          ];
          
          const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
          setCurrentCustomer(randomCustomer);
        }
      }
    };

    // Only start interval if no customer and time left
    if (!currentCustomer && timeLeft > 0) {
      tryGenerateCustomer(); // Try immediately
      interval = setInterval(tryGenerateCustomer, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCustomer, timeLeft, setCurrentCustomer]);

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

  const handleItemSelect = (item: Item) => {
    if (!currentCustomer) return;
    
    setSelectedItem(item);
    const basePrice = calculateSellPrice(item);
    setCurrentOffer(basePrice);
    setCustomerResponse('');
  };

  const handleHaggle = (newPrice: number) => {
    if (!currentCustomer || !selectedItem) return;
    
    const response = generateHaggleResponse(currentCustomer, selectedItem, newPrice, haggleCount);
    setCustomerResponse(response.message);
    setHaggleCount(prev => prev + 1);
    
    if (response.accepted) {
      sellItem(selectedItem, newPrice);
      updateReputation(response.reputationChange);
      updateTrust(response.trustChange);
      setCurrentCustomer(null);
      setSelectedItem(null);
      setCurrentOffer(0);
      setHaggleCount(0);
    } else if (response.counter) {
      setCurrentOffer(response.counter);
    } else if (haggleCount >= 3) {
      // Customer leaves after too many haggles
      setCurrentCustomer(null);
      setSelectedItem(null);
      setCurrentOffer(0);
      setHaggleCount(0);
    }
  };

  const handleAcceptOffer = () => {
    if (!currentCustomer || !selectedItem) return;
    handleHaggle(currentOffer);
  };

  const handleCounterOffer = (adjustment: number) => {
    const newPrice = Math.max(1, currentOffer + adjustment);
    setCurrentOffer(newPrice);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-4">
      {/* Customer Display */}
      {currentCustomer ? (
        <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Customer Avatar */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                {currentCustomer.avatar}
              </div>
              
              {/* Customer Info */}
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{currentCustomer.name}</h3>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  {t(currentCustomer.type as any, language)}
                </Badge>
              </div>
              
              {/* Customer Stats */}
              <div className="grid grid-cols-2 gap-4 w-full text-white text-sm">
                <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
                  <div className="text-yellow-200">💰</div>
                  <div className="font-semibold">{currentCustomer.budget}₳</div>
                  <div className="text-xs opacity-80">{t('budget', language)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
                  <div className="text-red-200">⏰</div>
                  <div className="font-semibold">{currentCustomer.patience}%</div>
                  <div className="text-xs opacity-80">{t('patience', language)}</div>
                </div>
              </div>
              
              {/* Customer Speech */}
              {customerResponse && (
                <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 w-full">
                  <div className="text-xs text-white/80 mb-1">{t('customerSays', language)}</div>
                  <div className="text-white font-medium">💬 "{customerResponse}"</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50 border-dashed border-2">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-2">🚶‍♂️</div>
            <div className="text-muted-foreground">{t('waitingCustomers', language)}</div>
          </CardContent>
        </Card>
      )}

      {/* Shop Items - Only show when customer is present */}
      {currentCustomer && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              🏪 {t('yourShop', language)}
            </CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {t('customerWants', language)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {inventory.map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedItem?.id === item.id 
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg' 
                    : 'hover:shadow-md border-2 border-transparent hover:border-primary/20'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">{item.name}</h4>
                      <div className="text-sm text-muted-foreground mb-1">
                        {t(item.category as any, language)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {calculateSellPrice(item)}₳
                        </div>
                        {selectedItem?.id === item.id && (
                          <Badge className="bg-green-500 text-white">Seçili</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Haggle Interface */}
      {selectedItem && currentCustomer && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              💰 {t('haggle', language)}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {t('negotiating', language)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Item Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{selectedItem.image}</div>
                <div>
                  <div className="font-semibold">{selectedItem.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {t(selectedItem.category as any, language)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Display */}
            <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">{t('yourPrice', language)}</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {currentOffer}₳
              </div>
            </div>
            
            {/* Price Controls */}
            <div className="space-y-3">
              {/* Quick adjust buttons */}
              <div className="grid grid-cols-5 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCounterOffer(-25)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  -25₳
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCounterOffer(-10)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  -10₳
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={handleAcceptOffer}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  {t('accept', language)}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCounterOffer(10)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  +10₳
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCounterOffer(25)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  +25₳
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};