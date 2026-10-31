import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  /** Stop observing after the first intersection. Use for "mount once" gating. */
  once?: boolean;
}

export function useInView<T extends Element>({
  rootMargin = '0px',
  once = false,
}: UseInViewOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return [ref, inView];
}
