"use client";

import { memo } from 'react';
import { Select, SelectItem, Button, CardHeader, CardBody, Divider } from '@heroui/react';
import { useWizardContext } from '../../context/WizardContext';
import { ErrorAlert } from '@/app/components/common/ErrorAlert';

/**
 * 第二步：选择细分赛道
 */
export const NicheSelectStep = memo(function NicheSelectStep() {
  const { state, actions } = useWizardContext();

  return (
    <>
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-2xl font-bold">第二步：选择细分赛道</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          已选择行业：{state.selectedIndustryName}
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* 错误提示 */}
        {state.error && <ErrorAlert message={state.error} dismissible onDismiss={actions.clearError} />}

        {/* 赛道选择 */}
        <Select
          label="选择细分赛道"
          placeholder="请选择一个赛道"
          selectedKeys={state.selectedNiche ? [state.selectedNiche] : []}
          onChange={(e) => actions.selectNiche(e.target.value)}
          size="lg"
          className="w-full"
        >
          {state.niches.map((niche) => (
            <SelectItem key={niche.id} textValue={niche.name}>
              <div className="flex flex-col gap-1 py-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {niche.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* 按钮组 */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            variant="bordered"
            size="lg"
            onPress={actions.goToPreviousStep}
            className="w-full sm:w-auto"
          >
            返回
          </Button>
          <Button
            color="success"
            size="lg"
            onPress={actions.goToNextStep}
            className="w-full sm:w-auto text-white"
          >
            下一步
          </Button>
        </div>
      </CardBody>
    </>
  );
});

