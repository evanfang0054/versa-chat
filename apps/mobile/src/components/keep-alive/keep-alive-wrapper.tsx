import { KeepAlive, KeepAliveProps } from 'react-activation';
import { ReactNode, useEffect } from 'react';
import { getAllTracker } from '@/utils/tracker';
import KeepAliveErrorBoundary from './keep-alive-error-boundary';

interface KeepAliveWrapperProps extends Omit<KeepAliveProps, 'children'> {
  children: ReactNode;
  id: string;
}

export default function KeepAliveWrapper({ children, id, ...props }: KeepAliveWrapperProps) {
  useEffect(() => {
    try {
      // KeepAliveWrapper 初始化
      if (!id) {
        throw new Error('KeepAliveWrapper requires an id prop');
      }
      console.log(`KeepAliveWrapper initialized with id: ${id}`);
    } catch (error) {
      // KeepAliveWrapper 初始化失败
      getAllTracker()
        .getInstanaTracker()
        .sendErr({
          type: 'KeepAliveWrapper',
          message: `KeepAliveWrapper initialization failed for id: ${id}`,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          pageId: id,
        });
    }
  }, [id]);

  return (
    <KeepAliveErrorBoundary pageId={id}>
      <KeepAlive
        id={id}
        autoFreeze={false} // React 18+ 兼容性配置
        {...props}
      >
        {children}
      </KeepAlive>
    </KeepAliveErrorBoundary>
  );
}
