/**
 * 分类 API 服务
 * 处理行业和赛道数据获取
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { logger } from '@/app/lib/logger';
import { CategoriesResponse } from '@/app/types/api.types';

/**
 * 获取分类数据（行业和赛道）
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
  logger.debug('获取分类数据');

  try {
    const data = await apiClient.get<CategoriesResponse>(
      API_ENDPOINTS.CATEGORIES
    );

    logger.info('分类数据获取成功', {
      industryCount: data.industry?.length || 0,
      nicheCount: Object.keys(data.niches || {}).length,
    });

    return data;
  } catch (error) {
    logger.error('获取分类数据失败', error);
    throw error;
  }
}

/**
 * 获取行业列表
 */
export async function fetchIndustries() {
  const data = await fetchCategories();
  return data.industry || [];
}

/**
 * 获取特定行业的赛道列表
 */
export async function fetchNichesByIndustry(industryName: string) {
  const data = await fetchCategories();
  return data.niches?.[industryName] || [];
}

