import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { content } from '../content/content';
import type { Era, SectionId } from '../content/types';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';
import styles from './Nav.module.css';
import { ThemeToggle } from './ThemeToggle';

const ERAS: readonly Era[] = ['gingerbread', 'holo', 'modern'];
const isEra = (value: string | undefined): value is Era => ERAS.some((era) => era === value);

const HIDE_AFTER_PX = 160;
const DIRECTION_THRESHOLD_PX = 6;
const ACTIVE_LINE = 0.4;

function StatusIcons({ era }: { era: Era }) {
  return (
    <span className={styles.status} aria-hidden="true">
      <svg className={styles.signal} viewBox="0 0 18 14" width="18" height="14">
        <rect x="0" y="10" width="3" height="4" />
        <rect x="5" y="7" width="3" height="7" />
        <rect x="10" y="4" width="3" height="10" />
        <rect x="15" y="0" width="3" height="14" />
      </svg>
      <span className={styles.network}>3G</span>
      <svg className={styles.battery} viewBox="0 0 12 18" width="10" height="16">
        <rect x="3.5" y="0" width="5" height="2" />
        <rect x="0.75" y="2.75" width="10.5" height="14.5" fill="none" strokeWidth="1.5" />
        <rect x="2.5" y="6" width="7" height="9.5" />
      </svg>
      <span className={styles.clock}>{content.nav.eraClock[era]}</span>
    </span>
  );
}

/**
 * The nav is the story's clock: it starts as a 2010 Android status bar and upgrades itself to
 * match whichever era of the page is on screen.
 */
export function Nav() {
  const { goToSection, scrollToTop } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId | null>(null);
  const [era, setEra] = useState<Era>('gingerbread');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
      }

      const nav = navRef.current;
      if (nav && Math.abs(y - lastY) > DIRECTION_THRESHOLD_PX) {
        const hide = y > lastY && y > HIDE_AFTER_PX && !reduced && !menuOpenRef.current;
        nav.dataset.hidden = String(hide && !nav.contains(document.activeElement));
        lastY = y;
      }

      let current: HTMLElement | undefined;
      const line = window.innerHeight * ACTIVE_LINE;
      document.querySelectorAll<HTMLElement>('[data-nav-section]').forEach((section) => {
        if (section.getBoundingClientRect().top <= line) current = section;
      });
      if (current) {
        const sectionId = current.dataset.navSection;
        const match = content.nav.links.find((link) => link.id === sectionId);
        setActive(match ? match.id : null);
        const sectionEra = current.dataset.era;
        if (isEra(sectionEra)) setEra(sectionEra);
      }
    };

    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault();
    setMenuOpen(false);
    void goToSection(id);
  };

  const linkList = (
    <ul className={styles.links}>
      {content.nav.links.map((link) => (
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            className={styles.link}
            aria-current={active === link.id ? 'location' : undefined}
            onClick={(event) => onLinkClick(event, link.id)}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav ref={navRef} className={styles.nav} data-nav-era={era} aria-label="Sections">
      <div className={styles.bar}>
        <a
          href="#top"
          className={styles.wordmark}
          onClick={(event) => {
            event.preventDefault();
            scrollToTop();
          }}
        >
          {content.nav.wordmark}
        </a>

        <div className={styles.desktopLinks}>{linkList}</div>

        <div className={styles.tools}>
          <StatusIcons era={era} />
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {content.nav.menuLabel}
          </button>
        </div>

        <div ref={progressRef} className={styles.progress} aria-hidden="true" />
      </div>

      <div id="nav-menu" className={styles.menu} hidden={!menuOpen}>
        {linkList}
      </div>
    </nav>
  );
}
