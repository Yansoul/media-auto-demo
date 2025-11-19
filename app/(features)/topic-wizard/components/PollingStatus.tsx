"use client";

import { memo } from 'react';
import { Card, CardBody, Spinner, Chip } from '@heroui/react';
import { useWizardContext } from '../context/WizardContext';
import { PollingState } from '@/app/types/topic.types';
import { INFO_MESSAGES } from '@/app/lib/constants';

/**
 * 轮询状态组件
 */
export const PollingStatus = memo(function PollingStatus() {
  const { state } = useWizardContext();

  const getStatusText = () => {
    switch (state.pollingState) {
      case PollingState.CHECKING_STATUS:
        return INFO_MESSAGES.CHECKING_STATUS;
      case PollingState.POLLING_RESULTS:
        return INFO_MESSAGES.POLLING_RESULTS;
      case PollingState.FINISHED:
        return '✅ 轮询完成！';
      case PollingState.ERROR:
        return '❌ 轮询出错';
      default:
        return '';
    }
  };

  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardBody>
          <div className="flex items-center gap-3">
            <Spinner size="sm" color="primary" />
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white">
                {getStatusText()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                已获取 {state.topicResults.length} 条选题 · 第{' '}
                {state.attemptCount} 次查询
              </p>
            </div>
          </div>
          {state.pollingError && (
            <div className="mt-3">
              <Chip color="danger" variant="flat" size="sm">
                {state.pollingError}
              </Chip>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
});

