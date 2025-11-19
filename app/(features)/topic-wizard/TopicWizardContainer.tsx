"use client";

import { useEffect, memo } from 'react';
import { Card } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardProvider } from './context/WizardProvider';
import { useWizardContext } from './context/WizardContext';
import { WizardStepper } from './components/WizardStepper';
import { IndustrySelectStep } from './components/steps/IndustrySelectStep';
import { NicheSelectStep } from './components/steps/NicheSelectStep';
import { ContentScriptsStep } from './components/steps/ContentScriptsStep';
import { SummaryStep } from './components/steps/SummaryStep';
import { LoadingSpinner } from '@/app/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary';
import { useBeforeUnload } from '@/app/hooks/useBeforeUnload';
import { fetchCategories } from '@/app/services/api/categories.api';
import { logger } from '@/app/lib/logger';

/**
 * 向导内容组件
 */
const WizardContent = memo(function WizardContent() {
  const { state, actions } = useWizardContext();

  // 从第3步开始启用离开页面警告
  useBeforeUnload(state.currentStep >= 3);

  // 页面加载时获取分类数据
  useEffect(() => {
    const loadData = async () => {
      try {
        actions.setLoading(true);
        logger.info('加载分类数据');
        const data = await fetchCategories();
        actions.setIndustries(data.industry || []);
        actions.setCategoryData(data.niches || {});
        logger.info('分类数据加载完成');
      } catch (error) {
        logger.error('加载分类数据失败', error);
        actions.setError('加载分类数据失败，请刷新页面重试');
      } finally {
        actions.setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染当前步骤
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <IndustrySelectStep />;
      case 2:
        return <NicheSelectStep />;
      case 3:
        return <ContentScriptsStep />;
      case 4:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            AI 自媒体选题助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            智能分析您的领域，提供优质选题建议
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <WizardStepper currentStep={state.currentStep} />

        {/* 主要内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-full max-w-2xl mx-auto">
              {state.loading ? (
                <div className="py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                renderStep()
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

/**
 * 向导主容器组件
 * 包含 Provider 和内容，带有局部错误边界
 */
export default function TopicWizardContainer() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              选题向导加载失败
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              请刷新页面重试
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-success text-white rounded-lg hover:bg-success-600 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      }
    >
      <WizardProvider>
        <WizardContent />
      </WizardProvider>
    </ErrorBoundary>
  );
}

