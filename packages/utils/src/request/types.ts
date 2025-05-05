import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 响应通用格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Toast处理器接口
export interface ToastHandler {
  show: (options: {
    content: string;
    position?: 'top' | 'bottom' | 'center';
    duration?: number;
    icon?: string;
  }) => void;
  clear: () => void;
}

// 浏览器API接口
export interface BrowserAPIs {
  localStorage?: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
  location?: {
    href: string;
  };
}

// 扩展的请求配置
export interface RequestOptions extends AxiosRequestConfig {
  // 重试相关配置
  retry?: {
    times: number;
    delay: number;
  };
  // 错误处理配置
  errorHandling?: {
    showErrorMessage?: boolean;
    ignoreBusinessError?: boolean;
  };
  // 是否使用 Mock 数据
  useMock?: boolean;
  // 是否显示加载提示
  showLoading?: boolean;
  // 自定义请求成功条件
  validateStatus?: (status: number) => boolean;
  // 请求标识，用于取消请求
  requestId?: string;
  // 缓存相关配置
  cache?: boolean;
  cacheTime?: number;
}

// 创建请求实例的配置
export interface CreateRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  // 自定义默认重试配置
  defaultRetry?: {
    times: number;
    delay: number;
  };
  // 错误处理钩子
  errorHandler?: (error: RequestError | Error | AxiosError) => void;
  // 请求成功钩子
  responseHandler?: <T>(response: AxiosResponse<ApiResponse<T>>) => T;
  // 请求拦截器钩子
  requestInterceptor?: (config: RequestOptions) => RequestOptions;
  // Toast处理器
  toastHandler?: ToastHandler;
  // 浏览器API
  browserAPIs?: Partial<BrowserAPIs>;
  // 是否开发环境
  isDev?: boolean;
}

// 定义错误类型
export enum ErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  BUSINESS = 'BUSINESS',
  AUTH = 'AUTH',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// 自定义错误
export class RequestError extends Error {
  type: ErrorType;
  code?: number;
  response?: AxiosResponse;
  config?: RequestOptions;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: number,
    response?: AxiosResponse,
    config?: RequestOptions
  ) {
    super(message);
    this.name = 'RequestError';
    this.type = type;
    this.code = code;
    this.response = response;
    this.config = config;
  }
}
