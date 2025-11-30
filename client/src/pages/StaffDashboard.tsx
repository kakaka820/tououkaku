import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { TableCard } from '@/components/TableCard';
import { OrderHistoryItem } from '@/components/OrderHistoryItem';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Users, ClipboardList, Clock } from 'lucide-react';
import type { Table, Order } from '@/lib/types';

export default function StaffDashboard() {
  const { t, i18n } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // API経由でテーブル取得
  const { data: tables = [], isLoading: tablesLoading } = useQuery<Table[]>({
    queryKey: ['/api/tables'],
    refetchInterval: 5000,
  });

  // API経由で注文取得
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    refetchInterval: 5000,
  });

  const activeOrders = orders.filter((o) => o.status !== 'complete');
  const completedOrders = orders.filter((o) => o.status === 'complete');

  const getTableOrder = (table: Table): Order | undefined => {
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setDetailOpen(true);
  };

  const tableStats = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    needsAttention: tables.filter((t) => t.status === 'needsAttention').length,
  };

  if (tablesLoading || ordersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex items-center justify-between gap-4 p-4">
          <h1 className="text-xl font-bold">{t('staff')}</h1>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tableStats.available}</p>
                <p className="text-sm text-muted-foreground">{t('available')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tableStats.occupied}</p>
                <p className="text-sm text-muted-foreground">{t('occupied')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tableStats.needsAttention}</p>
                <p className="text-sm text-muted-foreground">{t('needsAttention')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tables" data-testid="tab-tables">
              {t('tables')}
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">
              {t('orders')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {tables.map((table) => (
                <TableCard
                  key={table.number}
                  table={table}
                  onClick={() => handleTableClick(table)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="space-y-4">
              {activeOrders.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">{t('orders')} ({activeOrders.length})</h3>
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <OrderHistoryItem key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}
              {completedOrders.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-muted-foreground">
                    {t('history')} ({completedOrders.length})
                  </h3>
                  <div className="space-y-3">
                    {completedOrders.map((order) => (
                      <OrderHistoryItem key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent data-testid="dialog-table-detail">
          <DialogHeader>
            <DialogTitle>
              {t('tableNumber')} {selectedTable?.number}
            </DialogTitle>
          </DialogHeader>

          {selectedTable && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('tableNumber')}</span>
                <Badge
                  className={
                    selectedTable.status === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : selectedTable.status === 'occupied'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }
                >
                  {t(selectedTable.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{selectedTable.capacity}</span>
              </div>

              {selectedTable.currentOrderId && (
                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">{t('orders')}</h4>
                  {(() => {
                    const order = getTableOrder(selectedTable);
                    if (!order) return null;
                    return (
                      <div className="space-y-2 text-sm">
                        {order.items.map((item, idx) => {
                          const name = i18n.language === 'ja' ? item.menuItem.nameJa : item.menuItem.nameEn;
                          return (
                            <div key={idx} className="flex justify-between">
                              <span>{name} ×{item.quantity}</span>
                              <span>¥{(item.menuItem.price * item.quantity).toLocaleString()}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between border-t pt-2 font-bold">
                          <span>{t('total')}</span>
                          <span>¥{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              {t('close')}
            </Button>
            {selectedTable?.status === 'available' && (
              <Button data-testid="button-new-order">
                <Plus className="mr-2 h-4 w-4" />
                {t('newOrder')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}