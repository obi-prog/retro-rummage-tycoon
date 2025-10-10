import { useGameStore } from '@/store/gameStore';
import { useI18n } from '@/contexts/I18nContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, TrendingUp, TrendingDown, Calendar, ShoppingCart, ShoppingBag, Target, AlertTriangle } from 'lucide-react';

interface EndOfDayModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const EndOfDayModal = ({ isOpen, onContinue }: EndOfDayModalProps) => {
  const { t, locale } = useI18n();
  const { 
    day, 
    dailyFinancials, 
    financialRecords, 
    dailyStats,
    cash
  } = useGameStore();

  // Calculate today's stats from records
  const todayRecords = financialRecords.filter(record => record.date === day);
  const todayIncome = todayRecords
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const todayExpenses = todayRecords
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const netProfit = todayIncome - todayExpenses;

  // Currency and number formatters
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(locale).format(number);
  };

  // Week and day calculation
  const weekNumber = Math.ceil(day / 7);
  const dayOfWeek = ((day - 1) % 7) + 1;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-blue-600" />
            {t('common.week')} {weekNumber} {t('common.day')} {dayOfWeek} – {t('endOfDay.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Financial Summary Cards - First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Income Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-green-700 font-medium truncate">
                      {t('endOfDay.income')}
                    </p>
                    <p className="text-xl font-bold text-green-600 truncate">
                      {formatCurrency(todayIncome)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-red-700 font-medium truncate">
                      {t('endOfDay.expenses')}
                    </p>
                    <p className="text-xl font-bold text-red-600 truncate">
                      {formatCurrency(todayExpenses)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Net Profit/Loss Card */}
            <Card className={`bg-gradient-to-r ${netProfit >= 0 
              ? 'from-blue-50 to-cyan-50 border-blue-200' 
              : 'from-orange-50 to-red-50 border-orange-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Coins className={`w-6 h-6 flex-shrink-0 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                      {t('endOfDay.net')}
                    </p>
                    <p className={`text-xl font-bold truncate ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {formatCurrency(netProfit)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Stats Card - Second Row */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                {t('endOfDay.stats')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(dailyStats.itemsSold)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">
                    {t('endOfDay.sold')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(dailyStats.itemsBought)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">
                    {t('endOfDay.bought')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(dailyStats.negotiationsWon)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">
                    {t('endOfDay.successful')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(dailyStats.fakeItemsDetected)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">
                    {t('endOfDay.fakeDetected')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Cash Card - Third Row */}
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <p className="text-lg font-semibold text-yellow-800">
                    {t('endOfDay.cashAfter')}
                  </p>
                </div>
                <p className="text-3xl font-bold text-yellow-600">
                  {formatCurrency(cash)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onContinue}
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg py-6"
            >
              {t('endOfDay.openShop')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};