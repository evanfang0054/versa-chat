import { createRequest } from '@versa-chat/utils';
import { Toast } from 'antd-mobile';
import type { RequestOptions, ApiResponse, ToastHandler } from '@versa-chat/utils';

// 创建移动端专用的请求实例
export const http = createRequest({
  baseURL: import.meta.env.DEV ? '/' : import.meta.env.VITE_API_URL,
  // 150秒超时
  timeout: 300000,
  toastHandler: {
    show: (options: Parameters<ToastHandler['show']>[0]) =>
      Toast.show({
        content: options.content,
        position: options.position || 'top',
        duration: options.duration || 2000,
      }),
    clear: Toast.clear,
  },
  browserAPIs: {
    localStorage: window.localStorage,
    location: window.location,
  },
  responseHandler: (response): any => {
    return response.data;
  },
  errorHandler: (error) => {
    console.log('error', error);
  },
  isDev: import.meta.env.DEV,
});

// 导出请求类型
export type { RequestOptions, ApiResponse };
