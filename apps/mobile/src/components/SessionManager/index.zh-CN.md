<component-parts file-path="apps/mobile/src/components/SessionManager">
    <component-name>
        SessionManager
    </component-name>
    <component-description>
        SessionManager是一个会话管理组件，提供会话列表展示、选择、重命名和删除功能。以左侧弹出抽屉的形式展示，支持会话操作菜单、会话编辑模式和自定义底部内容。适配暗黑模式，适用于聊天应用的会话管理场景。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | visible | boolean | 控制组件的显示与隐藏 | - | v1.0 |
        | onClose | () => void | 关闭会话管理器的回调函数 | - | v1.0 |
        | sessions | Session[] | 会话数据数组 | - | v1.0 |
        | activeSessionId | string \| null | 当前激活的会话ID | - | v1.0 |
        | onAddSession | () => void | 添加新会话的回调函数 | - | v1.0 |
        | onRemoveSession | (sessionId: string) => void | 删除会话的回调函数 | - | v1.0 |
        | onSelectSession | (sessionId: string) => void | 选择会话的回调函数 | - | v1.0 |
        | onRenameSession | (sessionId: string, newTitle: string) => void | 重命名会话的回调函数 | - | v1.0 |
        | footer | React.ReactNode | 自定义底部内容 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | SessionManagerProps | interface | - | - | SessionManager组件的属性类型定义 |
        | Session | interface | - | - | 会话数据结构，包含id、title、messages和createdAt字段 |
    </component-type-description>
 </component-parts> 