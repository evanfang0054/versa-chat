# @versa-chat/utils

Monorepo 公共工具库，提供项目中通用的工具函数和工具类。

## 安装

```bash
pnpm add @versa-chat/utils
```

## 功能

- 通用工具函数
- 数据处理工具
- 类型检查工具
- 日期时间处理工具

## 使用示例

```typescript
import { formatDate, deepClone } from '@versa-chat/utils';

// 使用日期格式化工具
const today = formatDate(new Date(), 'YYYY-MM-DD');

// 使用深拷贝工具
const obj = { a: 1, b: { c: 2 } };
const clonedObj = deepClone(obj);
```

## API 文档

### 日期时间工具

- `formatDate(date: Date, format: string): string` - 格式化日期
- `getDayDiff(start: Date, end: Date): number` - 计算日期差

### 数据处理工具

- `deepClone<T>(obj: T): T` - 深拷贝对象
- `mergeObjects(...objects: object[]): object` - 合并多个对象

### 类型检查工具

- `isPlainObject(obj: any): boolean` - 检查是否为纯对象
- `isFunction(obj: any): boolean` - 检查是否为函数

## 开发指南

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 开发模式：
   ```bash
   pnpm run dev
   ```

3. 构建：
   ```bash
   pnpm run build
   ```
   