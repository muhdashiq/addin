import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease } from '../../lib/motion';
import styles from './BeforeAfterSlider.module.css';

export interface BeforeAfterSliderHandle {
  /** Animates the divider. 0 shows everything online, 100 shows everything offline. */
  slideTo: (value: number) => void;
}

interface BeforeAfterSliderProps {
  label: string;
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
}

const START_VALUE = 50;
const KEY_STEP = 5;
const KEY_PAGE_STEP = 20;

type SliderStyle = CSSProperties & { '--divider': string };

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export const BeforeAfterSlider = forwardRef<BeforeAfterSliderHandle, BeforeAfterSliderProps>(
  function BeforeAfterSlider({ label, before, after, beforeLabel, afterLabel }, handleRef) {
    const stageRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const position = useRef({ value: START_VALUE });
    const dragging = useRef(false);
    const reduced = usePrefersReducedMotion();

    // The divider follows the pointer through a CSS variable, so dragging never re-renders React.
    const apply = (value: number) => {
      const next = clamp(value);
      position.current.value = next;
      stageRef.current?.style.setProperty('--divider', `${next}%`);
      const thumb = thumbRef.current;
      if (thumb) {
        const rounded = Math.round(next);
        thumb.setAttribute('aria-valuenow', String(rounded));
        thumb.setAttribute(
          'aria-valuetext',
          `${rounded}% ${beforeLabel}, ${100 - rounded}% ${afterLabel}`,
        );
      }
    };

    const { contextSafe } = useGSAP({ scope: stageRef });

    const slideTo = contextSafe((value: number) => {
      if (reduced) {
        apply(value);
        return;
      }
      gsap.to(position.current, {
        value,
        duration: duration.slow,
        ease: ease.inOut,
        overwrite: true,
        onUpdate: () => apply(position.current.value),
      });
    });

    useImperativeHandle(handleRef, () => ({ slideTo }), [slideTo]);

    const moveToPointer = (event: PointerEvent<HTMLDivElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      apply(((event.clientX - box.left) / box.width) * 100);
    };

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      dragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      gsap.killTweensOf(position.current);
      moveToPointer(event);
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
      if (dragging.current) moveToPointer(event);
    };

    const onPointerEnd = () => {
      dragging.current = false;
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const current = position.current.value;
      const moves: Record<string, number> = {
        ArrowLeft: current - KEY_STEP,
        ArrowDown: current - KEY_STEP,
        ArrowRight: current + KEY_STEP,
        ArrowUp: current + KEY_STEP,
        PageDown: current - KEY_PAGE_STEP,
        PageUp: current + KEY_PAGE_STEP,
        Home: 0,
        End: 100,
      };
      const next = moves[event.key];
      if (next === undefined) return;
      event.preventDefault();
      gsap.killTweensOf(position.current);
      apply(next);
    };

    const stageStyle: SliderStyle = { '--divider': `${START_VALUE}%` };

    return (
      <div
        ref={stageRef}
        className={styles.stage}
        style={stageStyle}
        data-cursor="Drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div className={styles.after}>{after}</div>
        <div className={styles.before}>{before}</div>

        <span className={styles.tagBefore} aria-hidden="true">
          {beforeLabel}
        </span>
        <span className={styles.tagAfter} aria-hidden="true">
          {afterLabel}
        </span>

        <div
          ref={thumbRef}
          className={styles.thumb}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={START_VALUE}
          aria-valuetext={`${START_VALUE}% ${beforeLabel}, ${START_VALUE}% ${afterLabel}`}
          onKeyDown={onKeyDown}
        >
          <span className={styles.grip} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    );
  },
);
