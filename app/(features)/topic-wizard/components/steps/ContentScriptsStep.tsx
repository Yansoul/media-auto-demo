"use client";

import { memo } from 'react';
import { Textarea, Button, CardHeader, CardBody, Divider } from '@heroui/react';
import { useWizardContext } from '../../context/WizardContext';
import { ErrorAlert } from '@/app/components/common/ErrorAlert';
import { CONTENT_LIMITS, INFO_MESSAGES } from '@/app/lib/constants';

/**
 * 第三步：输入文案
 */
export const ContentScriptsStep = memo(function ContentScriptsStep() {
  const { state, actions } = useWizardContext();

  const handleAddScript = () => {
    if (state.contentScripts.length < CONTENT_LIMITS.SCRIPT_MAX_COUNT) {
      actions.updateContentScripts([...state.contentScripts, '']);
    }
  };

  const handleRemoveScript = (index: number) => {
    if (state.contentScripts.length > 1) {
      const newScripts = state.contentScripts.filter((_, i) => i !== index);
      actions.updateContentScripts(newScripts);
    }
  };

  const handleUpdateScript = (index: number, value: string) => {
    const newScripts = [...state.contentScripts];
    newScripts[index] = value.slice(0, CONTENT_LIMITS.SCRIPT_MAX_LENGTH);
    actions.updateContentScripts(newScripts);
  };

  const handleSkip = () => {
    actions.updateContentScripts(['', '', '']);
    actions.goToNextStep();
  };

  return (
    <>
      <CardHeader className="flex flex-col items-start">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            输入历史视频文案词稿（可选）
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          提供您已发布的视频文案词稿，AI 将学习您的风格和特点，生成更符合您账号风格的选题建议
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* 错误提示 */}
        {state.error && <ErrorAlert message={state.error} dismissible onDismiss={actions.clearError} />}

        <div className="space-y-4">
          {/* 头部操作栏 */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              请复制您已发布视频的代表性文案：
            </p>
            <Button
              size="sm"
              color="success"
              variant="flat"
              onPress={handleAddScript}
              isDisabled={state.contentScripts.length >= CONTENT_LIMITS.SCRIPT_MAX_COUNT}
            >
              + 添加文案
            </Button>
          </div>

          {/* 文案输入列表 */}
          {state.contentScripts.map((script, index) => (
            <div key={index} className="relative">
              <Textarea
                label={`文案词稿 ${index + 1}（${script.length}/${CONTENT_LIMITS.SCRIPT_MAX_LENGTH}）`}
                placeholder="请输入视频文案内容..."
                value={script}
                onValueChange={(value) => handleUpdateScript(index, value)}
                maxLength={CONTENT_LIMITS.SCRIPT_MAX_LENGTH}
                minRows={4}
                maxRows={8}
                className="w-full"
              />
              {state.contentScripts.length > 1 && (
                <button
                  onClick={() => handleRemoveScript(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all opacity-60 hover:opacity-100"
                  title="删除此文案"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {/* 提示信息 */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {INFO_MESSAGES.CONTENT_SCRIPT_TIP}
            </p>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            variant="bordered"
            size="lg"
            onPress={actions.goToPreviousStep}
            className="w-full sm-w-auto"
          >
            返回
          </Button>
          <Button
            variant="light"
            size="lg"
            onPress={handleSkip}
            className="w-full sm:w-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            跳过此步骤
          </Button>
          <Button
            color="success"
            size="lg"
            onPress={actions.goToNextStep}
            className="w-full sm-w-auto text-white"
          >
            继续
          </Button>
        </div>
      </CardBody>
    </>
  );
});

