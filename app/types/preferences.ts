/**
 * 用户偏好设置类型定义
 */

export interface UserPreferences {
  // 选中的行业 ID
  industryId: string;
  // 选中的行业名称
  industryName: string;
  // 选中的赛道 ID
  nicheId: string;
  // 选中的赛道名称
  nicheName: string;
  // 用户输入的文案内容列表
  contentScripts: string[];
  // 缓存时间戳
  timestamp: number;
}

export interface CachedPreferences {
  version: string; // 缓存版本号，用于未来升级兼容
  data: UserPreferences;
}

