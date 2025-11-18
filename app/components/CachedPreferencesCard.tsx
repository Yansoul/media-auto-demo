import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { UserPreferences } from "../types/preferences";

interface CachedPreferencesCardProps {
  cachedData: UserPreferences;
  onUseCached: () => void;
  onDismiss: () => void;
}

/**
 * 缓存偏好设置提示卡片
 * 非阻塞式设计，显示在第一步顶部
 */
export function CachedPreferencesCard({
  cachedData,
  onUseCached,
  onDismiss,
}: CachedPreferencesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          上次选择：
          <span className="font-medium ml-1">
            {cachedData.industryName} / {cachedData.nicheName}
          </span>
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button size="sm" variant="flat" onPress={onUseCached}>
            继续使用
          </Button>
          <button
            onClick={onDismiss}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
}
