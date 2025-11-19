"use client";

import { ReactNode, useState, useCallback, useMemo } from 'react';
import { WizardContext } from './WizardContext';
import { WizardState, WizardActions, WizardStep } from '@/app/types/wizard.types';
import { PollingState } from '@/app/types/topic.types';
import { Industry, Niche, CategoryData } from '@/app/types/api.types';
import { useFeishuPolling } from '@/app/hooks/useFeishuPolling';
import { fetchCategories } from '@/app/services/api/categories.api';
import { submitTopicGenerationTask, buildWebhookRequest } from '@/app/services/api/webhook.api';
import { useUserPreferences } from '@/app/hooks/useUserPreferences';
import { logger } from '@/app/lib/logger';
import { getUserFriendlyMessage } from '@/app/lib/errors';
import { ERROR_MESSAGES } from '@/app/lib/constants';

interface WizardProviderProps {
  children: ReactNode;
}

/**
 * 向导状态管理 Provider
 */
export function WizardProvider({ children }: WizardProviderProps) {
  // 基础状态
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  
  // 表单状态
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedIndustryName, setSelectedIndustryName] = useState<string>('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [contentScripts, setContentScripts] = useState<string[]>(['', '', '']);
  
  // UI 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 使用飞书轮询 Hook
  const {
    pollingState,
    topicResults,
    error: pollingError,
    attemptCount,
    startPolling,
  } = useFeishuPolling();
  
  // 使用用户偏好 Hook
  const { savePreferences, clearPreferences } = useUserPreferences();
  
  // 加载分类数据
  const loadCategories = useCallback(async () => {
    try {
      logger.info('开始加载分类数据');
      const data = await fetchCategories();
      setIndustries(data.industry || []);
      setCategoryData(data.niches || {});
      logger.info('分类数据加载成功');
    } catch (err) {
      logger.error('加载分类数据失败', err);
      setError(ERROR_MESSAGES.LOAD_INDUSTRIES_FAILED);
    }
  }, []);
  
  // 加载赛道数据
  const loadNiches = useCallback((industryName: string) => {
    setLoading(true);
    setError('');
    try {
      const nicheData = categoryData[industryName] || [];
      const nicheList: Niche[] = nicheData.map((item) => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.value,
      }));
      setNiches(nicheList);
    } catch (err) {
      logger.error('加载赛道数据失败', err);
      setError(ERROR_MESSAGES.LOAD_NICHES_FAILED);
    } finally {
      setLoading(false);
    }
  }, [categoryData]);
  
  // 步骤验证
  const validateStep = useCallback((step: WizardStep): boolean => {
    switch (step) {
      case 1:
        if (!selectedIndustry) {
          setError(ERROR_MESSAGES.INDUSTRY_REQUIRED);
          return false;
        }
        return true;
      case 2:
        if (!selectedNiche) {
          setError(ERROR_MESSAGES.NICHE_REQUIRED);
          return false;
        }
        return true;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  }, [selectedIndustry, selectedNiche]);
  
  // Actions
  const actions: WizardActions = useMemo(() => ({
    // 步骤导航
    goToNextStep: () => {
      if (!validateStep(currentStep)) {
        return;
      }
      
      if (currentStep === 1) {
        const industry = industries.find((i) => i.id === selectedIndustry);
        if (industry) {
          loadNiches(industry.name);
          savePreferences({
            industryId: selectedIndustry,
            industryName: industry.name,
            nicheId: '',
            nicheName: '',
            contentScripts: [],
            timestamp: Date.now(),
          });
        }
      } else if (currentStep === 2) {
        const niche = niches.find((n) => n.id === selectedNiche);
        if (niche) {
          savePreferences({
            industryId: selectedIndustry,
            industryName: selectedIndustryName,
            nicheId: selectedNiche,
            nicheName: niche.name,
            contentScripts: [],
            timestamp: Date.now(),
          });
        }
      }
      
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as WizardStep);
        setError('');
      }
    },
    
    goToPreviousStep: () => {
      if (currentStep > 1) {
        setCurrentStep((prev) => (prev - 1) as WizardStep);
        setError('');
      }
    },
    
    goToStep: (step: WizardStep) => {
      setCurrentStep(step);
      setError('');
    },
    
    // 数据更新
    setIndustries: (industries: Industry[]) => {
      setIndustries(industries);
    },
    
    setNiches: (niches: Niche[]) => {
      setNiches(niches);
    },
    
    setCategoryData: (data: CategoryData) => {
      setCategoryData(data);
    },
    
    // 表单更新
    selectIndustry: (id: string, name: string) => {
      setSelectedIndustry(id);
      setSelectedIndustryName(name);
    },
    
    selectNiche: (id: string) => {
      setSelectedNiche(id);
    },
    
    updateContentScripts: (scripts: string[]) => {
      setContentScripts(scripts);
      
      // 防抖保存到偏好
      if (selectedIndustry && selectedNiche && scripts.some((s) => s.trim())) {
        savePreferences({
          industryId: selectedIndustry,
          industryName: selectedIndustryName,
          nicheId: selectedNiche,
          nicheName: niches.find((n) => n.id === selectedNiche)?.name || '',
          contentScripts: scripts,
          timestamp: Date.now(),
        });
      }
    },
    
    // UI 控制
    setLoading: (loading: boolean) => {
      setLoading(loading);
    },
    
    setError: (error: string) => {
      setError(error);
    },
    
    clearError: () => {
      setError('');
    },
    
    // 任务控制
    setJobId: (jobId: string) => {
      setJobId(jobId);
    },
    
    setIsGenerating: (generating: boolean) => {
      setIsGenerating(generating);
    },
    
    startGeneration: async () => {
      setIsGenerating(true);
      setError('');
      setJobId('');
      
      try {
        const nicheName = niches.find((n) => n.id === selectedNiche)?.name || '';
        
        const requestData = buildWebhookRequest(
          selectedIndustry,
          selectedIndustryName,
          selectedNiche,
          nicheName,
          contentScripts
        );
        
        logger.info('提交选题生成任务', { requestData });
        
        const jobId = await submitTopicGenerationTask(requestData);
        setJobId(jobId);
        
        // 启动轮询
        startPolling(jobId);
      } catch (err) {
        logger.error('提交选题生成任务失败', err);
        const friendlyMessage = getUserFriendlyMessage(err);
        setError(friendlyMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    
    // 重置
    reset: () => {
      setCurrentStep(1);
      setSelectedIndustry('');
      setSelectedIndustryName('');
      setSelectedNiche('');
      setContentScripts(['', '', '']);
      setJobId('');
      setError('');
      clearPreferences();
    },
  }), [
    currentStep,
    industries,
    niches,
    categoryData,
    selectedIndustry,
    selectedIndustryName,
    selectedNiche,
    contentScripts,
    validateStep,
    loadNiches,
    savePreferences,
    clearPreferences,
    startPolling,
  ]);
  
  // 组合状态
  const state: WizardState = useMemo(() => ({
    currentStep,
    industries,
    niches,
    categoryData,
    selectedIndustry,
    selectedIndustryName,
    selectedNiche,
    contentScripts,
    loading,
    error,
    jobId,
    isGenerating,
    pollingState,
    topicResults,
    pollingError,
    attemptCount,
  }), [
    currentStep,
    industries,
    niches,
    categoryData,
    selectedIndustry,
    selectedIndustryName,
    selectedNiche,
    contentScripts,
    loading,
    error,
    jobId,
    isGenerating,
    pollingState,
    topicResults,
    pollingError,
    attemptCount,
  ]);
  
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);
  
  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
}

