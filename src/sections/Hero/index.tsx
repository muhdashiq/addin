import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { MagneticButton } from '../../components/MagneticButton';
import { SectionShell } from '../../components/SectionShell';
import { SplitText } from '../../components/SplitText';
import { content } from '../../content/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease, stagger } from '../../lib/motion';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';
import { NetworkStage } from '../../three/NetworkStage';
import styles from './Hero.module.css';

interface HeroProps {
  /** False while the preloader is covering the page. */
  revealed?: boolean;
}

export default function Hero({ revealed = true }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { goToSection } = useSmoothScroll();
  const { hero } = content;

  useGSAP(
    () => {
      if (reduced) return;

      gsap.set('[data-char]', { yPercent: 118 });
      gsap.set('[data-reveal]', { autoAlpha: 0, y: 18 });
      // Hidden under the preloader, a late font swap can't register as a layout shift.
      gsap.set('h1', { visibility: revealed ? 'visible' : 'hidden' });
      if (!revealed) return;

      gsap
        .timeline()
        .to('[data-char]', {
          yPercent: 0,
          duration: duration.slow,
          ease: ease.expo,
          stagger: stagger.chars,
        })
        .to(
          '[data-reveal]',
          {
            autoAlpha: 1,
            y: 0,
            duration: duration.base,
            ease: ease.out,
            stagger: stagger.items,
            clearProps: 'visibility,opacity',
          },
          '-=0.55',
        );

      gsap.fromTo(
        '[data-scroll-dot]',
        { yPercent: -120 },
        {
          yPercent: 220,
          duration: duration.epic,
          ease: ease.inOut,
          repeat: -1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
          },
        },
      );
    },
    { scope: ref, dependencies: [revealed, reduced], revertOnUpdate: true },
  );

  const onCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    void goToSection('origin');
  };

  return (
    <SectionShell ref={ref} id="top" world="paper" era="gingerbread" className={styles.hero}>
      <NetworkStage mode="hero" ready={revealed} />
      <div className={styles.copy}>
        <h1 id="top-title" className={styles.headline}>
          <SplitText text={hero.headline} />
        </h1>
        <p className={styles.subline} data-reveal="">
          {hero.subline}
        </p>
        <div className={styles.actions} data-reveal="">
          <MagneticButton href="#origin" onClick={onCtaClick}>
            {hero.cta}
          </MagneticButton>
          <div className={styles.scroll} aria-hidden="true">
            <span>{hero.scrollHint}</span>
            <span className={styles.scrollTrack}>
              <span className={styles.scrollDot} data-scroll-dot="" />
            </span>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
