# Versa Chat 组件

一个高度可定制的聊天组件，支持虚拟滚动、插件扩展和角色自定义。

## 1. 文件结构

```
packages/ui/src/components/chat/
├── index.ts               # 导出所有公共API
├── interface.ts           # 类型定义
├── Chat.tsx               # 主组件 
├── components/            # 组件目录
│   └── MessageItem/       # 消息项组件
│       ├── index.tsx      # 消息项实现
│       └── interface.ts   # 消息项类型定义
├── plugins/               # 插件系统
│   ├── BaseMessage.tsx    # 基础消息容器组件
│   ├── TextMessage.tsx    # 文本消息插件
│   ├── IframeMessage.tsx  # iframe消息插件
│   └── index.tsx          # 插件注册系统
├── utils/                 # 工具函数
│   ├── context.ts         # 上下文相关工具
│   └── helpers.ts         # 辅助函数
└── hooks/                 # 钩子函数
    └── useAutoScroll.ts   # 自动滚动钩子
```

## 2. 核心接口定义

### 消息类型

```typescript
// 消息发送者枚举
export enum MessageSender {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
}

// 基础消息接口
export interface MessageBase {
  id: string;
  type: string;
  loading?: boolean;
  sender: MessageSender;
  timestamp: Date;
}

// 文本消息
export interface TextMessage extends MessageBase {
  type: 'text';
  content: string;
}

// 插件消息
export interface PluginMessage<T = any> extends MessageBase {
  type: string;
  content: T;
}

// 聊天消息类型
export type ChatMessage = TextMessage | PluginMessage;
```

### 插件系统和角色

```typescript
// 消息插件定义
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

// 消息角色定义 - 用于自定义不同角色的消息样式和行为
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

// 主组件属性
export interface ChatProps {
  globalData?: Record<string, any>;
  messages: ChatMessage[];
  plugins?: MessagePlugin[];
  /** 消息角色配置 */
  roles?: Partial<Record<MessageSender, MessageRole>>;
  className?: string;
}
```

## 3. 基础消息组件

基础消息组件负责渲染消息气泡容器，可用于包装各类消息内容。

```typescript
// plugins/BaseMessage.tsx
import { FC } from 'react';
import { MessageBase } from '../interface';

interface BaseMessageProps {
  message: MessageBase;
  children: React.ReactNode;
}

export const BaseMessage: FC<BaseMessageProps> = ({ message, children }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-[80%] rounded-lg px-3 py-2 
        ${isUser 
          ? 'bg-blue-100 text-blue-900'
          : 'bg-blue-500 text-white'
        }`}>
        {children}
      </div>
    </div>
  );
};
```

## 4. 内置插件

### 4.1 文本消息插件

```typescript
// plugins/TextMessage.tsx
import { FC } from 'react';
import { BaseMessage } from './BaseMessage';
import { TextMessage as TextMessageType } from '../interface';

export const TextMessage: FC<{ message: TextMessageType }> = ({ message }) => {
  return <BaseMessage message={message}>{message.content}</BaseMessage>;
};
```

### 4.2 Iframe消息插件

```typescript
// plugins/IframeMessage.tsx
import React from 'react';
import { Card } from 'antd-mobile';
import { BaseMessage } from './BaseMessage';
import type { PluginMessage } from '../interface';

export interface IframeMessageProps {
  message: PluginMessage & {
    content?: {
      url?: string;
      height?: string;
      width?: string;
    };
  };
  className?: string;
}

