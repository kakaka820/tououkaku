import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from './QuantityStepper';
import type { CartItem } from '@/lib/types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { i18n } = useTranslation();
  const name = i18n.language === 'ja' ? item.menuItem.nameJa : item.menuItem.nameEn;

  return (
    <div
      className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0"
      data-testid={`cart-item-${item.menuItem.id}`}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-sm text-muted-foreground">
          ¥{item.menuItem.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <QuantityStepper
          quantity={item.quantity}
          onChange={onUpdateQuantity}
          min={1}
        />

        <p className="w-20 text-right font-semibold tabular-nums">
          ¥{(item.menuItem.price * item.quantity).toLocaleString()}
        </p>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive"
          data-testid={`button-remove-item-${item.menuItem.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
