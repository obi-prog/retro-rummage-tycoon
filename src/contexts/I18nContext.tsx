import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLocale = 'en' | 'tr' | 'de';

interface I18nState {
  currentLocale: SupportedLocale;
  override: SupportedLocale | null;
  resources: Record<SupportedLocale, Record<string, any>>;
}

interface I18nContextType {
  locale: SupportedLocale;
  t: (key: string, fallback?: string, params?: Record<string, string>) => string;
  setLocale: (locale: SupportedLocale | null) => void;
  getNestedTranslation: (key: string, fallback?: string, params?: Record<string, string>) => string;
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
      close: "Close"
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
      boughtFor: "Bought {} for ${}!"
    },
    navigation: {
      shop: "Shop",
      gameBook: "Game Book",
      inventory: "Inventory",
      missions: "Missions",
      skills: "Skills"
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
      close: "Kapat"
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
      boughtFor: "{} ${}' a satın alındı!"
    },
    navigation: {
      shop: "Dükkan",
      gameBook: "Oyun Defteri",
      inventory: "Envanter",
      missions: "Görevler",
      skills: "Yetenekler"
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
      close: "Schließen"
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
      boughtFor: "{} für ${} gekauft!"
    },
    navigation: {
      shop: "Geschäft",
      gameBook: "Spielbuch",
      inventory: "Inventar",
      missions: "Missionen",
      skills: "Fähigkeiten"
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

  const getNestedTranslation = (key: string, fallback?: string, params?: Record<string, string>): string => {
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
    
    let result = typeof value === 'string' ? value : (fallback || key);
    
    // Replace parameters in the string
    if (params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(`{${paramKey}}`, params[paramKey]);
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