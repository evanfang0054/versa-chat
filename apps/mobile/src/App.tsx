import { Suspense, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ErrorBoundary } from '@versa-chat/ui';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import enUS from 'antd-mobile/es/locales/en-US';
import { routes } from './routes';
import { useThemeStore } from './stores/themeStore';
import { getCurrentLanguage } from './utils/i18n';
import { useTranslation } from 'react-i18next';

const App = () => {
  const element = useRoutes(routes);
  const { isDark, pack } = useThemeStore();
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(zhCN);

  // 根据主题状态切换暗黑模式属性
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  // 根据主题包切换 CSS 变量作用域
  useEffect(() => {
    document.documentElement.setAttribute('data-theme-pack', pack);
  }, [pack]);

  // 监听语言变化，同步设置 antd-mobile 的语言包
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLocale(currentLang.startsWith('zh') ? zhCN : enUS);
  }, [i18n.language]);

  return (
    <ConfigProvider locale={locale}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
