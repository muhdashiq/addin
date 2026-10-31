import { useRef } from 'react';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { ease, NARROW_VIEWPORT, scrub, stagger, WIDE_VIEWPORT } from '../../lib/motion';
import styles from './Origin.module.css';
import { OriginScene } from './scenes';

function drawFrame(frame: Element) {
  return gsap
    .timeline({ defaults: { ease: ease.linear } })
    .fromTo(
      frame.querySelectorAll('[data-stroke]'),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, stagger: stagger.strokes },
    )
    .fromTo(frame.querySelectorAll('[data-wash]'), { autoAlpha: 0 }, { autoAlpha: 1 }, '-=0.3');
}

export default function Origin() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { origin } = content;

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;

      const frames = gsap.utils.toArray<HTMLElement>('[data-frame]');
      const media = gsap.matchMedia();

      media.add(WIDE_VIEWPORT, () => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: ease.linear,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: scrub.tight,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: ease.linear,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: scrub.tight,
              invalidateOnRefresh: true,
            },
          },
        );

        frames.forEach((frame, index) => {
          const panel = frame.querySelector('[data-panel]');
          if (index === 0) {
            // The first frame is on screen before the track moves, so it draws as the section arrives.
            const arrival = { trigger: section, start: 'top 75%', end: 'top 5%', scrub: true };
            ScrollTrigger.create({ animation: drawFrame(frame), ...arrival });
            gsap.from(panel, { x: 60, autoAlpha: 0, ease: ease.out, scrollTrigger: arrival });
            return;
          }
          const entering = {
            trigger: frame,
            containerAnimation: slide,
            start: 'left 90%',
            end: 'left 35%',
            scrub: true,
          };
          ScrollTrigger.create({ animation: drawFrame(frame), ...entering });
          gsap.from(panel, { x: 120, autoAlpha: 0, ease: ease.out, scrollTrigger: entering });
        });
      });

      media.add(NARROW_VIEWPORT, () => {
        frames.forEach((frame) => {
          const panel = frame.querySelector('[data-panel]');
          const entering = { trigger: frame, start: 'top 85%', end: 'top 35%', scrub: true };
          ScrollTrigger.create({ animation: drawFrame(frame), ...entering });
          gsap.from(panel, { y: 32, autoAlpha: 0, ease: ease.out, scrollTrigger: entering });
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <SectionShell
      ref={sectionRef}
      id="origin"
      world="paper"
      era="gingerbread"
      className={styles.origin}
    >
      <SectionHeader id="origin" number={origin.number} title={origin.title} />
      <div ref={viewportRef} className={styles.viewport}>
        <div ref={trackRef} className={styles.track}>
          {origin.frames.map((frame, index) => (
            <article key={frame.id} className={styles.frame} data-frame="">
              <div className={styles.scene}>
                <OriginScene id={frame.id} alt={frame.alt} />
              </div>
              <div className={styles.panel} data-panel="">
                <p className={styles.count} aria-hidden="true">
                  {index + 1}/{origin.frames.length}
                </p>
                <h3>{frame.title}</h3>
                <p>{frame.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <div ref={progressRef} className={styles.progress} />
      </div>
    </SectionShell>
  );
}
