import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shop } from '@/components/game/Shop';
import { QuickDock } from '@/components/game/QuickDock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    dailyCustomerLimit
  } = useGameStore();
  
  const [gameStarted, setGameStarted] = useState(false);

  // No timer needed - using customer counter system instead

  const handleStartGame = () => {
    initGame();
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20">
        <Card className="w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">🕰️</div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-retro-orange to-retro-pink bg-clip-text text-transparent">
              Sokak Bitpazarı
            </CardTitle>
            <div className="text-xl font-semibold text-retro-purple">
              Retro Flip Tycoon
            </div>
            <p className="text-sm text-muted-foreground">
              1980s Street Market • Buy Low, Sell High • Build Your Vintage Empire
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                📱 Mobile optimized • 🎮 One-hand play
              </div>
              <div className="text-sm text-muted-foreground">
                🌍 {language.toUpperCase()} • Auto-detected
              </div>
            </div>
            
            <Button 
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90 text-white font-bold py-3 text-lg shadow-lg"
            >
              🎯 {t('play', language)}
            </Button>
            
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">Starting Resources</div>
              <div className="flex justify-center gap-4 text-sm">
                <span>💰 $500</span>
                <span>📦 2 Items</span>
                <span>⭐ Level 1</span>
              </div>
            </div>
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
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span className="font-bold">{customersServed}/{dailyCustomerLimit}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Dock */}
        <QuickDock />

        {/* Main Game Interface - Single Screen */}
        <Shop />

        {/* Bottom Tab Bar (placeholder for future features) */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-around py-3">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                <span className="text-xl">🏠</span>
                <span className="text-xs">Tezgâh</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                <span className="text-xl">📦</span>
                <span className="text-xs">Envanter</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                <span className="text-xl">🎯</span>
                <span className="text-xs">Görevler</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                <span className="text-xl">⚡</span>
                <span className="text-xs">Yetenekler</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
