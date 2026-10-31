import { useMemo, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../lib/gsap';
import { duration, ease } from '../lib/motion';
import { createNetwork } from './networkData';
import styles from './NetworkFallback.module.css';
import type { NetworkMode } from './NetworkStage';

const WIDTH = 1600;
const HEIGHT = 900;
const NODE_COUNT = 72;
const LIT_SHARE = 0.4;

const toX = (x: number) => ((x + 1) / 2) * WIDTH;
const toY = (y: number) => ((1 - y) / 2) * HEIGHT;

/** The network as plain SVG, for devices without WebGL and visitors who prefer reduced motion. */
export function NetworkFallback({ mode }: { mode: NetworkMode }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const lit = mode === 'lit';
  const { nodes, edges } = useMemo(
    () => createNetwork({ count: NODE_COUNT, quietCorner: !lit }),
    [lit],
  );

  // A stable subset stays lit, so this also works as the static reduced-motion picture.
  const isOn = (index: number) => lit || (nodes[index]?.phase ?? 1) < LIT_SHARE;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.to('[data-node]', {
        attr: {
          r: (_index: number, target: SVGCircleElement) => Number(target.getAttribute('r')) * 1.6,
        },
        duration: duration.epic,
        ease: ease.inOut,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.09, from: 'random' },
      });
      gsap.from('[data-link]', {
        opacity: 0,
        duration: duration.slow,
        stagger: { each: 0.012, from: 'random' },
      });
    },
    { scope: ref, dependencies: [reduced, lit], revertOnUpdate: true },
  );

  return (
    <svg
      ref={ref}
      className={styles.network}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {edges.map(([a, b]) => {
        const from = nodes[a];
        const to = nodes[b];
        if (!from || !to || !isOn(a) || !isOn(b)) return null;
        return (
          <line
            key={`${a}-${b}`}
            data-link=""
            className={styles.link}
            x1={toX(from.x)}
            y1={toY(from.y)}
            x2={toX(to.x)}
            y2={toY(to.y)}
          />
        );
      })}
      {nodes.map((node, index) => (
        <circle
          key={index}
          data-node={isOn(index) ? '' : undefined}
          className={isOn(index) ? (node.tone > 0.5 ? styles.lit : styles.litAlt) : styles.dim}
          cx={toX(node.x)}
          cy={toY(node.y)}
          r={(isOn(index) ? 6 : 3.5) * node.size}
        />
      ))}
    </svg>
  );
}
