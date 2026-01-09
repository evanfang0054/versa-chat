import { FC, Suspense } from 'react';
import { SpinLoading } from 'antd-mobile';
import { Outlet } from 'react-router-dom';

// 自定义加载组件
const LoadingView = () => (
  <div className="flex items-center justify-center h-full">
    <SpinLoading color="primary" />
  </div>
);

const BasicLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <div className="flex-1">
        <Suspense fallback={<LoadingView />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default BasicLayout;
