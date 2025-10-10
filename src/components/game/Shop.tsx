import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Settings, Star, DollarSign } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useSound } from '@/hooks/useSound';
import { generateCustomer, calculateItemValue } from '@/utils/gameLogic';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslatedItems } from '@/hooks/useTranslatedItems';
import type { Item, Customer } from '@/types/game';
import shopInteriorBg from '@/assets/vintage-shop-interior.jpg';
import { SpeechBubble } from '@/components/ui/SpeechBubble';

const Shop: React.FC = () => {
  const { t } = useI18n();
  useTranslatedItems(); // Initialize translation context for item generation
  const { 
    cash, 
    level, 
    inventory, 
    buyItem, 
    sellItem, 
    addCash, 
    spendCash,
    customersServed,
    dailyCustomerLimit,
    serveCustomer,
    onDealResolved,
    currentCustomer: storeCurrentCustomer,
    isLoadingNextCustomer
  } = useGameStore();
  
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [offerInputValue, setOfferInputValue] = useState<string>('');
  const [speechText, setSpeechText] = useState<string>('');
  const [speechVisible, setSpeechVisible] = useState(false);
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  
  const { playSound } = useSound();
  
  // Use the store's current customer
  const currentCustomer = storeCurrentCustomer;

  // Set initial offer when customer changes
  useEffect(() => {
    if (currentCustomer?.carriedItem) {
      // Set initial offer based on intent
      const itemValue = calculateItemValue(currentCustomer.carriedItem);
      if (currentCustomer.intent === 'buy') {
        const offer = Math.floor(itemValue * (0.7 + Math.random() * 0.3));
        setCurrentOffer(offer);
        showSpeech(`I'd like to buy this ${currentCustomer.carriedItem.name} for $${offer}`, 3000);
      } else {
        const askPrice = Math.floor(itemValue * (0.8 + Math.random() * 0.4));
        setCurrentOffer(askPrice);
        showSpeech(`I want to sell this ${currentCustomer.carriedItem.name} for $${askPrice}`, 3000);
      }
    }
  }, [currentCustomer]);

  // Handle customer actions
  const handleAccept = () => {
    if (!currentCustomer || !dealItem) return;

    if (currentCustomer.intent === 'buy') {
      // Customer buying from us
      const price = currentOffer;
      sellItem(dealItem, price);
      playSound('coin');
      showSuccess(`${t('shop.soldFor').replace('{}', dealItem.name).replace('${}', `$${price}`)}`);
    } else {
      // Customer selling to us
      const price = currentOffer;
      if (cash >= price) {
        const success = buyItem(dealItem, price);
        if (success) {
          playSound('buy');
          showSuccess(`Bought ${dealItem.name} for $${price}!`);
        }
      } else {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough money for this purchase.",
          variant: "destructive"
        });
        return;
      }
    }
    
    onDealResolved();
  };

  const handleReject = () => {
    playSound('click');
    showSpeech(t('common.noDeal'), 2000);
    toast({
      title: t('common.dealRejected'),
      description: t('common.customerRejected'),
      variant: "destructive",
      duration: 2000,
    });
    setTimeout(() => onDealResolved(), 2000);
  };

  const handleCounterOffer = (amount: number) => {
    if (!currentCustomer || !dealItem) return;

    // Simple acceptance logic
    const itemValue = calculateItemValue(dealItem);
    const isReasonable = currentCustomer.intent === 'buy' 
      ? amount <= itemValue * 1.2 
      : amount >= itemValue * 0.6;
    
    if (isReasonable && Math.random() > 0.3) {
      // Accept the counter offer
      if (currentCustomer.intent === 'buy') {
        sellItem(dealItem, amount);
        playSound('coin');
        showSuccess(`Sold ${dealItem.name} for $${amount}!`);
      } else {
        if (cash >= amount) {
          const success = buyItem(dealItem, amount);
          if (success) {
            playSound('buy');
            showSuccess(`Bought ${dealItem.name} for $${amount}!`);
          }
        } else {
          toast({
            title: "Insufficient Funds",
            description: "You don't have enough money for this purchase.",
            variant: "destructive"
          });
          return;
        }
      }
      onDealResolved();
    } else {
      // Reject the counter offer
      playSound('error');
      const responses = [
        "That's not quite what I had in mind...",
        "I was thinking of a different price range.",
        "Let me consider other options.",
        "That doesn't work for me, sorry."
      ];
      showSpeech(responses[Math.floor(Math.random() * responses.length)], 2000);
      setTimeout(() => onDealResolved(), 2000);
    }
  };

  const showSpeech = (text: string, duration: number = 3000) => {
    setSpeechText(text);
    setSpeechVisible(true);
    setTimeout(() => setSpeechVisible(false), duration);
  };

  const showSuccess = (message: string) => {
    setShowSuccessEffect(true);
    const isProfit = message.includes('Sold') || message.includes('sattın');
    showSpeech(isProfit ? t('common.greatDeal') : t('common.dealAccepted'), 2500);
    toast({
      title: t('common.dealCompleted'),
      description: message,
      duration: 3000,
    });
    setTimeout(() => setShowSuccessEffect(false), 2500);
  };

  const openOfferModal = () => {
    if (!currentCustomer || !dealItem) return;
    setOfferInputValue(currentOffer.toString());
    setOfferModalOpen(true);
  };

  const adjustOffer = (delta: number) => {
    const newValue = Math.max(1, currentOffer + delta);
    setCurrentOffer(newValue);
    setOfferInputValue(newValue.toString());
  };

  const submitOffer = () => {
    const finalOffer = parseInt(offerInputValue) || currentOffer;
    handleCounterOffer(finalOffer);
    setOfferModalOpen(false);
  };

  // Show day completed message if no more customers
  if (customersServed >= dailyCustomerLimit) {
    return (
      <div className="relative flex items-center justify-center h-full min-h-screen bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(${shopInteriorBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-amber-100/90 backdrop-blur-sm"></div>
        <div className="relative text-center p-8 bg-white/85 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-amber-900">{t('game.dayComplete')}</h2>
          <p className="text-amber-700">{t('game.customersServed')}: {customersServed}/{dailyCustomerLimit}</p>
        </div>
      </div>
    );
  }

  if (!currentCustomer || isLoadingNextCustomer) {
    return (
      <div className="relative flex items-center justify-center h-full min-h-screen bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(${shopInteriorBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-amber-100/90 backdrop-blur-sm"></div>
        <div className="relative text-center bg-white/85 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-900">{t('game.lookingForCustomers')}</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Use currentCustomer.carriedItem directly instead of derived state
  const dealItem = currentCustomer.carriedItem;

  return (
    <div className="relative flex flex-col h-full overflow-y-auto min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${shopInteriorBg})` }}>
      {/* Background overlay for warmth and contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/75 to-orange-50/80 backdrop-blur-[1px]"></div>
      
      <div className="relative flex-1 p-4 space-y-4 max-w-md mx-auto w-full z-10">
        {/* Customer Info Card */}
        <div className="bg-gradient-to-br from-amber-50/98 via-orange-50/95 to-amber-100/90 backdrop-blur-lg rounded-lg border-2 border-amber-300/40 p-6 shadow-2xl shadow-amber-900/25 relative overflow-hidden">
          {/* Vintage paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#000_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          <div className="flex items-start gap-4">
            <div className="relative">
              <img 
                src={currentCustomer.avatar} 
                alt={currentCustomer.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
              />
              {/* Intent Badge on Avatar */}
              <div className={`absolute -bottom-1 -right-1 rounded-full p-1.5 border-2 border-white shadow-lg ${
                currentCustomer.intent === 'buy' 
                  ? 'bg-blue-500' 
                  : 'bg-orange-500'
              }`}>
                {currentCustomer.intent === 'buy' ? (
                  <DollarSign className="w-4 h-4 text-white" />
                ) : (
                  <Star className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Speech Bubble near customer */}
              {speechVisible && (
                <SpeechBubble 
                  message={speechText}
                  isVisible={speechVisible}
                  className="absolute left-24 top-0 w-64 z-20"
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-professional-dark-grey mb-2">
                {currentCustomer.name}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge 
                  variant="outline" 
                  className={`font-medium px-3 py-1 text-sm ${currentCustomer.intent === 'buy'
                    ? 'border-blue-500 text-blue-700 bg-blue-100' 
                    : 'border-orange-500 text-orange-700 bg-orange-100'
                  }`}
                >
                  {currentCustomer.intent === 'buy' ? '💰 ' + t('shop.buyer') : '🏷️ ' + t('shop.seller')}
                </Badge>
                
                <Badge variant="secondary" className="text-xs bg-gray-100 text-professional-grey border-gray-200">
                  {currentCustomer.type}
                </Badge>
              </div>
              
              <p className="text-sm font-medium text-professional-dark-grey leading-relaxed">
                {currentCustomer.intent === 'buy'
                  ? '🛒 ' + t('shop.wantsToPurchase') 
                  : '💼 ' + t('shop.wantsToSell')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Product Info Card */}
        <div className="bg-gradient-to-br from-orange-50/98 via-amber-50/95 to-yellow-50/90 backdrop-blur-lg rounded-lg border-2 border-amber-300/40 p-6 shadow-2xl shadow-amber-900/25 relative overflow-hidden">
          {/* Vintage paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#000_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          <div className="flex gap-4 mb-4 relative z-10">
            <div className="w-24 h-24 bg-white/80 rounded-lg overflow-hidden border-2 border-amber-200/60 shadow-inner">
              {typeof dealItem.image === 'string' && dealItem.image.startsWith('/') ? (
                <img 
                  src={dealItem.image} 
                  alt={dealItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={dealItem.image} 
                  alt={dealItem.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-professional-dark-grey mb-1">
                {dealItem.name}
              </h4>
              <p className="text-sm text-professional-grey mb-3">
                {t(`items.categories.${dealItem.category}`)}
              </p>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-professional-grey">
                  {dealItem.condition}% {t('shop.condition')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-professional-grey">
                  {t(`items.rarities.${dealItem.rarity}`)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {/* Market Price - Always shown as reference */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-professional-dark-grey">
                    {t('shop.estimatedMarketValue')}
                  </span>
                  <span className="text-xs text-professional-grey">
                    {t('shop.referenceInfo')}
                  </span>
                </div>
                <span className="text-lg font-bold text-professional-blue">
                  ${calculateItemValue(dealItem)}
                </span>
              </div>
              
              {/* Customer is SELLER (wants to sell to player) */}
              {currentCustomer.intent === 'sell' && (
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-professional-dark-grey">
                      {t('shop.sellerAskingPrice')}
                    </span>
                    <span className="text-xs text-professional-grey">
                      {t('shop.customerRequestedAmount')}
                    </span>
                  </div>
                <span className="text-lg font-bold text-professional-red">
                  ${currentOffer}
                </span>
              </div>
            )}
            
            {/* Customer is BUYER (wants to buy from player) */}
            {currentCustomer.intent === 'buy' && (
              <>
                {dealItem.purchasePrice && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-professional-dark-grey">
                      {t('shop.yourPurchasePrice')}
                    </span>
                    <span className="text-xs text-professional-grey">
                      {t('shop.yourCostForItem')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    ${dealItem.purchasePrice}
                  </span>
                </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-professional-dark-grey">
                      {t('shop.buyerOfferPrice')}
                    </span>
                    <span className="text-xs text-professional-grey">
                      {t('shop.customerWillingToPay')}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-professional-red">
                    ${currentOffer}
                  </span>
                </div>
                
                {/* Profit/Loss calculation for buyer scenario */}
                {dealItem.purchasePrice && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-professional-dark-grey">
                        {t('shop.profitLoss')}
                      </span>
                      {(currentOffer - dealItem.purchasePrice) < 0 && (
                        <span className="text-red-500 text-sm">⚠️</span>
                      )}
                    </div>
                    <span className={`text-lg font-bold ${
                      (currentOffer - dealItem.purchasePrice) >= 0 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      ${(currentOffer - dealItem.purchasePrice) >= 0 ? '+' : ''}
                      {currentOffer - dealItem.purchasePrice}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleReject}
            className="h-12 border-professional-red text-professional-red hover:bg-red-50 hover:border-red-400 font-medium"
          >
            {t('common.decline')}
          </Button>
          
          <Button
            onClick={openOfferModal}
            className="h-12 bg-professional-navy hover:bg-professional-blue text-white font-medium"
          >
            {t('common.counter')}
          </Button>
          
          <Button
            onClick={handleAccept}
            className="h-12 bg-professional-emerald hover:bg-emerald-600 text-white font-medium"
          >
            {t('common.accept')}
          </Button>
        </div>
      </div>

      {/* Enhanced Counter Offer Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-professional-dark-grey">{t('shop.makeCounterOffer')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-professional-dark-grey mb-2">
                ${currentOffer.toLocaleString()}
              </div>
              <div className="text-sm text-professional-blue font-medium uppercase tracking-wide">
                {t('shop.currentOffer')}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustOffer(-10)}
                className="h-12 w-12 border-gray-300 hover:border-professional-blue"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                value={offerInputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setOfferInputValue(value);
                  const numValue = parseInt(value) || 0;
                  setCurrentOffer(numValue);
                }}
                onFocus={(e) => e.target.select()}
                className="text-center text-lg font-semibold w-28 h-12 border-gray-300 focus:border-professional-blue"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustOffer(10)}
                className="h-12 w-12 border-gray-300 hover:border-professional-blue"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={submitOffer}
              className="w-full h-12 bg-professional-navy hover:bg-professional-blue font-medium"
            >
              {t('common.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Effect */}
      {showSuccessEffect && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">💼</div>
        </div>
      )}
    </div>
  );
};

export default Shop;