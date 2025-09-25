import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Item, Customer } from '@/types/game';
import { generateCustomer, calculateItemValue, generateInitialMessage } from '@/utils/gameLogic';
import { generateBalancedInitialOffer, generateBalancedCounterOffer } from '@/utils/balancedBargaining';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Minus, Plus } from 'lucide-react';
import { SpeechBubble } from '@/components/ui/SpeechBubble';

// Comprehensive buyer-seller dialogue system
const dialoguePools = {
  // Buyer responses (customer wants to buy from player)
  buyer: {
    accept: {
      tr: ["Tamamdır, anlaştık!", "Harika, bunu alıyorum!", "Süper, işte paran.", "Tam istediğim fiyat.", "Deal, kaşla göz arasında!"],
      en: ["Deal! I'll take it.", "Perfect, I'm buying this.", "Great, here's the cash.", "That's exactly what I wanted to pay.", "Sold, quick decision!"],
      de: ["Abgemacht, ich nehme es!", "Perfekt, das kaufe ich.", "Super, hier ist das Geld.", "Genau der Preis, den ich zahlen wollte.", "Verkauft, schnelle Entscheidung!"]
    },
    reject: {
      tr: ["Peki, vazgeçiyorum.", "O zaman olmaz, hoşça kal.", "Çok pahalı, başka yerde bakarım.", "Bütçem yetersiz.", "Başka sefer görüşürüz."],
      en: ["Alright, I'll pass.", "Too expensive for me, goodbye.", "I'll look elsewhere.", "Out of my budget.", "Maybe another time."],
      de: ["Okay, ich verzichte.", "Zu teuer für mich, auf Wiedersehen.", "Ich schaue woanders.", "Übersteigt mein Budget.", "Vielleicht ein andermal."]
    },
    counter_low: {
      tr: ["Bu çok pahalı, daha düşük olabilir mi?", "Fiyatı biraz indirebilir misin?", "Çok yüksek, pazarlık yapalım.", "Bu kadar vermem, daha makul ol.", "İndirim yapar mısın?"],
      en: ["That's too expensive, can you go lower?", "Can you reduce the price a bit?", "Too high, let's negotiate.", "I won't pay that much, be reasonable.", "Any discount possible?"],
      de: ["Das ist zu teuer, können Sie runter gehen?", "Können Sie den Preis etwas senken?", "Zu hoch, lass uns verhandeln.", "So viel zahle ich nicht, seien Sie vernünftig.", "Gibt es einen Rabatt?"]
    }
  },
  // Seller responses (customer wants to sell to player)
  seller: {
    accept: {
      tr: ["Tamamdır, satıyorum!", "Anlaştık, al bakalım.", "Deal, işte ürün.", "Bu fiyata razıyım.", "Tamam, sende kalsın."],
      en: ["Deal, I'm selling!", "Agreed, here you go.", "Alright, it's yours.", "I accept this price.", "Fine, take it."],
      de: ["Abgemacht, ich verkaufe!", "Einverstanden, hier haben Sie es.", "In Ordnung, es gehört Ihnen.", "Ich akzeptiere diesen Preis.", "Gut, nehmen Sie es."]
    },
    reject: {
      tr: ["Bu çok düşük, olmaz.", "Böyle ucuza satmam.", "Daha fazlasını hak ediyor.", "Çok az teklif ediyorsun.", "Başka yerde satarım."],
      en: ["That's too low, no deal.", "I won't sell for so little.", "It's worth more than that.", "You're offering too little.", "I'll sell it elsewhere."],
      de: ["Das ist zu wenig, kein Geschäft.", "So billig verkaufe ich nicht.", "Es ist mehr wert.", "Sie bieten zu wenig.", "Ich verkaufe es woanders."]
    },
    counter_high: {
      tr: ["Daha fazla ver, bu az.", "Biraz daha artır bakalım.", "Bu fiyata değmez, daha yüksek ol.", "Az teklif ediyorsun, artır.", "Daha cömert olmalısın."],
      en: ["Pay more, this is too little.", "Raise it a bit, please.", "Not worth this price, go higher.", "You're offering too little, increase it.", "You need to be more generous."],
      de: ["Zahlen Sie mehr, das ist zu wenig.", "Erhöhen Sie es etwas, bitte.", "Das ist den Preis nicht wert, gehen Sie höher.", "Sie bieten zu wenig, erhöhen Sie es.", "Sie müssen großzügiger sein."]
    }
  },
  // Initial offers
  initial: {
    buyer: {
      tr: ["Bu {item} çok hoşuma gitti, {price} dolara alabilir miyim?", "Şu {item} için {price} dolar veriyorum.", "Bu {item} tam aradığım şey, {price} dolar teklif ediyorum.", "{item} için {price} dolar uygun mu?", "Bu güzel {item} için {price} dolar nasıl?"],
      en: ["I really like this {item}, can I buy it for ${price}?", "I'm offering ${price} for that {item}.", "This {item} is exactly what I'm looking for, I offer ${price}.", "Is ${price} okay for the {item}?", "How about ${price} for this nice {item}?"],
      de: ["Mir gefällt dieses {item} sehr, kann ich es für {price} Dollar kaufen?", "Ich biete {price} Dollar für das {item}.", "Dieses {item} ist genau das, was ich suche, ich biete {price} Dollar.", "Sind {price} Dollar für das {item} in Ordnung?", "Wie wäre es mit {price} Dollar für dieses schöne {item}?"]
    },
    seller: {
      tr: ["Bu {item}'imi satmak istiyorum, {price} dolara veriyorum.", "Şu {item} için {price} dolar istiyorum.", "Bu güzel {item}'imi {price} dolara satıyorum.", "{item} var elimde, {price} dolar verirsen sat-arım.", "Bu {item} için {price} dolar makul fiyat."],
      en: ["I want to sell this {item}, I'm asking ${price}.", "I want ${price} for this {item}.", "I'm selling this nice {item} for ${price}.", "I have this {item}, I'll sell it for ${price}.", "${price} is a fair price for this {item}."],
      de: ["Ich möchte dieses {item} verkaufen, ich verlange {price} Dollar.", "Ich möchte {price} Dollar für dieses {item}.", "Ich verkaufe dieses schöne {item} für {price} Dollar.", "Ich habe dieses {item}, ich verkaufe es für {price} Dollar.", "{price} Dollar ist ein fairer Preis für dieses {item}."]
    }
  }
};

