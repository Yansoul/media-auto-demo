"use client";

import { memo } from 'react';
import { Chip } from '@heroui/react';
import { FeishuTopicResult } from '@/app/types/topic.types';
import { TopicResultCard } from './TopicResultCard';

interface TopicResultsListProps {
  results: FeishuTopicResult[];
}

/**
 * 选题结果列表组件
 */
export const TopicResultsList = memo(function TopicResultsList({
  results,
}: TopicResultsListProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          📝 选题结果
        </h3>
        <Chip color="success" variant="flat">
          共 {results.length} 条
        </Chip>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <TopicResultCard
            key={result.record_id}
            result={result}
            index={index}
          />
        ))}
      </div>
    </div>
  );
});

