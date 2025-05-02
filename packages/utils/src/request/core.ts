import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from 'axios';
import { ApiResponse, RequestOptions, CreateRequestConfig, ErrorType, RequestError } from './types';
import { Logger } from './logger';
import { defaultErrorHandler } from './handlers';

// 在文件顶部创建一个全局缓存管理器
export const cacheManager = new Map<string, { data: any; timestamp: number }>();

// 维护请求记录
class RequestManager {
  private pendingRequests: Map<string, CancelTokenSource> = new Map();

  // 添加请求
  addRequest(requestId: string, source: CancelTokenSource): void {
    this.pendingRequests.set(requestId, source);
    Logger.debug(`添加请求: ${requestId}, 当前请求数: ${this.pendingRequests.size}`);
  }

  // 移除请求
  removeRequest(requestId: string): void {
    this.pendingRequests.delete(requestId);
    Logger.debug(`移除请求: ${requestId}, 当前请求数: ${this.pendingRequests.size}`);
  }

  // 取消请求
  cancelRequest(requestId: string): void {
    const source = this.pendingRequests.get(requestId);
    if (source) {
      source.cancel('Request canceled');
      this.removeRequest(requestId);
    }
  }

  // 取消所有请求
  cancelAllRequests(): void {
    Logger.debug(`取消所有请求, 共 ${this.pendingRequests.size} 个`);
    this.pendingRequests.forEach((source, id) => {
      source.cancel('Request canceled by user');
      this.removeRequest(id);
    });
  }

  // 获取当前请求数
  getRequestCount(): number {
    return this.pendingRequests.size;
  }
}

