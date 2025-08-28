import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Item, Customer } from '@/types/game';
import { generateCustomer, generateHaggleResponse, calculateItemValue, generateCustomerInitialOffer, generateInitialMessage } from '@/utils/gameLogic';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Minus, Plus } from 'lucide-react';

export const Shop = () => {
  const { 
    inventory, 
    currentCustomer, 
    setCurrentCustomer, 
    sellItem, 
    addToInventory,
    spendCash,
    addCash,
    updateReputation, 
    updateTrust,
    language,
    cash,
    customersServed,
    dailyCustomerLimit,
    serveCustomer
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [tempOffer, setTempOffer] = useState<number>(0);
  const [customerFrustration, setCustomerFrustration] = useState(0);

  // Auto-generate customer if none present and daily limit not reached
  useEffect(() => {
    if (!currentCustomer && customersServed < dailyCustomerLimit) {
      const timer = setTimeout(() => {
        if (!currentCustomer && customersServed < dailyCustomerLimit) {
          const newCustomer = generateCustomer();
          setCurrentCustomer(newCustomer);
          
          // Auto-select item and set initial offer
          setTimeout(() => {
            if (newCustomer.intent === 'buy' && inventory.length > 0) {
              const interestedItem = inventory[Math.floor(Math.random() * inventory.length)];
              setSelectedItem(interestedItem);
              
              const itemValue = calculateItemValue(interestedItem);
              const customerOffer = Math.max(10, generateCustomerInitialOffer(newCustomer, itemValue)); // Ensure minimum $10
              setCurrentOffer(customerOffer);
              setCustomerResponse(generateInitialMessage(newCustomer, interestedItem, customerOffer));
            } else if (newCustomer.intent === 'sell' && newCustomer.carriedItem) {
              setSelectedItem(newCustomer.carriedItem);
              const itemValue = calculateItemValue(newCustomer.carriedItem);
              const customerAskingPrice = Math.max(10, Math.floor(itemValue * (0.8 + Math.random() * 0.3))); // Ensure minimum $10
              setCurrentOffer(customerAskingPrice);
              setCustomerResponse(`I have this ${newCustomer.carriedItem.name}. I'm asking $${customerAskingPrice} for it.`);
            }
          }, 1000);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentCustomer, customersServed, dailyCustomerLimit, inventory, setCurrentCustomer]);

  const resetNegotiation = () => {
    setCurrentCustomer(null);
    setSelectedItem(null);
    setCurrentOffer(0);
    setCustomerResponse('');
    setShowOfferModal(false);
    setTempOffer(0);
    setCustomerFrustration(0);
    serveCustomer(); // Increment customer counter
  };

  const handleMakeOffer = () => {
    if (!currentCustomer || !selectedItem) return;
    
    const itemValue = calculateItemValue(selectedItem);
    setTempOffer(Math.max(10, Math.floor(itemValue * 0.8))); // Start with 80% of market value, minimum $10
    setShowOfferModal(true);
  };

  const handleSubmitOffer = () => {
    if (!currentCustomer || tempOffer <= 0) return;
    
    const item = selectedItem || currentCustomer.carriedItem!;
    const itemValue = calculateItemValue(item);
    const offerRatio = tempOffer / itemValue;
    
    let response;
    let shouldAccept = false;
    
    if (currentCustomer.intent === 'buy') {
      // Customer wants to buy from us
      let acceptanceThreshold = 0.7;
      let priceToleranceMultiplier = 1.2;
      
      // Apply personality traits
      switch (currentCustomer.type) {
        case 'student':
          acceptanceThreshold = 0.4;
          priceToleranceMultiplier = 1.1;
          break;
        case 'collector':
          if (item.rarity === 'rare' || item.rarity === 'very_rare' || item.rarity === 'legendary') {
            acceptanceThreshold = 0.8;
            priceToleranceMultiplier = 1.5;
          }
          break;
        case 'tourist':
          if (currentCustomer.knowledge < 5) {
            acceptanceThreshold = 0.8;
            priceToleranceMultiplier = 1.4;
          }
          break;
        case 'expert':
          acceptanceThreshold = 0.5;
          priceToleranceMultiplier = 1.15;
          break;
        case 'hunter':
          acceptanceThreshold = 0.6;
          break;
      }
      
      if (tempOffer <= currentCustomer.budget && offerRatio <= priceToleranceMultiplier) {
        if (Math.random() < acceptanceThreshold) {
          response = "That sounds fair, I'll take it!";
          shouldAccept = true;
        } else {
          const counterOffer = Math.max(10, Math.floor(tempOffer * 0.9));
          response = `How about $${counterOffer} instead?`;
          setCurrentOffer(counterOffer);
        }
      } else {
        if (currentCustomer.type === 'student') {
          response = "That's way too expensive for my budget!";
        } else if (currentCustomer.type === 'expert') {
          response = "I know the market value. That price is unrealistic.";
        } else {
          response = "That's too expensive for me.";
        }
        
        if (offerRatio > 1.5) setCustomerFrustration(prev => prev + 2);
        else if (offerRatio > 1.2) setCustomerFrustration(prev => prev + 1);
      }
    } else {
      // Customer wants to sell to us
      let acceptanceThreshold = 0.7;
      let minPriceRatio = 0.6;
      
      switch (currentCustomer.type) {
        case 'student':
          acceptanceThreshold = 0.8;
          minPriceRatio = 0.5;
          break;
        case 'collector':
          acceptanceThreshold = 0.4;
          minPriceRatio = 0.8;
          break;
        case 'expert':
          acceptanceThreshold = 0.3;
          minPriceRatio = 0.85;
          break;
        case 'hunter':
          acceptanceThreshold = 0.9;
          minPriceRatio = 0.55;
          break;
        case 'tourist':
          acceptanceThreshold = 0.8;
          minPriceRatio = 0.5;
          break;
      }
      
      if (tempOffer <= cash && offerRatio >= minPriceRatio) {
        if (Math.random() < acceptanceThreshold) {
          response = "Deal! I'll sell it for that price.";
          shouldAccept = true;
        } else {
          const counterOffer = Math.max(10, Math.floor(tempOffer * 1.1));
          response = `Could you make it $${counterOffer}?`;
          setCurrentOffer(counterOffer);
        }
      } else {
        if (currentCustomer.type === 'expert') {
          response = "I know what this is worth. That offer is insulting.";
        } else if (currentCustomer.type === 'collector') {
          response = "This item has sentimental value.";
        } else {
          response = "That's too low for me.";
        }
        
        if (offerRatio < 0.4) setCustomerFrustration(prev => prev + 2);
        else if (offerRatio < 0.6) setCustomerFrustration(prev => prev + 1);
      }
    }
    
    setCustomerResponse(response);
    setShowOfferModal(false);
    
    if (shouldAccept) {
      setTimeout(() => {
        if (currentCustomer.intent === 'buy') {
          sellItem(item, tempOffer);
          updateReputation(2);
          updateTrust(1);
        } else {
          if (spendCash(tempOffer)) {
            addToInventory(item);
            updateReputation(2);
            updateTrust(1);
          }
        }
        resetNegotiation();
      }, 1500);
    } else if (customerFrustration >= 2) {
      setTimeout(() => {
        toast({
          title: "Müşteri Çekti Gitti! 😤",
          description: "Müşteri pazarlığı beğenmedi ve gitti.",
          variant: "destructive",
        });
        resetNegotiation();
      }, 2000);
    }
  };

  const handleAcceptOffer = () => {
    if (!currentCustomer || !selectedItem) return;
    
    if (currentCustomer.intent === 'buy') {
      sellItem(selectedItem, currentOffer);
      updateReputation(1);
    } else {
      if (currentOffer <= cash) {
        spendCash(currentOffer);
        addToInventory(selectedItem);
        updateReputation(1);
      } else {
        toast({
          title: "Yetersiz Para",
          description: "Bu teklifi karşılayacak paranız yok.",
          variant: "destructive",
        });
        return;
      }
    }
    
    resetNegotiation();
  };

  const handleRejectOffer = () => {
    toast({
      title: "Pazarlık Reddedildi",
      description: "Müşteri teklifinizi reddetti.",
    });
    resetNegotiation();
  };

  const adjustOffer = (increment: number) => {
    setTempOffer(prev => Math.max(1, prev + increment));
  };

  // Customer type translations and traits
  const getCustomerTypeDisplay = (type: string) => {
    const types = {
      'collector': { tr: 'Koleksiyoncu', trait: 'Bilgili' },
      'student': { tr: 'Öğrenci', trait: 'Cimri' },
      'trader': { tr: 'Tüccar', trait: 'Deneyimli' },
      'nostalgic': { tr: 'Nostaljik', trait: 'Duygusal' },
      'hunter': { tr: 'Avcı', trait: 'Sabırsız' },
      'tourist': { tr: 'Turist', trait: 'Acemi' },
      'expert': { tr: 'Uzman', trait: 'Çok Bilgili' }
    };
    return types[type] || { tr: type, trait: 'Normal' };
  };

  // No customer or day limit reached
  if (!currentCustomer) {
    if (customersServed >= dailyCustomerLimit) {
      return (
        <Card className="w-full max-w-sm mx-auto mt-4 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-300">
          <CardHeader>
            <CardTitle className="text-center">🌅 Gün Bitti!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Günlük müşteri limitine ulaştınız ({customersServed}/{dailyCustomerLimit})
            </p>
            <Button 
              onClick={() => useGameStore.getState().advanceDay()}
              className="w-full"
            >
              🏪 Yeni Güne Başla
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="w-full max-w-sm mx-auto mt-4">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-sm text-muted-foreground">Müşteri bekleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedItem) {
    return (
      <Card className="w-full max-w-sm mx-auto mt-4">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">🤔</div>
          <p className="text-sm text-muted-foreground">Müşteri ürün seçiyor...</p>
        </CardContent>
      </Card>
    );
  }

  const customerTypeInfo = getCustomerTypeDisplay(currentCustomer.type);
  const itemValue = calculateItemValue(selectedItem);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Role Card */}
      <Card className={`border-2 ${
        currentCustomer.intent === 'buy' 
          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500' 
          : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {currentCustomer.intent === 'buy' ? '🛒' : '🏷️'}
            </div>
            <div className="flex-1">
              <div className={`text-lg font-bold ${
                currentCustomer.intent === 'buy' ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'
              }`}>
                {currentCustomer.intent === 'buy' ? 'ALICI' : 'SATICI'}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentCustomer.intent === 'buy' ? 'Senden ürün almak istiyor' : 'Sana ürün satmak istiyor'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{currentCustomer.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {customerTypeInfo.trait}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Card */}
      <Card className="border-2 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
              {selectedItem.image}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{selectedItem.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t(selectedItem.category as any, language)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {currentCustomer.intent === 'buy' ? 'İstediği Fiyat:' : 'İstediği Fiyat:'}
              </span>
              <span className="text-lg font-bold text-primary">
                ${currentOffer}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Piyasa Değeri:</span>
              <span className="text-lg font-bold">≈ ${itemValue}</span>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Duruma, nadirliğe ve trendlere göre
            </p>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Durum: {selectedItem.condition}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedItem.rarity === 'rare' ? 'Nadir' : 
                 selectedItem.rarity === 'very_rare' ? 'Çok Nadir' :
                 selectedItem.rarity === 'legendary' ? 'Efsanevi' : 'Yaygın'}
              </Badge>
              {selectedItem.trendBonus !== 0 && (
                <Badge variant="outline" className="text-xs">
                  {selectedItem.trendBonus > 0 ? '↑' : '↓'} Trend
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Response */}
      {customerResponse && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <p className="text-sm italic">"{customerResponse}"</p>
          </CardContent>
        </Card>
      )}

      {/* Negotiation Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="destructive"
          onClick={handleRejectOffer}
          className="text-sm py-3"
        >
          ❌ Reddet
        </Button>
        
        <Button
          onClick={handleMakeOffer}
          className="text-sm py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          💬 Teklif Ver
        </Button>
        
        <Button
          variant={currentCustomer.intent === 'buy' ? 'default' : cash >= currentOffer ? 'default' : 'secondary'}
          onClick={handleAcceptOffer}
          disabled={currentCustomer.intent === 'sell' && cash < currentOffer}
          className="text-sm py-3"
        >
          ✅ Kabul Et
        </Button>
      </div>

      {/* Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teklif Ver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustOffer(-50)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <Input
                  type="number"
                  value={tempOffer}
                  onChange={(e) => setTempOffer(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center text-lg font-bold"
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustOffer(50)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustOffer(-10)}
              >
                -$10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustOffer(-100)}
              >
                -$100
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustOffer(100)}
              >
                +$100
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustOffer(10)}
              >
                +$10
              </Button>
            </div>
            
            <Button onClick={handleSubmitOffer} className="w-full text-lg font-bold">
              Teklif Gönder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};