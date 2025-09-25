import { useState } from 'react';
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

// Future-proof tab configuration - add new tabs here without code changes
const TABS: TabConfig[] = [
  { id: 'inventory', label: 'Envanter', icon: '📦', component: Inventory },
  { id: 'missions', label: 'Görevler', icon: '🎯', component: MissionsPanel },
  { id: 'skills', label: 'Yetenekler', icon: '⚡', component: SkillsPanel },
  // Future tabs can be added here:
  // { id: 'achievements', label: 'Başarılar', icon: '🏆', component: AchievementsPanel },
  // { id: 'market', label: 'Pazar', icon: '🏪', component: MarketPanel },
];

export const NavigationMenu = ({ triggerButton }: NotebookMenuProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

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
      <SheetContent side="bottom" className="h-[85vh] p-0 border-0 bg-gradient-to-b from-amber-50/95 to-orange-50/95 backdrop-blur-lg">
        <div className="flex flex-col h-full max-w-md mx-auto">
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-amber-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📒</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Oyun Defteri
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-full hover:bg-red-100 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Dynamic Tab Bar */}
          <div className="px-6 py-4 border-b border-amber-200/50">
            <ScrollArea className="w-full">
              <div className="flex gap-2 min-w-max pb-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium 
                      transition-all duration-300 min-w-fit whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg scale-105 border-2 border-orange-300' 
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-amber-200/50'
                      }
                    `}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 animate-fade-in">
                {activeTab === 'skills' ? (
                  <SkillsPanel onClose={() => setOpen(false)} isModal={false} />
                ) : (
                  <ActiveComponent />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};