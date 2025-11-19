/**
 * API 相关类型定义
 */

/**
 * 行业类型
 */
export interface Industry {
  id: string;
  name: string;
}

/**
 * 赛道类型
 */
export interface Niche {
  id: string;
  name: string;
  label: string;
  value: number;
}

/**
 * 分类数据类型
 */
export interface CategoryData {
  [industryName: string]: Niche[];
}

/**
 * 分类 API 响应
 */
export interface CategoriesResponse {
  industry: Industry[];
  niches: CategoryData;
}

/**
 * Webhook 请求数据
 */
export interface WebhookRequestData {
  trackData: Array<{
    tag: {
      children: Array<{
        label: string;
        value: number;
      }>;
      count: number;
      label: string;
      value: number;
    };
  }>;
  userHistory: string[];
}

/**
 * Webhook 响应数据
 */
export interface WebhookResponse {
  jobId?: string;
  job_id?: string;
  status?: string;
  data?: {
    jobId?: string;
    job_id?: string;
    status?: string;
  };
  [key: string]: any;
}

