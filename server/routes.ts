import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===== Menu API =====
  app.get('/api/menu', (req, res) => {
    const menu = storage.getMenu();
    res.json(menu);
  });

  // ===== Order API =====
  
  // 注文作成（客画面から）
  app.post('/api/orders', (req, res) => {
    try {
      const { tableNumber, items } = req.body;
      
      if (!tableNumber || !items || !Array.isArray(items)) {
        return res.status(400).json({ 
          error: 'tableNumber and items are required' 
        });
      }
      
      const order = storage.createOrder({ tableNumber, items });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // 注文一覧取得（キッチン・スタッフ用）
  app.get('/api/orders', (req, res) => {
    const { status, tableNumber } = req.query;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (tableNumber) filters.tableNumber = parseInt(tableNumber as string);
    
    const orders = storage.getOrders(filters);
    res.json(orders);
  });

  // 特定注文の取得
  app.get('/api/orders/:id', (req, res) => {
    const order = storage.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // 注文ステータス更新（キッチンから）
  app.patch('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }
    
    const order = storage.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  });

  // ===== Table API =====
  
  // テーブル一覧取得
  app.get('/api/tables', (req, res) => {
    const tables = storage.getTables();
    res.json(tables);
  });

  // 特定テーブルの取得
  app.get('/api/tables/:number', (req, res) => {
    const table = storage.getTableByNumber(parseInt(req.params.number));
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  });

  // テーブルステータス更新
  app.patch('/api/tables/:number', (req, res) => {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }
    
    const table = storage.updateTableStatus(parseInt(req.params.number), status);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    res.json(table);
  });

  const httpServer = createServer(app);
  return httpServer;
}