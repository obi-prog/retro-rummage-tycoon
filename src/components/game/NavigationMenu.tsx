import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inventory } from './Inventory';
import { MissionsPanel } from './MissionsPanel';
import { SkillsPanel } from './SkillsPanel';
import { X } from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
}

interface NotebookMenuProps {
  triggerButton?: React.ReactNode;
}

// Dynamic tab configuration using translations
const getTabsConfig = (t: any): TabConfig[] => [
  { id: 'inventory', label: t('navigation.inventory'), icon: '📦', component: Inventory },
  { id: 'missions', label: t('navigation.missions'), icon: '🎯', component: MissionsPanel },
  { id: 'skills', label: t('navigation.skills'), icon: '⚡', component: SkillsPanel },
  // Future tabs can be added here:
  // { id: 'achievements', label: t('navigation.achievements'), icon: '🏆', component: AchievementsPanel },
  // { id: 'market', label: t('navigation.market'), icon: '🏪', component: MarketPanel },
];

export const NavigationMenu = ({ triggerButton }: NotebookMenuProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  const TABS = getTabsConfig(t);

  const defaultTrigger = (
    <Button 
      size="sm"
      variant="outline"
      className="px-3 py-1 text-xs font-medium border-primary/30 hover:bg-primary/10 transition-all duration-200"
    >
      📓
    </Button>
  );

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || TABS[0].component;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerButton || defaultTrigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0 border-0 bg-gradient-to-b from-amber-50/95 to-orange-50/95 backdrop-blur-lg">
        <div className="flex flex-col h-full w-full max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="relative p-4 pb-3 border-b border-amber-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📒</span>
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {t('navigation.gameBook')}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-11 w-11 rounded-full hover:bg-red-100 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Fixed Tab Bar - Equal Width Buttons */}
          <div className="px-3 py-2.5 border-b border-amber-200/50 flex-shrink-0">
            <div className="grid grid-cols-3 gap-1.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-lg text-sm font-medium 
                    transition-all duration-200 min-h-[48px] active:scale-95
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md font-bold' 
                      : 'bg-white/60 text-gray-700 active:bg-white/90 border border-amber-200/30'
                    }
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="text-[10px] text-center leading-tight break-words px-1">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full">
              <div className="p-3 pb-6 animate-fade-in">
                {/* Inventory Content */}
                {activeTab === 'inventory' && (
                  <div className="space-y-2.5">
                    <Inventory />
                  </div>
                )}
                
                {/* Missions Content */}
                {activeTab === 'missions' && (
                  <div className="space-y-2.5">
                    <MissionsPanel />
                  </div>
                )}
                
                {/* Skills Content */}
                {activeTab === 'skills' && (
                  <div className="space-y-2.5">
                    <SkillsPanel onClose={() => setOpen(false)} isModal={false} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};