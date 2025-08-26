import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Item, Customer } from '@/types/game';
import { generateCustomer, generateHaggleResponse, calculateItemValue, generateCustomerInitialOffer, generateInitialMessage } from '@/utils/gameLogic';

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
    timeLeft,
    cash
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [shopOwnerOffer, setShopOwnerOffer] = useState<number>(0);
  const [haggleCount, setHaggleCount] = useState(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');
  const [negotiationPhase, setNegotiationPhase] = useState<'initial' | 'customer_offered' | 'shop_offered'>('initial');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [tempOffer, setTempOffer] = useState<number>(0);

  // Auto-start negotiation when customer arrives
  useEffect(() => {
    if (currentCustomer && !selectedItem && negotiationPhase === 'initial') {
      setTimeout(() => {
        if (currentCustomer.intent === 'buy' && inventory.length > 0) {
          // Customer automatically selects an item they're interested in
          const interestedItem = inventory[Math.floor(Math.random() * inventory.length)];
          setSelectedItem(interestedItem);
          
          // Customer makes initial offer based on their type and budget
          const itemValue = calculateItemValue(interestedItem);
          const customerOffer = generateCustomerInitialOffer(currentCustomer, itemValue);
          setCurrentOffer(customerOffer);
          setNegotiationPhase('customer_offered');
          setCustomerResponse(generateInitialMessage(currentCustomer, interestedItem, customerOffer));
        } else if (currentCustomer.intent === 'sell' && currentCustomer.carriedItem) {
          // Auto-select their item
          setSelectedItem(currentCustomer.carriedItem);
          setNegotiationPhase('customer_offered');
          
          const itemValue = calculateItemValue(currentCustomer.carriedItem);
          const customerAskingPrice = Math.floor(itemValue * (0.8 + Math.random() * 0.3)); // 80-110% of value
          setCurrentOffer(customerAskingPrice);
          setCustomerResponse(`I have this ${currentCustomer.carriedItem.name}. I'm asking ${customerAskingPrice}₳ for it.`);
        }
      }, 1500);
    }
  }, [currentCustomer, selectedItem, negotiationPhase, inventory]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const tryGenerateCustomer = () => {
      if (!currentCustomer && timeLeft > 0) {
        if (Math.random() < 0.4) { // 40% chance
          const newCustomer = generateCustomer();
          setCurrentCustomer(newCustomer);
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


  const handleItemSelect = (item: Item) => {
    if (!currentCustomer) return;
    
    setSelectedItem(item);
    const basePrice = calculateItemValue(item);
    setCurrentOffer(basePrice);
    setCustomerResponse('');
    setHaggleCount(0);
  };

  const handleBuyerHaggle = (newPrice: number) => {
    if (!currentCustomer || !selectedItem) return;
    
    const response = generateHaggleResponse(currentCustomer, selectedItem, newPrice, haggleCount);
    setCustomerResponse(response.message);
    setHaggleCount(prev => prev + 1);
    
    if (response.accepted) {
      sellItem(selectedItem, newPrice);
      updateReputation(response.reputationChange);
      updateTrust(response.trustChange);
      resetNegotiation();
    } else if (response.counter) {
      setCurrentOffer(response.counter);
    } else if (haggleCount >= 3) {
      resetNegotiation();
    }
  };

  const handleSellerHaggle = (offerPrice: number) => {
    if (!currentCustomer || !currentCustomer.carriedItem) return;
    
    const item = currentCustomer.carriedItem;
    const itemValue = calculateItemValue(item);
    const priceRatio = offerPrice / itemValue;
    
    let response;
    if (priceRatio >= 0.7 && offerPrice <= cash) {
      response = {
        accepted: true,
        message: "Deal! I'll take your offer.",
        reputationChange: 2,
        trustChange: 1
      };
      
      if (spendCash(offerPrice)) {
        addToInventory(item);
        updateReputation(response.reputationChange);
        updateTrust(response.trustChange);
        resetNegotiation();
      }
    } else if (offerPrice > cash) {
      response = {
        accepted: false,
        message: "You don't have enough money!",
        reputationChange: 0,
        trustChange: 0
      };
    } else {
      const counter = Math.floor(itemValue * 0.8);
      response = {
        accepted: false,
        message: `Too low! How about ${counter}₳?`,
        reputationChange: 0,
        trustChange: 0,
        counter
      };
      setCurrentOffer(counter);
    }
    
    setCustomerResponse(response.message);
    setHaggleCount(prev => prev + 1);
    
    if (haggleCount >= 3 && !response.accepted) {
      setTimeout(resetNegotiation, 2000);
    }
  };

  const resetNegotiation = () => {
    setCurrentCustomer(null);
    setSelectedItem(null);
    setCurrentOffer(0);
    setShopOwnerOffer(0);
    setHaggleCount(0);
    setCustomerResponse('');
    setNegotiationPhase('initial');
    setShowOfferInput(false);
    setTempOffer(0);
  };

  const handleMakeOffer = () => {
    if (!currentCustomer || !selectedItem && !currentCustomer.carriedItem) return;
    
    const itemValue = calculateItemValue(selectedItem || currentCustomer.carriedItem!);
    setTempOffer(Math.floor(itemValue * 0.8)); // Start with 80% of market value
    setShowOfferInput(true);
  };

  const handleSubmitOffer = () => {
    if (!currentCustomer || tempOffer <= 0) return;
    
    setShopOwnerOffer(tempOffer);
    setNegotiationPhase('shop_offered');
    
    // Generate customer response to shop owner's offer
    const item = selectedItem || currentCustomer.carriedItem!;
    const itemValue = calculateItemValue(item);
    const offerRatio = tempOffer / itemValue;
    
    let response;
    if (currentCustomer.intent === 'buy') {
      // Customer wants to buy, shop owner is offering a selling price
      if (tempOffer <= currentCustomer.budget && offerRatio <= 1.2) {
        if (Math.random() < 0.7) {
          response = "That sounds fair, I'll take it!";
          setTimeout(() => {
            sellItem(item, tempOffer);
            updateReputation(2);
            updateTrust(1);
            resetNegotiation();
          }, 1500);
        } else {
          const counterOffer = Math.floor(tempOffer * 0.9);
          response = `How about ${counterOffer}₳ instead?`;
          setCurrentOffer(counterOffer);
        }
      } else {
        response = "That's too expensive for me. Can you do better?";
      }
    } else {
      // Customer wants to sell, shop owner is offering a buying price  
      if (tempOffer <= cash && offerRatio >= 0.6) {
        if (Math.random() < 0.7) {
          response = "Deal! I'll sell it for that price.";
          setTimeout(() => {
            if (spendCash(tempOffer)) {
              addToInventory(item);
              updateReputation(2);
              updateTrust(1);
              resetNegotiation();
            }
          }, 1500);
        } else {
          const counterOffer = Math.floor(tempOffer * 1.1);
          response = `Could you make it ${counterOffer}₳?`;
          setCurrentOffer(counterOffer);
        }
      } else {
        response = "That's too low for me. I need a better offer.";
      }
    }
    
    setCustomerResponse(response);
    setShowOfferInput(false);
    setHaggleCount(prev => prev + 1);
  };

  const handleCancelOffer = () => {
    setShowOfferInput(false);
    setTempOffer(0);
  };

  const handleAcceptOffer = () => {
    if (!currentCustomer) return;
    
    if (currentCustomer.intent === 'buy') {
      handleBuyerHaggle(currentOffer);
    } else {
      handleSellerHaggle(currentOffer);
    }
  };

  const handleRejectOffer = () => {
    resetNegotiation();
  };

  const handleCounterOffer = (adjustment: number) => {
    const newPrice = Math.max(1, currentOffer + adjustment);
    setCurrentOffer(newPrice);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-4">
      {/* Shop Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-6xl">🏪</div>
        <div className="absolute top-32 right-10 text-4xl">💰</div>
        <div className="absolute bottom-40 left-20 text-5xl">📦</div>
        <div className="absolute bottom-60 right-20 text-4xl">🛍️</div>
      </div>

      {/* Customer Display */}
      {currentCustomer ? (
        <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col items-center space-y-4">
              {/* Customer Avatar */}
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 overflow-hidden">
                <img 
                  src={currentCustomer.avatar} 
                  alt={currentCustomer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Customer Info */}
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{currentCustomer.name}</h3>
                <div className="flex gap-2 justify-center mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {t(currentCustomer.type as any, language)}
                  </Badge>
                  <Badge className={`${
                    currentCustomer.intent === 'buy' 
                      ? 'bg-green-500/80 text-white border-green-300/50' 
                      : 'bg-blue-500/80 text-white border-blue-300/50'
                  }`}>
                    {currentCustomer.intent === 'buy' ? t('buyerBadge', language) : t('sellerBadge', language)}
                  </Badge>
                </div>
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

              {/* Intent Description */}
              <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 w-full text-center">
                <div className="text-white font-medium">
                  {currentCustomer.intent === 'buy' 
                    ? `🛒 ${t('wantsToBuy', language)}`
                    : `💼 ${t('wantsToSell', language)}`
                  }
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

      {/* Shop Items - Show when customer wants to buy */}
      {currentCustomer && currentCustomer.intent === 'buy' && (
        <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              🏪 {t('yourShop', language)}
            </CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {t('wantsToBuy', language)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {inventory.map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedItem?.id === item.id 
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg' 
                    : 'hover:shadow-md border-2 border-transparent hover:border-green-500/20'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">{item.name}</h4>
                      <div className="text-sm text-muted-foreground mb-1">
                        {t(item.category as any, language)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {calculateItemValue(item)}₳
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

      {/* Customer's Item - Show when customer wants to sell */}
      {currentCustomer && currentCustomer.intent === 'sell' && currentCustomer.carriedItem && (
        <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              💼 {t('theirItem', language)}
            </CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {t('wantsToSell', language)}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Card 
              className="cursor-pointer transition-all duration-200 hover:scale-105 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/20"
              onClick={() => handleItemSelect(currentCustomer.carriedItem!)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg">
                    {currentCustomer.carriedItem.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{currentCustomer.carriedItem.name}</h4>
                    <div className="text-sm text-muted-foreground mb-1">
                      {t(currentCustomer.carriedItem.category as any, language)}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ~{calculateItemValue(currentCustomer.carriedItem)}₳
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Haggle Interface */}
      {currentCustomer && (
        <Card className={`border-2 shadow-xl ${
          currentCustomer.intent === 'buy' 
            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
            : 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
        }`}>
          <CardHeader className="text-center">
            <CardTitle className={`flex items-center justify-center gap-2 ${
              currentCustomer.intent === 'buy' 
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              💰 {t('haggle', language)}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {currentCustomer.intent === 'buy' ? t('sellToThem', language) : t('buyFromThem', language)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Item Display */}
            {(selectedItem || currentCustomer.carriedItem) && (
              <div className={`rounded-lg p-3 border-l-4 ${
                currentCustomer.intent === 'buy' 
                  ? 'bg-white dark:bg-gray-800 border-green-500'
                  : 'bg-white dark:bg-gray-800 border-blue-500'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {(selectedItem || currentCustomer.carriedItem)!.image}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {(selectedItem || currentCustomer.carriedItem)!.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t((selectedItem || currentCustomer.carriedItem)!.category as any, language)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Price Display */}
            <div className="space-y-3">
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  {currentCustomer.intent === 'buy' ? 'Customer Offer' : 'Customer Asking Price'}
                </div>
                <div className={`text-3xl font-bold ${
                  currentCustomer.intent === 'buy' 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {currentOffer}₳
                </div>
              </div>
              
              {/* Item Value Information for Shop Owner */}
              {(selectedItem || currentCustomer.carriedItem) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                  <div className="text-center">
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">
                      📊 Market Value (Your Reference)
                    </div>
                    <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                      {calculateItemValue(selectedItem || currentCustomer.carriedItem!)}₳
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Based on condition, rarity & trends
                    </div>
                  </div>
                </div>
              )}
              
              {currentCustomer.intent === 'sell' && (
                <div className="text-center text-sm text-muted-foreground">
                  Your Cash: {cash}₳
                </div>
              )}
            </div>
            
            {/* Price Controls */}
            <div className="space-y-3">
              {/* Make Offer Input */}
              {showOfferInput && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-yellow-500">
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">
                      💡 Make Your Offer
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentCustomer.intent === 'buy' ? 'Set your selling price' : 'Set your buying price'}
                    </p>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="number"
                      value={tempOffer}
                      onChange={(e) => setTempOffer(Number(e.target.value))}
                      className="text-center text-lg font-bold"
                      min="1"
                      max={currentCustomer.intent === 'sell' ? cash : 9999}
                    />
                    <span className="flex items-center text-lg font-bold">₳</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      onClick={handleCancelOffer}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitOffer}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      disabled={tempOffer <= 0 || (currentCustomer.intent === 'sell' && tempOffer > cash)}
                    >
                      Submit Offer
                    </Button>
                  </div>
                </div>
              )}

              {/* Main Action Buttons */}
              {!showOfferInput && (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Button 
                      variant="destructive"
                      onClick={handleRejectOffer}
                      className="font-bold"
                    >
                      {t('reject', language)}
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleMakeOffer}
                      className="font-bold bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Make Offer
                    </Button>
                    <Button 
                      variant="default"
                      onClick={handleAcceptOffer}
                      className={`text-white font-bold ${
                        currentCustomer.intent === 'buy'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      disabled={currentCustomer.intent === 'sell' && currentOffer > cash}
                    >
                      {t('accept', language)}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
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
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};