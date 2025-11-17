import { FeishuTaskRecord, FeishuTopicResult } from '../types/topic';

// 飞书 API 基础 URL
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

// 获取飞书访问令牌
export async function getFeishuAccessToken(): Promise<string> {
  const appId = process.env.FEISHU_ACCESS_KEY_ID;
  const appSecret = process.env.FEISHU_SECRET_ACCESS_KEY;

  if (!appId || !appSecret) {
    throw new Error('飞书应用凭证未配置');
  }

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/app_access_token/internal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: appId,
      app_secret: appSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`获取飞书访问令牌失败: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.code !== 0) {
    throw new Error(`飞书 API 错误: ${data.msg}`);
  }

  return data.app_access_token;
}

// 查询任务状态表
export async function searchTaskStatus(jobId: string): Promise<FeishuTaskRecord | null> {
  const token = await getFeishuAccessToken();
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID_TASK;

  if (!appToken || !tableId) {
    throw new Error('飞书表格配置未完成');
  }

  // 使用飞书多维表格搜索 API
  const response = await fetch(
    `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
    }
  );

  if (!response.ok) {
    throw new Error(`查询任务状态失败: ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`飞书 API 错误: ${data.msg}`);
  }

  // 返回第一条匹配的记录
  const records = data.data?.items || [];
  return records.length > 0 ? records[0] : null;
}

// 查询选题结果表
export async function searchTopicResults(jobId: string): Promise<FeishuTopicResult[]> {
  const token = await getFeishuAccessToken();
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID_TOPIC;

  if (!appToken || !tableId) {
    throw new Error('飞书表格配置未完成');
  }

  // 使用飞书多维表格搜索 API
  const response = await fetch(
    `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
        page_size: 100, // 最多获取100条记录
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`查询选题结果失败: ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`飞书 API 错误: ${data.msg}`);
  }

  return data.data?.items || [];
}
