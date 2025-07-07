# @versa-chat/mobile

Versa Chat 是一个功能丰富的移动聊天应用模板，基于 React 和 Vite 构建，集成了现代化的 UI 组件和状态管理方案，支持多语言、主题定制和丰富的消息类型。

## 🚀 特性

- **丰富的消息类型**：支持文本、富文本、iframe 等多种消息格式
- **流式响应**：基于 SSE 实现的流式消息传输
- **虚拟滚动**：高效处理大量消息历史记录
- **国际化**：基于 i18next 的多语言支持（中文和英文）
- **主题定制**：支持主题切换和深色模式
- **响应式设计**：基于 Tailwind CSS 和 postcss-pxtorem 的移动端适配
- **组件化架构**：基于 @versa-chat/ui 组件库，可扩展的插件系统
- **状态管理**：使用 Zustand + Immer 实现高效状态管理
- **路由系统**：React Router 实现的 SPA 路由
- **自动加载**：使用 React Suspense 和动态导入实现代码拆分

## 🔧 技术栈

- **核心框架**：React 18
- **构建工具**：Vite + TypeScript
- **UI 框架**：Ant Design Mobile + Tailwind CSS
- **状态管理**：Zustand + Immer
- **路由**：React Router 6
- **国际化**：i18next + react-i18next
- **虚拟列表**：react-virtualized
- **其他工具**：amfe-flexible, uuid, lodash-es

## 📦 项目结构

```
src/
├── assets/        # 静态资源
├── components/    # 共享组件
├── constants/     # 常量定义
├── hooks/         # 自定义Hooks
├── layouts/       # 布局组件
├── locales/       # 国际化资源
│   ├── zh-CN/     # 中文翻译资源
│   └── en/        # 英文翻译资源
├── pages/         # 页面组件
├── routes/        # 路由配置
├── services/      # API服务
├── stores/        # 状态管理
├── styles/        # 全局样式
├── types/         # TypeScript类型
├── utils/         # 工具函数
├── App.tsx        # 应用入口
└── main.tsx       # 渲染入口
```

## 🛠️ 开发指南

### 环境准备

确保你的开发环境已安装:

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务

```bash
pnpm dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 🔨 可定制配置

主要配置集中在以下文件:

- `.env`: 环境变量配置
- `vite.config.ts`: Vite构建配置
- `tailwind.config.js`: Tailwind CSS配置
- `postcss.config.js`: PostCSS配置

## 🌓 暗黑模式

应用支持三种主题模式:
- **浅色模式 (🌞)**: 默认亮色主题
- **暗黑模式 (🌙)**: 深色主题，降低眼睛疲劳
- **跟随系统 (💻)**: 根据系统设置自动切换

暗黑模式实现采用:
- Tailwind CSS 的 html[data-theme='dark'] 属性
- CSS 变量实现全局主题切换
- 使用 Zustand 进行主题状态管理
- Ant Design Mobile 的主题适配

要切换主题，点击应用右上角的主题按钮即可循环切换。

## 🌍 国际化支持

应用支持多语言功能:
- **默认语言**: 中文 (zh-CN)
- **支持语言**: 中文 (zh-CN) 和英文 (en)

国际化实现采用:
- 基于 i18next 和 react-i18next 的翻译系统
- 使用 i18next-http-backend 实现动态加载翻译资源
- 使用 i18next-browser-languagedetector 自动检测用户首选语言
- 资源文件位于 src/locales 目录下，按语言和命名空间分类

如要添加新的翻译:
1. 在对应语言目录下创建或编辑JSON文件
2. 使用嵌套键结构组织翻译内容
3. 在代码中使用 useTranslation hook 访问翻译

```jsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  return <div>{t('session.welcome')}</div>;
};
```

要切换语言，可调用:
```jsx
import { changeLanguage } from '../utils/i18n';

// 切换到英文
changeLanguage('en');
```

### 环境文件
根目录下创建.env文件
``` bash
# 应用名称
VITE_APP_NAME=

# 端口
VITE_APP_PORT=

# API 地址
VITE_API_URL=

# API 密钥
VITE_API_KEY=

# 模型
VITE_MODEL=
```

## 📝 开发进度

### 已完成功能

- [x] 消息列表虚拟滚动
- [x] 消息插件支持富文本渲染
- [x] 消息插件支持 iframe 渲染
- [x] 项目支持i18n多语言(中文、英文)
- [x] 项目支持tailwind
- [x] 项目支持接入antd mobile
- [x] 支持sse流式消息
- [x] 基于axios请求封装
- [x] 支持暗黑模式
- [x] 支持主题包切换
- [x] 支持消息支持图片渲染、图片懒加载
- [x] 触碰/点击消息触发光波效果增强体验
- [x] 支持消息里面触发按钮调用外部接口(通过发布订阅实现)
- [x] 消息发送失败支持重新发送
- [x] 添加语言切换UI组件

### 待实现功能

