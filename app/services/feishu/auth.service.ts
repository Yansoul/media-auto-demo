/**
 * 飞书认证服务
 * 处理飞书 API 认证相关逻辑
 */

import { getEnvConfig } from '@/app/lib/env';
import { ApiError } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';
import { FEISHU_API } from '@/app/lib/constants';

// 飞书 API 基础 URL
const FEISHU_API_BASE = FEISHU_API.BASE_URL;

// Token 缓存（简单的内存缓存）
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * 获取飞书访问令牌
 * 带缓存机制，避免频繁请求
 */
export async function getFeishuAccessToken(): Promise<string> {
  // 检查缓存
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    logger.debug('使用缓存的飞书访问令牌');
    return cachedToken.token;
  }

  const env = getEnvConfig();
  const appId = env.FEISHU_ACCESS_KEY_ID;
  const appSecret = env.FEISHU_SECRET_ACCESS_KEY;

  logger.debug('获取新的飞书访问令牌');

  const requestBody = {
    app_id: appId,
    app_secret: appSecret,
  };

  try {
    const response = await fetch(
      `${FEISHU_API_BASE}${FEISHU_API.AUTH_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `获取飞书访问令牌失败: HTTP ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new ApiError(`飞书 API 错误: ${data.msg}`, data.code);
    }

    const token = data.app_access_token;
    const expiresIn = data.expire || 7200; // 默认2小时

    // 缓存 token（提前5分钟过期以确保安全）
    cachedToken = {
      token,
      expiresAt: Date.now() + (expiresIn - 300) * 1000,
    };

    logger.info('成功获取飞书访问令牌', {
      expiresIn: `${expiresIn}秒`,
    });

    return token;
  } catch (error) {
    logger.error('获取飞书访问令牌失败', error);
    throw error;
  }
}

/**
 * 清除缓存的 token（用于错误恢复）
 */
export function clearCachedToken(): void {
  cachedToken = null;
  logger.debug('已清除缓存的飞书访问令牌');
}

/**
 * 检查 token 是否过期
 */
export function isTokenExpired(): boolean {
  if (!cachedToken) return true;
  return Date.now() >= cachedToken.expiresAt;
}

