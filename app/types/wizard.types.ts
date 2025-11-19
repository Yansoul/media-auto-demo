/**
 * 向导相关类型定义
 */

import { PollingState, FeishuTopicResult } from './topic.types';
import { Industry, Niche, CategoryData } from './api.types';

/**
 * 向导步骤
 */
export type WizardStep = 1 | 2 | 3 | 4;

/**
 * 向导状态
 */
export interface WizardState {
  // 当前步骤
  currentStep: WizardStep;
  
  // 数据状态
  industries: Industry[];
  niches: Niche[];
  categoryData: CategoryData;
  
  // 表单数据
  selectedIndustry: string;
  selectedIndustryName: string;
  selectedNiche: string;
  contentScripts: string[];
  
  // UI 状态
  loading: boolean;
  error: string;
  
  // 任务相关
  jobId: string;
  isGenerating: boolean;
  
  // 轮询状态
  pollingState: PollingState;
  topicResults: FeishuTopicResult[];
  pollingError: string | null;
  attemptCount: number;
}

/**
 * 向导操作
 */
export interface WizardActions {
  // 步骤导航
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: WizardStep) => void;
  
  // 数据更新
  setIndustries: (industries: Industry[]) => void;
  setNiches: (niches: Niche[]) => void;
  setCategoryData: (data: CategoryData) => void;
  
  // 表单更新
  selectIndustry: (id: string, name: string) => void;
  selectNiche: (id: string) => void;
  updateContentScripts: (scripts: string[]) => void;
  
  // UI 控制
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  
  // 任务控制
  setJobId: (jobId: string) => void;
  setIsGenerating: (generating: boolean) => void;
  startGeneration: () => Promise<void>;
  
  // 重置
  reset: () => void;
}

/**
 * 向导 Context 类型
 */
export interface WizardContextType {
  state: WizardState;
  actions: WizardActions;
}

