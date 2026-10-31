import { useRef } from 'react';
import { content } from '../../content/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease } from '../../lib/motion';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';
import buttonStyles from '../../components/Button.module.css';
import styles from './Footer.module.css';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const rocketRef = useRef<SVGSVGElement>(null);
  const flameRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollToTop } = useSmoothScroll();
  const { footer } = content;

  const { contextSafe } = useGSAP({ scope: ref });

  const launch = contextSafe(() => {
    if (reduced) {
      scrollToTop();
      return;
    }
    gsap
      .timeline({
        onComplete: () =>
          void gsap.set([rocketRef.current, flameRef.current], { clearProps: 'all' }),
      })
      .to(flameRef.current, {
        opacity: 1,
        scaleY: 1.5,
        duration: duration.quick,
        transformOrigin: 'top center',
      })
      .to(rocketRef.current, { x: -1.5, duration: 0.05, repeat: 5, yoyo: true }, 0)
      .call(scrollToTop)
      .to(rocketRef.current, { y: -window.innerHeight, duration: duration.slow, ease: ease.in })
      .set(rocketRef.current, { y: 40, autoAlpha: 0 })
      .to(rocketRef.current, { y: 0, autoAlpha: 1, duration: duration.base, ease: ease.out });
  });

  return (
    <footer
      ref={ref}
      id="contact"
      className={styles.footer}
      data-nav-section="contact"
      data-world="night"
      data-era="modern"
    >
      <div className={styles.top}>
        <div>
          <h2 className={styles.title}>{footer.title}</h2>
          <ul className={styles.links}>
            {footer.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className={`${buttonStyles.button} ${styles.rocket}`}
          onClick={launch}
        >
          <svg ref={rocketRef} viewBox="0 0 24 36" width="20" height="30" aria-hidden="true">
            <path
              d="M12 2c4 3 6 8 6 13v8H6v-8c0-5 2-10 6-13zM6 18l-3 5v4l3-2M18 18l3 5v4l-3-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="2.5" fill="currentColor" />
            <path
              ref={flameRef}
              className={styles.flame}
              d="M9 25c0 4 2 6 3 9 1-3 3-5 3-9z"
              fill="currentColor"
            />
          </svg>
          {footer.backToTop}
        </button>
      </div>
      <p className={styles.credit}>{footer.credit}</p>
    </footer>
  );
}
