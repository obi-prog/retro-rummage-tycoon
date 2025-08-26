import { Language } from '@/types/game';

export const translations = {
  en: {
    // UI Elements
    play: 'Play',
    settings: 'Settings',
    inventory: 'Inventory',
    customers: 'Customers',
    reputation: 'Reputation',
    trust: 'Trust',
    level: 'Level',
    day: 'Day',
    cash: 'Cash',
    
    // Game Actions
    haggle: 'Haggle',
    finalOffer: 'Final Offer',
    addBonus: 'Add Bonus',
    bundleDeal: 'Bundle Deal',
    waitingCustomers: 'Waiting for customers...',
    yourShop: 'Your Shop',
    budget: 'Budget',
    patience: 'Patience',
    currentOffer: 'Current Offer',
    accept: 'Accept',
    repair: 'Repair',
    clean: 'Clean',
    verify: 'Verify',
    
    // Events
    trendAlert: 'Trend Alert!',
    policeCheck: 'Police Check',
    event: 'Event',
    auction: 'Auction',
    
    // Messages
    itemSold: 'You sold an item!',
    insufficientFunds: 'Insufficient funds.',
    levelUp: 'Level Up!',
    gameOver: 'Game Over',
    
    // Categories
    cassette_record: 'Cassettes & Records',
    walkman_electronics: 'Electronics',
    watch: 'Watches',
    toy: 'Toys',
    comic: 'Comics',
    poster: 'Posters',
    camera: 'Cameras',
    mystery_box: 'Mystery Box',
    
    // Customer Types
    collector: 'Collector',
    student: 'Student',
    trader: 'Trader',
    nostalgic: 'Nostalgic Buyer',
    hunter: 'Bargain Hunter',
    tourist: 'Tourist',
    expert: 'Expert',
    
    // Rarity
    common: 'Common',
    rare: 'Rare',
    very_rare: 'Very Rare',
    legendary: 'Legendary',
    
    // Condition
    broken: 'Broken',
    damaged: 'Damaged',
    good: 'Good',
    excellent: 'Excellent',
  },
  
  de: {
    // UI Elements
    play: 'Spielen',
    settings: 'Einstellungen',
    inventory: 'Inventar',
    customers: 'Kunden',
    reputation: 'Ruf',
    trust: 'Vertrauen',
    level: 'Level',
    day: 'Tag',
    cash: 'Geld',
    
    // Game Actions
    haggle: 'Feilschen',
    finalOffer: 'Letztes Angebot',
    addBonus: 'Bonus hinzufügen',
    bundleDeal: 'Paketangebot',
    waitingCustomers: 'Warten auf Kunden...',
    yourShop: 'Ihr Geschäft',
    budget: 'Budget',
    patience: 'Geduld',
    currentOffer: 'Aktuelles Angebot',
    accept: 'Akzeptieren',
    repair: 'Reparieren',
    clean: 'Reinigen',
    verify: 'Prüfen',
    
    // Events
    trendAlert: 'Trendalarm!',
    policeCheck: 'Polizeikontrolle',
    event: 'Event',
    auction: 'Auktion',
    
    // Messages
    itemSold: 'Du hast einen Artikel verkauft!',
    insufficientFunds: 'Unzureichende Mittel.',
    levelUp: 'Stufenaufstieg!',
    gameOver: 'Spiel Vorbei',
    
    // Categories
    cassette_record: 'Kassetten & Platten',
    walkman_electronics: 'Elektronik',
    watch: 'Uhren',
    toy: 'Spielzeug',
    comic: 'Comics',
    poster: 'Poster',
    camera: 'Kameras',
    mystery_box: 'Überraschungsbox',
    
    // Customer Types
    collector: 'Sammler',
    student: 'Student',
    trader: 'Händler',
    nostalgic: 'Nostalgiker',
    hunter: 'Schnäppchenjäger',
    tourist: 'Tourist',
    expert: 'Experte',
    
    // Rarity
    common: 'Gewöhnlich',
    rare: 'Selten',
    very_rare: 'Sehr Selten',
    legendary: 'Legendär',
    
    // Condition
    broken: 'Kaputt',
    damaged: 'Beschädigt',
    good: 'Gut',
    excellent: 'Ausgezeichnet',
  },
  
  tr: {
    // UI Elements
    play: 'Oyna',
    settings: 'Ayarlar',
    inventory: 'Envanter',
    customers: 'Müşteriler',
    reputation: 'İtibar',
    trust: 'Güven',
    level: 'Seviye',
    day: 'Gün',
    cash: 'Para',
    
    // Game Actions
    haggle: 'Pazarlık',
    finalOffer: 'Son Fiyat',
    addBonus: 'Hediye Ekle',
    bundleDeal: 'Paket Satış',
    waitingCustomers: 'Müşteri bekleniyor...',
    yourShop: 'Dükkanınız',
    budget: 'Bütçe',
    patience: 'Sabır',
    currentOffer: 'Geçerli Teklif',
    accept: 'Kabul Et',
    repair: 'Tamir',
    clean: 'Temizle',
    verify: 'Doğrula',
    
    // Events
    trendAlert: 'Trend Uyarısı!',
    policeCheck: 'Polis Kontrolü',
    event: 'Etkinlik',
    auction: 'Müzayede',
    
    // Messages
    itemSold: 'Bir ürün sattın!',
    insufficientFunds: 'Yetersiz bakiye.',
    levelUp: 'Seviye Atlama!',
    gameOver: 'Oyun Bitti',
    
    // Categories
    cassette_record: 'Kaset & Plak',
    walkman_electronics: 'Elektronik',
    watch: 'Saat',
    toy: 'Oyuncak',
    comic: 'Çizgi Roman',
    poster: 'Poster',
    camera: 'Fotoğraf Makinesi',
    mystery_box: 'Sürpriz Kutu',
    
    // Customer Types
    collector: 'Koleksiyoner',
    student: 'Öğrenci',
    trader: 'Esnaf',
    nostalgic: 'Nostaljik Alıcı',
    hunter: 'Avcı',
    tourist: 'Turist',
    expert: 'Uzman',
    
    // Rarity
    common: 'Yaygın',
    rare: 'Nadir',
    very_rare: 'Çok Nadir',
    legendary: 'Lejant',
    
    // Condition
    broken: 'Kırık',
    damaged: 'Hasarlı',
    good: 'İyi',
    excellent: 'Mükemmel',
  }
};

export const detectLanguage = (): Language => {
  // Default to Turkish for this user
  return 'tr';
};

export const t = (key: keyof typeof translations.en, lang: Language = 'tr'): string => {
  return translations[lang][key] || translations.en[key] || key;
};