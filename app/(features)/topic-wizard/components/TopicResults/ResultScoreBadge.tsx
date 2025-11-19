"use client";

import { memo } from 'react';
import { SCORE_THRESHOLDS, SCORE_COLORS } from '@/app/lib/constants';

interface ResultScoreBadgeProps {
  score: string;
}

/**
 * 获取分数对应的颜色配置
 */
function getScoreConfig(score: string) {
  const numScore = parseFloat(score);
  
  if (numScore >= SCORE_THRESHOLDS.EXCELLENT) {
    return SCORE_COLORS.EXCELLENT;
  }
  if (numScore >= SCORE_THRESHOLDS.GOOD) {
    return SCORE_COLORS.GOOD;
  }
  if (numScore >= SCORE_THRESHOLDS.FAIR) {
    return SCORE_COLORS.FAIR;
  }
  return SCORE_COLORS.POOR;
}

/**
 * 分数徽章组件
 */
export const ResultScoreBadge = memo(function ResultScoreBadge({
  score,
}: ResultScoreBadgeProps) {
  if (!score) return null;

  const config = getScoreConfig(score);

  return (
    <div className="ml-4 flex flex-col items-end gap-1">
      <div
        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg transform hover:scale-105 transition-transform`}
      >
        <div className="text-white text-center">
          <div className="text-xs font-medium opacity-90">契合度</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
      </div>
    </div>
  );
});

