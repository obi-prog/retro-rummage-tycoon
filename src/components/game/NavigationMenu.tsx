import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu } from 'lucide-react';
import { Inventory } from './Inventory';
import { MissionsPanel } from './MissionsPanel';
import { EventsPanel } from './EventsPanel';
import { SkillsPanel } from './SkillsPanel';
import { FinancialLedger } from './FinancialLedger';

export const NavigationMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-orange/90 hover:to-retro-pink/90"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Oyun Menüsü</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="inventory" className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="inventory">📦 Envanter</TabsTrigger>
            <TabsTrigger value="missions">🎯 Görevler</TabsTrigger>
            <TabsTrigger value="skills">⚡ Yetenekler</TabsTrigger>
            <TabsTrigger value="events">📰 Olaylar</TabsTrigger>
            <TabsTrigger value="financials">💰 Mali Durum</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-4">
            <Inventory />
          </TabsContent>

          <TabsContent value="missions" className="mt-4">
            <MissionsPanel />
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <SkillsPanel />
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <EventsPanel />
          </TabsContent>

          <TabsContent value="financials" className="mt-4">
            <FinancialLedger />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};