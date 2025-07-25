<component-parts file-path="apps/mobile/src/components/HeaderBar">
    <component-name>
        HeaderBar
    </component-name>
    <component-description>
        HeaderBar是一个移动端顶部导航栏组件，提供会话标题显示、会话管理、新建会话和支付导航等功能。适用于聊天应用的顶部导航，支持暗黑模式。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | title | string | 显示在导航栏中间的标题文本 | - | v1.0 |
        | onOpenSessionManager | () => void | 点击左侧列表图标时触发，用于打开会话管理器 | - | v1.0 |
        | onAddSession | (title: string) => void | 点击右侧添加图标时触发，用于创建新会话 | - | v1.0 |
        | onNavigateToPayments | () => void | 点击支付图标时触发，用于导航到支付页面 | - | v1.0 |
        | pendingPaymentsCount | number | 待处理支付的数量，显示在支付图标上的徽章数字 | 0 | v1.0 |
        | className | string | 自定义容器类名，用于自定义样式 | '' | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | HeaderBarProps | interface | - | - | HeaderBar组件的属性类型定义 |
    </component-type-description>
 </component-parts> 