<component-parts file-path="packages/ui/src/components/ErrorBoundary">
    <component-name>
        ErrorBoundary
    </component-name>
    <component-description>
        错误边界组件，用于捕获子组件树中的 JavaScript 错误，记录错误并展示备用 UI，防止整个应用崩溃。当组件发生错误时，会显示错误信息并提供刷新页面和返回上一页的操作按钮。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | children | ReactNode | 需要进行错误捕获的子组件 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | ErrorBoundaryProps | { children: ReactNode } | 是 | - | 错误边界组件的属性 |
        | ErrorBoundaryState | { hasError: boolean; error: Error \| null } | - | { hasError: false, error: null } | 错误边界组件的状态 |
    </component-type-description>
 </component-parts> 