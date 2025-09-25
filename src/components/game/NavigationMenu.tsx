import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotebookPen } from 'lucide-react';
import { Inventory } from './Inventory';
import { MissionsPanel } from './MissionsPanel';
import { SkillsPanel } from './SkillsPanel';

interface NotebookMenuProps {
  triggerButton?: React.ReactNode;
}

export const NavigationMenu = ({ triggerButton }: NotebookMenuProps) => {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button 
      size="sm"
      variant="outline"
      className="px-3 py-1 text-xs font-medium border-primary/30 hover:bg-primary/10"
    >
      <NotebookPen className="w-4 h-4 mr-1" />
      📓
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerButton || defaultTrigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>📓 Oyun Defteri</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="inventory" className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="inventory">📦 Envanter</TabsTrigger>
            <TabsTrigger value="missions">🎯 Görevler</TabsTrigger>
            <TabsTrigger value="skills">⚡ Yetenekler</TabsTrigger>
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};