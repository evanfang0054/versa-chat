<component-parts file-path="packages/ui/src/components/chat/hooks">
    <component-name>
        useAutoScroll
    </component-name>
    <component-description>
        自动滚动钩子函数，用于在消息列表更新时自动滚动到指定位置。主要用于Chat组件内部实现消息列表的自动滚动功能。

        核心特性：
        - 支持滚动到指定索引位置
        - 支持滚动到最后一条消息('LAST')
        - 基于react-virtuoso实现高效滚动
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | deps | any[] | 依赖数组，变化时触发滚动 | - | v1.0 |
        | index | number \| 'LAST' | 要滚动到的索引位置 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | ReturnType | React.RefObject<any> | 是 | - | 返回virtuoso实例的ref对象 |
    </component-type-description>
 </component-parts>