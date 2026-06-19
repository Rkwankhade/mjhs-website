'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ScrollReveal({ children, className, delay = 0, as = 'div' }: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Comp = as as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={cn('reveal', isRevealed && 'revealed', className)}
      style={{ animationDelay: isRevealed ? `${delay}ms` : undefined }}
    >
      {children}
    </Comp>
  );
}
