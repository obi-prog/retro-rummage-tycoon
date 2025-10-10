import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLocale = 'en' | 'tr' | 'de';

interface I18nState {
  currentLocale: SupportedLocale;
  override: SupportedLocale | null;
  resources: Record<SupportedLocale, Record<string, any>>;
}

interface I18nContextType {
  locale: SupportedLocale;
  t: (key: string, fallback?: string, params?: Record<string, string>) => string | any;
  setLocale: (locale: SupportedLocale | null) => void;
  getNestedTranslation: (key: string, fallback?: string, params?: Record<string, string>) => string | any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation resources
const resources: Record<SupportedLocale, Record<string, any>> = {
  en: {
    common: {
      continue: "Continue",
      accept: "Accept",
      decline: "Decline",
      counter: "Counter",
      submit: "Submit",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      yes: "Yes",
      no: "No",
      save: "Save",
      close: "Close",
      week: "Week",
      day: "Day",
      customerWantsToBuy: "I'd like to buy this {} for ${}",
      customerWantsToSell: "I want to sell this {} for ${}",
      greatDeal: "🎉 Great deal!",
      dealAccepted: "✅ Deal Accepted",
      noDeal: "Maybe next time...",
      dealCompleted: "✅ Deal Completed!",
      dealRejected: "❌ Deal Rejected",
      customerRejected: "Customer rejected the offer"
    },
    menu: {
      newGame: "New Game",
      continue: "Continue",
      settings: "Settings",
      credits: "Credits",
      language: "Language",
      systemDefault: "System Default"
    },
    settings: {
      title: "Settings",
      language: "Language",
      systemDefault: "System Default",
      sound: "Sound",
      music: "Music",
      effects: "Sound Effects"
    },
    game: {
      cash: "Cash",
      level: "Level",
      reputation: "Reputation",
      dayComplete: "Day Complete!",
      customersServed: "Customers served",
      lookingForCustomers: "Looking for customers...",
      dealCompleted: "Deal Completed!",
      insufficientFunds: "Insufficient Funds",
      notEnoughMoney: "You don't have enough money for this purchase."
    },
    shop: {
      buyer: "BUYER",
      seller: "SELLER",
      wantsToPurchase: "Wants to purchase from you",
      wantsToSell: "Wants to sell to you",
      marketValue: "Market Value",
      estimatedMarketValue: "Estimated Market Value",
      referenceInfo: "reference info",
      sellerAskingPrice: "Seller's Asking Price",
      customerRequestedAmount: "customer's requested amount",
      yourPurchasePrice: "Your Purchase Price",
      yourCostForItem: "your cost for this item",
      buyerOfferPrice: "Buyer's Offer Price",
      customerWillingToPay: "customer's willing to pay",
      profitLoss: "Profit/Loss",
      makeCounterOffer: "Make Counter Offer",
      currentOffer: "Current Offer",
      condition: "condition",
      soldFor: "Sold {} for ${}!",
      boughtFor: "Bought {} for ${}!",
      counterRejectionMessages: [
        "That's not quite what I had in mind...",
        "I was thinking of a different price range.",
        "Let me consider other options.",
        "That doesn't work for me, sorry."
      ]
    },
    navigation: {
      shop: "Shop",
      gameBook: "Game Book",
      inventory: "Inventory",
      missions: "Missions",
      skills: "Skills"
    },
    items: {
      categories: {
        cassette_record: "Vinyl Records",
        walkman_electronics: "Electronics",
        watch: "Watches",
        toy: "Toys",
        comic: "Comics",
        poster: "Posters",
        camera: "Cameras"
      },
      names: {
        cassette_record: ["Vintage LP", "Rock Album", "Jazz Collection", "Classical Set"],
        walkman_electronics: ["Retro Walkman", "Vintage Radio", "Old Headphones", "Cassette Player"],
        watch: ["Pocket Watch", "Vintage Rolex", "Antique Timepiece", "Classic Watch"],
        toy: ["Action Figure", "Vintage Doll", "Model Car", "Board Game"],
        comic: ["First Edition Comic", "Vintage Magazine", "Rare Issue", "Collector Comic"],
        poster: ["Movie Poster", "Concert Poster", "Vintage Ad", "Art Print"],
        camera: ["Film Camera", "Vintage Polaroid", "Old Lens", "Photo Equipment"]
      },
      rarities: {
        common: "Common",
        rare: "Rare",
        very_rare: "Very Rare",
        legendary: "Legendary"
      },
      authenticity: {
        authentic: "Authentic",
        fake: "Fake",
        suspicious: "Suspicious"
      }
    },
    endOfDay: {
      title: "Daily Summary",
      income: "Income",
      expenses: "Expenses",
      net: "Net Profit / Loss",
      stats: "Daily Stats",
      sold: "Items Sold",
      bought: "Items Bought",
      successful: "Successful Negotiations",
      fakeDetected: "Fake Items Detected",
      cashAfter: "Cash After Day",
      openShop: "Open Shop"
    },
    dialogue: {
      greeting: [
        "Hi! I have something I'd like to sell.",
        "Would you take a look at this item?",
        "Maybe this will catch your interest!"
      ],
      buy_dialogues: [
        "This might be exactly what I'm looking for.",
        "Not bad, but the price is a bit high.",
        "Can you offer a better price?",
        "Deal! I'm buying it right now!"
      ],
      sell_dialogues: [
        "This item is rare, lowering the price is hard.",
        "I can't sell it below its value.",
        "It's well kept, but the price feels high.",
        "Deal! It's yours!"
      ],
      negotiation: [
        "That offer's too low, raise it a bit.",
        "You're getting closer, but add a little more.",
        "Hmm… I'm almost convinced.",
        "Alright, that works for me.",
        "No, I changed my mind."
      ],
      deal_success: [
        "That was a great deal!",
        "Thanks, I'm satisfied with that.",
        "We made a good deal!"
      ],
      deal_fail: [
        "I guess we won't agree, see you around.",
        "That was a waste of time, goodbye.",
        "Maybe we'll agree next time."
      ],
      random_talks: [
        "I used to have this when I was a kid!",
        "This reminds me of my grandfather's shop.",
        "Leave me some profit too, what do you say?",
        "I love bargaining, let's see what happens!"
      ]
    }
  },
  tr: {
    common: {
      continue: "Devam Et",
      accept: "Kabul Et",
      decline: "Reddet",
      counter: "Karşı Teklif",
      submit: "Gönder",
      cancel: "İptal",
      back: "Geri",
      next: "İleri",
      yes: "Evet",
      no: "Hayır",
      save: "Kaydet",
      close: "Kapat",
      week: "Hafta",
      day: "Gün",
      customerWantsToBuy: "Bu {} ürününü ${} dolara satın almak istiyorum",
      customerWantsToSell: "Bu {} ürününü ${} dolara satmak istiyorum",
      greatDeal: "🎉 Harika anlaşma!",
      dealAccepted: "✅ Anlaşma Kabul Edildi",
      noDeal: "Belki başka zaman...",
      dealCompleted: "✅ Anlaşma Tamamlandı!",
      dealRejected: "❌ Anlaşma Reddedildi",
      customerRejected: "Müşteri teklifi reddetti"
    },
    menu: {
      newGame: "Yeni Oyun",
      continue: "Devam Et",
      settings: "Ayarlar",
      credits: "Yapımcılar",
      language: "Dil",
      systemDefault: "Sistem Varsayılanı"
    },
    settings: {
      title: "Ayarlar",
      language: "Dil",
      systemDefault: "Sistem Varsayılanı",
      sound: "Ses",
      music: "Müzik",
      effects: "Ses Efektleri"
    },
    game: {
      cash: "Nakit",
      level: "Seviye",
      reputation: "İtibar",
      dayComplete: "Gün Tamamlandı!",
      customersServed: "Hizmet verilen müşteri",
      lookingForCustomers: "Müşteri aranıyor...",
      dealCompleted: "Anlaşma Tamamlandı!",
      insufficientFunds: "Yetersiz Bakiye",
      notEnoughMoney: "Bu satın alma için yeterli paranız yok."
    },
    shop: {
      buyer: "ALICI",
      seller: "SATICI",
      wantsToPurchase: "Sizden satın almak istiyor",
      wantsToSell: "Size satmak istiyor",
      marketValue: "Piyasa Değeri",
      estimatedMarketValue: "Tahmini Piyasa Değeri",
      referenceInfo: "referans bilgi",
      sellerAskingPrice: "Satıcının İstediği Fiyat",
      customerRequestedAmount: "müşterinin istediği rakam",
      yourPurchasePrice: "Senin Alış Fiyatın",
      yourCostForItem: "bu ürünün sana maliyeti",
      buyerOfferPrice: "Alıcının Teklif Ettiği Fiyat",
      customerWillingToPay: "müşterinin ödemek istediği rakam",
      profitLoss: "Kar/Zarar",
      makeCounterOffer: "Karşı Teklif Yap",
      currentOffer: "Mevcut Teklif",
      condition: "durumu",
      soldFor: "{} ${}' a satıldı!",
      boughtFor: "{} ${}' a satın alındı!",
      counterRejectionMessages: [
        "Aklımda tam olarak bu değildi...",
        "Farklı bir fiyat aralığı düşünüyordum.",
        "Diğer seçenekleri değerlendireyim.",
        "Bu benim için uygun değil, üzgünüm."
      ]
    },
    navigation: {
      shop: "Dükkan",
      gameBook: "Oyun Defteri",
      inventory: "Envanter",
      missions: "Görevler",
      skills: "Yetenekler"
    },
    items: {
      categories: {
        cassette_record: "Plak Kayıtları",
        walkman_electronics: "Elektronik",
        watch: "Saatler",
        toy: "Oyuncaklar",
        comic: "Çizgi Romanlar",
        poster: "Posterler",
        camera: "Kameralar"
      },
      names: {
        cassette_record: ["Vintage LP", "Rock Albümü", "Jazz Koleksiyonu", "Klasik Set"],
        walkman_electronics: ["Retro Walkman", "Vintage Radyo", "Eski Kulaklık", "Kaset Çalar"],
        watch: ["Cep Saati", "Vintage Rolex", "Antika Saat", "Klasik Saat"],
        toy: ["Aksiyon Figürü", "Vintage Bebek", "Model Araba", "Masa Oyunu"],
        comic: ["İlk Baskı Çizgi Roman", "Vintage Dergi", "Nadir Sayı", "Koleksiyoncu Çizgi Romanı"],
        poster: ["Film Posteri", "Konser Posteri", "Vintage Reklam", "Sanat Baskısı"],
        camera: ["Film Kamerası", "Vintage Polaroid", "Eski Lens", "Fotoğraf Ekipmanı"]
      },
      rarities: {
        common: "Yaygın",
        rare: "Nadir",
        very_rare: "Çok Nadir",
        legendary: "Efsanevi"
      },
      authenticity: {
        authentic: "Orijinal",
        fake: "Sahte",
        suspicious: "Şüpheli"
      }
    },
    endOfDay: {
      title: "Gün Özeti",
      income: "Gelir",
      expenses: "Gider",
      net: "Net Kâr / Zarar",
      stats: "Günlük İstatistikler",
      sold: "Satılan Ürün",
      bought: "Alınan Ürün",
      successful: "Başarılı Pazarlık",
      fakeDetected: "Sahte Ürün Yakalandı",
      cashAfter: "Gün Sonu Nakit",
      openShop: "Dükkanı Aç"
    },
    dialogue: {
      greeting: [
        "Merhaba! Satmak istediğim bir şeyim var.",
        "Şu ürüne bir göz atar mısın?",
        "Belki bu senin ilgini çeker!"
      ],
      buy_dialogues: [
        "Bu tam aradığım şey olabilir.",
        "Fena değil ama fiyat biraz fazla.",
        "Daha uygun bir fiyat teklif edebilir misin?",
        "Anlaştık, hemen alıyorum!"
      ],
      sell_dialogues: [
        "Bu ürün nadir, fiyatını düşürmem zor.",
        "Bunu değerinin altında veremem.",
        "Bu ürüne iyi bakılmış, ama fiyat yüksek.",
        "Anlaştık, satış senin!"
      ],
      negotiation: [
        "Bu teklif çok düşük, biraz daha yükselt.",
        "Yaklaşıyorsun, ama biraz daha ekle.",
        "Hımm… neredeyse ikna oldum.",
        "Tamam, bu bana uygun.",
        "Hayır, vazgeçtim."
      ],
      deal_success: [
        "Harika bir alışverişti!",
        "Teşekkürler, memnun kaldım.",
        "Güzel iş yaptık!"
      ],
      deal_fail: [
        "Sanırım anlaşamayacağız, görüşmek üzere.",
        "Zaman kaybı oldu, hoşça kal.",
        "Belki başka zaman anlaşırız."
      ],
      random_talks: [
        "Bu ürünü çocukken ben de kullanmıştım!",
        "Bu bana dedemin dükkanını hatırlattı.",
        "Biraz kâr bırak bana da, ne dersin?",
        "Pazarlık yapmayı severim, hadi bakalım!"
      ]
    }
  },
  de: {
    common: {
      continue: "Weiter",
      accept: "Annehmen",
      decline: "Ablehnen",
      counter: "Gegenangebot",
      submit: "Senden",
      cancel: "Abbrechen",
      back: "Zurück",
      next: "Weiter",
      yes: "Ja",
      no: "Nein",
      save: "Speichern",
      close: "Schließen",
      week: "Woche",
      day: "Tag",
      customerWantsToBuy: "Ich möchte dieses {} für ${} kaufen",
      customerWantsToSell: "Ich möchte dieses {} für ${} verkaufen",
      greatDeal: "🎉 Toller Deal!",
      dealAccepted: "✅ Deal Angenommen",
      noDeal: "Vielleicht nächstes Mal...",
      dealCompleted: "✅ Deal Abgeschlossen!",
      dealRejected: "❌ Deal Abgelehnt",
      customerRejected: "Kunde hat abgelehnt"
    },
    menu: {
      newGame: "Neues Spiel",
      continue: "Weiter",
      settings: "Einstellungen",
      credits: "Credits",
      language: "Sprache",
      systemDefault: "Systemstandard"
    },
    settings: {
      title: "Einstellungen",
      language: "Sprache",
      systemDefault: "Systemstandard",
      sound: "Ton",
      music: "Musik",
      effects: "Soundeffekte"
    },
    game: {
      cash: "Bargeld",
      level: "Level",
      reputation: "Ruf",
      dayComplete: "Tag Abgeschlossen!",
      customersServed: "Bediente Kunden",
      lookingForCustomers: "Suche nach Kunden...",
      dealCompleted: "Geschäft Abgeschlossen!",
      insufficientFunds: "Unzureichende Mittel",
      notEnoughMoney: "Sie haben nicht genug Geld für diesen Kauf."
    },
    shop: {
      buyer: "KÄUFER",
      seller: "VERKÄUFER",
      wantsToPurchase: "Möchte von Ihnen kaufen",
      wantsToSell: "Möchte an Sie verkaufen",
      marketValue: "Marktwert",
      estimatedMarketValue: "Geschätzter Marktwert",
      referenceInfo: "Referenzinfo",
      sellerAskingPrice: "Verkäufer Wunschpreis",
      customerRequestedAmount: "vom Kunden gewünschter Betrag",
      yourPurchasePrice: "Ihr Einkaufspreis",
      yourCostForItem: "Ihre Kosten für diesen Artikel",
      buyerOfferPrice: "Käufer Angebotspreis",
      customerWillingToPay: "Kunde bereit zu zahlen",
      profitLoss: "Gewinn/Verlust",
      makeCounterOffer: "Gegenangebot Machen",
      currentOffer: "Aktuelles Angebot",
      condition: "Zustand",
      soldFor: "{} für ${} verkauft!",
      boughtFor: "{} für ${} gekauft!",
      counterRejectionMessages: [
        "Das ist nicht ganz das, was ich mir vorgestellt habe...",
        "Ich hatte an eine andere Preisspanne gedacht.",
        "Lassen Sie mich andere Optionen in Betracht ziehen.",
        "Das funktioniert leider nicht für mich."
      ]
    },
    navigation: {
      shop: "Geschäft",
      gameBook: "Spielbuch",
      inventory: "Inventar",
      missions: "Missionen",
      skills: "Fähigkeiten"
    },
    items: {
      categories: {
        cassette_record: "Schallplatten",
        walkman_electronics: "Elektronik",
        watch: "Uhren",
        toy: "Spielzeug",
        comic: "Comics",
        poster: "Poster",
        camera: "Kameras"
      },
      names: {
        cassette_record: ["Vintage LP", "Rock Album", "Jazz Sammlung", "Klassik Set"],
        walkman_electronics: ["Retro Walkman", "Vintage Radio", "Alte Kopfhörer", "Kassettenspieler"],
        watch: ["Taschenuhr", "Vintage Rolex", "Antike Uhr", "Klassische Uhr"],
        toy: ["Actionfigur", "Vintage Puppe", "Modellauto", "Brettspiel"],
        comic: ["Erstausgabe Comic", "Vintage Magazin", "Seltene Ausgabe", "Sammler Comic"],
        poster: ["Film Poster", "Konzert Poster", "Vintage Werbung", "Kunstdruck"],
        camera: ["Filmkamera", "Vintage Polaroid", "Alte Linse", "Foto Ausrüstung"]
      },
      rarities: {
        common: "Häufig",
        rare: "Selten",
        very_rare: "Sehr Selten",
        legendary: "Legendär"
      },
      authenticity: {
        authentic: "Echt",
        fake: "Gefälscht",
        suspicious: "Verdächtig"
      }
    },
    endOfDay: {
      title: "Tagesübersicht",
      income: "Einnahmen",
      expenses: "Ausgaben",
      net: "Netto Gewinn / Verlust",
      stats: "Tagesstatistik",
      sold: "Verkaufte Artikel",
      bought: "Gekaufte Artikel",
      successful: "Erfolgreiche Verhandlungen",
      fakeDetected: "Gefälschte Artikel erkannt",
      cashAfter: "Bargeld nach dem Tag",
      openShop: "Laden öffnen"
    },
    dialogue: {
      greeting: [
        "Hallo! Ich habe etwas, das ich verkaufen möchte.",
        "Würdest du dir dieses Stück ansehen?",
        "Vielleicht interessiert dich das!"
      ],
      buy_dialogues: [
        "Das ist vielleicht genau das, was ich suche.",
        "Nicht schlecht, aber der Preis ist etwas hoch.",
        "Kannst du mir einen besseren Preis anbieten?",
        "Abgemacht! Ich kaufe es sofort!"
      ],
      sell_dialogues: [
        "Dieses Stück ist selten, den Preis zu senken ist schwierig.",
        "Ich kann es nicht unter Wert verkaufen.",
        "Es ist gut erhalten, aber der Preis scheint hoch.",
        "Abgemacht! Es gehört dir!"
      ],
      negotiation: [
        "Dieses Angebot ist zu niedrig, erhöhe es ein wenig.",
        "Du kommst näher, aber leg noch etwas drauf.",
        "Hmm… ich bin fast überzeugt.",
        "In Ordnung, das passt für mich.",
        "Nein, ich habe es mir anders überlegt."
      ],
      deal_success: [
        "Das war ein großartiges Geschäft!",
        "Danke, ich bin zufrieden damit.",
        "Wir haben ein gutes Geschäft gemacht!"
      ],
      deal_fail: [
        "Ich glaube, wir werden uns nicht einig, bis bald.",
        "Das war Zeitverschwendung, auf Wiedersehen.",
        "Vielleicht werden wir uns das nächste Mal einig."
      ],
      random_talks: [
        "Das hatte ich als Kind auch!",
        "Das erinnert mich an den Laden meines Großvaters.",
        "Lass mir auch etwas Gewinn, was meinst du?",
        "Ich liebe Feilschen, mal sehen, was passiert!"
      ]
    }
  }
};

const STORAGE_KEY = 'dow_locale';

// Detect device language
const detectDeviceLanguage = (): SupportedLocale => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('de')) return 'de';
  return 'en'; // default fallback
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [i18nState, setI18nState] = useState<I18nState>(() => {
    // Load from localStorage or detect device language
    const savedOverride = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    const deviceLang = detectDeviceLanguage();
    const currentLocale = savedOverride || deviceLang;
    
    return {
      currentLocale,
      override: savedOverride,
      resources
    };
  });

  const getNestedTranslation = (key: string, fallback?: string, params?: Record<string, string>): string | any => {
    const keys = key.split('.');
    let value: any = i18nState.resources[i18nState.currentLocale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = i18nState.resources.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            value = fallback || key;
            break;
          }
        }
        break;
      }
    }
    
    // If it's an array or object, return as-is for item names/categories
    if (Array.isArray(value) || (typeof value === 'object' && value !== null && typeof value !== 'string')) {
      return value;
    }
    
    let result = typeof value === 'string' ? value : (fallback || key);
    
    // Replace parameters in the string
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        result = result.replace(regex, params[paramKey]);
      });
    }
    
    return result;
  };

  const setLocale = (locale: SupportedLocale | null) => {
    if (locale === null) {
      // Reset to system default
      localStorage.removeItem(STORAGE_KEY);
      const deviceLang = detectDeviceLanguage();
      setI18nState(prev => ({
        ...prev,
        currentLocale: deviceLang,
        override: null
      }));
    } else {
      // Set manual override
      localStorage.setItem(STORAGE_KEY, locale);
      setI18nState(prev => ({
        ...prev,
        currentLocale: locale,
        override: locale
      }));
    }
  };

  const contextValue: I18nContextType = {
    locale: i18nState.currentLocale,
    t: getNestedTranslation,
    setLocale,
    getNestedTranslation
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};