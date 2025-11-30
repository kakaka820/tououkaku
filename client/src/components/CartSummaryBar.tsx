import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/types';

interface CartSummaryBarProps {
  items: CartItem[];
  onViewCart: () => void;
}

export function CartSummaryBar({ items, onViewCart }: CartSummaryBarProps) {
  const { t } = useTranslation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg"
      data-testid="cart-summary-bar"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {totalItems} {t('items')}
            </p>
            <p className="text-lg font-bold">
              ¥{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <Button size="lg" onClick={onViewCart} data-testid="button-view-cart">
          {t('cart')}
        </Button>
      </div>
    </div>
  );
}
