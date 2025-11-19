import { useState, useCallback } from 'react';
import { UserPreferences, CachedPreferences } from '../types/preferences.types';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/localStorage';

const STORAGE_KEY = 'media_auto_user_preferences';
const CACHE_VERSION = '1.0';

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  isLoaded: boolean;
  loadPreferences: () => UserPreferences | null;
  savePreferences: (data: Partial<UserPreferences>) => void;
  clearPreferences: () => void;
}

/**
 * 用户偏好设置 Hook
 * 管理用户的行业、赛道和文案选择的本地缓存
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * 从 localStorage 加载用户偏好
   */
  const loadPreferences = useCallback((): UserPreferences | null => {
    try {
      const cached = safeGetItem<CachedPreferences>(STORAGE_KEY);
      
      if (!cached || !cached.data) {
        setIsLoaded(true);
        return null;
      }

      // 检查缓存版本
      if (cached.version !== CACHE_VERSION) {
        console.info('Cache version mismatch, clearing old cache');
        safeRemoveItem(STORAGE_KEY);
        setIsLoaded(true);
        return null;
      }

      // 验证数据完整性
      const data = cached.data;
      if (!data.industryId || !data.nicheId) {
        console.warn('Incomplete cached data, clearing cache');
        safeRemoveItem(STORAGE_KEY);
        setIsLoaded(true);
        return null;
      }

      setPreferences(data);
      setIsLoaded(true);
      return data;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      safeRemoveItem(STORAGE_KEY);
      setIsLoaded(true);
      return null;
    }
  }, []);

  /**
   * 保存用户偏好到 localStorage
   * 支持部分更新
   */
  const savePreferences = useCallback((data: Partial<UserPreferences>) => {
    try {
      const currentPreferences = preferences || {
        industryId: '',
        industryName: '',
        nicheId: '',
        nicheName: '',
        contentScripts: [],
        timestamp: Date.now(),
      };

      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...data,
        timestamp: Date.now(),
      };

      const cached: CachedPreferences = {
        version: CACHE_VERSION,
        data: updatedPreferences,
      };

      const success = safeSetItem(STORAGE_KEY, cached);
      if (success) {
        setPreferences(updatedPreferences);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  /**
   * 清除用户偏好缓存
   */
  const clearPreferences = useCallback(() => {
    try {
      safeRemoveItem(STORAGE_KEY);
      setPreferences(null);
    } catch (error) {
      console.error('Failed to clear preferences:', error);
    }
  }, []);

  return {
    preferences,
    isLoaded,
    loadPreferences,
    savePreferences,
    clearPreferences,
  };
}

