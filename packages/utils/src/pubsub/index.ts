/**
 * Handler 类型定义，表示用于处理发布消息的回调函数。
 *
 * @template T - 发布消息的数据类型
 * @param data - 发布的消息数据
 * @returns 可选的 Promise<void>，若处理函数为异步则返回 Promise
 */
export type Handler<T = any> = (data: T) => void | Promise<void>;

/**
 * PubSub - 企业级发布订阅（Publish-Subscribe）管理器
 *
 * 实现了同步/异步事件发布、一致性订阅、一次性订阅、主题管理等功能。
 * 采用单例模式设计，确保全局只有一个发布订阅实例，避免重复创建。
 * 适用于复杂业务场景下的事件解耦和消息分发。
 *
 * @example
 * ```ts
 * // 方式1：直接使用导出的单例实例（推荐）
 * import { pubsub } from '@versa-chat/utils';
 *
 * // 订阅主题
 * const unsubscribe = pubsub.subscribe<string>('chat', (msg) => {
 *   console.log('收到消息：', msg);
 * });
 *
 * // 发布同步消息
 * pubsub.publish('chat', 'Hello');
 *
 * // 发布异步消息
 * await pubsub.publishAsync('chat', 'Async Hello');
 *
 * // 取消订阅
 * unsubscribe();
 *
 * // 方式2：通过 getInstance 获取实例（与方式1获取的是同一个实例）
 * import { PubSub } from '@versa-chat/utils';
 * const pubsubInstance = PubSub.getInstance();
 * ```
 */
export class PubSub {
  /**
   * 单例实例
   */
  private static instance: PubSub | null = null;

  /**
   * 内部维护的订阅者列表
   * 键为主题名称，值为处理该主题消息的回调函数集合
   */
  private subscriptions: Map<string, Set<Handler>>;

  /**
   * 私有构造函数 - 初始化订阅者列表
   */
  private constructor() {
    this.subscriptions = new Map();
  }

  /**
   * 获取 PubSub 单例实例
   * @returns PubSub 实例
   */
  public static getInstance(): PubSub {
    if (!PubSub.instance) {
      PubSub.instance = new PubSub();
    }
    return PubSub.instance;
  }

  /**
   * 订阅指定主题，返回取消订阅的函数
   *
   * @typeParam T - 订阅消息的数据类型
   * @param topic - 主题名称
   * @param handler - 处理消息的回调函数
   * @returns 用于取消订阅的函数
   */
  subscribe<T>(topic: string, handler: Handler<T>): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    const handlers = this.subscriptions.get(topic)!;
    handlers.add(handler as Handler);
    return () => {
      handlers.delete(handler as Handler);
      if (handlers.size === 0) {
        this.subscriptions.delete(topic);
      }
    };
  }

  /**
   * 对指定主题进行一次性订阅，只接收首次发布的消息，之后自动取消
   *
   * @typeParam T - 订阅消息的数据类型
   * @param topic - 主题名称
   * @param handler - 处理消息的回调函数
   * @returns 用于取消订阅的函数
   */
  subscribeOnce<T>(topic: string, handler: Handler<T>): () => void {
    // eslint-disable-next-line prefer-const
    let unsubscribe: () => void;
    const onceHandler: Handler<T> = async (data) => {
      await handler(data);
      unsubscribe();
    };
    unsubscribe = this.subscribe(topic, onceHandler);
    return unsubscribe;
  }

  /**
   * 同步发布消息到指定主题
   *
   * @typeParam T - 发布消息的数据类型
   * @param topic - 主题名称
   * @param data - 发布的消息数据
   */
  publish<T>(topic: string, data: T): void {
    const handlers = this.subscriptions.get(topic);
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`Error in handler for topic "${topic}":`, err);
      }
    });
  }

  /**
   * 异步发布消息到指定主题，等待所有异步处理完成
   *
   * @typeParam T - 发布消息的数据类型
   * @param topic - 主题名称
   * @param data - 发布的消息数据
   * @returns Promise<void> - 所有异步回调执行完成后的 Promise
   */
  async publishAsync<T>(topic: string, data: T): Promise<void> {
    const handlers = this.subscriptions.get(topic);
    if (!handlers) return;

    const promises: Promise<void>[] = [];
    handlers.forEach((handler) => {
      try {
        const result = handler(data);
        if (result instanceof Promise) {
          promises.push(
            result.catch((err) => {
              console.error(`Async error in handler for topic "${topic}":`, err);
            })
          );
        }
      } catch (err) {
        console.error(`Error in handler for topic "${topic}":`, err);
      }
    });

    await Promise.all(promises);
  }

  /**
   * 清除指定主题或所有主题的订阅
   *
   * @param topic - 可选，主题名称。不传则清除所有主题的订阅
   */
  clear(topic?: string): void {
    if (topic) {
      this.subscriptions.delete(topic);
    } else {
      this.subscriptions.clear();
    }
  }

  /**
   * 获取当前已注册的所有主题列表
   *
   * @returns 主题名称数组
   */
  getTopics(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * 获取指定主题的订阅者数量
   *
   * @param topic - 主题名称
   * @returns 订阅者数量
   */
  countSubscribers(topic: string): number {
    const handlers = this.subscriptions.get(topic);
    return handlers ? handlers.size : 0;
  }

  /**
   * 检查指定主题是否存在订阅者
   *
   * @param topic - 主题名称
   * @returns 是否存在订阅者，true 表示存在，false 表示不存在
   */
  hasSubscribers(topic: string): boolean {
    return this.subscriptions.has(topic);
  }
}

// 导出单例实例
export const pubsub = PubSub.getInstance();
