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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Minus, Plus } from 'lucide-react';
import { SpeechBubble } from '@/components/ui/SpeechBubble';

// Import customer avatars (for reference only)
import customer1 from '@/assets/avatars/customer-1.jpg';
import customer2 from '@/assets/avatars/customer-2.jpg';
import customer3 from '@/assets/avatars/customer-3.jpg';
import customer4 from '@/assets/avatars/customer-4.jpg';
import customer5 from '@/assets/avatars/customer-5.jpg';
import customer6 from '@/assets/avatars/customer-6.jpg';
import customer7 from '@/assets/avatars/customer-7.jpg';
import customer8 from '@/assets/avatars/customer-8.jpg';

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
    },
    counter_angry: {
      tr: ["Bu ne biçim fiyat böyle?!", "Dalga mı geçiyorsun?!", "Çok abartıyorsun!", "Bu kadar pahalı olmaz!", "Saygısızlık bu!"],
      en: ["What kind of price is this?!", "Are you kidding me?!", "You're way overcharging!", "This can't be that expensive!", "That's outrageous!"],
      de: ["Was ist das denn für ein Preis?!", "Machst du Witze?!", "Du verlangst viel zu viel!", "So teuer kann das nicht sein!", "Das ist eine Frechheit!"]
    },
    counter_neutral: {
      tr: ["Hmmm, fena değil ama biraz düşük olabilir.", "Makul ama daha iyi olur.", "Neredeyse tamam, biraz daha inin.", "Yaklaştın ama tam değil.", "İyi ama mükemmel değil."],
      en: ["Hmm, not bad but could be lower.", "Reasonable but could be better.", "Almost there, come down a bit more.", "You're close but not quite.", "Good but not perfect."],
      de: ["Hmm, nicht schlecht aber könnte niedriger sein.", "Vernünftig aber könnte besser sein.", "Fast da, gehen Sie noch etwas runter.", "Sie sind nah dran aber nicht ganz.", "Gut aber nicht perfekt."]
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
    },
    counter_angry: {
      tr: ["Bu ne biçim teklif böyle?!", "Dalga mı geçiyorsun?!", "Çok düşük, saygısızlık!", "Bu kadar ucuza olmaz!", "Ciddiye almıyorsun!"],
      en: ["What kind of offer is this?!", "Are you joking?!", "Too low, that's insulting!", "It can't be this cheap!", "You're not taking this seriously!"],
      de: ["Was ist das denn für ein Angebot?!", "Machen Sie Witze?!", "Zu niedrig, das ist beleidigend!", "So billig kann es nicht sein!", "Sie nehmen das nicht ernst!"]
    },
    counter_neutral: {
      tr: ["Fena değil ama biraz daha artırsan iyi olur.", "Yaklaştın, biraz daha üstüne koy.", "Makul ama mükemmel değil.", "İyi başlangıç, biraz daha yüksel.", "Neredeyse tamam, ufak bir artış yeter."],
      en: ["Not bad but a bit more would be good.", "You're close, add a little more.", "Reasonable but not perfect.", "Good start, go a bit higher.", "Almost there, just a small increase needed."],
      de: ["Nicht schlecht aber etwas mehr wäre gut.", "Sie sind nah dran, legen Sie etwas drauf.", "Vernünftig aber nicht perfekt.", "Guter Anfang, gehen Sie etwas höher.", "Fast da, nur eine kleine Erhöhung nötig."]
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
    serveCustomer
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [customerResponse, setCustomerResponse] = useState<string>('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [tempOffer, setTempOffer] = useState<number>(0);
  const [customerFrustration, setCustomerFrustration] = useState(0);
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  const [showRejectEffect, setShowRejectEffect] = useState(false);
  const [showSadCustomer, setShowSadCustomer] = useState(false);
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
            
            const itemValue = calculateItemValue(interestedItem);
            const customerOffer = Math.max(10, generateCustomerInitialOffer(customerToShow, itemValue));
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
    setCustomerFrustration(0);
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
      } else {
        if (offerRatio > 1.5) {
          response = getRandomMessage('buyer', 'counter_angry', language);
          setCustomerFrustration(prev => prev + 2);
        } else if (offerRatio > 1.2) {
          response = getRandomMessage('buyer', 'counter_neutral', language);
          setCustomerFrustration(prev => prev + 1);
        } else {
          response = getRandomMessage('buyer', 'counter_low', language);
          setCustomerFrustration(prev => prev + 1);
        }
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
          response = getRandomMessage('seller', 'accept', language);
          shouldAccept = true;
        } else {
          const counterOffer = Math.max(10, Math.floor(tempOffer * 1.1));
          response = getRandomMessage('seller', 'counter_high', language);
          setCurrentOffer(counterOffer);
          toast({
            title: "Karşı Teklif",
            description: `Müşteri $${counterOffer} istiyor.`,
          });
        }
      } else {
        if (offerRatio < 0.4) {
          response = getRandomMessage('seller', 'counter_angry', language);
          setCustomerFrustration(prev => prev + 2);
        } else if (offerRatio < 0.6) {
          response = getRandomMessage('seller', 'counter_neutral', language);
          setCustomerFrustration(prev => prev + 1);
        } else {
          response = getRandomMessage('seller', 'counter_high', language);
          setCustomerFrustration(prev => prev + 1);
        }
      }
    }
    
    setCustomerResponse(response);
    showCustomerSpeech(response);
    setShowOfferModal(false);
    
    if (shouldAccept) {
      // Process the transaction immediately
      if (currentCustomer.intent === 'buy') {
        sellItem(item, tempOffer);
        updateReputation(2);
        updateTrust(1);
      } else {
        if (buyItem(item, tempOffer)) {
          updateReputation(2);
          updateTrust(1);
        } else {
          toast({
            title: "Yetersiz Para",
            description: "Bu teklifi karşılayacak paranız yok.",
            variant: "destructive",
          });
          return;
        }
      }
      
      addTimeout(() => {
        toast({
          title: currentCustomer.intent === 'buy' ? 'Satış Tamamlandı' : 'Satın Alma Tamamlandı',
          description: currentCustomer.intent === 'buy' 
            ? `$${tempOffer} karşılığında satıldı.` 
            : `$${tempOffer} karşılığında satın alındı.`,
        });
        resetNegotiation();
        onDealResolved(response, 400); // Quick transition after accepted negotiation
      }, 1500);
    } else if (customerFrustration >= 3) {
      addTimeout(() => {
        toast({
          title: "Müşteri Çekti Gitti! 😤",
          description: "Müşteri pazarlığı beğenmedi ve gitti.",
          variant: "destructive",
        });
        resetNegotiation();
        onDealResolved("😤", 600); // Medium transition after frustration
      }, 2000);
    }
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
      resetNegotiation();
      onDealResolved(acceptMessage, 300); // Fast transition after successful deal
    }, 1200);
  };

  const handleRejectOffer = () => {
    // Prefetch next customer immediately  
    prefetchNextCustomer();
    
    // Show rejection effects first
    setShowRejectEffect(true);
    setShowSadCustomer(true);
    const rejectMessage = getRandomMessage(currentCustomer.intent === 'buy' ? 'buyer' : 'seller', 'reject', language);
    setCustomerResponse(rejectMessage);
    showCustomerSpeech(rejectMessage);
    
    addTimeout(() => {
      setShowRejectEffect(false);
      setShowSadCustomer(false);
      
      toast({
        title: "Müşteri Ayrıldı",
        description: "Müşteri dükkânı terk etti.",
      });
      resetNegotiation();
      onDealResolved(rejectMessage, 400); // Quick transition after rejection
    }, 1500);
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
            <CardTitle className="text-center">🌅 Dükkan Kapandı!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Dükkan kapandı, yarın tekrar açılıyor.
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
          <div className="absolute animate-[fade-in_0.5s_ease-out,slide-in-right_1.2s_ease-out] delay-500">
            <div className="text-3xl">💵</div>
          </div>
        </div>
      )}
      
      {/* Reject Effect - Red X */}
      {showRejectEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl text-red-500 animate-[scale-in_0.3s_ease-out,fade-out_0.5s_ease-out_0.5s]">
            ❌
          </div>
        </div>
      )}

      {/* Role Card */}
      <Card className={`border-2 ${
        currentCustomer.intent === 'buy' 
          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500' 
          : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500'
      }`}>
        <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-background relative">
                <img 
                  src={currentCustomer.avatar} 
                  alt={`${currentCustomer.name} avatar`}
                  className="w-full h-full object-cover"
                />
                <SpeechBubble
                  message={speechBubbleMessage}
                  isVisible={showSpeechBubble}
                  onComplete={() => setShowSpeechBubble(false)}
                  className="bottom-16 left-0"
                />
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
            
            {currentCustomer.intent === 'buy' && selectedItem.purchasePrice && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-600">Alış Fiyatım:</span>
                <span className="text-lg font-bold text-red-600">${selectedItem.purchasePrice}</span>
              </div>
            )}
            
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
            <DialogDescription>
              Müşteriyle pazarlık yapmak için fiyat belirleyin.
            </DialogDescription>
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
                  value={tempOffer === 0 ? '' : tempOffer}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                    setTempOffer(Math.max(0, value));
                  }}
                  onBlur={(e) => {
                    if (tempOffer === 0) {
                      setTempOffer(1);
                    }
                  }}
                  placeholder="Tutar girin"
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