// 创建请求实例
export function createRequest(config: CreateRequestConfig = {}) {
  const {
    baseURL = process.env.VITE_API_BASE_URL || '/api',
    timeout = 10000,
    headers = { 'Content-Type': 'application/json' },
    withCredentials = false,
    defaultRetry = { times: 2, delay: 1000 },
    errorHandler,
    responseHandler,
    requestInterceptor,
    toastHandler,
    browserAPIs = {
      localStorage: typeof window !== 'undefined' ? window.localStorage : undefined,
      location: typeof window !== 'undefined' ? window.location : undefined,
    },
    isDev = process.env.NODE_ENV === 'development',
  } = config;

  // 创建axios实例
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers,
    withCredentials,
    validateStatus: (status: number) => {
      // 默认为 2xx 有效
      return status >= 200 && status < 300;
    },
  });

  // 请求管理器
  const requestManager = new RequestManager();

  // 请求重试功能
  const retryRequest = async (config: RequestOptions): Promise<any> => {
    const { retry = defaultRetry } = config;
    let retryCount = 0;

    const execute = async (): Promise<any> => {
      try {
        return await instance(config);
      } catch (err) {
        retryCount++;
        if (retryCount >= retry.times) {
          return Promise.reject(err);
        }

        await new Promise((resolve) => setTimeout(resolve, retry.delay));
        return execute();
      }
    };

    return execute();
  };

  // 添加请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 转换为扩展的请求配置
      const requestConfig = config as unknown as RequestOptions;

      // 获取token
      const token = browserAPIs?.localStorage?.getItem('token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      // 添加时间戳防止缓存
      if (config.method?.toLowerCase() === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      // 创建取消令牌
      if (requestConfig.requestId) {
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        requestManager.addRequest(requestConfig.requestId, source);
      }

      // 应用自定义请求拦截器
      if (requestInterceptor) {
        return requestInterceptor(requestConfig) as InternalAxiosRequestConfig;
      }

      // 在 createRequest 函数内部添加 mock 数据处理逻辑
      if (requestConfig.useMock && isDev) {
        // 获取 mock 数据路径
        const mockPath = `${config.baseURL}/mock${config.url}.json`;
        Logger.info(`[Mock] 使用mock数据: ${mockPath}`);
        config.url = mockPath;
        config.method = 'GET'; // 强制使用 GET 方法
      }

      // 请求时合并自定义验证
      if (requestConfig.validateStatus) {
        config.validateStatus = requestConfig.validateStatus;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(
        new RequestError(
          error.message,
          ErrorType.CLIENT,
          undefined,
          error.response,
          error.config as RequestOptions
        )
      );
    }
  );

  // 添加响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data, config } = response;
      const requestConfig = config as RequestOptions;

      // 请求完成后移除请求记录
      if (requestConfig.requestId) {
        requestManager.removeRequest(requestConfig.requestId);
      }

      // 处理业务错误
      if (data.code !== 0 && !requestConfig.errorHandling?.ignoreBusinessError) {
        const error = new RequestError(
          data.message || '请求失败',
          ErrorType.BUSINESS,
          data.code,
          response,
          requestConfig
        );

        // 调用自定义错误处理器
        if (errorHandler) {
          errorHandler(error);
        } else {
          defaultErrorHandler(error, toastHandler, browserAPIs);
        }

        return Promise.reject(error);
      }

      // 应用自定义响应处理器
      if (responseHandler) {
        return responseHandler(response);
      }

      return data.data;
    },
    async (error: unknown) => {
      // 确保 error 是 AxiosError 类型
      const axiosError = error as AxiosError<ApiResponse>;
      const config = axiosError.config as RequestOptions;

      // 请求完成后移除请求记录
      if (config?.requestId) {
        requestManager.removeRequest(config.requestId);
      }

      // 处理请求取消
      if (axios.isCancel(error)) {
        const cancelError = new RequestError(
          '请求已取消',
          ErrorType.CLIENT,
          undefined,
          undefined,
          config
        );
        defaultErrorHandler(cancelError, toastHandler, browserAPIs);
        return Promise.reject(cancelError);
      }

      // 处理请求超时
      if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
        const timeoutError = new RequestError(
          '请求超时',
          ErrorType.TIMEOUT,
          undefined,
          axiosError.response,
          config
        );

        // 是否重试 - 添加空值检查
        if (config?.retry?.times && config.retry.times > 0) {
          return retryRequest(config);
        }

        // 调用自定义错误处理器
        if (errorHandler) {
          errorHandler(timeoutError);
        } else {
          defaultErrorHandler(timeoutError, toastHandler, browserAPIs);
        }

        return Promise.reject(timeoutError);
      }

      // 处理网络错误
      if (!axiosError.response) {
        const networkError = new RequestError(
          '网络异常，请检查网络连接',
          ErrorType.NETWORK,
          undefined,
          undefined,
          config
        );

        // 调用自定义错误处理器
        if (errorHandler) {
          errorHandler(networkError);
        } else {
          defaultErrorHandler(networkError, toastHandler, browserAPIs);
        }

        return Promise.reject(networkError);
      }

      // 处理 HTTP 错误
      const status = axiosError.response.status;
      let errorType = ErrorType.UNKNOWN;
      let errorMessage = axiosError.response?.data?.message || '请求失败';

      switch (status) {
        case 401:
          errorType = ErrorType.AUTH;
          errorMessage = '未授权或登录已过期';
          break;
        case 403:
          errorType = ErrorType.PERMISSION;
          errorMessage = '无访问权限';
          break;
        case 404:
          errorType = ErrorType.CLIENT;
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorType = ErrorType.SERVER;
          errorMessage = '服务器错误';
          break;
      }

      const httpError = new RequestError(
        errorMessage,
        errorType,
        status,
        axiosError.response,
        config
      );

      // 调用自定义错误处理器
      if (errorHandler) {
        errorHandler(httpError);
      } else {
        defaultErrorHandler(httpError, toastHandler, browserAPIs);
      }

      return Promise.reject(httpError);
    }
  );

  // 封装请求方法
  const request = {
    get: <T = any>(url: string, params: any = {}, options: RequestOptions = {}) => {
      // 处理缓存
      if (options.cache) {
        const cacheKey = `${url}:${JSON.stringify(params)}`;
        const cachedData = cacheManager.get(cacheKey);

        // 如果有缓存且未过期
        if (
          cachedData &&
          (!options.cacheTime || Date.now() - cachedData.timestamp < options.cacheTime)
        ) {
          return Promise.resolve(cachedData.data);
        }

        // 设置缓存回调
        return instance
          .get<any, T>(url, {
            params,
            ...options,
          })
          .then((data: any) => {
            cacheManager.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
            return data;
          });
      }

      return instance.get<any, T>(url, { params, ...options });
    },

    post: <T = any>(url: string, data?: any, options: RequestOptions = {}) =>
      instance.post<any, T>(url, data, options),

    put: <T = any>(url: string, data?: any, options: RequestOptions = {}) =>
      instance.put<any, T>(url, data, options),

    delete: <T = any>(url: string, params: any = {}, options: RequestOptions = {}) =>
      instance.delete<any, T>(url, { params, ...options }),

    patch: <T = any>(url: string, data?: any, options: RequestOptions = {}) =>
      instance.patch<any, T>(url, data, options),

    // 高级功能
    upload: <T = any>(url: string, file: File | FormData, options: RequestOptions = {}) => {
      const formData = file instanceof FormData ? file : new FormData();

      if (!(file instanceof FormData)) {
        formData.append('file', file);
      }

      return instance.post<any, T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...options,
      });
    },

    download: (url: string, params: any = {}, options: RequestOptions = {}) =>
      instance.get(url, {
        params,
        responseType: 'blob',
        ...options,
      }),

    // 取消请求
    cancel: (requestId: string) => requestManager.cancelRequest(requestId),

    // 取消所有请求
    cancelAll: () => requestManager.cancelAllRequests(),

    // 获取请求管理器
    getRequestManager: () => ({
      // 只返回安全的公共方法，不暴露内部实现
      cancelRequest: requestManager.cancelRequest.bind(requestManager),
      cancelAllRequests: requestManager.cancelAllRequests.bind(requestManager),
      getRequestCount: requestManager.getRequestCount.bind(requestManager),
    }),
  };

  return request;
}

// 导出默认错误处理器
export { defaultErrorHandler } from './handlers';
