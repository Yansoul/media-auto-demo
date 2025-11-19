/**
 * Webhook API 服务
 * 处理选题任务提交
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { logger } from '@/app/lib/logger';
import { ApiError } from '@/app/lib/errors';
import { WebhookRequestData, WebhookResponse } from '@/app/types/api.types';

/**
 * 提交选题生成任务
 */
export async function submitTopicGenerationTask(
  requestData: WebhookRequestData
): Promise<string> {
  logger.info('提交选题生成任务', {
    trackCount: requestData.trackData.length,
    userHistoryCount: requestData.userHistory.length,
  });

  try {
    const response = await apiClient.post<WebhookResponse>(
      API_ENDPOINTS.WEBHOOK,
      requestData
    );

    // 尝试多种可能的响应格式提取 jobId
    const jobId =
      response.jobId ||
      response.job_id ||
      response.data?.jobId ||
      response.data?.job_id;

    if (!jobId) {
      logger.error('响应格式不符合预期', undefined, {
        receivedKeys: Object.keys(response),
        fullResponse: response,
      });

      throw new ApiError(
        `无效的响应格式：缺少 jobId。响应内容: ${JSON.stringify(response)}`,
        500
      );
    }

    logger.info('选题生成任务提交成功', { jobId });

    return jobId;
  } catch (error) {
    logger.error('提交选题生成任务失败', error);
    throw error;
  }
}

/**
 * 构建 Webhook 请求数据
 */
export function buildWebhookRequest(
  industryId: string,
  industryName: string,
  nicheId: string,
  nicheName: string,
  contentScripts: string[]
): WebhookRequestData {
  return {
    trackData: [
      {
        tag: {
          children: [
            {
              label: nicheName,
              value: parseInt(nicheId),
            },
          ],
          count: 0,
          label: industryName,
          value: parseInt(industryId),
        },
      },
    ],
    userHistory: contentScripts.filter((s) => s.trim()),
  };
}

