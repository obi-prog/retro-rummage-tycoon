import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useGameStore } from '@/store/gameStore';
import { useSoundContext } from '@/contexts/SoundContext';
import { useI18n } from '@/contexts/I18nContext';

interface SettingsProps {
  onBack: () => void;
  isInGame?: boolean;
  onBackToGame?: () => void;
}

export const Settings = ({ onBack, isInGame, onBackToGame }: SettingsProps) => {
  const { initGame, saveGameState } = useGameStore();
  const { t } = useI18n();
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

  const handleResetGame = () => {
    initGame(); // This resets the game to initial state
    setShowResetConfirm(false);
    onBack(); // Go back to menu after reset
  };

  const handleSaveAndBack = () => {
    saveGameState();
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ 
           background: 'linear-gradient(135deg, #FDF7F0 0%, #F8F4E6 50%, #F0E6FF 100%)'
         }}>
      <Card className="w-full max-w-[480px] bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        {/* Animated Header */}
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-white to-gray-50/50">
          <div className="text-5xl mb-3 animate-pulse">⚙️</div>
          <CardTitle 
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-5 p-6">
          {/* Audio Settings Card */}
          <Card className="border-2 border-gray-200/60 shadow-sm bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎵</span>
                <h3 className="font-bold text-gray-800">Audio Settings</h3>
              </div>
              
              {/* Master Volume */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Master Volume</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-600">{Math.round(settings.masterVolume * 100)}%</span>
                    <span className="text-lg">🔊</span>
                  </div>
                </div>
                <div className="px-1">
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
              </div>

              {/* Music & Sound Effects Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎵</span>
                      <label className="text-xs font-medium text-gray-700">Music</label>
                    </div>
                    <Switch
                      checked={true} // Always true for now - can be extended later
                      onCheckedChange={(enabled) => {
                        toast({
                          title: enabled ? "🎵 Music On" : "🔇 Music Off",
                          duration: 1500,
                        });
                      }}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔊</span>
                      <label className="text-xs font-medium text-gray-700">Sound FX</label>
                    </div>
                    <Switch
                      checked={settings.sfxEnabled}
                      onCheckedChange={(enabled) => {
                        updateSettings({ sfxEnabled: enabled });
                        toast({
                          title: enabled ? "🔊 Sound FX On" : "🔇 Sound FX Off",
                          duration: 1500,
                        });
                        if (enabled) playNotificationSound();
                      }}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                  {settings.sfxEnabled && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Volume</span>
                        <span className="text-xs font-semibold text-purple-600">{Math.round(settings.sfxVolume * 100)}%</span>
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
              </div>

              {/* Sound Test Buttons - Pill Style */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  onClick={() => {
                    playCoinSound();
                    toast({ title: "💰 Money sound", duration: 1000 });
                  }}
                  disabled={!settings.sfxEnabled}
                  className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 border-0 shadow-sm disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  💰 Money
                </Button>
                <Button
                  onClick={() => {
                    playSellSound();
                    toast({ title: "💸 Sale sound", duration: 1000 });
                  }}
                  disabled={!settings.sfxEnabled}
                  className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border-0 shadow-sm disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  💸 Sale
                </Button>
                <Button
                  onClick={() => {
                    playBuySound();
                    toast({ title: "🛒 Buy sound", duration: 1000 });
                  }}
                  disabled={!settings.sfxEnabled}
                  className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-0 shadow-sm disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  🛒 Buy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Management Card */}
          <Card className="border-2 border-gray-200/60 shadow-sm bg-gradient-to-r from-red-50/50 to-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎮</span>
                <h3 className="font-bold text-gray-800">Game Management</h3>
              </div>
              
              {/* Reset Game Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-red-400 text-red-600 bg-white hover:bg-red-50 hover:border-red-500 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">⚠️</span>
                    Reset Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-2 border-gray-300 shadow-xl max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-lg">
                      ⚠️ Reset Game
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-700 leading-relaxed">
                      Are you sure? This will delete all progress and restart the game from the beginning.
                      <br /><br />
                      Your money, level, items, and saved data will be lost.
                      <br /><br />
                      <strong>This action cannot be undone.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-2 border-gray-300 hover:bg-gray-50">
                      ❌ Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetGame}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                    >
                      ✅ Yes, Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Footer Info with Divider */}
          <div className="pt-4">
            <Separator className="mb-4" />
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-500 font-medium">
                Deal or Walk • Retro Street Market Flip Tycoon
              </div>
              <div className="text-xs text-gray-400">
                v1.0 • Made with ❤️
              </div>
            </div>
          </div>
        </CardContent>

        {/* Sticky Save Button at Bottom */}
        <div className="p-4 pt-0">
          {isInGame && onBackToGame && (
            <Button 
              onClick={() => {
                playClickSound();
                saveGameState();
                onBackToGame();
              }}
              className="w-full mb-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              🎮 Continue Game
            </Button>
          )}
          <Button 
            onClick={handleSaveAndBack}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 text-lg shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(255,165,0,0.3)'
            }}
          >
            💾 Save & Main Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};