# Versa Chat

Versa Chat AI 聊天应用，基于 Monorepo 架构构建，包含移动端聊天应用和 Design-to-Code 工具。

## 🚀 项目概览

### 核心应用

**📱 移动端聊天应用** (`@versa-chat/mobile`)
- 基于 React + Vite + TypeScript 构建
- 支持多种消息类型：文本、图片、iframe、卡片等
- 集成智能旅游助手 AI 助手
- 支持会话管理、主题切换、多语言国际化
- 包含支付模块，支持支付列表和详情查看

**🎨 Design-to-Code 工具** (`@versa-chat/design-to-code`)
- Figma 设计稿转代码工具
- 集成 Monaco Editor 代码编辑器
- 支持 AI 辅助代码生成（OpenAI）
- 自动生成符合企业规范的 React 组件
- 支持多种样式框架和配置选项

### 技术栈

- 📦 **Monorepo 管理** - pnpm workspace + Turborepo
- 🚀 **构建工具** - Vite + TypeScript
- 🎨 **UI 框架** - Ant Design Mobile (移动端) / Ant Design (PC端)
- 📱 **移动端适配** - amfe-flexible + postcss-pxtorem
- 🌐 **国际化** - i18next + react-i18next
- 🎯 **状态管理** - Zustand + persist 中间件
- 🎨 **样式方案** - TailwindCSS + Less
- 🔧 **代码编辑** - Monaco Editor
- 🤖 **AI 集成** - OpenAI API
- 📝 **类型检查** - TypeScript 严格模式
- 🔍 **代码规范** - ESLint + Prettier + Husky
- 📦 **版本管理** - Changesets
- 🐳 **容器化** - Docker + Nginx

## 🏗️ 项目架构

### 目录结构

```
.
├── README.md                 # 项目说明文档
├── apps/                     # 应用程序目录
│   ├── mobile/              # 移动端聊天应用
│   │   ├── src/
│   │   │   ├── components/   # 业务组件
│   │   │   │   ├── HeaderBar/     # 顶部导航栏
│   │   │   │   ├── SessionManager/ # 会话管理
│   │   │   │   ├── ThemeToggle/    # 主题切换
│   │   │   │   ├── ThemeSwitcher/  # 主题包切换
│   │   │   │   └── LanguageSwitcher/ # 语言切换
│   │   │   ├── pages/        # 页面组件
│   │   │   │   ├── chat/          # 聊天页面
│   │   │   │   ├── demo/          # 演示页面
│   │   │   │   └── payment/       # 支付模块
│   │   │   ├── stores/       # 状态管理
│   │   │   │   ├── chatStore.ts   # 聊天状态
│   │   │   │   ├── paymentStore.ts # 支付状态
│   │   │   │   └── themeStore.ts   # 主题状态
│   │   │   └── constants/    # 常量配置
│   │   │       └── prompts.ts     # AI 提示词模板
│   └── design-to-code/      # Design-to-Code 应用
│       ├── src/
│       │   ├── api/         # API 接口
│       │   │   ├── figma.ts       # Figma API
│       │   │   └── openai.ts      # OpenAI API
│       │   ├── services/    # 业务服务
│       │   │   ├── aiCodeService.ts   # AI 代码生成
│       │   │   ├── codeGenerator.ts    # 代码生成器
│       │   │   └── figmaProcessor.ts   # Figma 数据处理
│       │   └── transformers/ # 转换器
│       │       ├── effects.ts      # 效果转换
│       │       ├── layout.ts       # 布局转换
│       │       └── style.ts        # 样式转换
├── packages/                 # 公共包目录
│   ├── ui/                  # 共享 UI 组件库
│   │   └── src/
│   │       └── components/
│   │           ├── chat/         # 聊天组件
│   │           │   ├── Chat.tsx      # 主聊天组件
│   │           │   ├── plugins/      # 消息插件
│   │           │   └── hooks/        # 聊天相关 hooks
│   │           ├── InputArea/    # 输入框组件
│   │           ├── RichText/     # 富文本组件
│   │           └── ErrorBoundary/ # 错误边界
│   ├── hooks/               # 共享 React Hooks
│   ├── utils/               # 工具函数库
│   │   └── src/
│   │       ├── request/      # HTTP 请求库
│   │       └── pubsub/       # 发布订阅
│   └── config/              # 共享配置
├── package.json             # 根项目配置文件
├── pnpm-workspace.yaml    # pnpm 工作空间配置
├── turbo.json             # Turborepo 构建配置
├── docker-compose.yml     # Docker 容器编排
└── nginx.conf             # Nginx 配置
```

