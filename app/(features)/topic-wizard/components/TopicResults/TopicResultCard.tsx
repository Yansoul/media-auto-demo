"use client";

import { memo } from 'react';
import { Card, CardBody, CardHeader, Divider, Link } from '@heroui/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FeishuTopicResult } from '@/app/types/topic.types';
import { ResultScoreBadge } from './ResultScoreBadge';
import { ResultAnalysis } from './ResultAnalysis';

interface TopicResultCardProps {
  result: FeishuTopicResult;
  index: number;
}

/**
 * 选题结果卡片组件 - 杂志风格
 */
export const TopicResultCard = memo(function TopicResultCard({
  result,
  index,
}: TopicResultCardProps) {
  const { fields } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none rounded-lg overflow-hidden">
        {/* 标题和分数 */}
        <CardHeader className="flex flex-row justify-between items-start p-6 gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
              {fields.title || '未命名选题'}
            </h3>
          </div>
          <div className="flex-shrink-0">
             <ResultScoreBadge score={fields.match_score || ''} />
          </div>
        </CardHeader>

        <Divider className="bg-gray-100 dark:bg-gray-800 mx-6" />

        <CardBody className="p-6 gap-6">
          {/* 分析理由 */}
          <ResultAnalysis analysisReason={fields.analysis_reason} />

          {/* 执行策略建议 */}
          {fields.execution_strategy && (
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-l-4 border-gray-900 dark:border-gray-500">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>Strategy</span>
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
              </h4>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {fields.execution_strategy}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* 参考视频 */}
          {fields.video_link && (
            <div className="flex items-start sm:items-center gap-3 pt-2">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider mt-1 sm:mt-0">Reference:</span>
              <Link
                href={fields.video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 text-sm underline underline-offset-4 break-all font-medium transition-colors"
              >
                {fields.video_link}
              </Link>
            </div>
          )}

          {/* 元数据 */}
          {fields.created_at && (
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-2 font-mono">
              PUBLISHED: {new Date(fields.created_at).toLocaleDateString('zh-CN').replace(/\//g, '.')}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
});
