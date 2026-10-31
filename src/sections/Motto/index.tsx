import { useRef } from 'react';
import { SectionShell } from '../../components/SectionShell';
import { TiltCard } from '../../components/TiltCard';
import { content } from '../../content/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { ease, NARROW_VIEWPORT, scrub, stagger, WIDE_VIEWPORT } from '../../lib/motion';
import styles from './Motto.module.css';

export default function Motto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { motto } = content;
  const words = motto.text.split(' ');

  useGSAP(
    () => {
      if (reduced) return;
      const stage = stageRef.current;
      if (!stage) return;

      const fills = gsap.utils.toArray<HTMLElement>('[data-fill]');
      const wordBoxes = gsap.utils.toArray<HTMLElement>('[data-word]');
      const outlines = gsap.utils.toArray<HTMLElement>('[data-outline]');
      const wordStagger = stagger.items * 5;

      const sweep = (scrollTrigger: ScrollTrigger.Vars) => {
        gsap
          .timeline({ defaults: { ease: ease.linear }, scrollTrigger })
          .fromTo(
            fills,
            { clipPath: 'inset(-10% 100% -20% 0%)' },
            { clipPath: 'inset(-10% -5% -20% 0%)', stagger: wordStagger },
            0,
          )
          .fromTo(wordBoxes, { scale: 0.9 }, { scale: 1, stagger: wordStagger }, 0)
          .fromTo(outlines, { opacity: 1 }, { opacity: 0, stagger: wordStagger }, 0.5);
      };

      const media = gsap.matchMedia();
      media.add(WIDE_VIEWPORT, () => {
        sweep({ trigger: stage, start: 'top top', end: '+=140%', pin: true, scrub: scrub.tight });
      });
      media.add(NARROW_VIEWPORT, () => {
        sweep({ trigger: stage, start: 'top 75%', end: 'bottom 45%', scrub: scrub.tight });
      });
    },
    { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <SectionShell
      ref={sectionRef}
      id="motto"
      world="paper"
      era="gingerbread"
      className={styles.motto}
    >
      <div ref={stageRef} className={styles.stage}>
        <span className={styles.numeral} aria-hidden="true">
          {motto.number}
        </span>
        <h2 id="motto-title" className={styles.text} tabIndex={-1}>
          <span className="sr-only">{motto.text}</span>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span className={styles.word} data-word="">
                  <span className={styles.outline} data-outline="">
                    {word}
                  </span>
                  <span className={styles.fill} data-fill="">
                    {word}
                  </span>
                </span>{' '}
              </span>
            ))}
          </span>
        </h2>
      </div>

      <h3 className={styles.pillarsTitle}>{motto.pillarsTitle}</h3>
      <ul className={styles.pillars}>
        {motto.pillars.map((pillar) => (
          <li key={pillar.id} className={styles.pillarItem}>
            <TiltCard className={styles.pillar}>
              <h4>{pillar.title}</h4>
              <p>{pillar.body}</p>
            </TiltCard>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
