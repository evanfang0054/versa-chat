<component-parts file-path="packages/ui/src/components/chat/utils">
    <component-name>
        Chat Utils
    </component-name>
    <component-description>
        Chat组件的工具函数集合，提供消息处理和上下文管理的实用功能。

        核心工具：
        - getMessageContext: 获取消息上下文
        - getMessagePlugin: 获取匹配的消息插件
    </component-description>
    <component-api>
        | 函数名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | getMessageContext | (messages: ChatMessage[], index: number) => { prevMessages: ChatMessage[]; nextMessages: ChatMessage[] } | 获取消息上下文 | - | v1.0 |
        | getMessagePlugin | (message: ChatMessage, plugins: MessagePlugin[]) => MessagePlugin \| undefined | 获取匹配的消息插件 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | MessageContext | { prevMessages: ChatMessage[]; nextMessages: ChatMessage[] } | 是 | - | 消息上下文类型 |
    </component-type-description>
 </component-parts>