/**
 * localStorage 工具函数
 * 处理 SSR、隐私模式等边界情况
 */

/**
 * 检查 localStorage 是否可用
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false; // SSR 环境
  }

  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // 隐私模式或存储已满
    return false;
  }
}

/**
 * 安全地从 localStorage 读取数据
 * @param key 存储键名
 * @returns 解析后的数据，失败返回 null
 */
export function safeGetItem<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to get item from localStorage: ${key}`, error);
    return null;
  }
}

/**
 * 安全地向 localStorage 写入数据
 * @param key 存储键名
 * @param value 要存储的值（会自动 JSON 序列化）
 * @returns 是否成功
 */
export function safeSetItem<T>(key: string, value: T): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`Failed to set item to localStorage: ${key}`, error);
    return false;
  }
}

/**
 * 安全地从 localStorage 删除数据
 * @param key 存储键名
 * @returns 是否成功
 */
export function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
}

