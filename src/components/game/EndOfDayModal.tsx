import { useGameStore } from '@/store/gameStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface EndOfDayModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const EndOfDayModal = ({ isOpen, onContinue }: EndOfDayModalProps) => {
  const { 
    day, 
    dailyFinancials, 
    financialRecords, 
    dailyStats,
    cash
  } = useGameStore();

  // Get current day financials
  const currentDayFinancials = dailyFinancials.find(d => d.day === day) || {
    day,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    records: []
  };

  // Calculate today's stats from records
  const todayRecords = financialRecords.filter(record => record.date === day);
  const todayIncome = todayRecords
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const todayExpenses = todayRecords
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const netProfit = todayIncome - todayExpenses;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      sales: '💰',
      purchases: '🛒',
      rent: '🏠',
      tax: '📋',
      utilities: '⚡',
      fine: '⚠️',
      other: '📄'
    };
    return icons[category] || '📄';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6" />
            Hafta {Math.ceil(day / 7)} Gün {((day - 1) % 7) + 1} - Günlük Özet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Günlük Gelir</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(todayIncome)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Günlük Gider</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(todayExpenses)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-r ${netProfit >= 0 
              ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200' 
              : 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Coins className={`w-5 h-5 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Net Kar/Zarar</p>
                    <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {formatCurrency(netProfit)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Günlük İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dailyStats.itemsSold}</p>
                  <p className="text-sm text-muted-foreground">Satılan Eşya</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dailyStats.itemsBought}</p>
                  <p className="text-sm text-muted-foreground">Alınan Eşya</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{dailyStats.negotiationsWon}</p>
                  <p className="text-sm text-muted-foreground">Başarılı Pazarlık</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{dailyStats.fakeItemsDetected}</p>
                  <p className="text-sm text-muted-foreground">Sahte Eşya Tespit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Records */}
          {todayRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Günlük İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {todayRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(record.category)}</span>
                        <div>
                          <p className="text-sm font-medium">{record.description}</p>
                          <Badge variant={record.type === 'income' ? 'default' : 'secondary'} className="text-xs">
                            {record.type === 'income' ? 'Gelir' : 'Gider'}
                          </Badge>
                        </div>
                      </div>
                      <p className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Cash */}
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <p className="text-lg font-semibold">Güncel Nakit</p>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(cash)}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onContinue}
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            >
              Sonraki Güne Geç
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};