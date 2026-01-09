# PubSub (企业级发布-订阅模式)

## 介绍
PubSub 是一个轻量且功能全面的发布-订阅管理器，支持同步/异步事件发布、一致性订阅、一次性订阅、主题管理等功能。采用单例模式设计，确保全局只有一个发布订阅实例，非常适合企业级业务场景。

## 安装
在 monorepo 中直接引用：
```bash
pnpm add @versa-chat/utils -S
```

## 引入
```typescript
// 方式1：直接使用导出的单例实例（推荐）
import { pubsub } from '@versa-chat/utils/pubsub';

// 方式2：通过 getInstance 获取实例（与方式1获取的是同一个实例）
import { PubSub } from '@versa-chat/utils/pubsub';
const pubsubInstance = PubSub.getInstance();
```

## 使用示例
```typescript
// 推荐使用方式
import { pubsub } from '@versa-chat/utils/pubsub';

// 订阅主题
const unsubscribe = pubsub.subscribe<{ message: string }>('chat', (data) => {
  console.log('收到消息：', data.message);
});

// 发布消息（同步）
pubsub.publish('chat', { message: 'Hello World!' });

// 发布消息（异步）
await pubsub.publishAsync('chat', { message: 'Async Hello!' });

// 取消订阅
unsubscribe();
```

### 一次性订阅
```typescript
import { pubsub } from '@versa-chat/utils/pubsub';

pubsub.subscribeOnce<number>('onceTopic', (count) => {
  console.log('只接收一次：', count);
});

pubsub.publish('onceTopic', 1);
pubsub.publish('onceTopic', 2); // 不会触发处理
```

### 主题管理
```typescript
import { pubsub } from '@versa-chat/utils/pubsub';

// 获取所有主题
console.log(pubsub.getTopics()); // ['chat', 'onceTopic']

// 统计订阅者数量
console.log(pubsub.countSubscribers('chat')); // 0 或 正确数值

// 检查某主题是否存在订阅
console.log(pubsub.hasSubscribers('chat')); // true/false

// 清除单个主题订阅或全部订阅
pubsub.clear('chat');
pubsub.clear();
```

## API 文档

| 方法                          | 参数                                  | 返回值           | 描述                                        |
|-------------------------------|---------------------------------------|------------------|---------------------------------------------|
| `getInstance()`               | -                                     | `PubSub`         | 获取 PubSub 单例实例                        |
| `subscribe(topic, handler)`   | `topic: string`, `handler: Handler<T>`| `() => void`     | 订阅主题，返回取消订阅函数                  |
| `subscribeOnce(topic, handler)` | `topic: string`, `handler: Handler<T>`| `() => void`     | 只触发一次的订阅                            |
| `publish(topic, data)`        | `topic: string`, `data: T`            | `void`           | 同步发布消息                                |
| `publishAsync(topic, data)`   | `topic: string`, `data: T`            | `Promise<void>`  | 异步发布消息，等待所有异步订阅完成          |
| `clear(topic?)`               | `topic?: string`                      | `void`           | 清除单个主题订阅或所有主题订阅              |
| `getTopics()`                 | -                                     | `string[]`       | 获取当前所有主题列表                        |
| `countSubscribers(topic)`     | `topic: string`                       | `number`         | 获取指定主题订阅者数量                      |
| `hasSubscribers(topic)`       | `topic: string`                       | `boolean`        | 检查指定主题是否有订阅者                    |

## 类型定义
```typescript
export type Handler<T = any> = (data: T) => void | Promise<void>;
export class PubSub { 
  private constructor();
  public static getInstance(): PubSub;
  // ... 其他方法
}
export const pubsub: PubSub;
```

## 注意事项
- PubSub 采用单例模式，全局共享一个实例
- 推荐直接使用导出的 `pubsub` 实例
- `publish` 仅同步调用订阅者  
- `publishAsync` 会捕获并输出异步错误  
- 订阅回调请注意错误处理，避免阻塞主流程  
