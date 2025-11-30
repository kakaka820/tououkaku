import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { AllergenList } from './AllergenBadge';
import { SpicyIndicator } from './SpicyIndicator';
import { QuantityStepper } from './QuantityStepper';
import type { MenuItem } from '@/lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const getName = () => {
    if (i18n.language === 'ja') return item.nameJa;
    if (i18n.language === 'zh') return item.nameCn;
    return item.nameEn;
  };

  const getDescription = () => {
    if (i18n.language === 'ja') return item.descriptionJa;
    if (i18n.language === 'zh') return item.descriptionCn;
    return item.descriptionEn;
  };

  const name = getName();
  const description = getDescription();

  const handleAdd = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <Card
      className={`flex flex-col ${!item.available ? 'opacity-50' : ''}`}
      data-testid={`card-menu-item-${item.id}`}
    >
      <CardContent className="flex-1 p-4">
        <div className="mb-3 flex aspect-square items-center justify-center rounded-md bg-muted">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={name}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{name}</h3>
            <SpicyIndicator level={item.spicyLevel} />
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <AllergenList allergens={item.allergens} />

          <p className="text-lg font-bold text-primary">
            ¥{item.price.toLocaleString()}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        <QuantityStepper quantity={quantity} onChange={setQuantity} min={1} />
        <Button
          className="w-full gap-2"
          onClick={handleAdd}
          disabled={!item.available}
          data-testid={`button-add-to-cart-${item.id}`}
        >
          <Plus className="h-4 w-4" />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}
