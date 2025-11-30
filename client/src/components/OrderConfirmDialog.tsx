import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/lib/types';

interface OrderConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  tableNumber: number;
  onConfirm: () => void;
}

export function OrderConfirmDialog({
  open,
  onOpenChange,
  items,
  tableNumber,
  onConfirm,
}: OrderConfirmDialogProps) {
  const { t, i18n } = useTranslation();

  const total = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-order-confirm">
        <DialogHeader>
          <DialogTitle>{t('orderConfirmation')}</DialogTitle>
          <DialogDescription>
            {t('tableNumber')}: {tableNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {items.map((item, index) => {
              const name = i18n.language === 'ja' ? item.menuItem.nameJa : item.menuItem.nameEn;
              return (
                <div
                  key={index}
                  className="flex justify-between"
                  data-testid={`confirm-item-${item.menuItem.id}`}
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
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t('total')}</span>
          <span>¥{total.toLocaleString()}</span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-order"
          >
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} data-testid="button-confirm-order">
            {t('confirmOrder')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
