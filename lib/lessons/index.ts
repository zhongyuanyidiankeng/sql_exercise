// lib/lessons/index.ts
// 电商运营 SQL 课程体系

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags: string[];
  knowledge: {
    title: string;
    explanation: string;
    syntax: string;
    example: {
      description: string;
      sql: string;
    };
    tips: string[];
  };
  exercise: {
    scenario: string;         // 业务背景描述
    question: string;         // 具体问题
    hints: string[];          // 逐步提示
    answerSql: string;        // 参考答案
    validateMode: 'exact' | 'result'; // exact=完全匹配，result=结果匹配
    successMessage: string;
    failMessage: string;
  };
  tables: string[];           // 本课用到的表
}

export const LESSONS: Lesson[] = [
  {
    id: 'L01',
    title: '查看商品数据',
    subtitle: 'SELECT 基础查询',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    tags: ['SELECT', 'FROM', '基础'],
    knowledge: {
      title: 'SELECT — 指定你想看的列',
      explanation: `SELECT 是 SQL 最基础的命令，就像在 Excel 里选择要看哪些列。\n\n运营场景中，我们经常需要从商品表里看某几个字段，比如名称、价格、库存，而不需要看全部数据。`,
      syntax: `SELECT 列名1, 列名2, ...
FROM 表名;

-- 查看所有列用 *
SELECT * FROM 表名;`,
      example: {
        description: '查看所有商品的名称和价格',
        sql: `SELECT name, price
FROM products;`,
      },
      tips: [
        'SELECT * 会返回全部列，数据量大时尽量指定具体列名',
        'SQL 关键词不区分大小写，但约定俗成用大写',
        '多个列名之间用英文逗号隔开',
      ],
    },
    exercise: {
      scenario: '🛒 你是某电商平台的运营，老板让你整理一份商品库存清单，只需要看商品名称、价格和库存数量。',
      question: '请写 SQL 查询 products 表中所有商品的 name（名称）、price（价格）、stock（库存）三列。',
      hints: [
        '使用 SELECT 关键词，后面跟列名',
        '多个列名用逗号分隔：name, price, stock',
        '用 FROM products 指定数据来自 products 表',
      ],
      answerSql: `SELECT name, price, stock
FROM products;`,
      validateMode: 'result',
      successMessage: '✅ 完美！你已经能独立查询商品数据了，这是运营工作的第一步！',
      failMessage: '❌ 再检查一下，确认列名是 name、price、stock，表名是 products',
    },
    tables: ['products'],
  },
  {
    id: 'L02',
    title: '筛选特定商品',
    subtitle: 'WHERE 条件过滤',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    tags: ['WHERE', '条件', '筛选'],
    knowledge: {
      title: 'WHERE — 只看满足条件的数据',
      explanation: `WHERE 就像 Excel 的筛选功能，帮你过滤掉不需要的数据行。\n\n运营中常见场景：找出库存不足的商品、价格区间筛选、特定类目的商品等。`,
      syntax: `SELECT 列名
FROM 表名
WHERE 条件;

-- 常用条件运算符
-- =  等于    >  大于    <  小于
-- >= 大于等于  <= 小于等于  != 不等于
-- AND 同时满足  OR 满足其一`,
      example: {
        description: '找出价格超过 100 元的商品',
        sql: `SELECT name, price, stock
FROM products
WHERE price > 100;`,
      },
      tips: [
        "文本类型的值要用单引号：WHERE category = '手机'",
        'AND 可以组合多个条件，所有条件都要满足',
        'OR 表示满足任一条件即可',
      ],
    },
    exercise: {
      scenario: '📦 库存预警！仓库发来通知，需要你找出所有库存少于 20 件的商品，方便采购部门及时补货。',
      question: "查询 products 表中库存（stock）小于 20 的商品，展示 name、price、stock 三列。",
      hints: [
        '在 SELECT 和 FROM 之后，加上 WHERE 子句',
        '库存列名是 stock，小于用 < 符号',
        'WHERE stock < 20',
      ],
      answerSql: `SELECT name, price, stock
FROM products
WHERE stock < 20;`,
      validateMode: 'result',
      successMessage: '✅ 太棒了！找到了所有需要补货的商品，运营能力 +1！',
      failMessage: '❌ 注意 WHERE 语法，检查列名 stock 和条件 < 20',
    },
    tables: ['products'],
  },
  {
    id: 'L03',
    title: '销量排行榜',
    subtitle: 'ORDER BY 排序',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    tags: ['ORDER BY', '排序', 'DESC'],
    knowledge: {
      title: 'ORDER BY — 按指定列排序',
      explanation: `ORDER BY 让查询结果按某列升序或降序排列。\n\n运营场景：做爆款榜单、找滞销商品、价格排序等，都需要排序功能。`,
      syntax: `SELECT 列名
FROM 表名
ORDER BY 列名 DESC;  -- 降序（从大到小）

ORDER BY 列名 ASC;   -- 升序（从小到大，默认）`,
      example: {
        description: '查看销量最高的商品排名',
        sql: `SELECT name, price, sales_count
FROM products
ORDER BY sales_count DESC;`,
      },
      tips: [
        'DESC = Descending 降序，ASC = Ascending 升序',
        '不写 DESC/ASC 默认是升序',
        '可以同时按多列排序：ORDER BY sales_count DESC, price ASC',
      ],
    },
    exercise: {
      scenario: '📊 月度复盘会议要开始了，你需要准备一份商品销量排行榜，从销量最高到最低展示，帮老板做决策。',
      question: '查询 products 表所有商品的 name、price、sales_count，按销量（sales_count）从高到低排序。',
      hints: [
        '先写 SELECT name, price, sales_count FROM products',
        '然后加 ORDER BY sales_count',
        '降序要加 DESC 关键词',
      ],
      answerSql: `SELECT name, price, sales_count
FROM products
ORDER BY sales_count DESC;`,
      validateMode: 'result',
      successMessage: '✅ 排行榜制作完成！你的数据汇报能力又提升了一步！',
      failMessage: '❌ 检查一下 ORDER BY 的列名和排序方向 DESC',
    },
    tables: ['products'],
  },
  {
    id: 'L04',
    title: 'TOP 10 爆款',
    subtitle: 'LIMIT 限制返回行数',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    tags: ['LIMIT', 'TOP', '分页'],
    knowledge: {
      title: 'LIMIT — 只取前 N 条记录',
      explanation: `LIMIT 限制返回的数据行数，配合 ORDER BY 可以很方便地取 TOP N。\n\n电商常用场景：TOP10 爆款、最近 5 条订单、前 20 名用户等。`,
      syntax: `SELECT 列名
FROM 表名
ORDER BY 列名 DESC
LIMIT N;  -- 只返回前 N 行`,
      example: {
        description: '查看销量 TOP 5 的商品',
        sql: `SELECT name, sales_count
FROM products
ORDER BY sales_count DESC
LIMIT 5;`,
      },
      tips: [
        'LIMIT 必须放在 SQL 最后面',
        '和 ORDER BY 配合使用才有意义',
        'LIMIT 10 OFFSET 10 可以实现翻页（跳过前10条，取下10条）',
      ],
    },
    exercise: {
      scenario: '🔥 双十一活动策划，你需要找出平台销量 TOP 10 的爆款商品，给它们重点推广资源位。',
      question: '查询 products 表中销量（sales_count）最高的 10 款商品，展示 name、category、price、sales_count。',
      hints: [
        '先用 ORDER BY sales_count DESC 做降序排序',
        '最后加 LIMIT 10 限制只返回10条',
      ],
      answerSql: `SELECT name, category, price, sales_count
FROM products
ORDER BY sales_count DESC
LIMIT 10;`,
      validateMode: 'result',
      successMessage: '✅ 爆款清单已出炉！双十一资源位安排上！',
      failMessage: '❌ 注意 LIMIT 要放在 ORDER BY 后面',
    },
    tables: ['products'],
  },
  {
    id: 'L05',
    title: '销售额统计',
    subtitle: '聚合函数 COUNT / SUM / AVG',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    tags: ['COUNT', 'SUM', 'AVG', '聚合'],
    knowledge: {
      title: '聚合函数 — 对数据做统计计算',
      explanation: `聚合函数可以对一列数据做统计，是运营数据分析的核心技能。\n\n常用的四个：\n- COUNT：计数（有多少条）\n- SUM：求和（总金额）\n- AVG：平均值（客单价）\n- MAX/MIN：最大/最小值`,
      syntax: `SELECT 
  COUNT(*) AS 订单总数,
  SUM(total_amount) AS 总销售额,
  AVG(total_amount) AS 平均客单价,
  MAX(total_amount) AS 最大订单
FROM orders;`,
      example: {
        description: '统计订单总数和总销售额',
        sql: `SELECT 
  COUNT(*) AS order_count,
  SUM(total_amount) AS total_revenue,
  AVG(total_amount) AS avg_order_value
FROM orders;`,
      },
      tips: [
        'AS 关键词可以给列起别名，让结果更易读',
        'COUNT(*) 统计行数，COUNT(列名) 会忽略 NULL 值',
        '聚合函数不能和普通列直接混用（要配合 GROUP BY）',
      ],
    },
    exercise: {
      scenario: '📈 月度数据汇报，老板需要知道本月订单总量、总销售额和平均客单价，请你从 orders 表查出来。',
      question: '从 orders 表中，统计：订单总数（命名为 order_count）、总销售额（命名为 total_revenue）、平均客单价（命名为 avg_order_value）。',
      hints: [
        '用 COUNT(*) 统计订单数，AS order_count 起别名',
        '用 SUM(total_amount) 计算总销售额',
        '用 AVG(total_amount) 计算平均值',
      ],
      answerSql: `SELECT 
  COUNT(*) AS order_count,
  SUM(total_amount) AS total_revenue,
  AVG(total_amount) AS avg_order_value
FROM orders;`,
      validateMode: 'result',
      successMessage: '✅ 月度数据汇报完成！老板看了很满意！',
      failMessage: '❌ 检查聚合函数的写法和别名是否正确',
    },
    tables: ['orders'],
  },
  {
    id: 'L06',
    title: '各类目销售对比',
    subtitle: 'GROUP BY 分组统计',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    tags: ['GROUP BY', '分组', '聚合'],
    knowledge: {
      title: 'GROUP BY — 按类别分组统计',
      explanation: `GROUP BY 就像 Excel 数据透视表，把数据按某个维度分组，再对每组做聚合计算。\n\n这是运营分析最常用的功能：各类目销售额、各城市用户数、各渠道转化率等。`,
      syntax: `SELECT 分组列, 聚合函数(...)
FROM 表名
GROUP BY 分组列;`,
      example: {
        description: '统计各商品类目的商品数量和平均价格',
        sql: `SELECT 
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price,
  SUM(sales_count) AS total_sales
FROM products
GROUP BY category;`,
      },
      tips: [
        'SELECT 里的非聚合列，必须出现在 GROUP BY 里',
        '可以按多列分组：GROUP BY category, status',
        'GROUP BY 通常和聚合函数一起使用',
      ],
    },
    exercise: {
      scenario: '🗂️ 季度品类复盘，你需要统计每个商品类目下的商品数量、总销量和平均售价，找出哪个类目最有潜力。',
      question: '从 products 表按类目（category）分组，统计每个类目的商品数量（product_count）、总销量（total_sales）、平均价格（avg_price）。',
      hints: [
        '先 SELECT category 和三个聚合函数',
        '用 FROM products',
        '最后加 GROUP BY category',
      ],
      answerSql: `SELECT 
  category,
  COUNT(*) AS product_count,
  SUM(sales_count) AS total_sales,
  AVG(price) AS avg_price
FROM products
GROUP BY category;`,
      validateMode: 'result',
      successMessage: '✅ 品类数据一目了然！你的分析能力已经超过 80% 的运营新手！',
      failMessage: '❌ 注意 GROUP BY 后面要写分组的列名 category',
    },
    tables: ['products'],
  },
  {
    id: 'L07',
    title: '找出高价值类目',
    subtitle: 'HAVING 过滤分组结果',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    tags: ['HAVING', 'GROUP BY', '过滤'],
    knowledge: {
      title: 'HAVING — 对分组结果再过滤',
      explanation: `WHERE 过滤行，HAVING 过滤分组后的结果。\n\n场景：找出总销售额超过 10 万的类目、订单数大于 100 的商品等。`,
      syntax: `SELECT 分组列, SUM(列) AS 别名
FROM 表名
GROUP BY 分组列
HAVING SUM(列) > 条件值;

-- 执行顺序：WHERE → GROUP BY → HAVING`,
      example: {
        description: '找出总销量超过 1000 的商品类目',
        sql: `SELECT 
  category,
  SUM(sales_count) AS total_sales
FROM products
GROUP BY category
HAVING SUM(sales_count) > 1000;`,
      },
      tips: [
        'HAVING 在 GROUP BY 之后执行，WHERE 在 GROUP BY 之前',
        'HAVING 里可以用聚合函数，WHERE 里不行',
        '能用 WHERE 的尽量用 WHERE，性能更好',
      ],
    },
    exercise: {
      scenario: '💰 资源集中投入！你需要找出总销量超过 500 件的优势类目，把有限的推广预算重点投放在这些类目。',
      question: '从 products 表中，找出总销量（SUM of sales_count）超过 500 的商品类目，展示类目名和总销量。',
      hints: [
        '先 GROUP BY category 做分组统计',
        '用 HAVING SUM(sales_count) > 500 过滤',
      ],
      answerSql: `SELECT 
  category,
  SUM(sales_count) AS total_sales
FROM products
GROUP BY category
HAVING SUM(sales_count) > 500;`,
      validateMode: 'result',
      successMessage: '✅ 优质类目已找到！精准投放，效果翻倍！',
      failMessage: '❌ 记住过滤分组结果要用 HAVING，不是 WHERE',
    },
    tables: ['products'],
  },
  {
    id: 'L08',
    title: '订单用户关联分析',
    subtitle: 'JOIN 多表关联',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    tags: ['JOIN', 'INNER JOIN', '多表'],
    knowledge: {
      title: 'JOIN — 把多张表关联在一起',
      explanation: `真实业务数据分散在多张表里，JOIN 就像把两张 Excel 表按相同的 ID 列合并。\n\n最常用的是 INNER JOIN（内连接）：只返回两张表都有匹配的行。`,
      syntax: `SELECT a.列名, b.列名
FROM 表A a
INNER JOIN 表B b ON a.关联列 = b.关联列;

-- a、b 是表的别名，让 SQL 更简洁`,
      example: {
        description: '关联订单和用户，看每笔订单是谁下的',
        sql: `SELECT 
  o.id AS order_id,
  u.name AS user_name,
  u.city,
  o.total_amount
FROM orders o
INNER JOIN users u ON o.user_id = u.id;`,
      },
      tips: [
        'ON 后面写两表的关联条件，通常是外键=主键',
        '用表别名（a, b 或有意义的缩写）让 SQL 更清晰',
        '同名列前要加表名/别名区分：o.id 而不是 id',
      ],
    },
    exercise: {
      scenario: '👥 用户画像分析，你要了解各个城市的用户下单情况，需要把订单表和用户表关联起来，看每笔订单来自哪个城市。',
      question: '关联 orders 表和 users 表，查询订单ID（o.id）、用户名（u.name）、城市（u.city）、订单金额（o.total_amount）。',
      hints: [
        '用 FROM orders o 给 orders 起别名 o',
        '用 INNER JOIN users u ON o.user_id = u.id 关联',
        'SELECT 里用 o.id, u.name, u.city, o.total_amount',
      ],
      answerSql: `SELECT 
  o.id AS order_id,
  u.name AS user_name,
  u.city,
  o.total_amount
FROM orders o
INNER JOIN users u ON o.user_id = u.id;`,
      validateMode: 'result',
      successMessage: '✅ 多表关联成功！你已经掌握了中级 SQL 技能，真正的数据分析才刚开始！',
      failMessage: '❌ 检查 JOIN 的语法和 ON 后面的关联条件',
    },
    tables: ['orders', 'users'],
  },
  {
    id: 'L09',
    title: '复购用户分析',
    subtitle: '子查询',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    tags: ['子查询', 'IN', '嵌套'],
    knowledge: {
      title: '子查询 — 在查询里嵌套查询',
      explanation: `子查询就是把一个 SELECT 结果作为另一个查询的条件。\n\n业务场景：找出买过某商品的用户、复购率分析、交叉销售分析。`,
      syntax: `-- 用子查询结果作为 WHERE 条件
SELECT * FROM 表A
WHERE 列名 IN (
  SELECT 列名 FROM 表B WHERE 条件
);`,
      example: {
        description: '找出下过多于 1 次订单的复购用户',
        sql: `SELECT name, city, level
FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING COUNT(*) > 1
);`,
      },
      tips: [
        '子查询用括号包裹，放在 WHERE 条件里',
        'IN 表示"在这个列表中"',
        '子查询可以多层嵌套，但一般不超过 3 层',
      ],
    },
    exercise: {
      scenario: '🔄 复购促活专项，你需要找出在平台下过超过 1 次订单的用户，对他们发送专属优惠券，提升复购率。',
      question: '从 users 表中，找出在 orders 表中有超过 1 条订单记录的用户，展示用户 name、city、level。',
      hints: [
        '先写子查询：从 orders 表按 user_id 分组，找出 COUNT(*) > 1 的 user_id',
        '再用 WHERE id IN (...) 筛选 users 表',
      ],
      answerSql: `SELECT name, city, level
FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING COUNT(*) > 1
);`,
      validateMode: 'result',
      successMessage: '✅ 复购用户名单已生成！精准营销，提升 LTV！',
      failMessage: '❌ 检查子查询的结构，确保 HAVING COUNT(*) > 1 的位置正确',
    },
    tables: ['orders', 'users'],
  },
  {
    id: 'L10',
    title: '运营周报完整分析',
    subtitle: '综合案例',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    tags: ['综合', '实战', '周报'],
    knowledge: {
      title: '综合实战 — 用 SQL 生成运营周报',
      explanation: `这是一个综合运用所有知识点的实战案例。\n\n真实工作中，运营周报通常包含：本周订单量、GMV、客单价、TOP商品、各类目表现等关键指标。`,
      syntax: `-- 组合运用所有技能
SELECT 
  p.category,
  COUNT(o.id) AS order_count,
  SUM(o.total_amount) AS gmv,
  AVG(o.total_amount) AS avg_order_value
FROM orders o
INNER JOIN products p ON o.product_id = p.id
GROUP BY p.category
HAVING COUNT(o.id) > 5
ORDER BY gmv DESC;`,
      example: {
        description: '按类目统计本周 GMV 和订单量',
        sql: `SELECT 
  p.category,
  COUNT(o.id) AS order_count,
  SUM(o.total_amount) AS gmv,
  AVG(o.total_amount) AS avg_order_value
FROM orders o
INNER JOIN products p ON o.product_id = p.id
GROUP BY p.category
ORDER BY gmv DESC;`,
      },
      tips: [
        '复杂查询建议先想清楚逻辑，再一步步写',
        '可以先测试子查询，再组合',
        '给每列加清晰的别名，让结果易读',
      ],
    },
    exercise: {
      scenario: '📋 本周运营周报需要你完成！要求：关联订单表和商品表，按商品类目统计 GMV（总销售额）和订单数量，按 GMV 从高到低排序，找出表现最好的类目。',
      question: '关联 orders 和 products 表，按 category 分组，统计每个类目的 order_count（订单数）和 gmv（销售额），按 gmv 降序排列。',
      hints: [
        'FROM orders o INNER JOIN products p ON o.product_id = p.id',
        'GROUP BY p.category',
        'SELECT p.category, COUNT(o.id), SUM(o.total_amount)',
        '最后 ORDER BY gmv DESC',
      ],
      answerSql: `SELECT 
  p.category,
  COUNT(o.id) AS order_count,
  SUM(o.total_amount) AS gmv
FROM orders o
INNER JOIN products p ON o.product_id = p.id
GROUP BY p.category
ORDER BY gmv DESC;`,
      validateMode: 'result',
      successMessage: '🎉 恭喜！你已完成全部课程！从零基础到能独立产出运营数据报告，你已经掌握了电商运营所需的核心 SQL 技能！',
      failMessage: '❌ 综合题需要结合 JOIN + GROUP BY + ORDER BY，检查每个部分的语法',
    },
    tables: ['orders', 'products'],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find(l => l.id === id);
}

export const DIFFICULTY_LABEL = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export const DIFFICULTY_COLOR = {
  beginner: 'text-accent2 bg-accent2/10',
  intermediate: 'text-accent bg-accent/10',
  advanced: 'text-ink/70 bg-ink/5',
};
