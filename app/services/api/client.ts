/**
 * 统一的 API 客户端
 * 封装 fetch，提供统一的错误处理、重试机制和日志记录
 */

import { HTTP_CONFIG } from '@/app/lib/constants';
import { 
  ApiError, 
  NetworkError, 
  TimeoutError, 
  shouldRetry,
  handleFetchError 
} from '@/app/lib/errors';
import { logger, startTimer } from '@/app/lib/logger';

/**
 * 请求配置接口
 */
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: {
    attempts?: number;
    delay?: number;
    backoff?: number;
  };
  skipErrorLog?: boolean;
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算重试延迟（指数退避）
 */
function calculateRetryDelay(
  attempt: number,
  baseDelay: number,
  backoff: number
): number {
  return baseDelay * Math.pow(backoff, attempt - 1);
}

/**
 * 创建带超时的 fetch
 */
async function fetchWithTimeout(
  url: string,
  config: RequestConfig
): Promise<Response> {
  const timeout = config.timeout || HTTP_CONFIG.TIMEOUT;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new TimeoutError(`请求超时 (${timeout}ms): ${url}`);
    }
    
    throw new NetworkError(`网络请求失败: ${error.message}`);
  }
}

/**
 * 核心请求函数（带重试）
 */
async function requestWithRetry<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const retryConfig = {
    attempts: config.retry?.attempts ?? HTTP_CONFIG.RETRY_ATTEMPTS,
    delay: config.retry?.delay ?? HTTP_CONFIG.RETRY_DELAY,
    backoff: config.retry?.backoff ?? HTTP_CONFIG.RETRY_BACKOFF,
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
    try {
      // 开始计时
      const timer = startTimer(`API Request: ${config.method || 'GET'} ${url}`);

      // 发送请求
      const response = await fetchWithTimeout(url, config);
      
      // 记录响应日志
      const duration = timer.end();
      logger.apiResponse(
        config.method || 'GET',
        url,
        response.status,
        duration
      );

      // 处理非 2xx 响应
      if (!response.ok) {
        await handleFetchError(response);
      }

      // 解析响应
      const data = await response.json();
      return data as T;

    } catch (error: any) {
      lastError = error;

      // 判断是否应该重试
      if (attempt < retryConfig.attempts && shouldRetry(error, attempt, retryConfig.attempts)) {
        const retryDelay = calculateRetryDelay(attempt, retryConfig.delay, retryConfig.backoff);
        
        logger.warn(`请求失败，${retryDelay}ms 后重试 (${attempt}/${retryConfig.attempts})`, {
          url,
          error: error.message,
        });

        await delay(retryDelay);
        continue;
      }

      // 不重试，抛出错误
      if (!config.skipErrorLog) {
        logger.error(`API 请求失败`, error, {
          url,
          method: config.method || 'GET',
          attempts: attempt,
        });
      }

      throw error;
    }
  }

  // 所有重试都失败
  throw lastError || new ApiError('请求失败', 500, url);
}

/**
 * API 客户端类
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * 构建完整的 URL
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    
    logger.apiRequest('GET', url);

    return requestWithRetry<T>(url, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    
    logger.apiRequest('POST', url, { body: data });

    return requestWithRetry<T>(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    
    logger.apiRequest('PUT', url, { body: data });

    return requestWithRetry<T>(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    
    logger.apiRequest('DELETE', url);

    return requestWithRetry<T>(url, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    
    logger.apiRequest('PATCH', url, { body: data });

    return requestWithRetry<T>(url, {
      ...config,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// 导出默认实例
export const apiClient = new ApiClient();

// 导出类用于创建自定义实例
export { ApiClient };

