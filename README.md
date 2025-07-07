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
- 🐳 容器化 - Docker + Nginx

## 项目结构

```
.
├── README.md                 # 项目说明文档
├── apps                      # 应用程序目录，存放最终的应用
│   ├── mobile               # 移动端应用
│   └── design-to-code       # Design-to-Code应用
├── package.json             # 根项目配置文件
├── packages                 # 公共包目录，存放共享的模块
│   ├── config              # 配置相关的包（如：eslint, prettier 等配置）
│   ├── hooks               # React Hooks 相关的公共逻辑
│   ├── ui                  # UI 组件库
│   └── utils              # 通用工具函数包
├── pnpm-lock.yaml         # pnpm 依赖锁定文件
├── pnpm-workspace.yaml    # pnpm 工作空间配置文件
├── tsconfig.base.json     # TypeScript 基础配置文件
├── turbo.json             # Turborepo 配置文件，用于管理构建流程
├── Dockerfile             # Docker 镜像构建文件
├── docker-compose.yml     # Docker Compose 配置文件
├── nginx.conf             # Nginx 配置文件
└── logs                   # 应用日志目录
    ├── mobile             # 移动端应用日志
    └── design             # Design-to-Code应用日志
```

## 开发指南

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Docker >= 20.10 (可选，用于容器化部署)

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
pnpm dev --filter=@versa-chat/design-to-code
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm build --filter=@versa-chat/mobile
pnpm build --filter=@versa-chat/design-to-code
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

## Docker 部署

项目支持使用 Docker 进行容器化部署，提供高性能、高稳定的运行环境。应用被拆分为两个独立的服务，通过不同的端口访问。

### 构建 Docker 镜像

```bash
# 使用 Docker Compose 构建所有应用
docker-compose build

# 或分别构建各应用
docker-compose build mobile-app
docker-compose build design-to-code-app
```

### 运行容器

```bash
# 使用 Docker Compose 启动所有应用（推荐）
docker-compose up -d

# 或分别启动各应用
docker-compose up -d mobile-app
docker-compose up -d design-to-code-app
```

### 访问应用

容器启动后，可通过以下地址访问应用：

- 移动端应用：http://localhost/ 或 http://localhost:80/
- Design-to-Code 应用：http://localhost:8080/

### 容器管理

```bash
# 查看所有容器状态
docker ps

# 查看容器日志
docker logs versa-chat-mobile    # 查看移动端应用日志
docker logs versa-chat-design    # 查看Design-to-Code应用日志

# 停止所有容器
docker-compose down

# 停止特定容器
docker stop versa-chat-mobile
docker stop versa-chat-design

# 重启所有容器
docker-compose restart

# 重启特定容器
docker restart versa-chat-mobile
docker restart versa-chat-design
```

### 日志管理

应用日志被映射到本地目录，可以直接查看：

```bash
# 移动端应用日志
ls -la logs/mobile/

# Design-to-Code应用日志
ls -la logs/design/
```

### 高级配置

如需自定义配置，可以修改以下文件：

- `docker-compose.yml`: 调整容器资源限制、端口映射等
- `nginx.conf`: 自定义 Nginx 服务器配置
- `Dockerfile`: 自定义构建过程

#### 修改端口映射

如果需要修改端口映射，可以编辑 `docker-compose.yml` 文件：

```yaml
services:
  mobile-app:
    ports:
      - "自定义端口:80"
  
  design-to-code-app:
    ports:
      - "自定义端口:8080"
```

#### 修改资源限制

可以根据服务器资源情况调整容器资源限制：

```yaml
services:
  mobile-app:
    deploy:
      resources:
        limits:
          cpus: '0.5'  # 调整CPU限制
          memory: 512M  # 调整内存限制
```

### 常见问题排查

#### 1. 应用无法访问

- 检查容器是否正常运行：`docker ps`
- 检查端口是否被占用：`netstat -tuln | grep 80` 和 `netstat -tuln | grep 8080`
- 检查容器日志：`docker logs versa-chat-mobile` 或 `docker logs versa-chat-design`
- 检查 Nginx 配置是否正确：`docker exec -it versa-chat-mobile nginx -t`

#### 2. 资源文件 404 错误

- 检查 Nginx 配置中的路径是否正确
- 检查构建产物是否正确复制到容器中：`docker exec -it versa-chat-mobile ls -la /usr/share/nginx/html/mobile/assets/`
- 检查浏览器网络请求，查看具体哪些资源文件无法加载

#### 3. 容器启动失败

如果容器无法正常启动：
- 检查日志：`docker logs versa-chat-mobile`
- 尝试以交互方式运行容器排查问题：`docker run -it --rm versa-chat:mobile sh`
- 检查 Nginx 配置是否有语法错误：`docker run -it --rm versa-chat:mobile nginx -t`

#### 4. 性能优化

如果应用性能不佳：
- 调整 Nginx worker 进程数：编辑 `nginx.conf` 添加 `worker_processes auto;`
- 优化静态资源缓存策略
- 考虑使用 CDN 分发静态资源

## 目录说明

### apps/mobile

移动端应用，基于 React + Vite + TypeScript + Ant Design Mobile。通过 80 端口访问。

### apps/design-to-code

Design-to-Code 应用，Figma 设计稿转代码工具。通过 8080 端口访问。

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

6. 部署策略
   - 开发环境：本地开发服务器
   - 测试环境：Docker 容器化部署
   - 生产环境：Docker + Nginx 高性能部署，应用独立部署在不同端口
