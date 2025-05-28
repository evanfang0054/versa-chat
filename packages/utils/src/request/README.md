# HTTP 请求模块使用文档

## 概述
本模块基于 Axios 封装了一套完整的 HTTP 请求解决方案，提供以下核心功能：
- 请求/响应拦截器
- 错误统一处理
- 请求重试机制
- 请求取消功能
- 缓存管理
- 文件上传/下载
- 完善的类型定义

## 快速开始

### 1. 创建请求实例
```typescript
import { createRequest } from '@versa-chat/utils';

const http = createRequest({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  toastHandler: {
    show: (options) => toast.show(options),
    clear: () => toast.clear()
  }
});
```

### 2. 发起请求
```typescript
// GET 请求
http.get('/users', { page: 1, size: 10 })
  .then(data => console.log(data))
  .catch(err => console.error(err));

// POST 请求  
http.post('/users', { name: 'John' })
  .then(data => console.log(data));
```

## 核心功能

### 请求配置
支持所有 Axios 原生配置，并扩展了以下功能：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| retry | { times: number, delay: number } | 请求重试配置 |
| errorHandling | { showErrorMessage?: boolean, ignoreBusinessError?: boolean } | 错误处理配置 |
| useMock | boolean | 是否使用 Mock 数据 |
| requestId | string | 请求唯一标识，用于取消请求 |
| cache | boolean | 是否启用缓存 |
| cacheTime | number | 缓存时间(ms) |

### 错误处理
内置了完整的错误分类和处理机制：

```typescript
import { ErrorType } from '@versa-chat/utils';

try {
  await http.get('/users');
} catch (err) {
  if (err.type === ErrorType.AUTH) {
    // 处理未授权错误
  } else if (err.type === ErrorType.TIMEOUT) {
    // 处理超时错误
  }
  // ...
}
```

### 高级功能

#### 1. 请求取消
```typescript
// 发起可取消的请求
const reqId = 'get_users';
http.get('/users', {}, { requestId: reqId });

// 取消特定请求
http.cancel(reqId);

// 取消所有请求
http.cancelAll();
```

#### 2. 文件上传
```typescript
const file = document.querySelector('input[type="file"]').files[0];
http.upload('/upload', file, {
  onUploadProgress: (progress) => {
    console.log(`上传进度: ${progress}%`);
  }
});
```

#### 3. 文件下载
```typescript
http.download('/export', { type: 'excel' })
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    a.click();
  });
```

## 最佳实践

### 1. 全局请求实例
建议在应用初始化时创建全局请求实例：

```typescript
// src/request/index.ts
export const http = createRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  // 其他全局配置...
});
```

### 2. 错误处理策略
推荐在应用顶层统一处理错误：

```typescript
// 设置全局错误处理器
const http = createRequest({
  errorHandler: (error) => {
    if (error.type === ErrorType.AUTH) {
      router.push('/login');
    }
    // 其他错误处理逻辑...
  }
});
```

### 3. TypeScript 集成
充分利用类型系统：

```typescript
interface User {
  id: number;
  name: string;
}

// 带类型的请求
http.get<User[]>('/users')
  .then(users => {
    // users 自动推断为 User[] 类型
  });
```

## API 参考

### createRequest(config)
创建请求实例

| 参数 | 类型 | 说明 |
|------|------|------|
| config | CreateRequestConfig | 请求配置 |

### 实例方法
| 方法 | 说明 |
|------|------|
| get(url, params, options) | GET 请求 |
| post(url, data, options) | POST 请求 |
| put(url, data, options) | PUT 请求 |
| delete(url, params, options) | DELETE 请求 |
| patch(url, data, options) | PATCH 请求 |
| upload(url, file, options) | 文件上传 |
| download(url, params, options) | 文件下载 |
| cancel(requestId) | 取消请求 |
| cancelAll() | 取消所有请求 |

## 开发指南

### 1. Mock 数据
开发环境下可通过 `useMock` 配置启用 Mock：

```typescript
http.get('/users', {}, { useMock: true });
```

需在 `public/mock` 目录下创建对应的 JSON 文件，如：
`public/mock/users.json`

### 2. 日志调试
内置了日志系统，开发环境下默认输出 DEBUG 级别日志：

```typescript
import { Logger } from '@versa-chat/utils';

// 设置日志级别
Logger.setLevel(Logger.LogLevel.DEBUG);
```

### 3. 自定义拦截器
可通过配置自定义拦截器：

```typescript
createRequest({
  requestInterceptor: (config) => {
    // 自定义请求拦截逻辑
    return config;
  },
  responseHandler: (response) => {
    // 自定义响应处理
    return response.data;
  }
});
```

## 注意事项
1. 生产环境请确保关闭 Mock 和 DEBUG 日志
2. 文件上传需自行处理进度显示
3. 取消请求需配合 `requestId` 使用
4. 缓存功能仅适用于 GET 请求