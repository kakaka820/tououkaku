// client/src/components/CateforyTabs.tsx
// カテゴリ



import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Category } from '@/lib/types';

const categories: (Category | 'all')[] = ['all', 'course', 'appetizer', 'vegetable', 'meat', 'seafood', 'delicacy', 'staple',  'dessert' , 'drink'];

interface CategoryTabsProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const { t } = useTranslation();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selected === category ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onSelect(category)}
            className="shrink-0"
            data-testid={`button-category-${category}`}
          >
            {t(`categories.${category}`)}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
