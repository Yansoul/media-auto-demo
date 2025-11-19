/**
 * 统一的错误处理工具
 * 提供错误类定义、错误转换和格式化工具
 */

import { ERROR_MESSAGES } from './constants';

/**
 * 应用错误基类
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API 请求错误
 */
export class ApiError extends AppError {
  public readonly endpoint?: string;

  constructor(message: string, statusCode: number = 500, endpoint?: string) {
    super(message, statusCode, true);
    this.endpoint = endpoint;
  }
}

/**
 * 网络错误
 */
export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK) {
    super(message, 0, true);
  }
}

/**
 * 超时错误
 */
export class TimeoutError extends AppError {
  constructor(message: string = ERROR_MESSAGES.TIMEOUT) {
    super(message, 408, true);
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 400, true);
    this.field = field;
  }
}

/**
 * 业务逻辑错误
 */
export class BusinessError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode, true);
  }
}

/**
 * 轮询超时错误
 */
export class PollingTimeoutError extends AppError {
  public readonly attemptCount?: number;

  constructor(message: string, attemptCount?: number) {
    super(message, 408, true);
    this.attemptCount = attemptCount;
  }
}

/**
 * 错误类型守卫
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * 将未知错误转换为 AppError
 */
export function normalizeError(error: unknown): AppError {
  // 如果已经是 AppError，直接返回
  if (isAppError(error)) {
    return error;
  }

  // 处理标准 Error
  if (error instanceof Error) {
    // 检查是否是网络错误
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message);
    }

    // 检查是否是超时错误
    if (error.message.includes('timeout')) {
      return new TimeoutError(error.message);
    }

    return new AppError(error.message);
  }

  // 处理字符串
  if (typeof error === 'string') {
    return new AppError(error);
  }

  // 处理对象
  if (error && typeof error === 'object') {
    const errorObj = error as any;
    const message = errorObj.message || errorObj.error || ERROR_MESSAGES.GENERIC;
    const statusCode = errorObj.statusCode || errorObj.status || 500;
    return new AppError(message, statusCode);
  }

  // 未知错误
  return new AppError(ERROR_MESSAGES.GENERIC);
}

/**
 * 获取用户友好的错误消息
 */
export function getUserFriendlyMessage(error: unknown): string {
  const normalizedError = normalizeError(error);

  // 根据错误类型返回友好消息
  if (isNetworkError(normalizedError)) {
    return ERROR_MESSAGES.NETWORK;
  }

  if (isTimeoutError(normalizedError)) {
    return ERROR_MESSAGES.TIMEOUT;
  }

  if (isValidationError(normalizedError)) {
    return (normalizedError as ValidationError).message;
  }

  // 如果是 API 错误，根据状态码返回消息
  if (isApiError(normalizedError)) {
    const apiError = normalizedError as ApiError;
    switch (apiError.statusCode) {
      case 400:
        return '请求参数错误，请检查输入';
      case 401:
        return '未授权，请重新登录';
      case 403:
        return '无权限访问此资源';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误，请稍后重试';
      case 503:
        return '服务暂时不可用，请稍后重试';
      default:
        return apiError.message || ERROR_MESSAGES.GENERIC;
    }
  }

  // 返回错误消息或通用消息（normalizedError 始终是 AppError 类型）
  return (normalizedError as AppError).message || ERROR_MESSAGES.GENERIC;
}

/**
 * 格式化错误用于日志记录
 */
export function formatErrorForLogging(error: unknown): {
  name: string;
  message: string;
  statusCode?: number;
  stack?: string;
  timestamp: string;
  [key: string]: any;
} {
  const normalizedError = normalizeError(error);

  return {
    name: normalizedError.name,
    message: normalizedError.message,
    statusCode: normalizedError.statusCode,
    stack: normalizedError.stack,
    timestamp: normalizedError.timestamp.toISOString(),
    isOperational: normalizedError.isOperational,
  };
}

/**
 * 处理 Fetch API 响应错误
 */
export async function handleFetchError(response: Response): Promise<never> {
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch {
    // 如果响应体不是 JSON，使用默认消息
  }

  throw new ApiError(errorMessage, response.status, response.url);
}

/**
 * 错误重试判断
 * 判断错误是否应该重试
 */
export function shouldRetry(error: unknown, attemptCount: number, maxAttempts: number): boolean {
  // 如果已达到最大重试次数，不再重试
  if (attemptCount >= maxAttempts) {
    return false;
  }

  // 网络错误可以重试
  if (isNetworkError(error)) {
    return true;
  }

  // 超时错误可以重试
  if (isTimeoutError(error)) {
    return true;
  }

  // API 错误根据状态码判断
  if (isApiError(error)) {
    // 5xx 错误可以重试
    if (error.statusCode >= 500 && error.statusCode < 600) {
      return true;
    }
    // 429 (Too Many Requests) 可以重试
    if (error.statusCode === 429) {
      return true;
    }
  }

  // 其他错误不重试
  return false;
}

