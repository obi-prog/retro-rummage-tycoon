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
    language 
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [haggleCount, setHaggleCount] = useState(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');

  useEffect(() => {
    if (!currentCustomer && Math.random() < 0.3) {
      // 30% chance of customer entering
      const newCustomer = generateCustomer();
      setCurrentCustomer(newCustomer);
      setHaggleCount(0);
    }
  }, [currentCustomer, setCurrentCustomer]);

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
        <Card className="bg-gradient-to-r from-retro-purple to-retro-cyan">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-center">
              {currentCustomer.avatar} {currentCustomer.name}
            </CardTitle>
            <div className="text-center">
              <Badge className="bg-white/20 text-white">
                {t(currentCustomer.type as any, language)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-white text-center">
            <div className="space-y-2">
              <div>💰 Budget: {currentCustomer.budget}₳</div>
              <div>⏰ Patience: {currentCustomer.patience}/100</div>
              {customerResponse && (
                <div className="bg-white/20 p-2 rounded text-sm">
                  💬 "{customerResponse}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            🚶 Waiting for customers...
          </CardContent>
        </Card>
      )}

      {/* Shop Items */}
      {currentCustomer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏪 Your Shop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventory.map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all ${
                  selectedItem?.id === item.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="text-xs text-muted-foreground">
                        {t(item.category as any, language)}
                      </div>
                      <div className="font-bold text-cash-green">
                        {calculateSellPrice(item)}₳
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
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-lg">💰 {t('haggle', language)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Current Offer</div>
              <div className="text-2xl font-bold text-cash-green">{currentOffer}₳</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCounterOffer(-10)}
              >
                -10₳
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={handleAcceptOffer}
              >
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCounterOffer(10)}
              >
                +10₳
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleCounterOffer(-25)}
              >
                -25₳
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleCounterOffer(25)}
              >
                +25₳
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};