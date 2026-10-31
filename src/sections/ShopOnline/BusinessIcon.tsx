import type { BusinessId } from '../../content/types';

const ICON_PATHS: Record<BusinessId, string> = {
  'spice-trader':
    'M12 3c4 2 6 6 5 10-1 4-4 7-5 8-1-1-4-4-5-8-1-4 1-8 5-10zM12 7v10M12 10l-3-2M12 13l3-2',
  'coir-maker': 'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M21 12h-4M3 21l5-5',
  'handloom-weaver': 'M4 4h16M4 20h16M7 4v16M12 4v16M17 4v16M4 9h16M4 14h16',
  bakery: 'M4 12c0-4 4-7 8-7s8 3 8 7c0 1-1 2-2 2v5H6v-5c-1 0-2-1-2-2zM9 9v3M12 8v4M15 9v3',
  'auto-workshop':
    'M15 3a5 5 0 0 0-4.6 6.9L3 17.3 6.7 21l7.4-7.4A5 5 0 0 0 21 9l-3 3-3-1-1-3 3-3a5 5 0 0 0-2-2z',
};

interface BusinessIconProps {
  id: BusinessId;
  size?: number;
}

export function BusinessIcon({ id, size = 24 }: BusinessIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d={ICON_PATHS[id]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
