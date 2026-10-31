import Lenis from 'lenis';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { requestMountAll } from '../lib/lazyMount';

interface SmoothScrollContextValue {
  /** Scrolls to a section by id, loading any lazy sections above it first. */
  goToSection: (id: string) => Promise<void>;
  scrollToTop: () => void;
  pause: () => void;
  resume: () => void;
}

const NAV_CLEARANCE = 0;
const LAYOUT_WAIT_FRAMES = 300;

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Resolves once no lazy section is still a placeholder, because those above the target change how
 * far away it is. Gives up after about five seconds and scrolls anyway if a chunk fails to load.
 */
async function waitForSection(id: string): Promise<HTMLElement | null> {
  for (let frame = 0; frame < LAYOUT_WAIT_FRAMES; frame += 1) {
    if (!document.querySelector('[data-lazy-pending]')) break;
    await nextFrame();
  }
  return document.getElementById(id);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  // The preloader's effect runs before this provider's, so pause() can arrive before Lenis exists.
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    if (pausedRef.current) lenis.stop();
    lenis.on('scroll', () => ScrollTrigger.update());

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Lazy sections and disclosures change the page height, which ScrollTrigger can't see by itself.
  useEffect(() => {
    let lastHeight = document.body.offsetHeight;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const height = document.body.offsetHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        ScrollTrigger.refresh();
      }, 180);
    });
    observer.observe(document.body);
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      goToSection: async (id) => {
        requestMountAll();
        const target = await waitForSection(id);
        if (!target) return;
        await nextFrame();
        await nextFrame();
        ScrollTrigger.refresh();

        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: NAV_CLEARANCE, force: true });
        } else {
          target.scrollIntoView();
        }
        target.querySelector<HTMLElement>('[tabindex="-1"]')?.focus({ preventScroll: true });
      },
      scrollToTop: () => {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { force: true, duration: 1.6 });
        else window.scrollTo(0, 0);
      },
      pause: () => {
        pausedRef.current = true;
        lenisRef.current?.stop();
      },
      resume: () => {
        pausedRef.current = false;
        lenisRef.current?.start();
      },
    }),
    [],
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  if (!context) throw new Error('useSmoothScroll must be used inside <SmoothScrollProvider>');
  return context;
}
