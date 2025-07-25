<component-parts file-path="apps/mobile/src/components/Plugin/CardPlugin">
    <component-name>
        cardPlugin
    </component-name>
    <component-description>
        cardPlugin是一个自定义卡片消息插件，用于在聊天界面中渲染卡片类型的消息。支持标题、内容和交互按钮，并适配暗黑模式。该插件作为MessagePlugin类型被导出，可以集成到聊天消息渲染系统中。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | type | string | 插件类型标识符 | 'card' | v1.0 |
        | render | (message, globalData, context, pubsub) => ReactNode | 渲染函数，用于生成卡片UI | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | MessagePlugin | interface | - | - | 来自@versa-chat/ui的消息插件接口定义 |
    </component-type-description>
 </component-parts> 