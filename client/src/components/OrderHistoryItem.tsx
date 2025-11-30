import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  complete: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

interface OrderHistoryItemProps {
  order: Order;
}

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString(i18n.language === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card data-testid={`order-history-${order.id}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge className={statusStyles[order.status]}>
              {t(order.status)}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDateTime(order.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">¥{order.total.toLocaleString()}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-toggle-order-${order.id}`}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-4 pt-2">
          <div className="space-y-2 border-t pt-3">
            {order.items.map((item, index) => {
              const name = i18n.language === 'ja' ? item.menuItem.nameJa : item.menuItem.nameEn;
              return (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                  data-testid={`history-item-${item.menuItem.id}`}
                >
                  <span>
                    {name} ×{item.quantity}
                  </span>
                  <span className="font-medium">
                    ¥{(item.menuItem.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
