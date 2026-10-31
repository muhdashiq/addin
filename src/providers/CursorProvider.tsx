import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import { useCoarsePointer } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface CursorContextValue {
  enabled: boolean;
  /** Takes priority over data-cursor attributes, e.g. "Drop" while something is being dragged. */
  labelOverride: MutableRefObject<string | null>;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = !coarse && !reduced;
  const labelOverride = useRef<string | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (enabled) root.dataset.customCursor = '';
    return () => {
      delete root.dataset.customCursor;
    };
  }, [enabled]);

  const value = useMemo(() => ({ enabled, labelOverride }), [enabled]);

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor(): CursorContextValue {
  const context = useContext(CursorContext);
  if (!context) throw new Error('useCursor must be used inside <CursorProvider>');
  return context;
}
