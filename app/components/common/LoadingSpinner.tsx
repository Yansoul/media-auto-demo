"use client";

import { Spinner } from '@heroui/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * 统一的加载状态组件
 */
export function LoadingSpinner({
  size = 'lg',
  color = 'primary',
  label,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Spinner size={size} color={color} />
      {label && (
        <p className="text-gray-600 dark:text-gray-300 text-sm animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * 全屏加载组件
 */
export function FullScreenLoader({ label }: { label?: string }) {
  return <LoadingSpinner fullScreen label={label} />;
}

/**
 * 行内加载组件
 */
export function InlineLoader({ label }: { label?: string }) {
  return (
    <div className="py-8 flex justify-center">
      <LoadingSpinner size="md" label={label} />
    </div>
  );
}

