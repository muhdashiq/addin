import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../lib/gsap';
import { duration, ease } from '../lib/motion';
import buttonStyles from './Button.module.css';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  actionLabel?: string | undefined;
  onAction?: (() => void) | undefined;
}

export function Toast({ message, actionLabel, onAction }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(ref.current, { y: 24, autoAlpha: 0, duration: duration.fast, ease: ease.out });
    },
    { scope: ref, dependencies: [message, reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={styles.toast} role="status">
      <p>{message}</p>
      {actionLabel && (
        <button type="button" className={buttonStyles.button} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
