'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ end, suffix = '', duration = 2000 }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const safeEnd = typeof end === 'number' && !isNaN(end) ? end : 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * safeEnd));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(safeEnd);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [safeEnd, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}