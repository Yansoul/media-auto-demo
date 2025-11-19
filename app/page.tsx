"use client";

import dynamic from 'next/dynamic';
import { FullScreenLoader } from './components/common/LoadingSpinner';

// 动态导入向导容器，避免 SSR 问题
const TopicWizardContainer = dynamic(
  () => import('./(features)/topic-wizard/TopicWizardContainer'),
  {
    ssr: false,
    loading: () => <FullScreenLoader label="加载中..." />,
  }
);

/**
 * 主页面
 * 简化为容器组件，实际功能由 TopicWizardContainer 实现
 */
export default function Home() {
  return <TopicWizardContainer />;
}
