"use client";

import { memo } from 'react';
import { Progress } from '@heroui/react';
import { motion } from 'framer-motion';
import { WIZARD_STEPS } from '@/app/lib/constants';

interface WizardStepperProps {
  currentStep: number;
}

/**
 * 步骤指示器组件
 */
export const WizardStepper = memo(function WizardStepper({
  currentStep,
}: WizardStepperProps) {
  const steps = WIZARD_STEPS.LABELS;
  const totalSteps = WIZARD_STEPS.TOTAL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-8"
    >
      {/* 进度条 */}
      <Progress
        value={(currentStep / totalSteps) * 100}
        className="max-w-md mx-auto"
        size="sm"
        color="success"
      />

      {/* 步骤图标 */}
      <div className="flex justify-center mt-4 space-x-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-success text-white shadow-lg shadow-success-500/30'
                    : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              <div
                className={`text-xs mt-2 text-center font-medium max-w-20 ${
                  isActive
                    ? 'text-success dark:text-success-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

