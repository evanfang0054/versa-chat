<component-parts file-path="packages/ui/src/components/InputArea">
    <component-name>
        InputArea
    </component-name>
    <component-description>
        输入区域组件，提供文本输入、发送和取消功能，适用于聊天、评论等场景。组件包含输入框、发送按钮和可选的取消按钮，支持自定义样式和按钮文本。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | value | string | 输入框的值 | - | v1.0 |
        | placeholder | string | 输入框的占位符 | '输入消息...' | v1.0 |
        | onChange | (value: string) => void | 输入框的值发生变化时的回调 | - | v1.0 |
        | onSend | (value: string) => void | 发送消息时的回调 | - | v1.0 |
        | onCancel | () => void | 取消发送时的回调 | - | v1.0 |
        | loading | boolean | 是否显示加载状态 | false | v1.0 |
        | inputDisabled | boolean | 是否禁用输入框 | false | v1.0 |
        | showCancelButton | boolean | 是否显示取消按钮 | false | v1.0 |
        | showSendButton | boolean | 是否显示发送按钮 | true | v1.0 |
        | className | string | 输入框的类名 | '' | v1.0 |
        | cancelButtonText | string | 取消按钮的文本 | '取消' | v1.0 |
        | sendButtonText | string | 发送按钮的文本 | '发送' | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | InputAreaProps | 见上方属性表 | - | - | 输入区域组件的属性 |
    </component-type-description>
 </component-parts> 