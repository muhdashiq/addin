import { Suspense, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { World } from '../content/types';
import { useInView } from '../hooks/useInView';
import { getMountAll, subscribeMountAll } from '../lib/lazyMount';
import styles from './LazySection.module.css';

interface LazySectionProps {
  world: World;
  /** Close to the real height, so the scrollbar and anchors stay roughly right before mounting. */
  placeholderHeight: string;
  children: ReactNode;
}

/** Holds a section's space with a placeholder until the visitor gets near it. */
export function LazySection({ world, placeholderHeight, children }: LazySectionProps) {
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: '120% 0px', once: true });
  const mountAll = useSyncExternalStore(subscribeMountAll, getMountAll);

  const placeholder = (
    <div
      className={styles.placeholder}
      data-world={world}
      data-lazy-pending=""
      style={{ minHeight: placeholderHeight }}
    />
  );

  return (
    <div ref={ref}>
      {near || mountAll ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
}
