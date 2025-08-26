import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Inventory } from './Inventory';
import { MissionsPanel } from './MissionsPanel';
import { EventsPanel } from './EventsPanel';
import { SkillsPanel } from './SkillsPanel';
import { FinancialLedger } from './FinancialLedger';

export const QuickDock = () => {
  const [open, setOpen] = useState<string | null>(null);

  const close = () => setOpen(null);

  return (
    <div className="sticky top-2 z-30 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        <Sheet open={open === 'inventory'} onOpenChange={(v) => setOpen(v ? 'inventory' : null)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">📦 Envanter</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Envanter</SheetTitle>
            </SheetHeader>
            <div className="mt-4"><Inventory /></div>
          </SheetContent>
        </Sheet>

        <Sheet open={open === 'missions'} onOpenChange={(v) => setOpen(v ? 'missions' : null)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">🎯 Görevler</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Görevler</SheetTitle>
            </SheetHeader>
            <div className="mt-4"><MissionsPanel /></div>
          </SheetContent>
        </Sheet>

        <Sheet open={open === 'skills'} onOpenChange={(v) => setOpen(v ? 'skills' : null)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">⚡ Yetenekler</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Yetenekler</SheetTitle>
            </SheetHeader>
            <div className="mt-4"><SkillsPanel /></div>
          </SheetContent>
        </Sheet>

        <Sheet open={open === 'events'} onOpenChange={(v) => setOpen(v ? 'events' : null)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">📰 Olaylar</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Olaylar</SheetTitle>
            </SheetHeader>
            <div className="mt-4"><EventsPanel /></div>
          </SheetContent>
        </Sheet>

        <Sheet open={open === 'financials'} onOpenChange={(v) => setOpen(v ? 'financials' : null)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">💰 Muhasebe</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Mali Durum</SheetTitle>
            </SheetHeader>
            <div className="mt-4"><FinancialLedger /></div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};