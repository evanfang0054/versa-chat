<component-parts file-path="apps/mobile/src/components/ThemeSwitcher">
    <component-name>
        ThemeSwitcher
    </component-name>
    <component-description>
        ThemeSwitcher是一个主题包切换组件，提供多种主题包（如默认、AI风格、动物风格等）的选择功能。用户可以通过点击按钮打开选择器，选择不同的主题包来改变应用的视觉风格。适用于需要支持多种主题的移动应用，与全局主题状态管理系统配合使用。
    </component-description>
    <component-api>
        | 属性名 | 类型 | 说明 | 默认值 | 版本 |
        |-------|------|-----|-------|------|
        | - | - | 该组件不接收任何属性，使用全局状态管理 | - | v1.0 |
    </component-api>
    <component-type-description>
        | 类型名 | 类型详情 | 必填 | 默认值 | 说明 |
        |-------|------|-----|-------|------|
        | ThemeItem | interface | - | - | 主题项定义，包含label和value属性 |
    </component-type-description>
 </component-parts> 