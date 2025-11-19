"use client";

import { Chip } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorAlertProps {
  message: string;
  variant?: 'danger' | 'warning' | 'default';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * 统一的错误提示组件
 */
export function ErrorAlert({
  message,
  variant = 'danger',
  dismissible = false,
  onDismiss,
  className = '',
}: ErrorAlertProps) {
  const iconMap = {
    danger: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
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
    ),
    default: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-4 ${className}`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border ${
          variant === 'danger'
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            : variant === 'warning'
            ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400'
        }`}
      >
        <div className="flex-shrink-0">{iconMap[variant]}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="关闭"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 简单的错误 Chip 组件（用于替换现有的 Chip）
 */
export function ErrorChip({ message }: { message: string }) {
  return (
    <div className="mb-4">
      <Chip color="danger" variant="solid">
        {message}
      </Chip>
    </div>
  );
}

/**
 * 带动画的错误提示容器
 */
export function AnimatedErrorAlert({
  message,
  visible,
  onDismiss,
}: {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <ErrorAlert
          message={message}
          dismissible={!!onDismiss}
          onDismiss={onDismiss}
        />
      )}
    </AnimatePresence>
  );
}

