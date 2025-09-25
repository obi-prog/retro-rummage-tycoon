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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

  // Get level-based background color
  const getLevelBgColor = (level: number) => {
    const colors = [
      'bg-gradient-to-br from-slate-50 to-blue-50',     // Level 1
      'bg-gradient-to-br from-blue-50 to-indigo-50',    // Level 2
      'bg-gradient-to-br from-indigo-50 to-purple-50',  // Level 3
      'bg-gradient-to-br from-purple-50 to-pink-50',    // Level 4
      'bg-gradient-to-br from-pink-50 to-rose-50',      // Level 5
      'bg-gradient-to-br from-rose-50 to-orange-50',    // Level 6
      'bg-gradient-to-br from-orange-50 to-yellow-50',  // Level 7
      'bg-gradient-to-br from-yellow-50 to-green-50',   // Level 8+
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

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
      toast({
        title: "Satış Başarılı! 💰",
        description: `${selectedItem.name} $${currentOffer}'a satıldı!`,
      });
    } else {
      // Müşteri bize satıyor -> kasadan para çıkar
      if (cash >= currentOffer) {
        buyItem(selectedItem, currentOffer);
        toast({
          title: "Alış Başarılı! 📦",
          description: `${selectedItem.name} $${currentOffer}'a alındı!`,
        });
      } else {
        toast({
          title: "Yetersiz Para!",
          description: "Bu alış için yeterli paranız yok.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Schedule customer reset
    addTimeout(() => {
      resetNegotiation();
    }, 2000);
  };

  const handleRejectOffer = () => {
    if (!currentCustomer) return;
    
    const rejectMessage = getRandomMessage(
      currentCustomer.intent === 'buy' ? 'buyer' : 'seller', 
      'reject', 
      language
    );
    setCustomerResponse(`😔 ${rejectMessage}`);
    showCustomerSpeech(`😔 ${rejectMessage}`);
    updateReputation(-0.5);
    
    addTimeout(() => {
      resetNegotiation();
    }, 1500);
  };

  const adjustOffer = (amount: number) => {
    setTempOffer(Math.max(10, tempOffer + amount));
  };

  // Dükkan kapalı
  if (customersServed >= dailyCustomerLimit) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getLevelBgColor(level)}`}>
        <div className="text-center p-8 bg-card rounded-xl shadow-lg max-w-sm mx-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            🏪 Dükkan Kapalı
          </h2>
          <p className="text-muted-foreground">
            Günlük müşteri limiti ({dailyCustomerLimit}) doldu. Yarın tekrar gelin!
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingNextCustomer) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getLevelBgColor(level)}`}>
        <div className="text-center p-8 bg-card rounded-xl shadow-lg max-w-sm mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yeni müşteri geliyor...</p>
        </div>
      </div>
    );
  }

  // Waiting for customer
  if (!currentCustomer) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getLevelBgColor(level)}`}>
        <div className="text-center p-8 bg-card rounded-xl shadow-lg max-w-sm mx-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            ⏳ Müşteri Bekleniyor
          </h2>
          <p className="text-muted-foreground">
            Müşteri: {customersServed} / {dailyCustomerLimit}
          </p>
        </div>
      </div>
    );
  }

  const getCustomerTypeDisplay = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'Duygusal': { label: '💭 Duygusal', color: 'bg-retro-pink/20 text-retro-pink border-retro-pink/30' },
      'Nostaljik': { label: '🎭 Nostaljik', color: 'bg-retro-purple/20 text-retro-purple border-retro-purple/30' },
      'Pratik': { label: '⚡ Pratik', color: 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/30' },
      'Koleksiyoncu': { label: '🎯 Koleksiyoncu', color: 'bg-cash-green/20 text-cash-green border-cash-green/30' },
      'Pazarlıkçı': { label: '💼 Pazarlıkçı', color: 'bg-retro-orange/20 text-retro-orange border-retro-orange/30' },
      'Aceleyle': { label: '⏰ Aceleyle', color: 'bg-destructive/20 text-destructive border-destructive/30' },
      'Titiz': { label: '🔍 Titiz', color: 'bg-retro-yellow/20 text-retro-yellow border-retro-yellow/30' }
    };
    return typeMap[type] || { label: type, color: 'bg-muted text-muted-foreground' };
  };

  return (
    <div className={`min-h-screen ${getLevelBgColor(level)} p-4`}>
      {/* Success effect overlay */}
      {showSuccessEffect && (
        <div className="fixed inset-0 bg-cash-green/20 z-50 flex items-center justify-center animate-pulse">
          <div className="text-6xl animate-bounce">💰</div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="max-w-md mx-auto mb-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-cash-green text-lg">💵</span>
              <span className="font-bold text-xl text-foreground">${cash.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-retro-orange">⭐</span>
              <span className="font-semibold text-lg text-foreground">Lv {level}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {customersServed}/{dailyCustomerLimit}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Customer Card */}
        <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* Large Customer Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24 border-4 border-border">
                  <AvatarImage src={currentCustomer.avatar || ''} alt={currentCustomer.name} />
                  <AvatarFallback className="text-2xl">{currentCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* Role Badge */}
                <div className="mt-2 text-center">
                  {currentCustomer.intent === 'buy' ? (
                    <Badge className="bg-cash-green/20 text-cash-green border-cash-green/30 text-sm font-bold px-3 py-1">
                      🟢 ALICI
                    </Badge>
                  ) : (
                    <Badge className="bg-retro-orange/20 text-retro-orange border-retro-orange/30 text-sm font-bold px-3 py-1">
                      🟠 SATICI
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground mb-2">{currentCustomer.name}</h3>
                <Badge className={`${getCustomerTypeDisplay(currentCustomer.type).color} text-xs border mb-3`}>
                  {getCustomerTypeDisplay(currentCustomer.type).label}
                </Badge>
                
                {/* Intent Description */}
                <p className="text-sm text-muted-foreground">
                  {currentCustomer.intent === 'buy' 
                    ? "Senden ürün almak istiyor" 
                    : "Sana ürün satmak istiyor"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Item Card */}
        {selectedItem && (
          <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Large Item Icon */}
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-border flex-shrink-0">
                  <span className="text-3xl">{selectedItem.image || '📦'}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground mb-1">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedItem.category}</p>
                  
                  {/* Price Information */}
                  <div className="space-y-2">
                    {/* Market Value - Always Visible */}
                    <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                      <p className="text-xs text-destructive font-medium mb-1">TAHMİNİ DEĞER</p>
                      <p className="text-2xl font-bold text-destructive">
                        ${calculateItemValue(selectedItem).toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Customer Offer/Price */}
                    {currentCustomer.intent === 'buy' && (
                      <div className="bg-retro-orange/10 p-3 rounded-lg border border-retro-orange/30">
                        <p className="text-xs text-retro-orange font-medium mb-1">TEKLİF ETTİĞİ FİYAT</p>
                        <p className="text-2xl font-bold text-retro-orange">
                          ${currentOffer.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {currentCustomer.intent === 'sell' && (
                      <div className="bg-retro-orange/10 p-3 rounded-lg border border-retro-orange/30">
                        <p className="text-xs text-retro-orange font-medium mb-1">İSTEDİĞİ FİYAT</p>
                        <p className="text-2xl font-bold text-retro-orange">
                          ${currentOffer.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {/* Show Buy Price if selling from inventory */}
                    {currentCustomer.intent === 'buy' && selectedItem && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Senin Alış Fiyatın: ${Math.floor(calculateItemValue(selectedItem) * 0.6)}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Condition & Rarity Badges */}
                  <div className="flex space-x-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {selectedItem.condition}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedItem.rarity}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Message */}
        <div className="relative">
          <SpeechBubble 
            message={speechBubbleMessage}
            isVisible={showSpeechBubble}
            onComplete={() => setShowSpeechBubble(false)}
            className="top-0 left-4 z-20"
          />
          <div className="bg-card rounded-xl p-4 shadow-lg border">
            <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
              <p className="text-lg leading-relaxed text-foreground">{customerResponse}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="destructive" 
            onClick={handleRejectOffer} 
            className="h-12 text-base font-semibold"
            size="lg"
          >
            ❌ Reddet
          </Button>
          <Button 
            variant="outline" 
            onClick={handleMakeOffer} 
            className="h-12 text-base font-semibold border-2"
            size="lg"
          >
            💬 Teklif Ver
          </Button>
          <Button 
            variant="default" 
            onClick={handleAcceptOffer} 
            className="h-12 text-base font-semibold"
            size="lg"
          >
            ✅ Kabul Et
          </Button>
        </div>

        {/* Offer Modal - Enhanced for Mobile */}
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="sm:max-w-md mx-4 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                💰 Teklif Ver
              </DialogTitle>
              <DialogDescription className="text-center">
                {currentCustomer?.intent === 'buy' 
                  ? "Müşterinin teklif ettiği fiyatı değerlendirin" 
                  : "Bu ürün için teklifinizi yapın"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Large Price Display */}
              <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/30">
                <p className="text-sm text-primary font-medium mb-2">GÜNCEL TEKLİF</p>
                <p className="text-4xl font-bold text-primary">
                  ${tempOffer.toLocaleString()}
                </p>
              </div>
              
              {/* Price Adjustment Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 w-12 rounded-full"
                    onClick={() => setTempOffer(Math.max(10, tempOffer - 100))}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={tempOffer}
                      onChange={(e) => setTempOffer(Math.max(10, parseInt(e.target.value) || 10))}
                      className="text-center text-xl font-bold h-12 rounded-xl border-2"
                      min="10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 w-12 rounded-full"
                    onClick={() => setTempOffer(tempOffer + 100)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Quick Adjustment Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTempOffer(Math.max(10, tempOffer - 50))}
                    className="text-xs"
                  >
                    -$50
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTempOffer(Math.max(10, tempOffer - 25))}
                    className="text-xs"
                  >
                    -$25
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTempOffer(tempOffer + 25)}
                    className="text-xs"
                  >
                    +$25
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTempOffer(tempOffer + 50)}
                    className="text-xs"
                  >
                    +$50
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOfferModal(false)} 
                  className="h-12 text-base"
                  size="lg"
                >
                  ❌ İptal
                </Button>
                <Button 
                  onClick={handleSubmitOffer} 
                  className="h-12 text-base font-semibold"
                  size="lg"
                >
                  💸 Teklif Gönder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};