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
           background: 'linear-gradient(160deg, #FFE5B4 0%, #FFD1DC 30%, #B4FFE5 60%, #E5B4FF 100%)',
           backgroundSize: '400% 400%',
           animation: 'gradientShift 15s ease infinite'
         }}>
      
      {/* Retro pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" 
           style={{
             backgroundImage: `
               radial-gradient(circle at 20% 30%, hsl(45, 100%, 70%) 2px, transparent 2px),
               radial-gradient(circle at 70% 20%, hsl(15, 80%, 75%) 2px, transparent 2px),
               radial-gradient(circle at 40% 70%, hsl(120, 60%, 80%) 2px, transparent 2px),
               radial-gradient(circle at 80% 80%, hsl(280, 70%, 85%) 2px, transparent 2px)
             `,
             backgroundSize: '80px 80px, 120px 120px, 100px 100px, 90px 90px',
             backgroundPosition: '0 0, 30px 30px, 60px 10px, 10px 60px'
           }}>
      </div>

      {/* Large decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
        {/* Handshake silhouette */}
        <div className="absolute top-1/4 left-1/4 text-8xl" style={{ 
          filter: 'blur(1px)', 
          transform: 'rotate(-15deg)',
          color: 'hsl(45, 80%, 60%)'
        }}>🤝</div>
        
        {/* Money bag */}
        <div className="absolute bottom-1/4 right-1/4 text-7xl" style={{ 
          filter: 'blur(1px)', 
          transform: 'rotate(20deg)',
          color: 'hsl(120, 60%, 70%)'
        }}>💰</div>
        
        {/* Dollar sign */}
        <div className="absolute top-1/2 right-1/5 text-6xl" style={{ 
          filter: 'blur(1px)', 
          transform: 'rotate(-25deg)',
          color: 'hsl(280, 70%, 75%)'
        }}>💵</div>
        
        {/* Vintage radio */}
        <div className="absolute bottom-1/3 left-1/6 text-5xl" style={{ 
          filter: 'blur(1px)', 
          transform: 'rotate(30deg)',
          color: 'hsl(15, 80%, 65%)'
        }}>📻</div>
      </div>

      {/* Floating animated elements */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-20 left-10 text-3xl float-money">🛍️</div>
        <div className="absolute top-40 right-16 text-2xl float-money" style={{ animationDelay: '1s' }}>🏪</div>
        <div className="absolute bottom-40 left-20 text-3xl float-money" style={{ animationDelay: '2s' }}>💎</div>
        <div className="absolute bottom-20 right-12 text-2xl float-money" style={{ animationDelay: '0.5s' }}>🎯</div>
        <div className="absolute top-60 left-1/2 text-2xl float-money" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute top-1/3 right-1/3 text-2xl float-money" style={{ animationDelay: '2.5s' }}>🔥</div>
      </div>

      <Card className="w-[90%] max-w-md mx-4 border-0 relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(145deg, #FFB347 0%, #FFCC33 30%, #FF6B6B 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(4px)'
            }}>
        
        {/* Decorative overlay pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{
               backgroundImage: `
                 url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
               `,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Retro icons overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-8">
          <div className="absolute top-4 right-4 text-2xl" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>💰</div>
          <div className="absolute bottom-6 left-6 text-xl" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>📻</div>
          <div className="absolute top-1/2 left-4 text-lg" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>💵</div>
          <div className="absolute bottom-4 right-8 text-lg" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>🎧</div>
        </div>
        <CardHeader className="text-center space-y-3 pb-4 relative z-10">
          <div className="text-6xl mb-2">🤝</div>
          <CardTitle className="text-4xl font-bold leading-tight text-white" style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 0, 0, 0.3)'
          }}>
            Deal or Walk
          </CardTitle>
          <div className="text-lg font-bold text-white" style={{ 
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)'
          }}>
            Buy Low, Sell High!
          </div>
          <p className="text-sm font-medium text-white/90" style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            Retro Street Market Flip Tycoon
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3 px-6 pb-6 relative z-10">
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
            className="w-full h-12 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--retro-cyan)), hsl(var(--retro-purple)))',
              boxShadow: 'var(--shadow-button)'
            }}
          >
            ⚙️ Settings
          </Button>
          
          {/* How to Play Button */}
          <Button 
            onClick={() => handleUserInteraction(onHowToPlay)}
            className="w-full h-12 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--retro-yellow)), hsl(var(--retro-orange)))',
              boxShadow: 'var(--shadow-button)'
            }}
          >
            ❓ How to Play
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};