import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { duration, ease } from '../lib/motion';
import { useCursor } from '../providers/CursorProvider';
import styles from './CustomCursor.module.css';

const INTERACTIVE = 'a, button, [role="slider"], [data-cursor]';

export function CustomCursor() {
  const { enabled } = useCursor();
  return enabled ? <CursorVisual /> : null;
}

function CursorVisual() {
  const { labelOverride } = useCursor();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const dot = dotRef.current;
      const ring = ringRef.current;
      const label = labelRef.current;
      if (!root || !dot || !ring || !label) return;

      const dotFollow = { duration: duration.quick * 0.5, ease: ease.out };
      const ringFollow = { duration: duration.fast, ease: ease.out };
      const dotX = gsap.quickTo(dot, 'x', dotFollow);
      const dotY = gsap.quickTo(dot, 'y', dotFollow);
      const ringX = gsap.quickTo(ring, 'x', ringFollow);
      const ringY = gsap.quickTo(ring, 'y', ringFollow);

      const onMove = (event: PointerEvent) => {
        root.dataset.visible = 'true';
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        if (!(event.target instanceof Element)) return;
        const labelled = event.target.closest<HTMLElement>('[data-cursor]');
        const text = labelOverride.current ?? labelled?.dataset.cursor ?? '';
        label.textContent = text;
        root.dataset.state = text ? 'label' : event.target.closest(INTERACTIVE) ? 'hover' : '';
        root.dataset.hidden = String(event.target.tagName === 'INPUT');
      };

      const onDown = () => {
        gsap.to(ring, { scale: 0.85, duration: duration.quick });
      };
      const onUp = () => {
        gsap.to(ring, { scale: 1, duration: duration.fast, ease: ease.pop });
      };
      const onExit = () => {
        root.dataset.visible = 'false';
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onExit);

      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerover', onOver);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.removeEventListener('pointerleave', onExit);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true" data-visible="false">
      <div ref={ringRef} className={styles.ringAnchor}>
        <div className={styles.ring}>
          <span ref={labelRef} className={styles.label} />
        </div>
      </div>
      <div ref={dotRef} className={styles.dotAnchor}>
        <div className={styles.dot} />
      </div>
    </div>
  );
}
