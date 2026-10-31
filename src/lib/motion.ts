export const ease = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power2.inOut',
  in: 'power3.in',
  pop: 'back.out(1.7)',
  linear: 'none',
} as const;

export const duration = {
  quick: 0.2,
  fast: 0.35,
  base: 0.6,
  slow: 1,
  epic: 1.5,
} as const;

export const stagger = {
  chars: 0.016,
  items: 0.08,
  strokes: 0.03,
} as const;

/** Seconds a scrubbed animation takes to catch up with the scrollbar. */
export const scrub = {
  tight: 0.5,
  loose: 1,
} as const;

/** Matches the CSS layouts that switch to horizontal/pinned presentation. */
export const WIDE_VIEWPORT = '(min-width: 900px)';
export const NARROW_VIEWPORT = '(max-width: 899.98px)';
