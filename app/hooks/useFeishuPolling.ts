import { useState, useRef, useCallback, useEffect } from 'react';
import {
  PollingState,
  FeishuTopicResult,
  UseFeishuPollingReturn,
  PollingConfig,
} from '../types/topic.types';

const DEFAULT_CONFIG: PollingConfig = {
  intervalMs: 5000, // 5秒轮询一次
  maxDuration: 10 * 60 * 1000, // 最大轮询10分钟
  maxAttempts: 120, // 最大轮询120次
};

export function useFeishuPolling(config: Partial<PollingConfig> = {}): UseFeishuPollingReturn {
  const [pollingState, setPollingState] = useState<PollingState>(PollingState.IDLE);
  const [topicResults, setTopicResults] = useState<FeishuTopicResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const jobIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(0);
  const seenRecordIdsRef = useRef<Set<string>>(new Set());
  const configRef = useRef<PollingConfig>({ ...DEFAULT_CONFIG, ...config });

  // 清理定时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 检查任务状态
  const checkTaskStatus = useCallback(async (jobId: string): Promise<'processing' | 'finished' | 'error'> => {
    try {
      const response = await fetch(`/api/feishu/task-status?jobId=${encodeURIComponent(jobId)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // 任务记录未找到，可能还未创建，继续轮询
          return 'processing';
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.status || 'processing';
    } catch (err) {
      console.error('检查任务状态失败:', err);
      // 单次失败不中断轮询
      return 'processing';
    }
  }, []);

  // 获取选题结果
  const fetchTopicResults = useCallback(async (jobId: string): Promise<FeishuTopicResult[]> => {
    try {
      const response = await fetch(`/api/feishu/topic-results?jobId=${encodeURIComponent(jobId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error('获取选题结果失败:', err);
      // 单次失败不中断轮询
      return [];
    }
  }, []);

  // 轮询逻辑
  const poll = useCallback(async () => {
    const jobId = jobIdRef.current;
    if (!jobId) return;

    // 检查超时
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed > configRef.current.maxDuration) {
      setError('轮询超时：已超过最大等待时间');
      setPollingState(PollingState.ERROR);
      clearTimer();
      return;
    }

    // 检查最大尝试次数
    if (attemptCount >= configRef.current.maxAttempts) {
      setError('轮询超时：已达到最大尝试次数');
      setPollingState(PollingState.ERROR);
      clearTimer();
      return;
    }

    setAttemptCount((prev) => prev + 1);

    // 1. 先检查任务状态
    setPollingState(PollingState.CHECKING_STATUS);
    const taskStatus = await checkTaskStatus(jobId);

    if (taskStatus === 'finished') {
      // 任务完成，最后获取一次结果然后停止
      setPollingState(PollingState.POLLING_RESULTS);
      const results = await fetchTopicResults(jobId);
      
      // 过滤出新的结果
      const newResults = results.filter(
        (result) => !seenRecordIdsRef.current.has(result.record_id)
      );
      
      if (newResults.length > 0) {
        newResults.forEach((result) => seenRecordIdsRef.current.add(result.record_id));
        setTopicResults((prev) => [...prev, ...newResults]);
      }
      
      setPollingState(PollingState.FINISHED);
      clearTimer();
      return;
    }

    // 2. 如果任务还在处理中，查询选题结果
    setPollingState(PollingState.POLLING_RESULTS);
    const results = await fetchTopicResults(jobId);
    
    // 过滤出新的结果（追加模式）
    const newResults = results.filter(
      (result) => !seenRecordIdsRef.current.has(result.record_id)
    );
    
    if (newResults.length > 0) {
      newResults.forEach((result) => seenRecordIdsRef.current.add(result.record_id));
      setTopicResults((prev) => [...prev, ...newResults]);
    }

    // 3. 继续轮询
    timerRef.current = setTimeout(poll, configRef.current.intervalMs);
  }, [attemptCount, checkTaskStatus, fetchTopicResults, clearTimer]);

  // 启动轮询
  const startPolling = useCallback((jobId: string) => {
    if (!jobId) {
      setError('无效的 jobId');
      return;
    }

    // 重置状态
    jobIdRef.current = jobId;
    startTimeRef.current = Date.now();
    seenRecordIdsRef.current.clear();
    setTopicResults([]);
    setError(null);
    setAttemptCount(0);
    setPollingState(PollingState.CHECKING_STATUS);

    // 清除旧的定时器
    clearTimer();

    // 立即开始第一次轮询
    poll();
  }, [poll, clearTimer]);

  // 停止轮询
  const stopPolling = useCallback(() => {
    clearTimer();
    setPollingState(PollingState.IDLE);
  }, [clearTimer]);

  // 重置轮询状态
  const resetPolling = useCallback(() => {
    clearTimer();
    jobIdRef.current = '';
    startTimeRef.current = 0;
    seenRecordIdsRef.current.clear();
    setPollingState(PollingState.IDLE);
    setTopicResults([]);
    setError(null);
    setAttemptCount(0);
  }, [clearTimer]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    pollingState,
    topicResults,
    error,
    attemptCount,
    startPolling,
    stopPolling,
    resetPolling,
  };
}
