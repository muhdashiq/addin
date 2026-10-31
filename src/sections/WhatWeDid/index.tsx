import { useRef } from 'react';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import type { ImpactStats } from '../../content/types';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease, stagger } from '../../lib/motion';
import { WorkIcon } from './icons';
import styles from './WhatWeDid.module.css';

type StatKey = keyof ImpactStats;
const STAT_ORDER: readonly StatKey[] = [
  'monthsBuilding',
  'businessesDigitized',
  'appsShipped',
  'startupsMentored',
  'talksGiven',
];

const { work } = content;

interface VisibleStat {
  key: StatKey;
  value: number;
  label: string;
}

/** Stats without a real number are dropped here, so no component can ever show a blank figure. */
export function visibleStats(stats: ImpactStats): VisibleStat[] {
  return STAT_ORDER.flatMap((key) => {
    const value = stats[key];
    return value === undefined ? [] : [{ key, value, label: work.statLabels[key] }];
  });
}

export default function WhatWeDid() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const stats = visibleStats(work.stats);

  useGSAP(
    () => {
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>('[data-block]').forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll('[data-stroke]'),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: duration.slow,
            ease: ease.inOut,
            stagger: stagger.strokes * 3,
            scrollTrigger: { trigger: block, start: 'top 82%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((stat) => {
        const target = Number(stat.dataset.stat);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: duration.epic,
          ease: ease.out,
          scrollTrigger: { trigger: stat, start: 'top 90%', once: true },
          onUpdate: () => {
            stat.textContent = String(Math.round(counter.value));
          },
        });
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <SectionShell ref={ref} id="work" world="dusk" era="holo" bleedFrom="hinge">
      <SectionHeader id="work" number={work.number} title={work.title} />

      <ul className={styles.blocks}>
        {work.blocks.map((block) => (
          <li key={block.id} className={styles.block} data-block="">
            <div className={styles.icon}>
              <WorkIcon icon={block.icon} />
            </div>
            <h3>{block.title}</h3>
            <p>{block.body}</p>
          </li>
        ))}
      </ul>

      {stats.length > 0 && (
        <div className={styles.stats}>
          <h3 className="sr-only">{work.statsTitle}</h3>
          <dl className={styles.statList}>
            {stats.map((stat) => (
              <div key={stat.key} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>
                  <span data-stat={stat.value}>{stat.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </SectionShell>
  );
}
