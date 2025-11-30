// client/src/pages/CustomerOrderPage.tsx
// 注文ページ


import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MenuItemCard } from '@/components/MenuItemCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { DrinkSubCategoryTabs } from '@/components/DrinkSubCategoryTabs';
import { CartSummaryBar } from '@/components/CartSummaryBar';
import { CartItemRow } from '@/components/CartItemRow';
import { OrderConfirmDialog } from '@/components/OrderConfirmDialog';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { MenuItem, CartItem, Category, DrinkSubCategory } from '@/lib/types';

interface CustomerOrderPageProps {
  tableNumber: number;
}

export default function CustomerOrderPage({ tableNumber }: CustomerOrderPageProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<DrinkSubCategory | 'all'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API経由でメニュー取得
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  // 注文送信のミューテーション
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { tableNumber: number; items: CartItem[] }) => {
      const res = await apiRequest('POST', '/api/orders', orderData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setCart([]);
      setConfirmOpen(false);
      setCartOpen(false);
    },
    onError: (error) => {
    },
  });

  // カテゴリー変更時にスクロール位置をリセット
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedCategory, selectedSubCategory]);

  const filteredItems = menuItems.filter((item) => {
    // メインカテゴリーでフィルター
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
     // ドリンクかつサブカテゴリーが選択されている場合
    if (selectedCategory === 'drink' && selectedSubCategory !== 'all') {
      return item.subCategory === selectedSubCategory;
    }
    return true;
  });
  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, quantity } : ci
      )
    );
  };


  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const handleConfirmOrder = () => {
    // 実際のAPI呼び出し
    createOrderMutation.mutate({ tableNumber, items: cart });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex-shrink-0 border-b bg-background">
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" data-testid="text-table-number">
              {t('tableNumber')}: {tableNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
        {/* メインカテゴリータブ */}
        <div className="px-4 pb-3">
          <CategoryTabs selected={selectedCategory} onSelect={(category) => {
              setSelectedCategory(category);
              setSelectedSubCategory('all');
           }}
            />
        </div>
        {/* サブカテゴリータブ（ドリンク選択時のみ表示） */}
        {selectedCategory === 'drink' && (
          <div className="px-4 pb-3">
            <DrinkSubCategoryTabs
              selected={selectedSubCategory}
              onSelect={setSelectedSubCategory}
            />
          </div>
        )}
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>
      <div className="flex-shrink-0">
      <CartSummaryBar items={cart} onViewCart={() => setCartOpen(true)} />
      </div>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-lg" data-testid="sheet-cart">
          <SheetHeader>
            <SheetTitle>{t('cart')}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground">{t('noOrders')}</p>
            ) : (
              cart.map((item) => (
                <CartItemRow
                  key={item.menuItem.id}
                  item={item}
                  onUpdateQuantity={(qty) => handleUpdateQuantity(item.menuItem.id, qty)}
                  onRemove={() => handleRemoveItem(item.menuItem.id)}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between py-4 text-lg font-bold">
                <span>{t('total')}</span>
                <span>¥{total.toLocaleString()}</span>
              </div>
              <SheetFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setConfirmOpen(true)}
                  disabled={createOrderMutation.isPending}
                  data-testid="button-checkout"
                >
                  {createOrderMutation.isPending ? 'Sending...' : t('confirmOrder')}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <OrderConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        items={cart}
        tableNumber={tableNumber}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}