"use client";

import { memo } from 'react';
import { Select, SelectItem, Button, CardHeader, CardBody, Divider } from '@heroui/react';
import { useWizardContext } from '../../context/WizardContext';
import { CachedPreferencesCard } from '@/app/components/CachedPreferencesCard';
import { ErrorAlert } from '@/app/components/common/ErrorAlert';
import { useUserPreferences } from '@/app/hooks/useUserPreferences';
import { useState, useEffect } from 'react';

/**
 * 第一步：选择行业
 */
export const IndustrySelectStep = memo(function IndustrySelectStep() {
  const { state, actions } = useWizardContext();
  const { loadPreferences, clearPreferences } = useUserPreferences();
  const [showCachedCard, setShowCachedCard] = useState(false);
  const [cachedData, setCachedData] = useState<any>(null);

  // 检查缓存
  useEffect(() => {
    const cached = loadPreferences();
    if (cached && cached.industryId && cached.nicheId) {
      setCachedData(cached);
      setShowCachedCard(true);
    }
  }, [loadPreferences]);

  // 使用缓存数据
  const handleUseCached = () => {
    if (!cachedData) return;

    // 验证缓存的行业是否仍然存在
    const industry = state.industries.find((i) => i.id === cachedData.industryId);
    if (!industry) {
      console.warn('缓存的行业不存在，清除缓存');
      clearPreferences();
      setCachedData(null);
      setShowCachedCard(false);
      return;
    }

    // 设置行业和赛道
    actions.selectIndustry(cachedData.industryId, cachedData.industryName);
    actions.selectNiche(cachedData.nicheId);

    // 加载赛道数据
    const nicheData = state.categoryData[cachedData.industryName] || [];
    actions.setNiches(nicheData);

    // 恢复文案
    if (cachedData.contentScripts && cachedData.contentScripts.length > 0) {
      actions.updateContentScripts(cachedData.contentScripts);
    }

    // 跳转到第3步
    setShowCachedCard(false);
    actions.goToStep(3);
  };

  return (
    <>
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-2xl font-bold">第一步：选择您的行业领域</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          请选择您的自媒体账号所属的行业领域
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* 缓存提示卡片 */}
        {showCachedCard && cachedData && (
          <CachedPreferencesCard
            cachedData={cachedData}
            onUseCached={handleUseCached}
            onDismiss={() => setShowCachedCard(false)}
          />
        )}

        {/* 错误提示 */}
        {state.error && <ErrorAlert message={state.error} dismissible onDismiss={actions.clearError} />}

        {/* 行业选择 */}
        <Select
          label="选择行业领域"
          placeholder="请选择一个行业"
          selectedKeys={state.selectedIndustry ? [state.selectedIndustry] : []}
          onChange={(e) => {
            const industryId = e.target.value;
            const industry = state.industries.find((i) => i.id === industryId);
            if (industry) {
              actions.selectIndustry(industryId, industry.name);
            }
          }}
          size="lg"
          className="w-full"
        >
          {state.industries.map((industry) => (
            <SelectItem key={industry.id} textValue={industry.name}>
              <div className="py-1">
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {industry.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* 下一步按钮 */}
        <div className="flex justify-end mt-6">
          <Button
            color="success"
            size="lg"
            onPress={actions.goToNextStep}
            className="w-full sm:w-auto bg-success text-white"
          >
            下一步
          </Button>
        </div>
      </CardBody>
    </>
  );
});

