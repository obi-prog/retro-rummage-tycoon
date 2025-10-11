import React, { createContext, useContext, ReactNode } from 'react';

export type SupportedLocale = 'en';

interface I18nContextType {
  locale: SupportedLocale;
  t: (key: string, fallback?: string, params?: Record<string, string>) => string | any;
  getNestedTranslation: (key: string, fallback?: string, params?: Record<string, string>) => string | any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation resources (English only)
const resources = {
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
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getNestedTranslation = (key: string, fallback?: string, params?: Record<string, string>): string | any => {
    const keys = key.split('.');
    let value: any = resources;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = fallback || key;
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

  const contextValue: I18nContextType = {
    locale: 'en',
    t: getNestedTranslation,
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