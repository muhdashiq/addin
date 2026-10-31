import { Component, lazy, Suspense, useEffect, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { NetworkFallback } from './NetworkFallback';
import styles from './NetworkStage.module.css';

export type NetworkMode = 'hero' | 'lit';

export interface NetworkPalette {
  dim: string;
  lit: string;
  litAlt: string;
  line: string;
  additive: boolean;
}

const HeroNetwork = lazy(() => import('./HeroNetwork'));

function readPalette(element: Element): NetworkPalette {
  const tokens = getComputedStyle(element);
  const token = (name: string) => tokens.getPropertyValue(name).trim();
  return {
    dim: token('--net-dim'),
    lit: token('--net-lit'),
    litAlt: token('--net-lit-2'),
    line: token('--net-line'),
    additive: token('--net-blend') === 'add',
  };
}

/** WebGL colours can't read CSS variables, so re-read them whenever the theme or skin changes. */
function useNetworkPalette(ref: RefObject<Element>): NetworkPalette | null {
  const [palette, setPalette] = useState<NetworkPalette | null>(null);

  useEffect(() => {
    const update = () => {
      if (ref.current) setPalette(readPalette(ref.current));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-skin'],
    });
    return () => observer.disconnect();
  }, [ref]);

  return palette;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

/** Catches a WebGL context that fails to start and swaps in the SVG network. */
class WebGLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface NetworkStageProps {
  mode: NetworkMode;
  /** Waits to start the scene until the preloader has finished. */
  ready?: boolean;
}

export function NetworkStage({ mode, ready = true }: NetworkStageProps) {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const pageVisible = usePageVisible();
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: '25% 0px' });
  const palette = useNetworkPalette(ref);

  // Once started, the scene stays mounted and pauses, so a lit network keeps its state.
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (ready && near) setStarted(true);
  }, [near, ready]);

  const fallback = <NetworkFallback mode={mode} />;

  return (
    <div ref={ref} className={styles.stage} aria-hidden="true">
      {webgl && !reduced
        ? started &&
          palette && (
            <WebGLBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <HeroNetwork mode={mode} palette={palette} paused={!near || !pageVisible} />
              </Suspense>
            </WebGLBoundary>
          )
        : fallback}
    </div>
  );
}
