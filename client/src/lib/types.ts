// client/src/lib/types.ts
// カテゴリー型定義





export type AllergenType = 'gluten' | 'dairy' | 'nuts' | 'seafood' | 'egg' | 'soy';

export type SpicyLevel = 0 | 1 | 2 | 3;

export type Category = 'course' | 'appetizer' | 'vegetable' | 'meat' | 'seafood' | 'delicacy' | 'staple' | 'dessert' | 'drink';

export type DrinkSubCategory = 'beer' | 'fruit-wine' | 'wine' | 'soft-drink' | 'chinese-tea';

export type CategoryWithSub = 'drink';

export interface MenuItem {
  id: string;
  nameJa: string;
  nameEn: string;
  nameCn: string;
  descriptionJa?: string;
  descriptionEn?: string;
  descriptionCn?: string;
  price: number;
  category: Category;
  subCategory?: DrinkSubCategory;
  allergens: AllergenType[];
  spicyLevel: SpicyLevel;
  shortName: string;
  imageUrl?: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'inProgress' | 'ready' | 'complete';

export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  status: OrderStatus;
  timestamp: Date;
  total: number;
}

export type TableStatus = 'available' | 'occupied' | 'needsAttention';

export interface Table {
  number: number;
  status: TableStatus;
  currentOrderId?: string;
  capacity: number;
}
