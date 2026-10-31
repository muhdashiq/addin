import { useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease } from '../../lib/motion';
import styles from './MvpBuilder.module.css';

const SWEEP_DEGREES = 180;
const NEEDLE_START = -90;

const arcOffset = (score: number) => 1 - score / 100;
const needleTransform = (score: number) =>
  `rotate(${NEEDLE_START + (score / 100) * SWEEP_DEGREES} 100 100)`;

interface GaugeProps {
  score: number;
  label: string;
}

export function Gauge({ score, label }: GaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      // One number drives the needle, the arc and the readout, so they can never disagree.
      const paint = (value: number) => {
        needleRef.current?.setAttribute('transform', needleTransform(value));
        arcRef.current?.setAttribute('stroke-dashoffset', String(arcOffset(value)));
        if (valueRef.current) valueRef.current.textContent = String(Math.round(value));
      };

      const reading = { value: 0 };
      paint(0);
      gsap.to(reading, {
        value: score,
        duration: duration.epic,
        ease: ease.expo,
        onUpdate: () => paint(reading.value),
      });
    },
    { scope: ref, dependencies: [score, reduced], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      className={styles.gauge}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <svg viewBox="0 0 200 116" aria-hidden="true">
        <path className={styles.gaugeTrack} d="M14 100 A86 86 0 0 1 186 100" />
        <path
          ref={arcRef}
          className={styles.gaugeArc}
          d="M14 100 A86 86 0 0 1 186 100"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={arcOffset(score)}
        />
        <g ref={needleRef} transform={needleTransform(score)}>
          <path className={styles.gaugeNeedle} d="M100 100 L100 26" />
        </g>
        <circle className={styles.gaugeHub} cx="100" cy="100" r="7" />
      </svg>
      <p className={styles.gaugeValue}>
        <span ref={valueRef}>{score}</span>
        <small>{label}</small>
      </p>
    </div>
  );
}
