import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useGameStore } from '@/store/gameStore';
import { useSoundContext } from '@/contexts/SoundContext';
import { Language } from '@/types/game';
import { t } from '@/utils/localization';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { language, setLanguage, initGame, saveGameState } = useGameStore();
  const { 
    settings, 
    updateSettings, 
    playClickSound, 
    playNotificationSound, 
    playCoinSound,
    playSellSound,
    playBuySound
  } = useSoundContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    playClickSound();
    setLanguage(newLang);
    saveGameState(); // Save immediately when language changes
  };

  const handleResetGame = () => {
    initGame(); // This resets the game to initial state
    setShowResetConfirm(false);
    onBack(); // Go back to menu after reset
  };

  const handleSaveAndBack = () => {
    saveGameState();
    onBack();
  };

  const languageNames = {
    'tr': '🇹🇷 Türkçe',
    'en': '🇺🇸 English', 
    'de': '🇩🇪 Deutsch'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <Card className="w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">⚙️</div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-retro-orange to-retro-pink bg-clip-text text-transparent">
            Ayarlar
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Language Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <h3 className="font-semibold">Dil / Language</h3>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full border-2 border-primary/20 bg-background/80">
                <SelectValue placeholder="Dil seçin / Select language" />
              </SelectTrigger>
              <SelectContent className="bg-background border-2 border-primary/20">
                <SelectItem value="tr">{languageNames.tr}</SelectItem>
                <SelectItem value="en">{languageNames.en}</SelectItem>
                <SelectItem value="de">{languageNames.de}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔊</span>
              <h3 className="font-semibold">Ses Ayarları</h3>
            </div>
            
            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Ana Ses ({Math.round(settings.masterVolume * 100)}%)</label>
                <span className="text-xs text-muted-foreground">🔊</span>
              </div>
              <Slider
                value={[settings.masterVolume * 100]}
                onValueChange={(value) => {
                  updateSettings({ masterVolume: value[0] / 100 });
                  playClickSound();
                }}
                max={100}
                step={5}
                className="w-full"
              />
            </div>


            {/* Sound Effects Settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Ses Efektleri</label>
                <Switch
                  checked={settings.sfxEnabled}
                  onCheckedChange={(enabled) => {
                    updateSettings({ sfxEnabled: enabled });
                    if (enabled) playNotificationSound();
                  }}
                />
              </div>
              {settings.sfxEnabled && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Efekt Seviyesi ({Math.round(settings.sfxVolume * 100)}%)</span>
                    <span className="text-xs">🔔</span>
                  </div>
                  <Slider
                    value={[settings.sfxVolume * 100]}
                    onValueChange={(value) => {
                      updateSettings({ sfxVolume: value[0] / 100 });
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Sound Test Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={playCoinSound}
                disabled={!settings.sfxEnabled}
                className="text-xs"
              >
                💰 Para
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={playSellSound}
                disabled={!settings.sfxEnabled}
                className="text-xs"
              >
                💸 Satış
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={playBuySound}
                disabled={!settings.sfxEnabled}
                className="text-xs"
              >
                🛒 Alış
              </Button>
            </div>
          </div>

          {/* Game Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <h3 className="font-semibold">Oyun Yönetimi</h3>
            </div>
            
            {/* Reset Game Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200"
                >
                  🔄 Oyunu Sıfırla
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background border-2 border-primary/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                    ⚠️ Oyunu Sıfırla
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem tüm ilerlemenizi silecek ve oyunu baştan başlatacak. 
                    Para, seviye, eşyalar ve kayıtlı verileriniz kaybolacak.
                    <br /><br />
                    Bu işlem geri alınamaz. Emin misiniz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-2 border-secondary/30">
                    ❌ İptal
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetGame}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    ✅ Evet, Sıfırla
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Game Info */}
          <div className="text-center pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2">
              Sokak Bitpazarı • Retro Flip Tycoon
            </div>
            <div className="text-xs text-muted-foreground">
              v1.0 • Made with ❤️
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleSaveAndBack}
              className="w-full bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90 text-white font-bold py-3 text-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              💾 Kaydet ve Ana Menü
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};