export const IframeMessage: React.FC<IframeMessageProps> = ({ message, className = '' }) => {
  const { content = {} } = message;
  const { url, height = '300px', width = '100%' } = content;

  if (!url) {
    return (
      <BaseMessage message={message}>
        <Card className={`text-red-500 ${className}`}>无效的iframe链接</Card>
      </BaseMessage>
    );
  }

  return (
    <BaseMessage message={message}>
      <Card className={`rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={url}
          height={height}
          width={width}
          className="border-0 w-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allowFullScreen
          loading="lazy"
        />
      </Card>
    </BaseMessage>
  );
};
```

## 5. 插件注册系统

```typescript
// plugins/index.tsx
import React from 'react';
import type { MessagePlugin } from '../interface';
import { IframeMessage } from './IframeMessage';
import { TextMessage } from './TextMessage';
import type { PluginMessage, TextMessage as TextMessageType } from '../interface';

const textPlugin: MessagePlugin = {
  type: 'text',
  render: (message) => {
    const textMessage = message as unknown as TextMessageType;
    return <TextMessage message={textMessage} />;
  },
};

const iframePlugin: MessagePlugin = {
  type: 'iframe',
  render: (message) => {
    const pluginMessage = message as PluginMessage;
    return <IframeMessage message={pluginMessage} />;
  },
};

const builtInPlugins: MessagePlugin[] = [textPlugin, iframePlugin];

export function registerPlugins(customPlugins: MessagePlugin[] = []) {
  return [...builtInPlugins, ...customPlugins];
}
```

## 6. 辅助工具

### 6.1 获取消息插件

```typescript
// utils/helpers.ts
import { ChatMessage, MessagePlugin, PluginMessage } from '../interface';

export function getMessagePlugin(
  message: ChatMessage,
  plugins: MessagePlugin[]
): MessagePlugin | undefined {
  return plugins.find(
    (p) => p.type === message.type && (p.match ? p.match(message as PluginMessage) : true)
  );
}
```

### 6.2 获取消息上下文

```typescript
// utils/context.ts
import { type ChatMessage } from '../interface';

export function getMessageContext(messages: ChatMessage[], index: number) {
  return {
    prevMessages: messages.slice(0, index),
    nextMessages: messages.slice(index + 1),
  };
}
```

### 6.3 自动滚动钩子

```typescript
// hooks/useAutoScroll.ts
import { useEffect, useRef } from 'react';

export function useAutoScroll(deps: any[], index: number | 'LAST') {
  const virtuoso = useRef<any>(null);

  useEffect(() => {
    if (virtuoso.current) {
      virtuoso.current.scrollToIndex({
        index,
        align: 'end'
      });
    }
  }, deps);

  return virtuoso;
}
```

## 7. 消息项组件

```typescript
// components/MessageItem/index.tsx
import { memo, useMemo } from 'react';
import { DotLoading } from 'antd-mobile';
import { pubsub } from '@versa-chat/utils';
import { BaseMessage } from '../../plugins/BaseMessage';
import { getMessageContext } from '../../utils/context';
import { getMessagePlugin } from '../../utils/helpers';
import type { MessageItemProps } from './interface';

export const MessageItem = memo(function MessageItem({
  message,
  index,
  messages,
  globalData,
  roles,
  plugins,
}: MessageItemProps) {
  const context = useMemo(() => getMessageContext(messages, index), [messages, index]);
  const role = roles?.[message.sender];

  const isLoading = useMemo(
    () => role?.loading?.(message, globalData, context, pubsub) || false,
    [role, message, globalData, context]
  );

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        role?.renderLoading?.(message, globalData, context, pubsub) || (
          <BaseMessage message={message}>
            <DotLoading color="white" />
          </BaseMessage>
        )
      );
    }

    const plugin = getMessagePlugin(message, plugins) || {
      render: (message) => {
        return <BaseMessage message={message}>--查无此插件 {message.type} --</BaseMessage>;
      },
    };

    return (
      <>
        {role?.renderHeader?.(message, globalData, context, pubsub)}
        {plugin?.render(message as any, globalData, context, pubsub)}
        {role?.renderFooter?.(message, globalData, context, pubsub)}
      </>
    );
  }, [isLoading, message, globalData, context, role, plugins]);

  return (
    <div className="pt-2 pb-2 px-2 text-3xs relative cursor-pointer transition-all duration-300 hover:bg-black/[0.02] active:bg-black/[0.05] active:scale-[0.98] before:content-[''] before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-[0.02] active:before:opacity-[0.05]">
      {renderContent}
    </div>
  );
});
```

## 8. 主组件实现

```typescript
// Chat.tsx
import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { registerPlugins } from './plugins';
import { type ChatProps } from './interface';
import { useAutoScroll } from './hooks/useAutoScroll';
import { MessageItem } from './components/MessageItem';

export function Chat({
  messages,
  plugins = [],
  globalData = {},
  className = '',
  roles,
}: ChatProps) {
  const allPlugins = useMemo(() => registerPlugins(plugins), [plugins]);
  const virtuosoRef = useAutoScroll([messages], 'LAST');

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Virtuoso
        className="flex-1 overflow-x-hidden"
        ref={virtuosoRef}
        totalCount={messages.length}
        itemContent={(index) => {
          const msg = messages[index];
          return (
            <MessageItem
              key={msg.id}
              message={msg}
              index={index}
              messages={messages}
              globalData={globalData}
              roles={roles}
              plugins={allPlugins}
            />
          );
        }}
      />
    </div>
  );
}
```

## 9. 使用示例

### 9.1 基本用法

```tsx
import { Chat, ChatMessage, MessageSender } from '@versa-chat/ui';
import { pubsub } from '@versa-chat/utils';

function ChatExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'text',
      sender: MessageSender.User,
      content: '你好，我是用户',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'text',
      sender: MessageSender.Assistant,
      content: '你好，我是助手',
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="h-screen">
      <Chat messages={messages} />
    </div>
  );
}
```

### 9.2 自定义角色

```tsx
import { Chat, ChatMessage, MessageSender, MessageRole } from '@versa-chat/ui';
import { pubsub } from '@versa-chat/utils';

function ChatWithCustomRoles() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    /* 消息数据 */
  ]);

  // 自定义角色渲染
  const roles: Partial<Record<MessageSender, MessageRole>> = {
    [MessageSender.User]: {
      renderHeader: (message) => (
        <div className="text-right text-xs text-gray-500 mb-1">
          用户 · {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      ),
      className: 'user-message',
    },
    [MessageSender.Assistant]: {
      renderHeader: (message) => (
        <div className="text-left text-xs text-gray-500 mb-1">
          AI助手 · {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      ),
      renderLoading: (message) => (
        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
          <div>AI正在思考...</div>
          <div className="loading-dots">...</div>
        </div>
      ),
      loading: (message) => Boolean(message.loading),
    },
  };

  return <Chat messages={messages} roles={roles} />;
}
```

### 9.3 自定义消息插件

```tsx
import { 
  Chat, 
  MessagePlugin, 
  ChatMessage, 
  PluginMessage, 
  MessageSender
} from '@versa-chat/ui';
import { pubsub } from '@versa-chat/utils';
import { BaseMessage } from '@versa-chat/ui/components/chat/plugins/BaseMessage';

// 自定义图片消息插件
const ImageMessage = ({ message }) => {
  const { content } = message;
  return (
    <BaseMessage message={message}>
      <img 
        src={content.url} 
        alt={content.alt || '图片'} 
        className="max-w-full rounded" 
      />
    </BaseMessage>
  );
};

const imagePlugin: MessagePlugin = {
  type: 'image',
  render: (message, globalData, context) => {
    return <ImageMessage message={message} />;
  }
};

function ChatWithImagePlugin() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'text',
      sender: MessageSender.User,
      content: '发送一张图片',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'image',
      sender: MessageSender.Assistant,
      content: {
        url: 'https://example.com/image.jpg',
        alt: '示例图片'
      },
      timestamp: new Date(),
    }
  ]);

  return (
    <Chat 
      messages={messages} 
      plugins={[imagePlugin]}
    />
  );
}
```

### 9.4 带全局数据的聊天

```tsx
import { Chat, ChatMessage } from '@versa-chat/ui';

function ChatWithGlobalData() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    /* 消息数据 */
  ]);
  
  // 全局数据可以在所有消息渲染器和角色渲染器中访问
  const globalData = {
    theme: 'dark',
    userProfile: {
      name: '张三',
      avatar: 'https://example.com/avatar.jpg'
    },
    assistantProfile: {
      name: 'AI助手',
      avatar: 'https://example.com/bot.jpg'
    }
  };

  return (
    <Chat 
      messages={messages} 
      globalData={globalData}
    />
  );
}
```

## 10. API 参考

### 10.1 Chat 组件Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| messages | ChatMessage[] | 是 | - | 聊天消息数组 |
| plugins | MessagePlugin[] | 否 | [] | 自定义消息插件 |
| globalData | Record<string, any> | 否 | {} | 全局数据，可在所有渲染回调中访问 |
| roles | Partial<Record<MessageSender, MessageRole>> | 否 | - | 消息角色配置 |
| className | string | 否 | '' | 自定义类名 |

### 10.2 MessageRole 接口

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| renderHeader | (message, globalData, context, pubsub) => ReactNode | 否 | - | 渲染消息头部 |
| renderFooter | (message, globalData, context, pubsub) => ReactNode | 否 | - | 渲染消息底部 |
| renderLoading | (message, globalData, context, pubsub) => ReactNode | 否 | - | 渲染加载状态 |
| loading | (message, globalData, context, pubsub) => boolean | 否 | - | 判断是否处于加载状态 |
| className | string | 否 | - | 消息容器类名 |
| style | React.CSSProperties | 否 | - | 消息容器样式 |

### 10.3 MessagePlugin 接口

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| type | string | 是 | - | 插件类型，对应message.type |
| render | (message, globalData, context, pubsub) => ReactNode | 是 | - | 消息渲染函数 |
| match | (message) => boolean | 否 | - | 判断是否匹配消息 |

## 11. 注意事项

1. 该组件使用了虚拟滚动技术（react-virtuoso），适合渲染大量消息
2. 消息渲染完全可定制，可以通过角色系统和插件系统扩展
3. 组件本身不包含输入区域，需要自行实现或使用配套的输入组件
4. 全局数据（globalData）可以传递任何需要在渲染中使用的上下文数据
5. 自定义插件开发时注意性能优化，尤其是在渲染函数中使用记忆化（useMemo/memo）
6. 所有回调函数中都可以访问pubsub实例，用于组件间通信
7. useAutoScroll钩子现在支持'LAST'常量以自动滚动到最后一条消息
8. MessageItem组件现在增加了交互效果，包括悬停和点击状态