// client/src/components/DrinkSubCategoryTabs.tsx
// ワインが多分まだちゃんと出せてないので注意

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { DrinkSubCategory } from '@/lib/types';

const drinkSubCategories: (DrinkSubCategory | 'all')[] = [
  'all',
  'beer',
  'fruit-wine',
  'wine',
  'soft-drink',
  'chinese-tea',
];

interface DrinkSubCategoryTabsProps {
  selected: DrinkSubCategory | 'all';
  onSelect: (subCategory: DrinkSubCategory | 'all') => void;
}

export function DrinkSubCategoryTabs({ selected, onSelect }: DrinkSubCategoryTabsProps) {
  const { t } = useTranslation();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {drinkSubCategories.map((subCategory) => (
          <Button
            key={subCategory}
            variant={selected === subCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(subCategory)}
            className="shrink-0"
            data-testid={`button-drink-subcategory-${subCategory}`}
          >
            {subCategory === 'all' 
              ? t('categories.all') 
              : t(`drinkSubCategories.${subCategory}`)
            }
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}