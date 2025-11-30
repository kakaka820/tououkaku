import { randomUUID } from "crypto";
import type { MenuItem, Order, Table, CartItem, OrderStatus } from "../client/src/lib/types";
import { menuItems, tables } from "../client/src/lib/data";

export interface IStorage {
  // Menu operations
  getMenu(): MenuItem[];
  
  // Order operations
  createOrder(data: { tableNumber: number; items: CartItem[] }): Order;
  getOrders(filters?: { status?: OrderStatus; tableNumber?: number }): Order[];
  getOrderById(id: string): Order | undefined;
  updateOrderStatus(id: string, status: OrderStatus): Order | undefined;
  
  // Table operations
  getTables(): Table[];
  getTableByNumber(number: number): Table | undefined;
  updateTableStatus(number: number, status: Table['status']): Table | undefined;
}

export class MemStorage implements IStorage {
  private menuItems: MenuItem[];
  private orders: Map<string, Order>;
  private tables: Map<number, Table>;

  constructor() {
  this.menuItems = [...menuItems];
  this.orders = new Map();
  this.tables = new Map(tables.map(table => [table.number, table]));
}

  // ===== Menu Operations =====
  getMenu(): MenuItem[] {
    return this.menuItems.filter(item => item.available);
  }

  // ===== Order Operations =====
  createOrder(data: { tableNumber: number; items: CartItem[] }): Order {
    const id = `order-${randomUUID()}`;
    const total = data.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    const order: Order = {
      id,
      tableNumber: data.tableNumber,
      items: data.items,
      status: 'pending',
      timestamp: new Date(),
      total,
    };
    
    this.orders.set(id, order);
    
    // テーブルのステータスを更新
    const table = this.tables.get(data.tableNumber);
    if (table) {
      table.status = 'occupied';
      table.currentOrderId = id;
    }
    
    return order;
  }

  getOrders(filters?: { status?: OrderStatus; tableNumber?: number }): Order[] {
    let orders = Array.from(this.orders.values());
    
    if (filters?.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters?.tableNumber) {
      orders = orders.filter(order => order.tableNumber === filters.tableNumber);
    }
    
    // 新しい順にソート
    return orders.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    order.status = status;
    
    // ステータスが complete の場合、テーブルを空席に
    if (status === 'complete') {
      const table = this.tables.get(order.tableNumber);
      if (table && table.currentOrderId === id) {
        table.status = 'available';
        table.currentOrderId = undefined;
      }
    }
    
    return order;
  }

  // ===== Table Operations =====
  getTables(): Table[] {
    return Array.from(this.tables.values());
  }

  getTableByNumber(number: number): Table | undefined {
    return this.tables.get(number);
  }

  updateTableStatus(number: number, status: Table['status']): Table | undefined {
    const table = this.tables.get(number);
    if (!table) return undefined;
    
    table.status = status;
    return table;
  }
}

export const storage = new MemStorage();