/**
 * 飞书选题结果服务
 * 处理选题结果查询相关逻辑
 */

import { getFeishuAccessToken } from './auth.service';
import { getEnvConfig } from '@/app/lib/env';
import { ApiError } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';
import { FEISHU_API } from '@/app/lib/constants';
import { FeishuTopicResult } from '@/app/types/topic.types';

/**
 * 辅助函数：提取数组字段的文本值
 */
function extractText(fieldArray: any[]): string {
  if (!Array.isArray(fieldArray) || fieldArray.length === 0) return '';
  return fieldArray[0]?.text || '';
}

/**
 * 转换飞书数据格式为应用格式
 */
function transformTopicResult(item: any): FeishuTopicResult {
  const fields = item.fields || {};

  return {
    record_id: item.record_id,
    fields: {
      jobId: extractText(fields.jobId),
      title: extractText(fields['标题']),
      match_score: extractText(fields['选题契合度']),
      analysis_reason: extractText(fields['分析理由']),
      execution_strategy: extractText(fields['执行策略建议']),
      video_link:
        extractText(fields['抖音链接']) || extractText(fields['视频链接']),
      created_at: fields['创建时间'] || item.created_time,
    },
  };
}

/**
 * 查询选题结果表
 */
export async function searchTopicResults(
  jobId: string
): Promise<FeishuTopicResult[]> {
  if (!jobId || jobId.trim() === '') {
    throw new ApiError('jobId 不能为空', 400);
  }

  const token = await getFeishuAccessToken();
  const env = getEnvConfig();
  const appToken = env.FEISHU_APP_TOKEN;
  const tableId = env.FEISHU_TABLE_ID_TOPIC;

  logger.debug('查询飞书选题结果', { jobId });

  const url = `${FEISHU_API.BASE_URL}${FEISHU_API.BITABLE_SEARCH(appToken, tableId)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          conjunction: 'and',
          conditions: [
            {
              field_name: 'jobId',
              operator: 'is',
              value: [jobId],
            },
          ],
        },
        automatic_fields: true,
        page_size: FEISHU_API.PAGE_SIZE,
      }),
    });

    if (!response.ok) {
      throw new ApiError(
        `查询选题结果失败: HTTP ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new ApiError(`飞书 API 错误: ${data.msg}`, data.code);
    }

    const items = data.data?.items || [];
    const transformedItems = items.map(transformTopicResult);

    logger.info('选题结果查询成功', {
      jobId,
      count: transformedItems.length,
    });

    return transformedItems;
  } catch (error) {
    logger.error('查询选题结果失败', error, { jobId });
    throw error;
  }
}

/**
 * 获取选题结果数量
 */
export async function getTopicResultCount(jobId: string): Promise<number> {
  try {
    const results = await searchTopicResults(jobId);
    return results.length;
  } catch (error) {
    logger.error('获取选题结果数量失败', error, { jobId });
    return 0;
  }
}

