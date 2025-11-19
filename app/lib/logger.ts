/**
 * 统一的日志工具
 * 区分开发和生产环境，提供结构化日志
 */

import { isDevelopment, isProduction } from './env';
import { formatErrorForLogging } from './errors';

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * 日志条目接口
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: any;
}

/**
 * 格式化日志时间戳
 */
function formatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 获取日志前缀（带颜色）
 */
function getLogPrefix(level: LogLevel): string {
  const colors = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m',  // Green
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
  };
  const reset = '\x1b[0m';
  
  return `${colors[level]}[${level}]${reset}`;
}

/**
 * 格式化日志输出
 */
function formatLog(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry;
  
  let output = `${getLogPrefix(level)} ${timestamp} - ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    output += `\n  Context: ${JSON.stringify(context, null, 2)}`;
  }
  
  return output;
}

/**
 * 创建日志条目
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: unknown
): LogEntry {
  return {
    level,
    message,
    timestamp: formatTimestamp(),
    context,
    error: error ? formatErrorForLogging(error) : undefined,
  };
}

/**
 * 核心日志函数
 */
function log(
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: unknown
): void {
  const entry = createLogEntry(level, message, context, error);

  // 开发环境：输出格式化的日志
  if (isDevelopment()) {
    const formattedLog = formatLog(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        if (entry.context) console.warn('  Context:', entry.context);
        break;
      case LogLevel.ERROR:
        console.error(formattedLog);
        if (entry.error) console.error('  Error Details:', entry.error);
        if (entry.context) console.error('  Context:', entry.context);
        break;
    }
  }

  // 生产环境：输出结构化 JSON（便于日志收集）
  if (isProduction()) {
    const jsonLog = JSON.stringify(entry);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(jsonLog);
        break;
      case LogLevel.WARN:
        console.warn(jsonLog);
        break;
      default:
        console.log(jsonLog);
    }
  }
}

/**
 * 日志工具类
 */
export const logger = {
  /**
   * 调试日志（仅开发环境）
   */
  debug(message: string, context?: Record<string, any>): void {
    if (isDevelopment()) {
      log(LogLevel.DEBUG, message, context);
    }
  },

  /**
   * 信息日志
   */
  info(message: string, context?: Record<string, any>): void {
    log(LogLevel.INFO, message, context);
  },

  /**
   * 警告日志
   */
  warn(message: string, context?: Record<string, any>): void {
    log(LogLevel.WARN, message, context);
  },

  /**
   * 错误日志
   */
  error(message: string, error?: unknown, context?: Record<string, any>): void {
    log(LogLevel.ERROR, message, context, error);
  },

  /**
   * API 请求日志
   */
  apiRequest(method: string, url: string, context?: Record<string, any>): void {
    this.debug(`API Request: ${method} ${url}`, context);
  },

  /**
   * API 响应日志
   */
  apiResponse(
    method: string,
    url: string,
    status: number,
    duration?: number,
    context?: Record<string, any>
  ): void {
    const message = `API Response: ${method} ${url} - ${status}`;
    const logContext = duration 
      ? { ...context, duration: `${duration}ms` }
      : context;

    if (status >= 500) {
      this.error(message, undefined, logContext);
    } else if (status >= 400) {
      this.warn(message, logContext);
    } else {
      this.debug(message, logContext);
    }
  },

  /**
   * 性能日志
   */
  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.debug(`Performance: ${operation} completed in ${duration}ms`, context);
  },

  /**
   * 用户操作日志
   */
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, context);
  },
};

/**
 * 性能计时器工具
 */
export class PerformanceTimer {
  private startTime: number;
  private operation: string;

  constructor(operation: string) {
    this.operation = operation;
    this.startTime = Date.now();
  }

  /**
   * 结束计时并记录日志
   */
  end(context?: Record<string, any>): number {
    const duration = Date.now() - this.startTime;
    logger.performance(this.operation, duration, context);
    return duration;
  }
}

/**
 * 创建性能计时器
 */
export function startTimer(operation: string): PerformanceTimer {
  return new PerformanceTimer(operation);
}

