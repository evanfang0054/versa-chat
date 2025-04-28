# Versa Chat

Versa Chat Ai聊天 支持多种消息类型插件(卡片、iframe、文本、图片、音频等等)接入、monorepo架构体系

## 技术栈

- 📦 Monorepo - 使用 pnpm workspace 和 Turborepo 管理
- 🚀 构建工具 - Vite
- 🎨 UI 框架 - Ant Design Mobile
- 📱 移动端适配 - amfe-flexible + postcss-pxtorem
- 🌐 国际化 - i18next + react-i18next
- 🎯 状态管理 - Zustand
- 🎨 样式方案 - TailwindCSS
- 📝 类型检查 - TypeScript
- 🔍 代码规范 - ESLint + Prettier
- 📦 版本管理 - Changesets

## 项目结构

```
.
├── README.md                 # 项目说明文档
├── apps                      # 应用程序目录，存放最终的应用
│   └── mobile               # 移动端应用
├── package.json             # 根项目配置文件
├── packages                 # 公共包目录，存放共享的模块
│   ├── config              # 配置相关的包（如：eslint, prettier 等配置）
│   ├── hooks               # React Hooks 相关的公共逻辑
│   ├── ui                  # UI 组件库
│   └── utils              # 通用工具函数包
├── pnpm-lock.yaml         # pnpm 依赖锁定文件
├── pnpm-workspace.yaml    # pnpm 工作空间配置文件
├── tsconfig.base.json     # TypeScript 基础配置文件
└── turbo.json             # Turborepo 配置文件，用于管理构建流程
```

## 开发指南

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动所有项目
pnpm dev

# 启动特定项目
pnpm dev --filter=@versa-chat/mobile
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm build --filter=@versa-chat/mobile
```

### 代码规范

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

### 版本发布

```bash
# 创建变更集
pnpm changeset

# 更新版本
pnpm version

# 发布
pnpm release
```

## 目录说明

### apps/mobile

移动端应用，基于 React + Vite + TypeScript + Ant Design Mobile。

### packages/ui

共享 UI 组件库，包含业务通用组件。

### packages/hooks

共享 Hooks 库，包含业务通用 Hooks。

### packages/utils

工具函数库，包含业务通用工具函数。

### packages/config

共享配置库，包含业务通用配置。

## 最佳实践

1. 组件开发

   - 遵循 React Hooks 最佳实践
   - 使用 TypeScript 严格模式
   - 编写单元测试

2. 状态管理

   - 使用 Zustand 进行状态管理
   - 按功能模块拆分 store
   - 使用 TypeScript 类型约束

3. 样式开发

   - 使用 TailwindCSS 进行样式开发
   - 遵循移动端适配方案
   - 保持样式的可维护性

4. 国际化

   - 使用 i18next 进行国际化
   - 按模块组织语言包
   - 支持动态加载语言包

5. 工程规范
   - 遵循 Git 分支管理规范
   - 遵循代码提交信息规范
   - 遵循版本发布规范
