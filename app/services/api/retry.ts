/**
 * 重试机制工具
 */

import { shouldRetry } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';

/**
 * 重试配置
 */
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * 默认重试配置
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoff: 2,
};

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算重试延迟（指数退避）
 */
function calculateDelay(attempt: number, baseDelay: number, backoff: number): number {
  return baseDelay * Math.pow(backoff, attempt - 1);
}

/**
 * 带重试的函数执行
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig: RetryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // 判断是否应该重试
      if (
        attempt < finalConfig.maxAttempts &&
        shouldRetry(error, attempt, finalConfig.maxAttempts)
      ) {
        const retryDelay = calculateDelay(attempt, finalConfig.delay, finalConfig.backoff);

        logger.warn(`操作失败，${retryDelay}ms 后重试 (${attempt}/${finalConfig.maxAttempts})`, {
          error: error.message,
        });

        // 调用重试回调
        if (finalConfig.onRetry) {
          finalConfig.onRetry(attempt, error);
        }

        await delay(retryDelay);
        continue;
      }

      // 不重试，抛出错误
      throw error;
    }
  }

  throw lastError;
}

