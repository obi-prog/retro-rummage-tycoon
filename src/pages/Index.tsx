import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Shop from '@/components/game/Shop';
import { NavigationMenu } from '@/components/game/NavigationMenu';
import { MainMenu } from '@/components/menus/MainMenu';
import { Settings } from '@/components/menus/Settings';
import { EndOfDayModal } from '@/components/game/EndOfDayModal';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSoundContext } from '@/contexts/SoundContext';
import { X } from 'lucide-react';
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
    saveGameState,
    showEndOfDayModal,
    setShowEndOfDayModal,
    advanceDay,
    proceedToNextDay
  } = useGameStore();
  
  const { 
    settings, 
    updateSettings, 
    playClickSound 
  } = useSoundContext();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'settings' | 'howtoplay'>('menu');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auto-load saved game on mount
  useEffect(() => {
    if (hasSavedGame()) {
      // Silently show that there's a saved game available
      // User can choose to continue or start new
    }
  }, []);

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

  const handleContinueToNextDay = () => {
    setShowEndOfDayModal(false);
    proceedToNextDay();
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
    return <Settings onBack={handleBackToMenu} isInGame={gameStarted} onBackToGame={() => setCurrentView('game')} />;
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span>💵</span>
                  <span className="font-bold">${cash}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-bold">Lv.{level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NavigationMenu />
                <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 text-xs font-medium border-primary/30 hover:bg-primary/10"
                      onClick={playClickSound}
                    >
                      ⚙️
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 bg-background/95 backdrop-blur-sm border-primary/20 shadow-xl" 
                    align="end"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          ⚙️ Oyun Ayarları
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSettingsOpen(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Sound Settings */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          🔊 Ses Ayarları
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🔔 Ses Efektleri</span>
                          <Switch
                            checked={settings.sfxEnabled}
                            onCheckedChange={(enabled) => {
                              updateSettings({ sfxEnabled: enabled });
                              if (enabled) playClickSound();
                            }}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            playClickSound();
                            setSettingsOpen(false);
                            handleSettings();
                          }}
                          variant="outline"
                          className="w-full justify-start text-sm"
                        >
                          ⚙️ Detaylı Ayarlar
                        </Button>
                        
                        <Button
                          onClick={() => {
                            playClickSound();
                            setSettingsOpen(false);
                            handleBackToMenu();
                          }}
                          variant="outline"
                          className="w-full justify-start text-sm"
                        >
                          📋 Ana Menü
                        </Button>
                        
                        <Button
                          onClick={() => {
                            playClickSound();
                            window.location.reload();
                          }}
                          variant="outline"
                          className="w-full justify-start text-sm text-destructive hover:text-destructive"
                        >
                          🚪 Oyundan Çık
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Interface - Single Screen */}
        <Shop />

        {/* End of Day Modal */}
        <EndOfDayModal 
          isOpen={showEndOfDayModal}
          onContinue={handleContinueToNextDay}
        />

      </div>
    </div>
  );
};

export default Index;
