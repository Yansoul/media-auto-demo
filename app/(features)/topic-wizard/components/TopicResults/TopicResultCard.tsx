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
 * 选题结果卡片组件（重构版）
 */
export const TopicResultCard = memo(function TopicResultCard({
  result,
  index,
}: TopicResultCardProps) {
  const { fields } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="w-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900">
        {/* 标题和分数 */}
        <CardHeader className="flex justify-between items-start pb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
              {fields.title || '未命名选题'}
            </h3>
          </div>
          <ResultScoreBadge score={fields.match_score || ''} />
        </CardHeader>

        <Divider />

        <CardBody className="gap-5 pt-5">
          {/* 分析理由 */}
          <ResultAnalysis analysisReason={fields.analysis_reason} />

          {/* 执行策略建议 */}
          {fields.execution_strategy && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl"></div>
              <div className="relative p-5 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">💡</div>
                  <h4 className="text-base font-bold text-blue-700 dark:text-blue-300">
                    执行策略建议
                  </h4>
                </div>
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {fields.execution_strategy}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* 参考视频 */}
          {fields.video_link && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <div className="text-2xl">🎬</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  参考视频
                </h4>
                <Link
                  href={fields.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                >
                  {fields.video_link}
                </Link>
              </div>
            </div>
          )}

          {/* 元数据 */}
          {fields.created_at && (
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              创建时间：{new Date(fields.created_at).toLocaleString('zh-CN')}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
});

