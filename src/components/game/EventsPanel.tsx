import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const EventsPanel = () => {
  const { events, trends, dismissEvent } = useGameStore();

  const activeEvents = events.filter(e => e.duration && e.duration > 0);
  const activeTrends = trends.filter(t => t.duration > 0);

  return (
    <div className="space-y-4">
      {/* Active Events */}
      {activeEvents.length > 0 && (
        <Card className="bg-gradient-to-r from-destructive/10 to-retro-orange/10 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              ⚡ Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeEvents.map(event => (
              <Card key={event.id} className="bg-card/50 border-destructive/20">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{event.description}</div>
                    </div>
                    {event.duration && (
                      <Badge variant="destructive" className="text-xs">
                        {event.duration} days
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dismissEvent(event.id)}
                    className="h-6 px-2 text-xs"
                  >
                    OK
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Trends */}
      {activeTrends.length > 0 && (
        <Card className="bg-gradient-to-r from-retro-orange/10 to-retro-yellow/10 border-retro-orange/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              🔥 Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTrends.map((trend, idx) => (
              <Card key={idx} className="bg-card/50 border-retro-orange/20">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">
                        {getCategoryName(trend.category)} Trend
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{trend.bonus}% value bonus
                      </div>
                    </div>
                    <Badge className="bg-retro-orange text-white text-xs">
                      {trend.duration} days
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {activeEvents.length === 0 && activeTrends.length === 0 && (
        <Card className="bg-muted/20">
          <CardContent className="p-4 text-center text-muted-foreground">
            <div className="text-2xl mb-2">😌</div>
            <div className="text-sm">No active events</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    'cassette_record': 'Vinyl Records',
    'walkman_electronics': 'Electronics',
    'watch': 'Watches',
    'toy': 'Toys',
    'comic': 'Comics',
    'poster': 'Posters',
    'camera': 'Cameras',
    'mystery_box': 'Mystery Box'
  };
  return names[category] || category;
};