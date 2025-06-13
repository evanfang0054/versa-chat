import { ReactNode } from 'react';
import { PubSub } from '@versa-chat/utils';

export enum MessageSender {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
}

export interface MessageBase {
  id: string;
  type: string;
  loading?: boolean;
  sender: MessageSender;
  timestamp: Date;
}

export interface TextMessage extends MessageBase {
  type: 'text';
  content: string;
}

export interface PluginMessage<T = any> extends MessageBase {
  type: string;
  content: T;
}

export type ChatMessage = TextMessage | PluginMessage;

export interface MessagePlugin {
  type: string;
  render: (
    message: PluginMessage,
    globalData: Record<string, any>,
    context: {
      prevMessages: MessageBase[];
      nextMessages: MessageBase[];
    },
    pubsub: PubSub
  ) => ReactNode;
  match?: (message: PluginMessage) => boolean;
}

export interface MessageRole<T extends ChatMessage = ChatMessage> {
  /** 自定义渲染消息头部 */
  renderHeader?: (
    message: T,
    globalData: Record<string, any>,
    context: {
      prevMessages: MessageBase[];
      nextMessages: MessageBase[];
    },
    pubsub: PubSub
  ) => ReactNode;
  /** 自定义渲染消息底部 */
  renderFooter?: (
    message: T,
    globalData: Record<string, any>,
    context: {
      prevMessages: MessageBase[];
      nextMessages: MessageBase[];
    },
    pubsub: PubSub
  ) => ReactNode;
  /** 自定义loading状态渲染 */
  renderLoading?: (
    message: T,
    globalData: Record<string, any>,
    context: {
      prevMessages: MessageBase[];
      nextMessages: MessageBase[];
    },
    pubsub: PubSub
  ) => ReactNode;
  loading?: (
    message: T,
    globalData: Record<string, any>,
    context: {
      prevMessages: MessageBase[];
      nextMessages: MessageBase[];
    },
    pubsub: PubSub
  ) => boolean;
  /** 消息容器样式类名 */
  className?: string;
  /** 消息容器样式 */
  style?: React.CSSProperties;
}

export interface ChatProps {
  globalData?: Record<string, any>;
  messages: ChatMessage[];
  plugins?: MessagePlugin[];
  /** 消息角色配置 */
  roles?: Partial<Record<MessageSender, MessageRole>>;
  className?: string;
}
