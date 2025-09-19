import { Button, ButtonProps } from '@/components/ui/button';
import { useSoundContext } from '@/contexts/SoundContext';
import { forwardRef } from 'react';

interface SoundButtonProps extends ButtonProps {
  soundType?: 'click' | 'buy' | 'sell' | 'coin' | 'notification' | 'error';
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ onClick, soundType = 'click', ...props }, ref) => {
    const { playClickSound, playBuySound, playSellSound, playCoinSound, playNotificationSound, playErrorSound } = useSoundContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Play the appropriate sound
      switch (soundType) {
        case 'click':
          playClickSound();
          break;
        case 'buy':
          playBuySound();
          break;
        case 'sell':
          playSellSound();
          break;
        case 'coin':
          playCoinSound();
          break;
        case 'notification':
          playNotificationSound();
          break;
        case 'error':
          playErrorSound();
          break;
      }

      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

SoundButton.displayName = 'SoundButton';