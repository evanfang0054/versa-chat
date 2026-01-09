# @versa-chat/design-to-code

基于 AI 和 Figma 的智能代码生成工具，可以将 Figma 设计稿转换为高质量的 React 组件代码。

## 🎯 主要功能

- **设计转换**: 从 Figma 设计稿自动生成 React 组件
- **AI 辅助**: 使用 OpenAI GPT 模型智能生成 React 代码
- **多语言支持**: 支持 TypeScript/JavaScript 生成
- **UI 组件库**: 优先使用 Ant Design Mobile 组件
- **样式方案**: 使用 Tailwind CSS 进行样式开发
- **国际化**: 支持 i18next 国际化
- **响应式**: 支持响应式布局
- **代码编辑**: 集成 Monaco Editor 代码编辑器
- **格式化**: 支持多种代码格式化选项
- **YAML 支持**: 支持从 YAML 格式导入设计数据

## 🛠️ 技术栈

### 框架
- **React 18** - 核心框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design Mobile** - 移动端 UI 组件

### 状态管理
- **Zustand** - 轻量级状态管理

### 代码编辑
- **Monaco Editor** - 代码编辑器

### AI 集成
- **OpenAI API** - AI 代码生成
- **Figma REST API** - 设计数据获取

### 样式
- **Tailwind CSS** - 原子化 CSS 框架
- **Less** - CSS 预处理器

### 国际化
- **i18next** - 国际化解决方案

### 工具库
- **js-yaml** - YAML 解析
- **markdown-it** - Markdown 解析
- **lodash-es** - 工具函数
- **uuid** - 唯一ID生成

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装
```bash
# 进入项目目录
cd apps/design-to-code

# 安装依赖
pnpm install
```

## 📖 使用指南

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:8080
```

### 构建部署
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🎨 使用流程

### 1. 获取 Figma API Token
1. 访问 [Figma](https://www.figma.com/)
2. 登录您的账户
3. 在 "Personal access tokens" 页面创建 API Token

### 2. 获取 Figma 文件 ID
在 Figma 文件 URL 中可以找到文件 ID，例如：
- URL: `https://www.figma.com/file/FmAvvwUDGqFsumzCG9rKyo/My-Design`
- 文件 ID: `FmAvvwUDGqFsumzCG9rKyo`

### 3. 开始使用

#### 步骤 1: 导入 Figma 设计
- 在 "Figma设计" 选项卡中输入 Figma API Token 和文件 ID
- 点击"获取设计"按钮加载设计数据
- 选择"导入设计"选项

#### 步骤 2: 配置设计
- 在 "配置设计" 选项卡中调整设计参数
- 支持多种设计配置选项

#### 步骤 3: 生成代码
- 在 "代码生成" 选项卡中选择生成选项
- 支持 Ant Design Mobile、响应式、国际化
- 点击"生成代码"按钮

#### 步骤 4: 编辑代码
- 在 "编辑" 选项卡中查看生成的代码
- 支持编辑 index.ts、interface.ts、组件文件等
- 点击"导出代码"导出生成的代码

#### 步骤 5: 预览 AI 提示
- 在 "AI提示" 选项卡中查看 AI 生成的提示
- 支持 Markdown 格式预览提示

## 📁 项目结构

```
src/
├── api/                    # API 接口
│   ├── figma.ts           # Figma API 封装
│   ├── openai.ts          # OpenAI API 封装
│   └── ...
├── components/            # 组件
│   └── CodeEditor/        # 代码编辑器组件
├── constants/             # 常量定义
├── layouts/               # 布局组件
├── locales/               # 国际化文件
├── pages/                 # 页面组件
│   └── DesignToCodePage/  # 设计转码页面
├── routes/                # 路由配置
├── services/              # 业务服务
│   ├── aiCodeService.ts   # AI 代码生成服务
│   ├── codeGenerator.ts   # 代码生成器
│   ├── componentManager.ts # 组件管理器
│   └── figmaProcessor.ts  # Figma 数据处理
├── stores/                # 状态管理
├── styles/                # 样式文件
├── transformers/          # 转换器
├── types/                 # 类型定义
└── utils/                 # 工具函数
```

## 🎯 代码生成选项

### 生成选项
- **组件名称**: 自定义组件名称
- **使用 Ant Design Mobile**: 优先使用 UI 组件库
- **响应式**: 支持响应式布局
- **国际化**: 支持 i18next 国际化
- **使用 TypeScript**: 使用 TypeScript 类型定义
- **样式方案**: 使用 Tailwind CSS 进行样式开发

### 生成结构
```
ComponentName/
├── index.ts          # 导出文件
├── interface.ts      # Props 类型定义
├── ComponentName.tsx # 主组件文件
└── helpers.ts        # 辅助函数文件
```

## 🌐 国际化支持

支持以下语言：

- **中文 (zh-CN)**: 默认语言
- **English**: 英文

语言文件位于 `src/locales/` 目录。

## 🚀 部署方式

支持多种部署方式：

- **Docker 部署**: 容器化部署
- **AI 部署**: AI 服务部署
- **静态部署**: 静态网站部署

## ⚙️ 环境配置

在 `.env` 文件中配置以下环境变量：

```env
# OpenAI API 配置
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_BASE_URL=https://api.openai.com/v1

# Figma API 配置
VITE_FIGMA_API_BASE_URL=https://api.figma.com/v1
```

## 🚀 部署

### Docker 部署
```bash
# 构建镜像
docker-compose build design-to-code-app

# 启动服务
docker-compose up -d design-to-code-app
```

### 静态部署
```bash
# 构建项目
pnpm build

# 部署到静态 Web 服务器
# 将 dist/ 目录内容部署到静态 Web 服务器
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../../LICENSE) 文件了解详情。

## 📞 支持

如果您在使用过程中遇到问题：

1. 查看项目文档
2. 提交 Issues
3. 参与 Issue 讨论

## 🔗 相关链接

- [Figma API 文档](https://www.figma.com/developers/api)
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Ant Design Mobile 文档](https://mobile.ant.design/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

**注意**: 本工具需要有效的 OpenAI API 密钥和 Figma API 访问权限才能正常工作。