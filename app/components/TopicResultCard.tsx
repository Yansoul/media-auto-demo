import { Card, CardBody, CardHeader, Chip, Divider, Link } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FeishuTopicResult } from "../types/topic";
import { useState } from "react";

interface TopicResultCardProps {
  result: FeishuTopicResult;
  index: number;
}

export function TopicResultCard({ result, index }: TopicResultCardProps) {
  const { fields } = result;
  const matchScore = fields.match_score || "";
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);

  // 根据契合度分数获取颜色配置
  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 90) return "from-green-500 to-emerald-600";
    if (numScore >= 80) return "from-blue-500 to-cyan-600";
    if (numScore >= 70) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  const getScoreTextColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 90) return "text-green-600 dark:text-green-400";
    if (numScore >= 80) return "text-blue-600 dark:text-blue-400";
    if (numScore >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="w-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900">
        <CardHeader className="flex justify-between items-start pb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
              {fields.title || "未命名选题"}
            </h3>
          </div>
          {matchScore && (
            <div className="ml-4 flex flex-col items-end gap-1">
              <div
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getScoreColor(
                  matchScore
                )} shadow-lg transform hover:scale-105 transition-transform`}
              >
                <div className="text-white text-center">
                  <div className="text-xs font-medium opacity-90">契合度</div>
                  <div className="text-2xl font-bold">{matchScore}</div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="gap-5 pt-5">
          {/* 分析理由 - 可折叠 */}
          {fields.analysis_reason && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg">📊</div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    分析理由
                  </h4>
                </div>
                <motion.div
                  animate={{ rotate: isAnalysisExpanded ? 180 : 0 }}
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
                {isAnalysisExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Divider />
                    <div className="p-4 text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none bg-gray-50/50 dark:bg-gray-900/30">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {fields.analysis_reason}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* 执行策略建议 - 最突出的区域 */}
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
              创建时间：{new Date(fields.created_at).toLocaleString("zh-CN")}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
