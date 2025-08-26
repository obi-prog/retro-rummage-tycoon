import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shop } from '@/components/game/Shop';
import { NavigationMenu } from '@/components/game/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/utils/localization';

const Index = () => {
  const { 
    initGame, 
    tickTime, 
    timeLeft, 
    language, 
    level,
    cash,
    reputation,
    triggerRandomEvent,
    day,
    experience,
    missions
  } = useGameStore();
  
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        tickTime();
        // Random chance to trigger events
        if (Math.random() < 0.1) { // 10% chance per tick
          triggerRandomEvent();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, tickTime, triggerRandomEvent]);

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
        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="bg-gradient-to-r from-retro-orange to-retro-pink shadow-lg">
            <CardContent className="p-3">
              <div className="flex justify-between items-center text-white text-sm">
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span className="font-bold">${cash}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-bold">Lv.{level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <span>🕒</span>
                  <span className="font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span className="font-bold">Gün {day}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Shop Interface */}
        <Shop />

        {/* Navigation Menu */}
        <NavigationMenu />

        {/* Day End Summary */}
        {timeLeft === 0 && (
          <Card className="w-full max-w-sm mx-auto mt-4 bg-gradient-to-r from-retro-orange/10 to-retro-pink/10 border-retro-orange/30">
            <CardHeader>
              <CardTitle className="text-center">🌅 Gün {day} Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>💰 Para: ${cash}</div>
                <div>⭐ İtibar: {reputation}/100</div>
                <div>🏆 Seviye: {level}</div>
                <div>🔥 XP: {experience}</div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>📊 Günün Özeti:</div>
                <div>• Satılan: {useGameStore.getState().dailyStats.itemsSold} ürün</div>
                <div>• Kazanılan: ${useGameStore.getState().dailyStats.cashEarned}</div>
                <div>• Başarılı pazarlık: {useGameStore.getState().dailyStats.negotiationsWon}</div>
              </div>
              
              <Button 
                onClick={() => useGameStore.getState().advanceDay()}
                className="w-full bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90"
              >
                🏪 Dükkanı Aç - Yeni Gün Başlat
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
