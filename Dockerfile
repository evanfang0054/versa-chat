# 构建阶段
FROM node:18.20.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置npm镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 安装pnpm
RUN npm install -g pnpm@9.4.0

# 配置pnpm镜像源
RUN pnpm config set registry https://registry.npmmirror.com/

# 安装依赖
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/design-to-code/package.json ./apps/design-to-code/package.json
COPY packages ./packages

# 使用pnpm安装依赖，使用frozen lockfile确保依赖一致性
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段 - 使用nginx提供静态文件服务
FROM nginx:1.25.3-alpine AS runner

# 复制nginx配置
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物 - 移动端应用
COPY --from=builder /app/apps/mobile/dist /usr/share/nginx/html/mobile

# 复制构建产物 - design-to-code应用
COPY --from=builder /app/apps/design-to-code/dist /usr/share/nginx/html/design-to-code

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:80/ || exit 1

# 暴露端口
EXPOSE 80 8080

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
