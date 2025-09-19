import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shop } from '@/components/game/Shop';
import { QuickDock } from '@/components/game/QuickDock';
import { MainMenu } from '@/components/menus/MainMenu';
import { Settings } from '@/components/menus/Settings';
import { Card, CardContent } from '@/components/ui/card';
import { t } from '@/utils/localization';

const Index = () => {
  const { 
    initGame, 
    language, 
    level,
    cash,
    reputation,
    day,
    experience,
    missions,
    customersServed,
    dailyCustomerLimit,
    loadGameState,
    hasSavedGame,
    saveGameState
  } = useGameStore();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'settings' | 'howtoplay'>('menu');

  const handleStartGame = () => {
    initGame();
    setGameStarted(true);
    setCurrentView('game');
  };

  const handleContinueGame = () => {
    const loaded = loadGameState();
    if (loaded) {
      setGameStarted(true);
      setCurrentView('game');
    }
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleHowToPlay = () => {
    setCurrentView('howtoplay');
  };

  const handleBackToMenu = () => {
    if (gameStarted) {
      saveGameState(); // Otomatik kayıt
    }
    setCurrentView('menu');
  };

  // Show main menu
  if (currentView === 'menu') {
    return (
      <MainMenu
        language={language}
        onStartGame={handleStartGame}
        onSettings={handleSettings}
        onHowToPlay={handleHowToPlay}
        hasSavedGame={hasSavedGame()}
        onContinueGame={handleContinueGame}
      />
    );
  }

  // Show settings
  if (currentView === 'settings') {
    return <Settings onBack={handleBackToMenu} />;
  }

  // Show how to play (placeholder for now)
  if (currentView === 'howtoplay') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20">
        <Card className="w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">❓ Nasıl Oynanır</h2>
            <div className="text-left space-y-2 text-sm">
              <p>🎯 <strong>Amaç:</strong> Eşyaları ucuza alıp pahalıya sat!</p>
              <p>💰 <strong>Para Kazan:</strong> Müşterilerle pazarlık yap</p>
              <p>⭐ <strong>Seviye At:</strong> Deneyim kazan ve yeni özellikler aç</p>
              <p>📦 <strong>Envanter:</strong> Eşyalarını yönet ve değerlendir</p>
            </div>
            <button 
              onClick={handleBackToMenu}
              className="mt-4 w-full bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90 text-white font-bold py-3 text-lg shadow-lg rounded-md"
            >
              ← Ana Menüye Dön
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <div className="container mx-auto px-4 py-2">
        {/* Top Bar - Single Line */}
        <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span>💵</span>
                <span className="font-bold">${cash}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="font-bold">Lv.{level}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Dock */}
        <QuickDock />

        {/* Main Game Interface - Single Screen */}
        <Shop />

      </div>
    </div>
  );
};

export default Index;
