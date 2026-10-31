import { useId, useRef, useState } from 'react';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import type { Milestone } from '../../content/types';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease, scrub } from '../../lib/motion';
import styles from './Timeline.module.css';

const { timeline } = content;

function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className={styles.milestone} data-milestone="">
      <span className={styles.dot} data-dot="" aria-hidden="true" />
      <div className={styles.body} data-milestone-body="">
        {milestone.date && <p className={styles.date}>{milestone.date}</p>}
        <h3>
          <button
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls={panelId}
            data-cursor={open ? undefined : 'Open'}
            onClick={() => setOpen((current) => !current)}
          >
            <span>{milestone.title}</span>
            <svg
              className={styles.chevron}
              viewBox="0 0 20 20"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path
                d="M4 7l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </h3>
        <div id={panelId} className={styles.panel} data-open={open}>
          <div className={styles.panelClip}>
            <p className={styles.detail}>{milestone.detail}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: ease.linear,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: scrub.tight,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>('[data-milestone]').forEach((item) => {
        const pop = { trigger: item, start: 'top 72%', toggleActions: 'play none none reverse' };
        gsap.from(item.querySelector('[data-dot]'), {
          scale: 0,
          duration: duration.fast,
          ease: ease.pop,
          scrollTrigger: pop,
        });
        gsap.from(item.querySelector('[data-milestone-body]'), {
          x: 40,
          autoAlpha: 0,
          duration: duration.base,
          ease: ease.out,
          scrollTrigger: pop,
        });
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <SectionShell ref={ref} id="timeline" world="screen" era="modern" className={styles.timeline}>
      <SectionHeader id="timeline" number={timeline.number} title={timeline.title} />
      <div ref={listRef} className={styles.rail}>
        <div className={styles.lineTrack} aria-hidden="true">
          <div ref={lineRef} className={styles.line} />
        </div>
        <ol className={styles.list}>
          {timeline.milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
