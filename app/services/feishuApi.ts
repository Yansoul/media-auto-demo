import { FeishuTaskRecord, FeishuTopicResult } from "../types/topic.types";

// 飞书 API 基础 URL
const FEISHU_API_BASE = "https://open.feishu.cn/open-apis";

// 获取飞书访问令牌
export async function getFeishuAccessToken(): Promise<string> {
  const appId = process.env.FEISHU_ACCESS_KEY_ID;
  const appSecret = process.env.FEISHU_SECRET_ACCESS_KEY;

  if (!appId || !appSecret) {
    throw new Error("飞书应用凭证未配置");
  }

  const requestBody = {
    app_id: appId,
    app_secret: appSecret,
  };

  const response = await fetch(
    `${FEISHU_API_BASE}/auth/v3/app_access_token/internal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

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
export async function searchTaskStatus(
  jobId: string
): Promise<FeishuTaskRecord | null> {
  const token = await getFeishuAccessToken();
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID_TASK;

  if (!appToken || !tableId) {
    throw new Error("飞书表格配置未完成");
  }

  // 使用飞书多维表格搜索 API
  const response = await fetch(
    `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          conjunction: "and",
          conditions: [
            {
              field_name: "jobId",
              operator: "is",
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
export async function searchTopicResults(
  jobId: string
): Promise<FeishuTopicResult[]> {
  const token = await getFeishuAccessToken();
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID_TOPIC;

  if (!appToken || !tableId) {
    throw new Error("飞书表格配置未完成");
  }

  // 使用飞书多维表格搜索 API
  const response = await fetch(
    `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          conjunction: "and",
          conditions: [
            {
              field_name: "jobId",
              operator: "is",
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

  const items = data.data?.items || [];

  // 转换飞书数据格式为代码期望的格式
  const transformedItems = items.map((item: any) => {
    const fields = item.fields || {};

    // 辅助函数：提取数组字段的文本值
    const extractText = (fieldArray: any[]): string => {
      if (!Array.isArray(fieldArray) || fieldArray.length === 0) return "";
      return fieldArray[0]?.text || "";
    };

    return {
      record_id: item.record_id,
      fields: {
        jobId: extractText(fields.jobId),
        title: extractText(fields["标题"]),
        match_score: extractText(fields["选题契合度"]),
        analysis_reason: extractText(fields["分析理由"]),
        execution_strategy: extractText(fields["执行策略建议"]),
        video_link:
          extractText(fields["抖音链接"]) || extractText(fields["视频链接"]),
        created_at: fields["创建时间"] || item.created_time,
      },
    };
  });

  return transformedItems;
}
