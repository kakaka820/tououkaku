import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { KitchenOrderCard } from '@/components/KitchenOrderCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Order, OrderStatus } from '@/lib/types';

export default function KitchenDisplay() {
  const { t } = useTranslation();
  
  // API経由で注文取得（complete以外）
  const { data: allOrders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    refetchInterval: 5000, // 5秒ごとに自動更新
  });

  // complete以外の注文のみ表示
  const orders = allOrders.filter((o) => o.status !== 'complete');

  // ステータス更新のミューテーション
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const res = await apiRequest('PATCH', `/api/orders/${orderId}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inProgressOrders = orders.filter((o) => o.status === 'inProgress');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  if (isLoading) {
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{t('kitchen')}</h1>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                {t('pending')}: {pendingOrders.length}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {t('inProgress')}: {inProgressOrders.length}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {t('ready')}: {readyOrders.length}
              </Badge>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              {t('pending')}
            </h2>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('noOrders')}</p>
              ) : (
                pendingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              {t('inProgress')}
            </h2>
            <div className="space-y-4">
              {inProgressOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('noOrders')}</p>
              ) : (
                inProgressOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              {t('ready')}
            </h2>
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('noOrders')}</p>
              ) : (
                readyOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}