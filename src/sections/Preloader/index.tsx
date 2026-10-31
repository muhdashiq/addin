import { useEffect, useRef } from 'react';
import { content } from '../../content/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease } from '../../lib/motion';
import { readStorage, writeStorage } from '../../lib/storage';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';
import styles from './Preloader.module.css';

const SESSION_KEY = 'addin:booted';

const TYPE_SECONDS_PER_LINE = 0.42;
const COUNT_START = 0.15;
const COUNT_SECONDS = 1.45;
const WIPE_SECONDS = 0.5;

/** The boot sequence plays once per browser session. */
export function shouldShowPreloader(reducedMotion: boolean): boolean {
  return !reducedMotion && readStorage('session', SESSION_KEY) === null;
}

interface PreloaderProps {
  onDone: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { pause, resume } = useSmoothScroll();
  const { preloader } = content;

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]');
      const counter = { value: 0 };

      const timeline = gsap.timeline({
        onComplete: () => {
          writeStorage('session', SESSION_KEY, '1');
          onDone();
        },
      });
      timelineRef.current = timeline;

      lines.forEach((line, index) => {
        const text = preloader.lines[index] ?? '';
        const typed = { length: 0 };
        timeline.to(
          typed,
          {
            length: text.length,
            duration: TYPE_SECONDS_PER_LINE,
            ease: ease.linear,
            onUpdate: () => {
              line.textContent = text.slice(0, Math.round(typed.length));
            },
          },
          index * TYPE_SECONDS_PER_LINE,
        );
      });

      timeline.to(
        counter,
        {
          value: 100,
          duration: COUNT_SECONDS,
          ease: ease.inOut,
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = `${Math.round(counter.value)}%`;
          },
        },
        COUNT_START,
      );

      timeline
        .addLabel('wipe')
        .to('[data-terminal]', { autoAlpha: 0, duration: duration.quick }, 'wipe')
        .to('[data-left]', { xPercent: -100, duration: WIPE_SECONDS, ease: ease.inOut }, 'wipe')
        .to('[data-right]', { xPercent: 100, duration: WIPE_SECONDS, ease: ease.inOut }, 'wipe');
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.booting = '';
    pause();

    const skip = () => {
      const timeline = timelineRef.current;
      const wipeAt = timeline?.labels.wipe;
      if (timeline && wipeAt !== undefined && timeline.time() < wipeAt) timeline.seek(wipeAt);
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      delete root.dataset.booting;
      resume();
    };
  }, [pause, resume]);

  return (
    <div
      ref={rootRef}
      className={styles.preloader}
      role="status"
      aria-label={preloader.statusLabel}
    >
      <div className={styles.panelLeft} data-left="" />
      <div className={styles.panelRight} data-right="" />
      <div className={styles.terminal} data-terminal="" aria-hidden="true">
        <div className={styles.lines}>
          {preloader.lines.map((line) => (
            <p key={line} className={styles.line} data-line="" />
          ))}
        </div>
        <span ref={counterRef} className={styles.counter}>
          0%
        </span>
        <p className={styles.skip}>{preloader.skipHint}</p>
      </div>
    </div>
  );
}
