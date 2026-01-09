import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// 懒加载路由组件
const DesignToCodePage = lazy(() => import('../pages/DesignToCodePage'));

// 应用路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DesignToCodePage />,
  },
];