### 核心特性

#### 🎯 消息插件系统
- **可扩展架构**: 支持自定义消息类型插件
- **内置插件**: 文本、图片、iframe、卡片消息
- **虚拟滚动**: 使用 react-virtuoso 处理大量消息
- **自动滚动**: 智能滚动到最新消息

#### 🎨 主题系统
- **多主题支持**: 内置 AI、动物、默认主题包
- **暗黑模式**: 完整的暗色主题支持
- **CSS 变量**: 基于 CSS 变量的主题切换
- **持久化**: 主题偏好本地存储

#### 🌐 国际化支持
- **多语言**: 中文、英文支持
- **i18next**: 业界标准的国际化方案
- **动态加载**: 支持语言包动态加载
- **Ant Design 同步**: 组件库语言包自动切换

#### 🤖 AI 集成
- **智能助手**: 集成旅游助手 AI
- **代码生成**: Design-to-Code 支持 AI 辅助编程
- **OpenAI**: 基于 GPT 模型的智能服务
- **提示词工程**: 优化的 AI 提示词模板

## 🛠️ 开发指南

### 环境要求

- **Node.js**: >= 18.20.0
- **pnpm**: >= 9.4.0
- **Docker**: >= 20.10 (可选，用于容器化部署)

### 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 启动特定应用
pnpm dev --filter=@versa-chat/mobile      # 移动端应用 (端口 5173)
pnpm dev --filter=@versa-chat/design-to-code # Design-to-Code (端口 5174)
```

### 开发工作流

#### 应用开发
```bash
# 构建应用
pnpm build

# 构建特定应用
pnpm build --filter=@versa-chat/mobile
pnpm build --filter=@versa-chat/design-to-code

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

#### 组件开发
```bash
# 开发共享组件
cd packages/ui
pnpm dev

# 开发工具库
cd packages/utils
pnpm build
```

#### 版本管理
```bash
# 创建变更集
pnpm changeset

# 更新版本号
pnpm version

# 发布版本
pnpm release
```

### 🔧 开发规范

#### 组件开发规范
- **文件结构**: 每个组件包含 `index.ts`、`interface.ts`、`ComponentName.tsx`、`helpers.ts`
- **UI 框架**: 移动端使用 Ant Design Mobile，PC端使用 Ant Design
- **样式**: 统一使用 TailwindCSS
- **数据流**: 严格遵循单向数据流，数据通过 props 传入，事件通过回调传出
- **TypeScript**: 启用严格模式，完整的类型定义

#### 状态管理规范
- **Store 拆分**: 按功能模块拆分 Zustand store
- **持久化**: 使用 persist 中间件实现本地存储
- **类型安全**: 完整的 TypeScript 类型定义
- **性能优化**: 避免不必要的重渲染

#### 代码质量
- **ESLint**: 严格的代码规范检查
- **Prettier**: 统一的代码格式化
- **Husky**: Git hooks 自动化检查
- **Commitlint**: 提交信息规范

### 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定应用测试
pnpm test --filter=@versa-chat/mobile

# 生成测试覆盖率报告
pnpm test:coverage
```

### 🐳 Docker 部署

```bash
# 构建所有应用镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🚢 部署指南

### Docker 容器化部署

项目采用 Docker + Nginx 的高性能部署方案，两个应用独立部署在不同端口：

- **移动端应用**: http://localhost:80/
- **Design-to-Code 应用**: http://localhost:8080/

#### 快速部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看实时日志
docker-compose logs -f
```

#### 独立部署

```bash
# 构建特定应用
docker-compose build mobile-app
docker-compose build design-to-code-app

