import { useEffect, useRef } from 'react';

export function useAutoScroll(deps: any[], index: number | 'LAST') {
  // const containerRef = useRef<HTMLDivElement>(null);
  const virtuoso = useRef<any>(null);

  useEffect(() => {
    if (virtuoso.current) {
      virtuoso.current.scrollToIndex({
        index,
        align: 'end',
      });
    }
  }, deps);

  return virtuoso;
}