const getRandomMessage = (role: 'buyer' | 'seller', scenario: string, language: string) => {
  const messages = dialoguePools[role]?.[scenario]?.[language] || dialoguePools[role]?.[scenario]?.tr || [];
  return messages[Math.floor(Math.random() * messages.length)] || "...";
};

const getInitialOfferMessage = (role: 'buyer' | 'seller', item: Item, price: number, language: string) => {
  const messages = dialoguePools.initial[role]?.[language] || dialoguePools.initial[role]?.tr || [];
  const template = messages[Math.floor(Math.random() * messages.length)] || "...";
  return template.replace('{item}', item.name).replace('{price}', price.toString());
};

export const Shop = () => {
  const { 
    inventory, 
    sellItem, 
    buyItem,
    addToInventory,
    spendCash,
    addCash,
    updateReputation,
    updateTrust,
    language,
    cash,
    customersServed,
    dailyCustomerLimit,
    serveCustomer,
    level
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [tempOffer, setTempOffer] = useState<number>(0);
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechBubbleMessage, setSpeechBubbleMessage] = useState('');
  
  // New customer loading system
  const [isLoadingNextCustomer, setIsLoadingNextCustomer] = useState(false);
  const [nextCustomer, setNextCustomer] = useState<Customer | null>(null);
  const [timeoutRefs, setTimeoutRefs] = useState<Set<NodeJS.Timeout>>(new Set());
  const [lastPrefetchTime, setLastPrefetchTime] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const showCustomerSpeech = (message: string) => {
    setSpeechBubbleMessage(message);
    setShowSpeechBubble(true);
  };

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.forEach(timeout => clearTimeout(timeout));
    };
  }, [timeoutRefs]);

  // Helper to add timeout with cleanup
  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      callback();
      setTimeoutRefs(prev => {
        const newSet = new Set(prev);
        newSet.delete(timeout);
        return newSet;
      });
    }, delay);
    
    setTimeoutRefs(prev => new Set(prev).add(timeout));
    return timeout;
  };

  // Prefetch next customer in background
  const prefetchNextCustomer = () => {
    const now = Date.now();
    // Debounce to prevent multiple calls within 500ms
    if (now - lastPrefetchTime < 500) return;
    
    setLastPrefetchTime(now);
    
    if (!nextCustomer && customersServed < dailyCustomerLimit - 1) {
      try {
        const forceSellerIntent = inventory.length === 0;
        const newCustomer = generateCustomer(forceSellerIntent);
        setNextCustomer(newCustomer);
      } catch (error) {
        console.warn('Failed to prefetch next customer:', error);
      }
    }
  };

  // Show next customer with controlled timing
  const showNextCustomer = () => {
    if (isLoadingNextCustomer) return; // Prevent multiple calls
    
    setIsLoadingNextCustomer(true);
    
    // Random delay between 300-900ms, with 1200ms timeout guard
    const delay = Math.random() * 600 + 300; // 300-900ms
    const timeoutGuard = 1200;
    
    const delayPromise = new Promise(resolve => addTimeout(resolve as () => void, delay));
    const timeoutPromise = new Promise(resolve => addTimeout(resolve as () => void, timeoutGuard));
    
    Promise.race([delayPromise, timeoutPromise]).then(() => {
      try {
        let customerToShow = nextCustomer;
        
        // Fallback if no prefetched customer
        if (!customerToShow && customersServed < dailyCustomerLimit) {
          const forceSellerIntent = inventory.length === 0;
          customerToShow = generateCustomer(forceSellerIntent);
        }
        
        if (customerToShow) {
          setCurrentCustomer(customerToShow);
          setNextCustomer(null);
          setOfferCount(0);
          
          // Setup new customer's item and offer
          if (customerToShow.intent === 'buy' && inventory.length > 0) {
            const interestedItem = inventory[Math.floor(Math.random() * inventory.length)];
            setSelectedItem(interestedItem);
            
            const customerOffer = Math.max(10, generateBalancedInitialOffer(customerToShow, interestedItem, level));
            setCurrentOffer(customerOffer);
            const message = getInitialOfferMessage('buyer', interestedItem, customerOffer, language);
            setCustomerResponse(message);
            showCustomerSpeech(message);
          } else if (customerToShow.intent === 'sell' && customerToShow.carriedItem) {
            setSelectedItem(customerToShow.carriedItem);
            const itemValue = calculateItemValue(customerToShow.carriedItem);
            const customerAskingPrice = Math.max(10, Math.floor(itemValue * (0.8 + Math.random() * 0.3)));
            setCurrentOffer(customerAskingPrice);
            const message = getInitialOfferMessage('seller', customerToShow.carriedItem, customerAskingPrice, language);
            setCustomerResponse(message);
            showCustomerSpeech(message);
          }
        }
      } catch (error) {
        console.error('Error showing next customer:', error);
        toast({
          title: "Yeni müşteri hazır.",
          description: "Bir sonraki müşteri dükkana geldi."
        });
      } finally {
        setIsLoadingNextCustomer(false);
      }
    });
  };

  // Common handler after deal resolution
  const onDealResolved = (responseMessage: string, delay: number = 1500) => {
    // Prefetch next customer immediately
    prefetchNextCustomer();
    
    // Show response message for specified time
    addTimeout(() => {
      showNextCustomer();
    }, delay);
  };

  // Auto-generate customer if none present and daily limit not reached
  useEffect(() => {
    if (!currentCustomer && !isLoadingNextCustomer && customersServed < dailyCustomerLimit) {
      showNextCustomer();
    }
  }, [currentCustomer, isLoadingNextCustomer, customersServed, dailyCustomerLimit]);

  const resetNegotiation = () => {
    setCurrentCustomer(null);
    setSelectedItem(null);
    setCurrentOffer(0);
    setCustomerResponse('');
    setShowOfferModal(false);
    setTempOffer(0);
    setShowSpeechBubble(false);
    setSpeechBubbleMessage('');
    setOfferCount(0);
    serveCustomer(); // Increment customer counter
  };

  const handleMakeOffer = () => {
    if (!currentCustomer || !selectedItem) return;
    
    const itemValue = calculateItemValue(selectedItem);
    setTempOffer(Math.max(10, Math.floor(itemValue * 0.8))); // Start with 80% of market value, minimum $10
    setShowOfferModal(true);
    
    // Prefetch next customer during negotiation
    prefetchNextCustomer();
  };

  const handleSubmitOffer = () => {
    if (!currentCustomer || tempOffer <= 0) return;
    
    const item = selectedItem || currentCustomer.carriedItem!;
    
    // Use the new balanced bargaining system
    try {
      const result = generateBalancedCounterOffer(
        currentCustomer,
        item,
        tempOffer,
        currentOffer,
        level,
        offerCount + 1
      );
      
      if (result.accepted) {
        // Customer accepts the offer
        setCustomerResponse(`${result.emoji} ${result.message}`);
        showCustomerSpeech(`${result.emoji} ${result.message}`);
        setShowOfferModal(false);
        setShowSuccessEffect(true);
        updateReputation(2);
        updateTrust(1);
        
        addTimeout(() => {
          handleAcceptOffer();
        }, 1500);
        return;
      } else if (result.counterOffer) {
        // Customer makes a counter-offer
        setCurrentOffer(result.counterOffer);
        setCustomerResponse(`${result.emoji} ${result.message}`);
        showCustomerSpeech(`${result.emoji} ${result.message}`);
        setOfferCount(prev => prev + 1);
        
        toast({
          title: "Karşı Teklif",
          description: `Müşteri $${result.counterOffer} teklif ediyor.`,
        });
        setShowOfferModal(false);
        return;
      } else {
        // Customer walks away
        setCustomerResponse(`${result.emoji} ${result.message}`);
        showCustomerSpeech(`${result.emoji} ${result.message}`);
        updateReputation(-1);
        
        addTimeout(() => {
          resetNegotiation();
        }, 2000);
        setShowOfferModal(false);
        return;
      }
    } catch (error) {
      console.warn('Falling back to original negotiation system:', error);
      
      // Fallback to simple logic
      const itemValue = calculateItemValue(item);
      const offerRatio = tempOffer / itemValue;
      
      let response = "Hmm, bu teklifi düşüneyim...";
      let shouldAccept = false;
      
      // Simple acceptance logic based on offer ratio
      if (currentCustomer.intent === 'buy' && offerRatio <= 1.2 && tempOffer <= currentCustomer.budget) {
        if (Math.random() < 0.7) {
          response = getRandomMessage('buyer', 'accept', language);
          shouldAccept = true;
        } else {
          const counterOffer = Math.max(10, Math.floor(tempOffer * 0.9));
          response = getRandomMessage('buyer', 'counter_low', language);
          setCurrentOffer(counterOffer);
          toast({
            title: "Karşı Teklif",
            description: `Müşteri $${counterOffer} teklif ediyor.`,
          });
        }
      } else if (currentCustomer.intent === 'sell' && offerRatio >= 0.6 && tempOffer <= cash) {
        if (Math.random() < 0.7) {
          response = getRandomMessage('seller', 'accept', language);
          shouldAccept = true;
        } else {
          const counterOffer = Math.max(10, Math.floor(tempOffer * 1.1));
          response = getRandomMessage('seller', 'counter_high', language);
          setCurrentOffer(counterOffer);
          toast({
            title: "Karşı Teklif", 
            description: `Müşteri $${counterOffer} istedi.`,
          });
        }
      }
      
      // Auto-reject if patience runs out (3+ offers)
      if (offerCount >= 2) {
        const autoRejectMessages = [
          "Sanırım anlaşamayacağız, başka bir zaman görüşürüz.",
          "Bu fiyatlarla olmaz, iyi günler dilerim.",
          "Bu iş bugünlük buraya kadar, hoşça kalın."
        ];
        const autoRejectMessage = autoRejectMessages[Math.floor(Math.random() * autoRejectMessages.length)];
        response = `😤 ${autoRejectMessage}`;
        updateReputation(-1);
        
        addTimeout(() => {
          resetNegotiation();
        }, 2000);
      } else if (shouldAccept) {
        setShowSuccessEffect(true);
        updateReputation(2);
        updateTrust(1);
        
        addTimeout(() => {
          handleAcceptOffer();
        }, 1500);
      } else {
        setOfferCount(prev => prev + 1);
      }
      
      setCustomerResponse(response);
      showCustomerSpeech(response);
    }
    
    setShowOfferModal(false);
  };

  const handleAcceptOffer = () => {
    if (!currentCustomer || !selectedItem) return;
    
    // Prefetch next customer immediately
    prefetchNextCustomer();
    
    // Show success animation first
    setShowSuccessEffect(true);
    const acceptMessage = getRandomMessage(currentCustomer.intent === 'buy' ? 'buyer' : 'seller', 'accept', language);
    setCustomerResponse(acceptMessage);
    showCustomerSpeech(acceptMessage);
    
    // Process the transaction
    if (currentCustomer.intent === 'buy') {
      // Müşteri bizden alıyor -> kasaya para girer
      sellItem(selectedItem, currentOffer);
      updateReputation(1);
    } else {
      // Müşteri bize satıyor -> kasadan para çıkar
      if (!buyItem(selectedItem, currentOffer)) {
        toast({
          title: "Yetersiz Para",
          description: "Bu teklifi karşılayacak paranız yok.",
          variant: "destructive",
        });
        setShowSuccessEffect(false);
        return;
      }
      updateReputation(1);
    }
    
    addTimeout(() => {
      setShowSuccessEffect(false);
      toast({
        title: currentCustomer.intent === 'buy' ? 'Satış Tamamlandı! 💵' : 'Satın Alma Tamamlandı! 📦',
        description: currentCustomer.intent === 'buy' 
          ? `$${currentOffer} karşılığında satıldı.` 
          : `$${currentOffer} karşılığında satın alındı.`,
      });
      resetNegotiation();
      onDealResolved(acceptMessage, 600); // Quick transition after successful deal
    }, 1500);
  };

  const handleRejectOffer = () => {
    if (!currentCustomer) return;
    
    const rejectMessage = getRandomMessage(currentCustomer.intent === 'buy' ? 'buyer' : 'seller', 'reject', language);
    setCustomerResponse(`😞 ${rejectMessage}`);
    showCustomerSpeech(`😞 ${rejectMessage}`);
    updateReputation(-1);
    
    addTimeout(() => {
      toast({
        title: "Anlaşma Olmadı 😞",
        description: "Müşteri teklifinizi reddetti.",
        variant: "destructive",
      });
      resetNegotiation();
      onDealResolved("😞", 800); // Medium transition after rejection
    }, 2000);
  };

  const adjustOffer = (amount: number) => {
    setTempOffer(prev => Math.max(1, prev + amount));
  };

  const getCustomerTypeDisplay = (type: string) => {
    const types = {
      'collector': { tr: 'Koleksiyoner', trait: 'Kaliteli' },
      'student': { tr: 'Öğrenci', trait: 'Bütçeli' },
      'trader': { tr: 'Tüccar', trait: 'Pazarlıkçı' },
      'nostalgic': { tr: 'Nostaljik', trait: 'Duygusal' },
      'hunter': { tr: 'Avcı', trait: 'Hızlı' },
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
            <CardTitle className="text-center">🌅 Dükkan Kapandı!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Dükkan kapandı, yarın tekrar açılıyor.
            </p>
            <Button onClick={() => window.location.reload()}>
              🏪 Yeni Güne Başla
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    if (isLoadingNextCustomer) {
      return (
        <Card className="w-full max-w-sm mx-auto mt-4 border-2 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="text-4xl animate-pulse">🤔</div>
              <p className="text-sm text-muted-foreground font-medium">Müşteri ürün seçiyor...</p>
              {/* Skeleton animation */}
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/60 to-muted/30 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/60 to-muted/30 rounded animate-pulse w-3/4 mx-auto"></div>
              </div>
            </div>
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
    <div className="w-full max-w-sm mx-auto space-y-4 relative">
      {/* Success Effect - Flying Money */}
      {showSuccessEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce">
            <div className="text-6xl animate-pulse">💵</div>
          </div>
          <div className="absolute animate-[fade-in_0.3s_ease-out,slide-in-right_1s_ease-out] delay-200">
            <div className="text-4xl">💵</div>
          </div>
          <div className="absolute animate-[fade-in_0.3s_ease-out,slide-in-left_1s_ease-out] delay-500">
            <div className="text-3xl">💰</div>
          </div>
        </div>
      )}

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative">
          <SpeechBubble 
            message={speechBubbleMessage} 
            isVisible={showSpeechBubble}
            onComplete={() => setShowSpeechBubble(false)}
          />
        </div>
      )}

      {/* Customer Info Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={currentCustomer.avatar} 
              alt={currentCustomer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <CardTitle className="text-lg">{currentCustomer.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {customerTypeInfo.tr}
                </Badge>
                <span>{customerTypeInfo.trait}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Item Details */}
          <div className="text-center space-y-2">
            <div className="text-2xl">{selectedItem.image}</div>
            <h3 className="font-medium">{selectedItem.name}</h3>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>Durum: {selectedItem.condition}%</span>
              <span>Nadir: {selectedItem.rarity}</span>
            </div>
            <p className="text-sm text-primary">Tahmini Değer: ${itemValue}</p>
          </div>

          {/* Customer Response */}
          <div className="bg-muted/50 p-3 rounded-lg text-sm text-center">
            {customerResponse}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRejectOffer}
              className="text-xs"
            >
              Reddet
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMakeOffer}
              className="text-xs"
            >
              Teklif Ver
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAcceptOffer}
              className="text-xs"
            >
              Kabul Et
            </Button>
          </div>

          {/* Current Offer Display */}
          <div className="text-center">
            <p className="text-lg font-bold text-primary">
              Güncel Teklif: ${currentOffer}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentCustomer.intent === 'buy' ? 'Müşteri vereceği fiyat' : 'Müşteri istediği fiyat'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Teklif Ver</DialogTitle>
            <DialogDescription>
              {currentCustomer.intent === 'buy' 
                ? `${selectedItem.name} için satış fiyatı belirleyin`
                : `${selectedItem.name} için alış fiyatı belirleyin`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fiyat ($)</label>
              <Input
                type="number"
                value={tempOffer}
                onChange={(e) => setTempOffer(Number(e.target.value))}
                className="text-center text-lg font-bold"
                min="1"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
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
                onClick={() => adjustOffer(-10)}
              >
                -$10
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