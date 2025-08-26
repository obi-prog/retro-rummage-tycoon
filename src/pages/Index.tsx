import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameUI } from '@/components/game/GameUI';
import { Inventory } from '@/components/game/Inventory';
import { Shop } from '@/components/game/Shop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/utils/localization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { 
    initGame, 
    tickTime, 
    timeLeft, 
    language, 
    level,
    cash,
    reputation 
  } = useGameStore();
  
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        tickTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, tickTime]);

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
                <span>💰 500₳</span>
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
        {/* Game Header */}
        <GameUI />
        
        {/* Game Content */}
        <Tabs defaultValue="shop" className="w-full max-w-sm mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="shop" className="text-sm">
              🏪 Shop
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-sm">
              📦 {t('inventory', language)}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shop" className="space-y-4">
            <Shop />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Inventory />
          </TabsContent>
        </Tabs>

        {/* Day End Summary */}
        {timeLeft === 0 && (
          <Card className="w-full max-w-sm mx-auto mt-4 bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="text-center">🌅 Day {useGameStore.getState().day} Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div>💰 Cash: {cash}₳</div>
              <div>⭐ Reputation: {reputation}/100</div>
              <div>🏆 Level: {level}</div>
              <Button 
                onClick={() => useGameStore.getState().advanceDay()}
                className="w-full mt-4"
              >
                ➡️ Next Day
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
