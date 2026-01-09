import { AliveScope } from 'react-activation';
import { ReactNode, useEffect } from 'react';
import { getAllTracker } from '@/utils/tracker';

interface KeepAliveProviderProps {
  children: ReactNode;
}

export default function KeepAliveProvider({ children }: KeepAliveProviderProps) {
  useEffect(() => {
    try {
      // KeepAliveProvider 初始化成功
      console.log('KeepAliveProvider initialized successfully');
    } catch (error) {
      // KeepAliveProvider 初始化失败
      getAllTracker()
        .getInstanaTracker()
        .sendErr({
          type: 'KeepAliveProvider',
          message: 'KeepAliveProvider initialization failed',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
    }
  }, []);

  return <AliveScope>{children}</AliveScope>;
}
