/**
 * 全局常量管理
 * 集中管理所有 magic numbers 和 strings
 */

// ==================== UI 相关常量 ====================

/**
 * 向导步骤配置
 */
export const WIZARD_STEPS = {
  LABELS: ['选择行业', '选择赛道', '输入文案(可选)', '完成配置'] as const,
  TOTAL: 4,
  INDUSTRY: 1,
  NICHE: 2,
  CONTENT: 3,
  SUMMARY: 4,
} as const;

/**
 * 内容限制
 */
export const CONTENT_LIMITS = {
  SCRIPT_MAX_LENGTH: 2000, // 单个文案最大长度
  SCRIPT_MIN_COUNT: 1, // 最少文案数量
  SCRIPT_MAX_COUNT: 10, // 最多文案数量
  SCRIPT_DEFAULT_COUNT: 3, // 默认文案数量
} as const;

/**
 * 动画时长（毫秒）
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 400,
  SLOW: 600,
  STEP_DELAY: 300,
  CARD_STAGGER: 100, // 卡片交错动画延迟
} as const;

// ==================== 轮询相关常量 ====================

/**
 * 轮询配置
 */
export const POLLING_CONFIG = {
  INTERVAL_MS: 5000, // 5秒轮询一次
  MAX_DURATION: 10 * 60 * 1000, // 最大轮询10分钟
  MAX_ATTEMPTS: 120, // 最大轮询120次
} as const;

/**
 * 任务状态
 */
export const TASK_STATUS = {
  PROCESSING: 'processing',
  FINISHED: 'finished',
  ERROR: 'error',
  NOT_FOUND: 'not_found',
} as const;

// ==================== 存储相关常量 ====================

/**
 * LocalStorage 键名
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'media_auto_user_preferences',
  CACHE_VERSION: '1.0',
} as const;

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  PREFERENCES_VERSION: '1.0',
  CATEGORIES_REVALIDATE: 86400, // 24小时（秒）
  CATEGORIES_TAG: 'douyin-categories',
} as const;

// ==================== API 相关常量 ====================

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  CATEGORIES: '/api/categories',
  WEBHOOK: '/api/webhook',
  FEISHU_TASK_STATUS: '/api/feishu/task-status',
  FEISHU_TOPIC_RESULTS: '/api/feishu/topic-results',
} as const;

/**
 * 飞书 API 配置
 */
export const FEISHU_API = {
  BASE_URL: 'https://open.feishu.cn/open-apis',
  AUTH_ENDPOINT: '/auth/v3/app_access_token/internal',
  BITABLE_SEARCH: (appToken: string, tableId: string) =>
    `/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
  PAGE_SIZE: 100, // 最多获取100条记录
} as const;

/**
 * HTTP 配置
 */
export const HTTP_CONFIG = {
  TIMEOUT: 30000, // 30秒超时
  RETRY_ATTEMPTS: 3, // 重试3次
  RETRY_DELAY: 1000, // 重试延迟1秒
  RETRY_BACKOFF: 2, // 指数退避因子
} as const;

// ==================== 分数相关常量 ====================

/**
 * 契合度分数阈值
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90, // 优秀
  GOOD: 80, // 良好
  FAIR: 70, // 一般
} as const;

/**
 * 分数对应的颜色配置
 */
export const SCORE_COLORS = {
  EXCELLENT: {
    gradient: 'from-green-500 to-emerald-600',
    text: 'text-green-600 dark:text-green-400',
  },
  GOOD: {
    gradient: 'from-blue-500 to-cyan-600',
    text: 'text-blue-600 dark:text-blue-400',
  },
  FAIR: {
    gradient: 'from-yellow-500 to-orange-500',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  POOR: {
    gradient: 'from-gray-400 to-gray-500',
    text: 'text-gray-600 dark:text-gray-400',
  },
} as const;

// ==================== 消息文本常量 ====================

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  // 通用错误
  GENERIC: '操作失败，请稍后重试',
  NETWORK: '网络连接失败，请检查网络后重试',
  TIMEOUT: '请求超时，请稍后重试',
  
  // 表单验证
  INDUSTRY_REQUIRED: '请先选择一个行业',
  NICHE_REQUIRED: '请先选择一个赛道',
  
  // 数据获取
  LOAD_INDUSTRIES_FAILED: '获取行业数据失败，请稍后重试',
  LOAD_NICHES_FAILED: '获取赛道数据失败',
  LOAD_TOPIC_FAILED: '获取选题建议失败，请稍后重试',
  
  // 轮询
  POLLING_TIMEOUT_DURATION: '轮询超时：已超过最大等待时间',
  POLLING_TIMEOUT_ATTEMPTS: '轮询超时：已达到最大尝试次数',
  INVALID_JOB_ID: '无效的任务ID',
  
  // 环境配置
  ENV_NOT_CONFIGURED: '环境变量未配置，请联系管理员',
} as const;

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  PREFERENCES_SAVED: '偏好设置已保存',
  TASK_SUBMITTED: '任务已提交',
  POLLING_COMPLETE: '✅ 轮询完成！',
} as const;

/**
 * 提示消息
 */
export const INFO_MESSAGES = {
  CONTENT_SCRIPT_TIP: 
    '💡 小贴士：选择最能代表您账号风格的文案，包含开头钩子、中间内容和结尾引导语，这样 AI 能更好地学习您的独特风格',
  LOADING: '加载中...',
  CHECKING_STATUS: '正在检查任务状态...',
  POLLING_RESULTS: '正在获取选题结果...',
  GENERATING: '正在分析您的领域，生成选题建议...',
} as const;

// ==================== 类型导出 ====================

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type WizardStep = typeof WIZARD_STEPS.INDUSTRY | 
  typeof WIZARD_STEPS.NICHE | 
  typeof WIZARD_STEPS.CONTENT | 
  typeof WIZARD_STEPS.SUMMARY;

