"use client";

import { Component, ReactNode } from 'react';
import { Button } from '@heroui/react';
import { logger } from '@/app/lib/logger';
import { normalizeError } from '@/app/lib/errors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示降级 UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 记录错误到日志系统
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // 这里可以添加错误上报逻辑
    // reportErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    // 调用父组件提供的重置回调
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义降级 UI，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认降级 UI
      const normalizedError = normalizeError(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-red-200 dark:border-red-800">
            <div className="text-center">
              {/* 错误图标 */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* 错误标题 */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                哎呀，出错了！
              </h1>

              {/* 错误描述 */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                应用程序遇到了一个意外错误。我们已经记录了这个问题，请稍后重试。
              </p>

              {/* 错误详情（仅开发环境显示） */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto max-h-32">
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                    {normalizedError.message}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  color="danger"
                  variant="solid"
                  size="lg"
                  onPress={this.handleReset}
                  className="w-full sm:w-auto"
                >
                  重新尝试
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={() => window.location.href = '/'}
                  className="w-full sm:w-auto"
                >
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

