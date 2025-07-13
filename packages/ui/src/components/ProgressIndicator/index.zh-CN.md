<component-parts file-path="packages/ui/src/components/ProgressIndicator">
    <component-name>
        ProgressIndicator
    </component-name>
    <component-description>
        进度指示器组件，支持直线、半圆和圆形三种形态，可用于展示任务进度、加载状态或完成度。组件提供丰富的自定义选项，包括颜色、渐变、动画效果等，适用于各类进度展示场景。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | percent | number | 进度百分比，范围 0-100 | - | v1.0 |
        | shape | 'line' \| 'semi-circle' \| 'circle' | 形态类型：直线、半圆、圆形 | 'line' | v1.0 |
        | showText | boolean | 是否显示进度文本 | true | v1.0 |
        | strokeColor | string \| GradientConfig | 进度条/进度圈的颜色，可以是字符串或渐变配置对象 | '#1677ff' | v1.0 |
        | trailColor | string | 进度条/进度圈的背景色 | '#eee' | v1.0 |
        | strokeWidth | number | 线条宽度 | 直线形态为8，其他为4 | v1.0 |
        | width | number | 进度条宽度（仅对line形态有效） | - | v1.0 |
        | size | number | 进度圈/半圈的尺寸（直径） | 100 | v1.0 |
        | format | (percent: number) => ReactNode | 自定义进度文本内容 | - | v1.0 |
        | className | string | 附加的类名 | - | v1.0 |
        | style | React.CSSProperties | 附加的样式 | - | v1.0 |
        | animated | boolean | 是否启用过渡动画 | true | v1.0 |
        | animationDuration | number | 过渡动画持续时间（毫秒） | 300 | v1.0 |
        | percentText | string | 百分比文本，默认 '%' | '%' | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | ProgressShape | 'line' \| 'semi-circle' \| 'circle' | - | - | 进度指示器的形态类型 |
        | GradientConfig | { from: string; to: string; direction?: string; } | - | - | 进度指示器的渐变色配置 |
        | ProgressIndicatorProps | 见上方属性表 | - | - | 进度指示器组件的属性 |
    </component-type-description>
 </component-parts> 