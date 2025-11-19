/**
 * 飞书任务状态服务
 * 处理任务状态查询相关逻辑
 */

import { getFeishuAccessToken } from './auth.service';
import { getEnvConfig } from '@/app/lib/env';
import { ApiError } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';
import { FEISHU_API } from '@/app/lib/constants';
import { FeishuTaskRecord } from '@/app/types/topic.types';

/**
 * 查询任务状态表
 */
export async function searchTaskStatus(
  jobId: string
): Promise<FeishuTaskRecord | null> {
  if (!jobId || jobId.trim() === '') {
    throw new ApiError('jobId 不能为空', 400);
  }

  const token = await getFeishuAccessToken();
  const env = getEnvConfig();
  const appToken = env.FEISHU_APP_TOKEN;
  const tableId = env.FEISHU_TABLE_ID_TASK;

  logger.debug('查询飞书任务状态', { jobId });

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
      }),
    });

    if (!response.ok) {
      throw new ApiError(
        `查询任务状态失败: HTTP ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new ApiError(`飞书 API 错误: ${data.msg}`, data.code);
    }

    const records = data.data?.items || [];
    const taskRecord = records.length > 0 ? records[0] : null;

    logger.debug('任务状态查询结果', {
      jobId,
      found: !!taskRecord,
      status: taskRecord?.fields?.status,
    });

    return taskRecord;
  } catch (error) {
    logger.error('查询任务状态失败', error, { jobId });
    throw error;
  }
}

/**
 * 获取任务状态（简化版本）
 */
export async function getTaskStatus(
  jobId: string
): Promise<'processing' | 'finished' | 'error' | 'not_found'> {
  try {
    const taskRecord = await searchTaskStatus(jobId);
    
    if (!taskRecord) {
      return 'not_found';
    }

    return taskRecord.fields.status || 'processing';
  } catch (error) {
    logger.error('获取任务状态失败', error, { jobId });
    return 'error';
  }
}

