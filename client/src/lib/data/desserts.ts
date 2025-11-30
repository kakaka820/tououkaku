// client/src/lib/data/desserts.ts
// デザート
// todo: allergens:'sesame'を追加

import type { MenuItem } from '../types';

export const desserts: MenuItem[] = [
  {
    id: 'des-001',
    nameJa: '濃厚杏仁豆腐',
    nameEn: 'Rich Almond Tofu',
    nameCn: '杏仁豆腐',
    price: 660,
    category: 'dessert',
    allergens: ['dairy', 'nuts'],
    spicyLevel: 0,
    shortName: '杏仁豆腐',
    available: true,
  },
  {
    id: 'des-002',
    nameJa: '黒ゴマ白玉（HOT）',
    nameEn: 'Black Sesame Rice Balls (Hot)',
    nameCn: '黑芝麻汤圆（热）',
    price: 660,
    category: 'dessert',
    allergens: [/*'sesame'*/],
    spicyLevel: 0,
    shortName: '黑芝麻汤圆',
    available: true,
  },
  {
    id: 'des-003',
    nameJa: 'マンゴープリン',
    nameEn: 'Mango Pudding',
    nameCn: '芒果布丁',
    price: 660,
    category: 'dessert',
    allergens: ['dairy'],
    spicyLevel: 0,
    shortName: '芒果布丁',
    available: true,
  },
  {
    id: 'des-004',
    nameJa: 'ココナッツカスタード団子（HOT）',
    nameEn: 'Coconut Custard Dumplings (Hot)',
    nameCn: '椰汁奶黄包（热）',
    price: 680,
    category: 'dessert',
    allergens: ['dairy', 'egg'],
    spicyLevel: 0,
    shortName: '奶黄包',
    available: true,
  },
  {
    id: 'des-005',
    nameJa: 'ゴマ団子',
    nameEn: 'Sesame Balls',
    nameCn: '芝麻球',
    price: 660,
    category: 'dessert',
    allergens: [/*'sesame',*/ 'gluten'],
    spicyLevel: 0,
    shortName: '芝麻球',
    available: true,
  },
];