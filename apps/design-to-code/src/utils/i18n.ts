import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// 预加载的中文资源，确保首次加载时有可用的翻译
import zhCN from '../locales/zh-CN/translation.json';
import en from '../locales/en/translation.json';

// 预加载的资源
const resources = {
  'zh-CN': {
    common: zhCN,
  },
  en: {
    common: en,
  },
};

// 支持的语言列表
const supportedLngs = ['zh-CN', 'en'];

i18n
  // 启用后端插件 - 用于从服务器动态加载翻译资源
  .use(Backend)
  // 启用语言检测插件 - 自动检测用户首选语言
  .use(LanguageDetector)
  // 集成到 React
  .use(initReactI18next)
  .init({
    // 预加载的资源
    resources,
    // 默认语言
    lng: 'zh-CN',
    // 备选语言
    fallbackLng: 'zh-CN',
    // 支持的语言列表
    supportedLngs,
    // 默认命名空间
    defaultNS: 'common',
    // 允许使用嵌套键
    keySeparator: '.',
    // 只在开发环境启用调试
    debug: import.meta.env.DEV,
    // 缓存设置
    load: 'currentOnly', // 只加载当前语言，不加载回退语言
    // 缓存翻译到本地存储
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // 禁用转义
    interpolation: {
      escapeValue: false,
    },
    // 后端配置 - 用于动态加载翻译文件
    backend: {
      // 翻译文件路径模板
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // 请求翻译文件的超时时间
      requestOptions: {
        timeout: 3000,
      },
    },
    // 确保在组件挂载前初始化完成
    react: {
      useSuspense: true,
    },
  });

// 导出类型 - 用于支持TypeScript类型检查
export type TxKeyPath = string;

// 语言切换函数
export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

// 获取当前语言
export const getCurrentLanguage = () => {
  return i18n.language;
};

export default i18n;
