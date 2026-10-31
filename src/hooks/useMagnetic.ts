import { useRef } from 'react';
import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { duration, ease } from '../lib/motion';
import { useCoarsePointer } from './useMediaQuery';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useMagnetic<T extends HTMLElement>(strength = 0.3): RefObject<T> {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || reduced || coarse) return;

      const follow = { duration: duration.base, ease: ease.expo };
      const moveX = gsap.quickTo(element, 'x', follow);
      const moveY = gsap.quickTo(element, 'y', follow);

      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        moveX((event.clientX - (box.left + box.width / 2)) * strength);
        moveY((event.clientY - (box.top + box.height / 2)) * strength);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      element.addEventListener('pointermove', onMove);
      element.addEventListener('pointerleave', onLeave);
      return () => {
        element.removeEventListener('pointermove', onMove);
        element.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [reduced, coarse, strength], revertOnUpdate: true },
  );

  return ref;
}
