<component-parts file-path="packages/ui/src/components/chat/plugins">
    <component-name>
        Chat Plugins
    </component-name>
    <component-description>
        Chat组件的插件系统，用于扩展支持不同类型的消息渲染。包含基础消息容器和内置插件实现。

        核心插件：
        - BaseMessage: 基础消息容器组件
        - TextMessage: 文本消息插件
        - IframeMessage: iframe消息插件
        - registerPlugins: 插件注册函数
    </component-description>
    <component-api>
        | 组件/函数 | 类型 | 说明 | 默认值 | 版本 |
        |----------|------|-----|-------|------|
        | BaseMessage | React.FC<BaseMessageProps> | 基础消息容器组件 | - | v1.0 |
        | TextMessage | React.FC<{message: TextMessageType}> | 文本消息插件 | - | v1.0 |
        | IframeMessage | React.FC<IframeMessageProps> | iframe消息插件 | - | v1.0 |
        | registerPlugins | (customPlugins?: MessagePlugin[]) => MessagePlugin[] | 插件注册函数 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | BaseMessageProps | { message: MessageBase; children: ReactNode } | 是 | - | 基础消息组件属性 |
        | IframeMessageProps | { message: PluginMessage & { content?: { url?: string; height?: string; width?: string } }; className?: string } | 是 | - | iframe消息组件属性 |
    </component-type-description>
 </component-parts>