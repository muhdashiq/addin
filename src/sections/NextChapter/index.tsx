import { useRef } from 'react';
import { SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { ease, scrub } from '../../lib/motion';
import { NetworkStage } from '../../three/NetworkStage';
import styles from './NextChapter.module.css';

export default function NextChapter() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { next } = content;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        stageRef.current,
        { scale: 0.92, autoAlpha: 0.2 },
        {
          scale: 1.02,
          autoAlpha: 1,
          ease: ease.linear,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'center center',
            scrub: scrub.loose,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <SectionShell
      ref={ref}
      id="next"
      world="night"
      era="modern"
      bleedFrom="screen"
      className={styles.next}
    >
      <div ref={stageRef} className={styles.network}>
        <NetworkStage mode="lit" />
      </div>
      <div className={styles.copy}>
        <span className={styles.numeral} aria-hidden="true">
          {next.number}
        </span>
        <h2 id="next-title" tabIndex={-1}>
          {next.title}
        </h2>
        <div className={styles.paragraphs}>
          {next.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <p className={styles.closing}>{next.closing}</p>
    </SectionShell>
  );
}
