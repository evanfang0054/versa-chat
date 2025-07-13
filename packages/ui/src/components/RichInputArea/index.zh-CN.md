<component-parts file-path="packages/ui/src/components/RichInputArea">
    <component-name>
        RichInputArea
    </component-name>
    <component-description>
        富文本输入区域组件，基于TextareaAutosize实现，支持自动高度调整、快捷键发送和图片粘贴功能。适用于聊天、评论等需要多行输入的场景，提供更丰富的输入体验。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | value | string | 输入框的值 | - | v1.0 |
        | placeholder | string | 输入框的占位符 | '输入消息...' | v1.0 |
        | onChange | (value: string) => void | 输入框的值发生变化时的回调 | - | v1.0 |
        | onSend | (value: string) => void | 发送消息时的回调 | - | v1.0 |
        | onCancel | () => void | 取消消息时的回调 | - | v1.0 |
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
        | RichInputAreaProps | 见上方属性表 | - | - | 富文本输入区域组件的属性 |
    </component-type-description>
 </component-parts> 