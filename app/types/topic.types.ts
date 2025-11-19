// 飞书任务状态表记录类型
export interface FeishuTaskRecord {
  record_id: string;
  fields: {
    jobId: string;
    status: 'processing' | 'finished';
    created_at?: number;
    updated_at?: number;
  };
}

// 飞书选题结果类型
export interface FeishuTopicResult {
  record_id: string;
  fields: {
    jobId: string;
    title: string;
    match_score?: string; // 选题契合度（格式如 "3/10"）
    analysis_reason?: string; // 分析理由
    execution_strategy?: string; // 执行策略建议
    video_link?: string; // 视频链接
    created_at?: number;
  };
}

// 轮询状态枚举
export enum PollingState {
  IDLE = 'idle',
  CHECKING_STATUS = 'checking_status',
  POLLING_RESULTS = 'polling_results',
  FINISHED = 'finished',
  ERROR = 'error',
}

// 轮询配置
export interface PollingConfig {
  intervalMs: number; // 轮询间隔（毫秒）
  maxDuration: number; // 最大轮询时长（毫秒）
  maxAttempts: number; // 最大轮询次数
}

// 轮询钩子返回类型
export interface UseFeishuPollingReturn {
  pollingState: PollingState;
  topicResults: FeishuTopicResult[];
  error: string | null;
  attemptCount: number;
  startPolling: (jobId: string) => void;
  stopPolling: () => void;
  resetPolling: () => void;
}
