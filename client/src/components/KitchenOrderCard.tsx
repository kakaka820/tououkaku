import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Check } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  complete: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export function KitchenOrderCard({ order, onStatusChange }: KitchenOrderCardProps) {
  const { t } = useTranslation();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getElapsedMinutes = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / 60000);
  };

  const elapsed = getElapsedMinutes(order.timestamp);

  return (
    <Card
      className={`${order.status === 'pending' && elapsed > 5 ? 'ring-2 ring-red-500' : ''}`}
      data-testid={`kitchen-order-${order.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">{order.tableNumber}</span>
          <Badge className={statusStyles[order.status]}>
            {t(order.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(order.timestamp)}</span>
          <span className={`ml-1 ${elapsed > 10 ? 'text-red-500 font-bold' : ''}`}>
            ({elapsed}分)
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-lg font-semibold"
              data-testid={`kitchen-item-${item.menuItem.id}`}
            >
              <span className="font-bold">{item.menuItem.shortName}</span>
              <span className="text-xl">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-2">
        {order.status === 'pending' && (
          <Button
            className="flex-1 gap-2"
            onClick={() => onStatusChange(order.id, 'inProgress')}
            data-testid={`button-start-order-${order.id}`}
          >
            <ChefHat className="h-4 w-4" />
            {t('inProgress')}
          </Button>
        )}
        {order.status === 'inProgress' && (
          <Button
            className="flex-1 gap-2"
            onClick={() => onStatusChange(order.id, 'ready')}
            data-testid={`button-ready-order-${order.id}`}
          >
            <Check className="h-4 w-4" />
            {t('ready')}
          </Button>
        )}
        {order.status === 'ready' && (
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={() => onStatusChange(order.id, 'complete')}
            data-testid={`button-complete-order-${order.id}`}
          >
            <Check className="h-4 w-4" />
            {t('complete')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
