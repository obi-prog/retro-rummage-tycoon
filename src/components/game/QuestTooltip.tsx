import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface QuestTooltipProps {
  playerLevel: number;
  children: React.ReactNode;
}

export const QuestTooltip: React.FC<QuestTooltipProps> = ({ playerLevel, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {children}
            <Info className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            Hedefler seviyenizle ölçeklenir (Lv.{playerLevel})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};