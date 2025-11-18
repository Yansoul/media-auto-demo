import { useEffect, DependencyList } from 'react';

/**
 * 防抖 Effect Hook
 * @param effect 要执行的副作用函数
 * @param deps 依赖数组
 * @param delay 防抖延迟时间（毫秒）
 */
export function useDebouncedEffect(
  effect: () => void,
  deps: DependencyList,
  delay: number = 500
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

