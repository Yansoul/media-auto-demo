"use client";

import { memo } from 'react';
import { Button, CardHeader, CardBody, Divider, Chip } from '@heroui/react';
import { useWizardContext } from '../../context/WizardContext';
import { PollingStatus } from '../PollingStatus';
import { TopicResultsList } from '../TopicResults/TopicResultsList';
import { LoadingSpinner } from '@/app/components/common/LoadingSpinner';
import { ErrorAlert } from '@/app/components/common/ErrorAlert';
import { PollingState } from '@/app/types/topic.types';

/**
 * 第四步：确认并生成
 */
export const SummaryStep = memo(function SummaryStep() {
  const { state, actions } = useWizardContext();

  const getNicheName = () => {
    return state.niches.find((n) => n.id === state.selectedNiche)?.name || '';
  };

  return (
    <>
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-2xl font-bold">配置完成！</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          您已完成领域选择，可以开始获取选题建议了
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* 生成中的加载状态 */}
        {state.isGenerating && (
          <LoadingSpinner label="正在分析您的领域，生成选题建议..." />
        )}

        {/* 错误提示 */}
        {!state.isGenerating && state.error && (
          <ErrorAlert message={state.error} dismissible onDismiss={actions.clearError} />
        )}

        {/* 配置摘要 */}
        {!state.isGenerating && (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    行业领域
                  </p>
                  <p className="font-medium">{state.selectedIndustryName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    细分赛道
                  </p>
                  <p className="font-medium">{getNicheName()}</p>
                </div>
                {state.contentScripts.some((s) => s.trim()) && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      已提供文案样本
                    </p>
                    <p className="font-medium text-success">
                      {state.contentScripts.filter((s) => s.trim()).length} 个
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 任务ID显示 */}
            {state.jobId && (
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  任务已提交，任务ID:{' '}
                  <span className="font-mono">{state.jobId}</span>
                </p>
              </div>
            )}
          </>
        )}

        {/* 轮询状态显示 */}
        {state.pollingState !== PollingState.IDLE && (
          <PollingStatus />
        )}

        {/* 选题结果展示 */}
        {state.topicResults.length > 0 && (
          <TopicResultsList results={state.topicResults} />
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          {state.pollingState === PollingState.IDLE && (
            <>
              <Button
                variant="bordered"
                size="lg"
                onPress={actions.goToPreviousStep}
                className="w-full sm-w-auto"
              >
                返回修改
              </Button>
              <Button
                color="success"
                size="lg"
                onPress={actions.startGeneration}
                isLoading={state.isGenerating}
                isDisabled={state.isGenerating}
                className="w-full sm-w-auto text-white"
              >
                {state.isGenerating ? '正在生成...' : '获取选题建议'}
              </Button>
            </>
          )}
          
          {state.pollingState === PollingState.FINISHED && (
            <Button
              color="success"
              variant="bordered"
              size="lg"
              onPress={actions.reset}
              className="w-full sm:w-auto"
            >
              开始新的选题
            </Button>
          )}
        </div>
      </CardBody>
    </>
  );
});

