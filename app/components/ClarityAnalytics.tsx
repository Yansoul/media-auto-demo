'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export function ClarityAnalytics() {
  useEffect(() => {
    // 只在生产环境中初始化 Clarity
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) {
      clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
    }
  }, []);

  return null;
}

