import { RequestError, ErrorType, ToastHandler, BrowserAPIs } from './types';

// 默认错误消息
const DEFAULT_ERROR_MESSAGES = {
  [ErrorType.NETWORK]: '网络异常，请检查网络连接',
  [ErrorType.TIMEOUT]: '请求超时，请稍后重试',
  [ErrorType.BUSINESS]: '业务处理失败',
  [ErrorType.AUTH]: '登录已过期，请重新登录',
  [ErrorType.PERMISSION]: '无权限访问该资源',
  [ErrorType.SERVER]: '服务器错误，请稍后重试',
  [ErrorType.CLIENT]: '客户端请求错误',
  [ErrorType.UNKNOWN]: '未知错误',
};

// 默认错误处理
export const defaultErrorHandler = (
  error: RequestError | Error,
  toastHandler?: ToastHandler,
  browserAPIs?: BrowserAPIs
): void => {
  // 使用类型守卫区分错误类型
  if (error instanceof RequestError) {
    // 自动处理未授权错误
    if (error.type === ErrorType.AUTH && browserAPIs?.localStorage && browserAPIs?.location) {
      browserAPIs.localStorage.removeItem('token');
      setTimeout(() => {
        if (browserAPIs.location) {
          browserAPIs.location.href = '/login';
        }
      }, 1500);
    }

    // 显示错误提示
    const errorMessage = error.message || DEFAULT_ERROR_MESSAGES[error.type];

    if (toastHandler) {
      toastHandler.show({
        content: errorMessage,
        position: 'top',
        duration: 2000,
      });
    }

    // 开发环境下在控制台输出详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.group('API Error');
      console.error('Error Type:', error.type);
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Request Config:', error.config);
      console.error('Response:', error.response);
      console.groupEnd();
    }
  } else {
    // 处理普通 Error
    if (toastHandler) {
      toastHandler.show({
        content: error.message || '未知错误',
        position: 'top',
        duration: 2000,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }
  }
};

// 默认请求拦截器
export const defaultRequestInterceptor = (config: any): any => {
  // 在这里可以添加全局请求拦截逻辑
  return config;
};

// 默认响应处理器
export const defaultResponseHandler = (response: any): any => {
  return response.data?.data;
};
