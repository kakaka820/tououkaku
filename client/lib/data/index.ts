import type { MenuItem, Table, Order } from '../types';
import { appetizers } from './appetizers';
import { course } from './course';
import { delicacies } from './delicacies';
import { desserts } from './desserts';
import { drinks } from './drinks';
import { meat } from './meat';
import { seafood } from './seafood';
import { staples } from './staples';
import { vegetables } from './vegetables';

// 全メニューを統合
export const menuItems: MenuItem[] = [
  ...appetizers,
  ...course,
  ...vegetables,
  ...meat,
  ...seafood,
  ...delicacies,
  ...staples,
  ...desserts,
  ...drinks,
];

// テーブルデータ
export const tables: Table[] = [
  { number: 1, status: 'available', capacity: 2 },
  { number: 2, status: 'occupied', capacity: 4, currentOrderId: 'order-1' },
  { number: 3, status: 'available', capacity: 4 },
  { number: 4, status: 'needsAttention', capacity: 6, currentOrderId: 'order-2' },
  { number: 5, status: 'occupied', capacity: 2, currentOrderId: 'order-3' },
  { number: 6, status: 'available', capacity: 4 },
  { number: 7, status: 'occupied', capacity: 8, currentOrderId: 'order-4' },
  { number: 8, status: 'available', capacity: 2 },
];

// 初期注文データ
export const initialOrders: Order[] = [
  {
    id: 'order-1',
    tableNumber: 2,
    items: [
      { menuItem: menuItems[0], quantity: 2 },
      { menuItem: menuItems[6], quantity: 2 },
    ],
    status: 'pending',
    timestamp: new Date(Date.now() - 3 * 60000),
    total: 3060,
  },
  {
    id: 'order-2',
    tableNumber: 4,
    items: [
      { menuItem: menuItems[1], quantity: 1 },
      { menuItem: menuItems[4], quantity: 2 },
      { menuItem: menuItems[7], quantity: 4 },
    ],
    status: 'inProgress',
    timestamp: new Date(Date.now() - 8 * 60000),
    total: 2960,
  },
  {
    id: 'order-3',
    tableNumber: 5,
    items: [
      { menuItem: menuItems[2], quantity: 1 },
      { menuItem: menuItems[3], quantity: 1 },
    ],
    status: 'ready',
    timestamp: new Date(Date.now() - 12 * 60000),
    total: 1430,
  },
];