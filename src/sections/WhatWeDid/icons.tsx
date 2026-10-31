import type { WorkIcon as WorkIconId } from '../../content/types';

const ICON_STROKES: Record<WorkIconId, string[]> = {
  devices: [
    'M6 14 L58 14 L58 50 L6 50 Z',
    'M2 50 L62 50 L58 58 L6 58 Z',
    'M62 28 L78 28 C80 28 82 30 82 32 L82 70 C82 72 80 74 78 74 L62 74 C60 74 58 72 58 70 L58 62',
    'M68 67 L72 67',
    'M16 26 L40 26',
    'M16 36 L46 36',
  ],
  seedling: [
    'M42 78 L42 40',
    'M42 52 C24 52 14 42 12 22 C32 22 42 32 42 52',
    'M42 42 C42 26 52 14 72 12 C72 32 62 42 42 42',
    'M20 78 L64 78',
    'M28 78 C30 70 36 66 42 66 C48 66 54 70 56 78',
  ],
  podium: [
    'M30 76 L54 76',
    'M42 76 L42 58',
    'M26 58 L58 58 L54 42 L30 42 Z',
    'M42 42 L42 32',
    'M36 8 C36 5 38 4 42 4 C46 4 48 5 48 8 L48 26 C48 29 46 32 42 32 C38 32 36 29 36 26 Z',
    'M16 14 C10 20 10 30 16 36',
    'M68 14 C74 20 74 30 68 36',
  ],
  community: [
    'M42 22 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0',
    'M16 58 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    'M68 58 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    'M36 29 L21 52',
    'M48 29 L63 52',
    'M23 58 L61 58',
    'M42 58 L42 74',
    'M34 74 L50 74',
  ],
};

export function WorkIcon({ icon }: { icon: WorkIconId }) {
  return (
    <svg viewBox="0 0 84 84" aria-hidden="true">
      {ICON_STROKES[icon].map((d) => (
        <path key={d} d={d} pathLength={1} data-stroke="" />
      ))}
    </svg>
  );
}
