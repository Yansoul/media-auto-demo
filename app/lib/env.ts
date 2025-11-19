/**
 * 环境变量验证和管理
 * 在应用启动时验证所有必需的环境变量
 */

interface EnvConfig {
  // 飞书配置
  FEISHU_ACCESS_KEY_ID: string;
  FEISHU_SECRET_ACCESS_KEY: string;
  FEISHU_APP_TOKEN: string;
  FEISHU_TABLE_ID_TASK: string;
  FEISHU_TABLE_ID_TOPIC: string;
  
  // 第三方 API
  TIKUB_API_KEY: string;
  WEBHOOK_API_URL: string;
  
  // Node 环境
  NODE_ENV: 'development' | 'production' | 'test';
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * 验证环境变量是否存在
 */
function validateEnvVar(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new EnvironmentError(
      `缺少必需的环境变量: ${key}\n` +
      `请在 .env.local 文件中配置 ${key}=your_value`
    );
  }
  return value.trim();
}

/**
 * 获取并验证所有环境变量
 */
export function getEnvConfig(): EnvConfig {
  return {
    // 飞书配置
    FEISHU_ACCESS_KEY_ID: validateEnvVar(
      'FEISHU_ACCESS_KEY_ID',
      process.env.FEISHU_ACCESS_KEY_ID
    ),
    FEISHU_SECRET_ACCESS_KEY: validateEnvVar(
      'FEISHU_SECRET_ACCESS_KEY',
      process.env.FEISHU_SECRET_ACCESS_KEY
    ),
    FEISHU_APP_TOKEN: validateEnvVar(
      'FEISHU_APP_TOKEN',
      process.env.FEISHU_APP_TOKEN
    ),
    FEISHU_TABLE_ID_TASK: validateEnvVar(
      'FEISHU_TABLE_ID_TASK',
      process.env.FEISHU_TABLE_ID_TASK
    ),
    FEISHU_TABLE_ID_TOPIC: validateEnvVar(
      'FEISHU_TABLE_ID_TOPIC',
      process.env.FEISHU_TABLE_ID_TOPIC
    ),
    
    // 第三方 API
    TIKUB_API_KEY: validateEnvVar(
      'TIKUB_API_KEY',
      process.env.TIKUB_API_KEY
    ),
    WEBHOOK_API_URL: validateEnvVar(
      'WEBHOOK_API_URL',
      process.env.WEBHOOK_API_URL
    ),
    
    // Node 环境
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  };
}

/**
 * 安全地获取环境变量（不抛出错误）
 * 用于可选的环境变量
 */
export function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key]?.trim() || defaultValue;
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 验证环境变量（仅在服务端调用）
 * 如果验证失败，会抛出详细的错误信息
 */
export function validateEnvironment(): void {
  try {
    getEnvConfig();
    console.log('✅ 环境变量验证通过');
  } catch (error) {
    if (error instanceof EnvironmentError) {
      console.error('❌ 环境变量验证失败:');
      console.error(error.message);
      throw error;
    }
    throw error;
  }
}

// 导出类型
export type { EnvConfig };
export { EnvironmentError };

