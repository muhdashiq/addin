import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useCoarsePointer } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../lib/gsap';
import { duration, ease } from '../lib/motion';

interface TiltCardProps {
  className?: string | undefined;
  children: ReactNode;
  maxTilt?: number;
}

export function TiltCard({ className, children, maxTilt = 9 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();

  useGSAP(
    () => {
      const card = ref.current;
      if (!card || reduced || coarse) return;

      gsap.set(card, { transformPerspective: 900 });
      const follow = { duration: duration.base, ease: ease.out };
      const tiltX = gsap.quickTo(card, 'rotationX', follow);
      const tiltY = gsap.quickTo(card, 'rotationY', follow);

      const onMove = (event: PointerEvent) => {
        const box = card.getBoundingClientRect();
        tiltY(((event.clientX - box.left) / box.width - 0.5) * 2 * maxTilt);
        tiltX(((event.clientY - box.top) / box.height - 0.5) * -2 * maxTilt);
      };
      const onLeave = () => {
        tiltX(0);
        tiltY(0);
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      return () => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [reduced, coarse, maxTilt], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
