import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore } from '@/store/gameStore';
import { DailyFinancials, FinancialRecord } from '@/types/game';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Receipt } from 'lucide-react';

export const FinancialLedger: React.FC = () => {
  const { financialRecords, dailyFinancials, day } = useGameStore();
  const [activeTab, setActiveTab] = useState('daily');

  const getCurrentDayFinancials = (): DailyFinancials => {
    return dailyFinancials.find(df => df.day === day) || {
      day,
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      records: []
    };
  };

  const getWeeklyFinancials = () => {
    const weekStart = Math.max(1, day - 6);
    const weeklyData = dailyFinancials.filter(df => df.day >= weekStart && df.day <= day);
    
    const totalIncome = weeklyData.reduce((sum, df) => sum + df.totalIncome, 0);
    const totalExpenses = weeklyData.reduce((sum, df) => sum + df.totalExpenses, 0);
    const netProfit = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netProfit, days: weeklyData };
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const currentDay = getCurrentDayFinancials();
  const weekly = getWeeklyFinancials();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return '💰';
      case 'purchases': return '🛒';
      case 'rent': return '🏠';
      case 'tax': return '📊';
      case 'fine': return '⚠️';
      case 'utilities': return '💡';
      default: return '📄';
    }
  };

  const getCategoryColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Mali Durum
          </CardTitle>
          <CardDescription>
            Günlük ve haftalık gelir-gider takibi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Günlük</TabsTrigger>
              <TabsTrigger value="weekly">Haftalık</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Gelir</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(currentDay.totalIncome)}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Gider</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(currentDay.totalExpenses)}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Net Kar</p>
                        <p className={`text-2xl font-bold ${currentDay.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(currentDay.netProfit)}
                        </p>
                      </div>
                      <DollarSign className={`w-8 h-8 ${currentDay.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bugünkü Hareketler</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    {currentDay.records.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Bugün henüz hareket yok
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {currentDay.records.map((record) => (
                          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getCategoryIcon(record.category)}</span>
                              <div>
                                <p className="font-medium">{record.description}</p>
                                <p className="text-sm text-muted-foreground capitalize">{record.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className={getCategoryColor(record.type)}>
                                {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Haftalık Gelir</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(weekly.totalIncome)}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Haftalık Gider</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(weekly.totalExpenses)}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Haftalık Kar</p>
                        <p className={`text-2xl font-bold ${weekly.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(weekly.netProfit)}
                        </p>
                      </div>
                      <DollarSign className={`w-8 h-8 ${weekly.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Günlük Kâr/Zarar Grafiği
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {weekly.days.map((dayData) => (
                      <div key={dayData.day} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{dayData.day}. Gün</Badge>
                          <div className="flex gap-4 text-sm">
                            <span className="text-green-600">+{formatCurrency(dayData.totalIncome)}</span>
                            <span className="text-red-600">-{formatCurrency(dayData.totalExpenses)}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={dayData.netProfit >= 0 ? "default" : "destructive"}
                          className={dayData.netProfit >= 0 ? "bg-green-600" : ""}
                        >
                          {dayData.netProfit >= 0 ? '+' : ''}{formatCurrency(dayData.netProfit)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};