# 启动特定服务
docker-compose up -d mobile-app
docker-compose up -d design-to-code-app
```

### 🔧 配置管理

#### 环境变量配置

项目支持以下环境变量：

```bash
# Node.js 环境
NODE_ENV=production

# 部署环境
DEPLOY_ENV=production

# API 基础地址
API_BASE_URL=https://api.example.com

# Figma API Token (Design-to-Code)
VITE_FIGMA_TOKEN=your_figma_token

# OpenAI API Key (AI 功能)
VITE_OPENAI_API_KEY=your_openai_key
```

#### Nginx 配置优化

```nginx
# nginx.conf 核心配置
worker_processes auto;
events {
    worker_connections 1024;
}

http {
    # 移动端应用
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html/mobile;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # SPA 路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    
    # Design-to-Code 应用
    server {
        listen 8080;
        server_name localhost;
        root /usr/share/nginx/html/design-to-code;
        
        # 类似配置...
    }
}
```

### 📊 监控与日志

#### 日志管理

```bash
# 查看应用日志
docker-compose logs -f mobile-app
docker-compose logs -f design-to-code-app

# 查看特定时间日志
docker-compose logs --since 1h mobile-app

# 导出日志
docker-compose logs mobile-app > mobile.log
```

#### 性能监控

```bash
# 查看容器资源使用情况
docker stats

# 查看容器详细信息
docker inspect versa-chat-mobile

# 进入容器调试
docker exec -it versa-chat-mobile sh
```

### 🔒 安全配置

#### HTTPS 配置

```nginx
# SSL 配置示例
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

#### 安全头部

```nginx
# 安全响应头
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📈 性能优化

### 构建优化

#### 代码分割

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd-mobile'],
          utils: ['lodash-es', 'zustand']
        }
      }
    }
  }
})
```

#### 资源优化

```javascript
// 压缩配置
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ]
})
```

### 运行时优化

#### 缓存策略

```javascript
// Service Worker 缓存
const CACHE_NAME = 'versa-chat-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

#### 懒加载

```javascript
// 路由懒加载
const ChatPage = lazy(() => import('@/pages/chat'));
const DesignPage = lazy(() => import('@/pages/design'));

// 组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## 🐛 故障排查

### 常见问题

#### 1. 构建失败

```bash
# 清理缓存重新构建
pnpm clean
pnpm install
pnpm build

# 检查 Node.js 版本
node --version  # 需要 >= 18.20.0
```

#### 2. 启动失败

```bash
# 检查端口占用
lsof -i :80
lsof -i :8080

# 检查 Docker 服务
docker --version
docker-compose --version
```

#### 3. API 请求失败

```bash
# 检查网络连接
curl -I https://api.example.com

# 检查环境变量
echo $API_BASE_URL
```

#### 4. 样式问题

```bash
# 检查 TailwindCSS 配置
npx tailwindcss --help

# 检查 PostCSS 配置
npx postcss --version
```

### 调试工具

#### React Developer Tools

```bash
# 安装 React DevTools
npm install -g react-devtools

# 启动调试
react-devtools
```

#### Vue DevTools (如需要)

```bash
# 安装 Vue DevTools
npm install -g @vue/devtools

# 启动调试
vue-devtools
```

## 🤝 贡献指南

### 开发流程

1. **Fork 项目** 并创建特性分支
2. **遵循开发规范** 进行代码开发
3. **运行测试** 确保代码质量
4. **提交变更** 并创建 Pull Request
5. **代码审查** 通过后合并

### Git 规范

```bash
# 提交信息格式
<type>(<scope>): <description>

# 示例
feat(chat): 添加消息持久化功能
fix(payment): 修复支付金额显示问题
docs(readme): 更新项目文档
style(ui): 优化按钮样式
test(chat): 添加聊天组件单元测试
```

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] TypeScript 类型定义完整
- [ ] 组件具备可复用性
- [ ] 包含必要的测试用例
- [ ] 文档更新完整
- [ ] 性能影响已评估

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Ant Design Mobile](https://mobile.ant.design/)
- [Vite](https://vitejs.dev/)
- [Turborepo](https://turbo.build/repo)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [TailwindCSS](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)

---

⭐ 如果这个项目对你有帮助，请考虑给个 Star！
