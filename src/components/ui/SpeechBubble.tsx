import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpeechBubbleProps {
  message: string;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
}

export const SpeechBubble = ({ message, isVisible, onComplete, className }: SpeechBubbleProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, message, onComplete]);

  if (!show || !message) return null;

  return (
    <div className={cn(
      "absolute z-10 animate-fade-in",
      "bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-lg border",
      "max-w-[calc(100vw-120px)] min-w-[180px] w-auto",
      "before:content-[''] before:absolute before:bottom-[-8px] before:left-4",
      "before:w-0 before:h-0 before:border-l-[8px] before:border-r-[8px] before:border-t-[8px]",
      "before:border-l-transparent before:border-r-transparent before:border-t-white/95",
      className
    )}>
      <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">
        {message}
      </p>
    </div>
  );
};