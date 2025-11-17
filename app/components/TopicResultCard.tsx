import { Card, CardBody, CardHeader, Chip, Divider, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { FeishuTopicResult } from "../types/topic";

interface TopicResultCardProps {
  result: FeishuTopicResult;
  index: number;
}

export function TopicResultCard({ result, index }: TopicResultCardProps) {
  const { fields } = result;
  const matchScore = fields.match_score || 0;

  // 根据契合度确定颜色
  const getScoreColor = (score: number): "success" | "warning" | "default" => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "default";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {fields.title || "未命名选题"}
            </h3>
          </div>
          {matchScore > 0 && (
            <Chip
              color={getScoreColor(matchScore)}
              variant="flat"
              size="lg"
              className="ml-4"
            >
              契合度 {matchScore}%
            </Chip>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          {fields.analysis_reason && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                📊 分析理由
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {fields.analysis_reason}
              </p>
            </div>
          )}

          {fields.execution_strategy && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                💡 执行策略建议
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {fields.execution_strategy}
              </p>
            </div>
          )}

          {fields.video_link && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                🎬 参考视频
              </h4>
              <Link
                href={fields.video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {fields.video_link}
              </Link>
            </div>
          )}

          {fields.created_at && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              创建时间：{new Date(fields.created_at).toLocaleString('zh-CN')}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
