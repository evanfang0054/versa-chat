import { Component, ReactNode } from 'react';
import { getAllTracker } from '@/utils/tracker';
import ErrorBoundary from '@/components/error-boundary';

interface KeepAliveErrorBoundaryProps {
  children: ReactNode;
  pageId?: string;
}

interface KeepAliveErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class KeepAliveErrorBoundary extends Component<
  KeepAliveErrorBoundaryProps,
  KeepAliveErrorBoundaryState
> {
  constructor(props: KeepAliveErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): KeepAliveErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 发送KeepAlive相关错误到监控系统
    getAllTracker()
      .getInstanaTracker()
      .sendErr({
        type: 'KeepAliveErrorBoundary',
        message: `KeepAlive error occurred${this.props.pageId ? ` for page: ${this.props.pageId}` : ''}`,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        pageId: this.props.pageId,
      });

    console.error('KeepAlive Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundary />;
    }

    return this.props.children;
  }
}
