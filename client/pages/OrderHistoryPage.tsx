import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { OrderHistoryItem } from '@/components/OrderHistoryItem';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Order } from '@/lib/types';

interface OrderHistoryPageProps {
  tableNumber?: number;
}

export default function OrderHistoryPage({ tableNumber }: OrderHistoryPageProps) {
  const { t } = useTranslation();

  // API経由で注文取得
  const queryKey = tableNumber 
    ? ['/api/orders', { tableNumber }] 
    : ['/api/orders'];
    
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey,
  });

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
          <h1 className="text-xl font-bold">{t('orderHistory')}</h1>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-muted-foreground">{t('noOrders')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderHistoryItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}