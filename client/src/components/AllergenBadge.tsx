import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Wheat, Milk, Nut, Fish, Egg, Bean } from 'lucide-react';
import type { AllergenType } from '@/lib/types';

const allergenIcons: Record<AllergenType, React.ElementType> = {
  gluten: Wheat,
  dairy: Milk,
  nuts: Nut,
  seafood: Fish,
  egg: Egg,
  soy: Bean,
};

interface AllergenBadgeProps {
  allergen: AllergenType;
  showLabel?: boolean;
}

export function AllergenBadge({ allergen, showLabel = false }: AllergenBadgeProps) {
  const { t } = useTranslation();
  const Icon = allergenIcons[allergen];

  return (
    <Badge
      variant="secondary"
      className="gap-1 text-xs"
      data-testid={`badge-allergen-${allergen}`}
    >
      <Icon className="h-3 w-3" />
      {showLabel && <span>{t(`allergenTypes.${allergen}`)}</span>}
    </Badge>
  );
}

interface AllergenListProps {
  allergens: AllergenType[];
  showLabels?: boolean;
}

export function AllergenList({ allergens, showLabels = false }: AllergenListProps) {
  if (allergens.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1" data-testid="allergen-list">
      {allergens.map((allergen) => (
        <AllergenBadge key={allergen} allergen={allergen} showLabel={showLabels} />
      ))}
    </div>
  );
}
