<component-parts file-path="packages/ui/src/components/chat">
    <component-name>
        Versa Chat
    </component-name>
    <component-description>
        一个高度可定制的聊天组件，支持虚拟滚动、插件扩展和角色自定义。适用于需要展示聊天消息、支持多种消息类型和自定义样式的场景。

        核心特性：
        - 基于react-virtuoso的虚拟滚动，支持大量消息高效渲染
        - 插件系统可扩展支持多种消息类型
        - 角色系统可自定义不同发送者的消息样式和行为
        - 全局数据传递机制
        - 自动滚动到底部功能
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | messages | ChatMessage[] | 聊天消息数组 | - | v1.0 |
        | plugins | MessagePlugin[] | 自定义消息插件 | [] | v1.0 |
        | globalData | Record<string, any> | 全局数据，可在所有渲染回调中访问 | {} | v1.0 |
        | roles | Partial<Record<MessageSender, MessageRole>> | 消息角色配置 | - | v1.0 |
        | className | string | 自定义类名 | '' | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | MessageSender | enum { User = 'user', System = 'system', Assistant = 'assistant' } | 是 | - | 消息发送者枚举 |
        | MessageBase | interface { id: string; type: string; loading?: boolean; sender: MessageSender; timestamp: Date; } | 是 | - | 基础消息接口 |
        | TextMessage | extends MessageBase { type: 'text'; content: string; } | 是 | - | 文本消息类型 |
        | PluginMessage | extends MessageBase { type: string; content: T; } | 是 | - | 插件消息类型 |
        | ChatMessage | TextMessage \| PluginMessage | 是 | - | 聊天消息联合类型 |
        | MessagePlugin | interface { type: string; render: (message, globalData, context, pubsub) => ReactNode; match?: (message) => boolean; } | 是 | - | 消息插件定义 |
        | MessageRole | interface { renderHeader?: (message, globalData, context, pubsub) => ReactNode; renderFooter?: (message, globalData, context, pubsub) => ReactNode; renderLoading?: (message, globalData, context, pubsub) => ReactNode; loading?: (message, globalData, context, pubsub) => boolean; className?: string; style?: React.CSSProperties; } | 否 | - | 消息角色定义 |
    </component-type-description>
 </component-parts>