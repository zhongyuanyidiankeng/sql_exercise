// lib/db/schema.ts
// 电商示例数据库 Schema 和测试数据

export const CREATE_TABLES_SQL = `
-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  sales_count INTEGER DEFAULT 0,
  created_at TEXT
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  level TEXT NOT NULL,
  register_date TEXT
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

export const SEED_DATA_SQL = `
-- 插入商品数据
INSERT INTO products VALUES
(1, 'iPhone 15 Pro', '手机', 8999, 150, 2380, '2024-01-01'),
(2, '小米14', '手机', 3999, 280, 3150, '2024-01-05'),
(3, 'OPPO Reno11', '手机', 2499, 8, 1820, '2024-01-10'),
(4, 'AirPods Pro 2', '耳机', 1899, 320, 4200, '2024-01-02'),
(5, '索尼WH-1000XM5', '耳机', 2499, 12, 980, '2024-01-08'),
(6, '华为FreeBuds Pro 3', '耳机', 999, 450, 2100, '2024-01-15'),
(7, 'MacBook Air M3', '笔记本', 9499, 60, 760, '2024-01-03'),
(8, '联想小新Pro16', '笔记本', 5299, 5, 420, '2024-01-12'),
(9, 'ThinkPad X1 Carbon', '笔记本', 12999, 25, 180, '2024-01-20'),
(10, 'iPad Pro 11寸', '平板', 6799, 90, 1050, '2024-01-04'),
(11, '华为MatePad Pro', '平板', 3499, 15, 680, '2024-01-18'),
(12, '小米平板6 Pro', '平板', 2299, 200, 1340, '2024-01-22'),
(13, '罗技MX Master 3S', '配件', 699, 380, 3600, '2024-01-06'),
(14, 'Apple Watch Ultra 2', '穿戴', 6299, 45, 520, '2024-01-07'),
(15, '华为Watch GT4', '穿戴', 1588, 220, 1680, '2024-01-14');

-- 插入用户数据
INSERT INTO users VALUES
(1, '张伟', '北京', '钻石', '2022-03-15'),
(2, '李静', '上海', '金卡', '2022-08-20'),
(3, '王磊', '深圳', '银卡', '2023-01-10'),
(4, '刘芳', '广州', '普通', '2023-06-01'),
(5, '陈浩', '杭州', '金卡', '2022-11-30'),
(6, '赵敏', '成都', '普通', '2024-01-05'),
(7, '周翔', '武汉', '银卡', '2023-04-18'),
(8, '吴欣', '西安', '钻石', '2021-12-01'),
(9, '孙悦', '南京', '金卡', '2023-09-22'),
(10, '郑勇', '重庆', '普通', '2024-02-14');

-- 插入订单数据
INSERT INTO orders VALUES
(1, 1, 1, 1, 8999, '已完成', '2024-03-01'),
(2, 1, 4, 2, 3798, '已完成', '2024-03-05'),
(3, 2, 2, 1, 3999, '已完成', '2024-03-02'),
(4, 2, 13, 1, 699, '已发货', '2024-03-08'),
(5, 3, 6, 1, 999, '已完成', '2024-03-03'),
(6, 4, 12, 1, 2299, '已完成', '2024-03-04'),
(7, 5, 7, 1, 9499, '已完成', '2024-03-01'),
(8, 5, 14, 1, 6299, '已完成', '2024-03-10'),
(9, 6, 3, 1, 2499, '退款', '2024-03-06'),
(10, 7, 5, 1, 2499, '已完成', '2024-03-07'),
(11, 8, 1, 2, 17998, '已完成', '2024-03-02'),
(12, 8, 4, 1, 1899, '已完成', '2024-03-09'),
(13, 9, 10, 1, 6799, '已发货', '2024-03-03'),
(14, 10, 15, 1, 1588, '已完成', '2024-03-05'),
(15, 1, 7, 1, 9499, '已完成', '2024-03-12'),
(16, 3, 13, 2, 1398, '已完成', '2024-03-11'),
(17, 5, 2, 1, 3999, '已发货', '2024-03-13'),
(18, 7, 6, 1, 999, '已完成', '2024-03-14'),
(19, 9, 12, 1, 2299, '已完成', '2024-03-08'),
(20, 2, 14, 1, 6299, '已完成', '2024-03-15');
`;

// 每张表的元数据，用于数据预览
export const TABLE_METADATA = {
  products: {
    label: '商品表 (products)',
    description: '平台所有在售商品信息',
    icon: '📦',
    columns: [
      { name: 'id', type: 'INTEGER', desc: '商品ID' },
      { name: 'name', type: 'TEXT', desc: '商品名称' },
      { name: 'category', type: 'TEXT', desc: '商品类目' },
      { name: 'price', type: 'REAL', desc: '售价（元）' },
      { name: 'stock', type: 'INTEGER', desc: '库存数量' },
      { name: 'sales_count', type: 'INTEGER', desc: '累计销量' },
      { name: 'created_at', type: 'TEXT', desc: '上架日期' },
    ],
  },
  users: {
    label: '用户表 (users)',
    description: '平台注册用户信息',
    icon: '👥',
    columns: [
      { name: 'id', type: 'INTEGER', desc: '用户ID' },
      { name: 'name', type: 'TEXT', desc: '用户昵称' },
      { name: 'city', type: 'TEXT', desc: '所在城市' },
      { name: 'level', type: 'TEXT', desc: '会员等级' },
      { name: 'register_date', type: 'TEXT', desc: '注册日期' },
    ],
  },
  orders: {
    label: '订单表 (orders)',
    description: '所有用户订单记录',
    icon: '🧾',
    columns: [
      { name: 'id', type: 'INTEGER', desc: '订单ID' },
      { name: 'user_id', type: 'INTEGER', desc: '用户ID（关联users）' },
      { name: 'product_id', type: 'INTEGER', desc: '商品ID（关联products）' },
      { name: 'quantity', type: 'INTEGER', desc: '购买数量' },
      { name: 'total_amount', type: 'REAL', desc: '订单金额（元）' },
      { name: 'status', type: 'TEXT', desc: '订单状态' },
      { name: 'created_at', type: 'TEXT', desc: '下单时间' },
    ],
  },
};
