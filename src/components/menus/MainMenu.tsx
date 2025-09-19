import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/utils/localization';
import { Language } from '@/types/game';
import { useSoundContext } from '@/contexts/SoundContext';

interface MainMenuProps {
  language: Language;
  onStartGame: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
  hasSavedGame?: boolean;
  onContinueGame?: () => void;
}

export const MainMenu = ({ 
  language, 
  onStartGame, 
  onSettings, 
  onHowToPlay,
  hasSavedGame = false,
  onContinueGame 
}: MainMenuProps) => {
  const { playClickSound, settings } = useSoundContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <Card className="w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="text-7xl animate-pulse">🕰️</div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-retro-orange to-retro-pink bg-clip-text text-transparent">
            Sokak Bitpazarı
          </CardTitle>
          <div className="text-xl font-semibold text-retro-purple">
            Retro Flip Tycoon
          </div>
          <p className="text-sm text-muted-foreground">
            1980s Street Market • Buy Low, Sell High
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          {/* Continue Game Button - only if saved game exists */}
          {hasSavedGame && onContinueGame && (
            <Button 
              onClick={() => {
                playClickSound();
                onContinueGame();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 text-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              💾 Devam Et
            </Button>
          )}
          
          {/* New Game Button */}
          <Button 
            onClick={() => {
              playClickSound();
              onStartGame();
            }}
            className="w-full bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90 text-white font-bold py-3 text-lg shadow-lg transition-all duration-200 hover:scale-105"
          >
            🎮 {hasSavedGame ? 'Yeni Oyun' : t('play', language)}
          </Button>
          
          {/* Settings Button */}
          <Button 
            onClick={() => {
              playClickSound();
              onSettings();
            }}
            variant="outline" 
            className="w-full border-2 border-primary/30 hover:bg-primary/10 font-semibold py-3 text-lg transition-all duration-200 hover:scale-105"
          >
            ⚙️ Ayarlar
          </Button>
          
          {/* How to Play Button */}
          <Button 
            onClick={() => {
              playClickSound();
              onHowToPlay();
            }}
            variant="outline" 
            className="w-full border-2 border-secondary/30 hover:bg-secondary/10 font-semibold py-3 text-lg transition-all duration-200 hover:scale-105"
          >
            ❓ Nasıl Oynanır
          </Button>
          
          {/* Game Info */}
          <div className="text-center pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Başlangıç Kaynakları</div>
            <div className="flex justify-center gap-4 text-sm">
              <span>💰 $500</span>
              <span>📦 2 Eşya</span>
              <span>⭐ Seviye 1</span>
            </div>
          </div>
          
          {/* Language indicator */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              🌍 {language.toUpperCase()} • 📱 Mobile Optimized 
              {settings.musicEnabled && <span> • 🎵 Müzik Açık</span>}
              {settings.sfxEnabled && <span> • 🔊 Ses Açık</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};