"use client";

import { memo, useState } from 'react';
import { Divider } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultAnalysisProps {
  analysisReason?: string;
}

/**
 * 分析理由折叠区组件
 */
export const ResultAnalysis = memo(function ResultAnalysis({
  analysisReason,
}: ResultAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!analysisReason) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="text-lg">📊</div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            分析理由
          </h4>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Divider />
            <div className="p-4 text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none bg-gray-50/50 dark:bg-gray-900/30">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisReason}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

