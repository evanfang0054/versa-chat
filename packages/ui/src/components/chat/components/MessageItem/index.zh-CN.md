<component-parts file-path="packages/ui/src/components/chat/components/MessageItem">
    <component-name>
        MessageItem 消息项
    </component-name>
    <component-description>
        MessageItem 是聊天消息列表中的单项组件，负责渲染单条聊天消息内容。支持以下特性：
        
        - 根据消息类型自动选择对应的插件进行渲染
        - 支持消息加载状态显示（默认显示加载动画）
        - 支持通过角色(role)系统自定义消息头部、内容和尾部的渲染
        - 支持全局数据传递和上下文计算
        - 内置基础消息样式和交互效果
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | message | ChatMessage | 当前消息对象 | - | v1.0 |
        | index | number | 当前消息在列表中的索引 | - | v1.0 |
        | messages | ChatMessage[] | 消息列表 | - | v1.0 |
        | globalData | Record<string, any> | 全局共享数据 | - | v1.0 |
        | roles | Partial<Record<string, MessageRole>> | 角色配置，用于自定义消息渲染 | - | v1.0 |
        | plugins | any[] | 消息插件列表 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | ChatMessage | 基础消息类型 | 是 | - | 必须包含type和sender字段 |
        | MessageRole | { loading?: (message, globalData, context, pubsub) => boolean; renderHeader?: (message, globalData, context, pubsub) => ReactNode; renderFooter?: (message, globalData, context, pubsub) => ReactNode; renderLoading?: (message, globalData, context, pubsub) => ReactNode; } | 否 | - | 角色自定义渲染方法 |
    </component-type-description>
 </component-parts>