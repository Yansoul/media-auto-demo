"use client";

import { createContext, useContext } from 'react';
import { WizardContextType } from '@/app/types/wizard.types';

/**
 * 向导 Context
 */
export const WizardContext = createContext<WizardContextType | undefined>(
  undefined
);

/**
 * 使用向导 Context 的 Hook
 */
export function useWizardContext(): WizardContextType {
  const context = useContext(WizardContext);
  
  if (!context) {
    throw new Error('useWizardContext 必须在 WizardProvider 内部使用');
  }
  
  return context;
}

