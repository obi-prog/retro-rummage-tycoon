import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/utils/localization';
import { Language } from '@/types/game';
import { useSoundContext } from '@/contexts/SoundContext';
import { useEffect } from 'react';

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
  const { playClickSound } = useSoundContext();

  const handleUserInteraction = (callback: () => void) => {
    playClickSound();
    callback();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, #FDF7F0 0%, #F8F4E6 50%, #F0E6FF 100%)'
         }}>
      
      {/* Floating money background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-4xl float-money">💵</div>
        <div className="absolute top-40 right-16 text-3xl float-money" style={{ animationDelay: '1s' }}>💰</div>
        <div className="absolute bottom-40 left-20 text-3xl float-money" style={{ animationDelay: '2s' }}>💎</div>
        <div className="absolute bottom-20 right-12 text-4xl float-money" style={{ animationDelay: '0.5s' }}>💵</div>
        <div className="absolute top-60 left-1/2 text-2xl float-money" style={{ animationDelay: '1.5s' }}>⭐</div>
      </div>

      <Card className="w-[90%] max-w-md mx-4 bg-white/95 backdrop-blur-sm border-0" 
            style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="text-6xl mb-2">🤝</div>
          <CardTitle className="text-4xl font-bold neon-title leading-tight">
            Deal or Walk
          </CardTitle>
          <div className="text-lg font-bold" style={{ 
            background: 'var(--gradient-neon-alt)', 
            backgroundClip: 'text', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Buy Low, Sell High!
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Retro Street Market Flip Tycoon
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3 px-6 pb-6">
          {/* Continue Game Button - only if saved game exists */}
           {hasSavedGame && onContinueGame && (
            <Button 
              onClick={() => handleUserInteraction(onContinueGame)}
              className="w-full h-12 text-white font-bold text-lg button-hover-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: 'var(--gradient-continue)',
                boxShadow: 'var(--shadow-button)'
              }}
            >
              💾 Continue Game
            </Button>
          )}
          
          {/* New Game Button */}
          <Button 
            onClick={() => handleUserInteraction(onStartGame)}
            className="w-full h-12 text-white font-bold text-lg button-hover-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: 'var(--gradient-play)',
              boxShadow: 'var(--shadow-button)'
            }}
          >
            🎮 {hasSavedGame ? 'New Game' : 'Start Playing'}
          </Button>
          
          {/* Settings Button */}
          <Button 
            onClick={() => handleUserInteraction(onSettings)}
            variant="outline" 
            className="w-full h-12 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            ⚙️ Settings
          </Button>
          
          {/* How to Play Button */}
          <Button 
            onClick={() => handleUserInteraction(onHowToPlay)}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            ❓ How to Play
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};