import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Space, ErrorBlock } from 'antd-mobile';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './interface';
import './style.less';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorBlock fullPage description={this.state.error?.message || '未知错误'}>
          <Space block justify="center">
            <Button className="error-boundary-refresh-btn" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
            <Button className="error-boundary-back-btn" onClick={() => window.history.back()}>
              返回上一页
            </Button>
          </Space>
        </ErrorBlock>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
