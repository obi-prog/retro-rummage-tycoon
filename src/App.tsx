import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundProvider } from "@/contexts/SoundContext";
import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// AutoSave Component - handles global auto-save events
const AutoSaveWrapper = ({ children }: { children: React.ReactNode }) => {
  const { saveGameState, hasSavedGame } = useGameStore();

  useEffect(() => {
    // Auto-save when user is about to leave/close the tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasSavedGame()) {
        saveGameState();
      }
    };

    // Auto-save when tab becomes hidden (user switches tabs/minimizes)
    const handleVisibilityChange = () => {
      if (document.hidden && hasSavedGame()) {
        saveGameState();
      }
    };

    // Auto-save when page is being unloaded
    const handlePageHide = () => {
      if (hasSavedGame()) {
        saveGameState();
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [saveGameState, hasSavedGame]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SoundProvider>
      <TooltipProvider>
        <AutoSaveWrapper>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AutoSaveWrapper>
      </TooltipProvider>
    </SoundProvider>
  </QueryClientProvider>
);

export default App;
