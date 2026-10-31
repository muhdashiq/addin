import type { ReactNode } from 'react';
import type { OriginSceneId } from '../../content/types';

/*
 * Original line drawings. Every stroke is a <path> with pathLength=1, so GSAP can draw it on.
 * Lines are slightly off true on purpose: this part of the story is still pen on paper.
 */

const Ink = ({ d }: { d: string }) => <path d={d} pathLength={1} data-stroke="" />;

const Wash = ({ d, tone = 'ochre' }: { d: string; tone?: 'ochre' | 'green' }) => (
  <path
    d={d}
    data-wash=""
    fill={tone === 'ochre' ? 'var(--accent-2)' : 'var(--accent)'}
    fillOpacity={0.82}
  />
);

const dot = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

const DeskScene = () => (
  <>
    <Wash d="M314 34 L488 30 L490 186 L318 190 Z" tone="green" />
    <Wash d="M354 268 L352 240 L390 238 L386 294 L358 296 Z" />
    <Wash d="M46 268 L122 266 L124 298 L44 300 Z" />

    <Ink d="M312 34 L486 30 L490 186 L316 190 Z" />
    <Ink d="M401 32 L403 188" />
    <Ink d="M314 110 L488 107" />
    <Ink d="M444 186 C440 150 432 120 422 92" />
    <Ink d="M422 92 C402 76 382 78 364 92" />
    <Ink d="M422 92 C406 66 386 58 368 62" />
    <Ink d="M422 92 C426 66 442 52 464 52" />
    <Ink d="M422 92 C442 78 462 80 480 96" />
    <Ink d="M422 92 C438 96 454 110 458 130" />
    <Ink d="M422 92 C406 98 394 112 390 132" />

    <Ink d="M60 60 L190 54 L196 150 L66 156 Z" />
    <Ink d="M62 86 L192 80" />
    <Ink d="M64 112 L194 106" />
    <Ink d="M104 58 L108 154" />
    <Ink d="M148 56 L152 152" />
    <Ink d={dot(126, 50, 4)} />

    <Ink d="M24 300 L496 294" />
    <Ink d="M24 300 L26 316 L494 310 L496 294" />
    <Ink d="M60 316 L54 392" />
    <Ink d="M460 311 L468 392" />
    <Ink d="M300 313 L302 360 L456 356 L454 311" />
    <Ink d="M360 336 L398 335" />

    <Ink d="M150 178 L306 174 L312 274 L146 278 Z" />
    <Ink d="M160 188 L296 185 L300 264 L156 268 Z" />
    <Ink d="M146 278 L312 274 L340 296 L120 300 Z" />
    <Ink d="M204 289 L256 288" />
    <Ink d="M172 204 L226 203" />
    <Ink d="M172 218 L258 216" />
    <Ink d="M186 232 L246 231" />
    <Ink d="M186 246 L276 244" />

    <Ink d="M44 300 L44 268 L122 266 L124 298" />
    <Ink d="M50 266 L50 240 L116 238 L118 266" />
    <Ink d="M58 282 L108 281" />
    <Ink d="M62 252 L104 251" />

    <Ink d="M356 296 L350 240 L392 238 L386 294 Z" />
    <Ink d="M354 268 L388 266" />
    <Ink d="M362 226 C356 214 368 208 362 196" />
    <Ink d="M380 224 C374 212 386 206 380 194" />
  </>
);

const ClientScene = () => (
  <>
    <Wash d="M30 150 L110 70 L410 66 L490 146 Z" />
    <Wash d="M120 160 L400 156 L402 206 L122 210 Z" tone="green" />

    <Ink d="M30 150 L110 70 L410 66 L490 146 Z" />
    <Ink d="M70 110 L450 106" />
    <Ink d="M50 130 L470 126" />
    <Ink d="M90 90 L430 86" />
    <Ink d="M150 70 L120 148" />
    <Ink d="M210 68 L196 148" />
    <Ink d="M270 68 L272 148" />
    <Ink d="M330 66 L348 146" />
    <Ink d="M390 66 L424 146" />

    <Ink d="M60 150 L62 350" />
    <Ink d="M460 147 L462 348" />
    <Ink d="M16 352 L504 348" />

    <Ink d="M120 160 L400 156 L402 206 L122 210 Z" />
    <Ink d="M160 176 L362 173" />
    <Ink d="M190 192 L330 190" />

    <Ink d="M92 226 L190 224 L192 350 L94 350 Z" />
    <Ink d="M92 250 L190 248" />
    <Ink d="M93 274 L191 272" />
    <Ink d="M93 298 L191 296" />
    <Ink d="M94 322 L192 320" />

    <Ink d="M214 240 L438 236" />
    <Ink d="M236 240 L236 216 L258 216 L258 240" />
    <Ink d="M280 239 L280 208 L306 208 L306 239" />
    <Ink d="M330 238 L330 214 L350 214 L350 238" />
    <Ink d="M376 237 L376 204 L404 204 L404 237" />

    <Ink d="M210 286 L440 282 L442 350 L212 350 Z" />
    <Ink d="M240 350 C226 322 238 300 262 300 C288 300 298 324 286 350" />
    <Ink d="M300 350 C290 322 302 302 326 302 C350 302 358 326 346 349" />
    <Ink d="M250 300 C256 294 268 294 274 300" />
    <Ink d="M314 302 C320 296 332 296 338 302" />

    <Ink d={dot(396, 322, 26)} />
    <Ink d={dot(396, 322, 15)} />
    <Ink d={dot(396, 322, 5)} />
  </>
);

const LiveScene = () => (
  <>
    <Wash d="M72 112 L454 109 L454 146 L72 149 Z" tone="green" />
    <Wash d="M276 244 L380 242 L382 276 L278 278 Z" />
    <Wash d="M72 164 L250 162 L252 302 L74 304 Z" />

    <Ink d="M48 58 L472 54 L476 330 L52 334 Z" />
    <Ink d="M50 96 L474 92" />
    <Ink d={dot(72, 76, 6)} />
    <Ink d={dot(92, 76, 6)} />
    <Ink d={dot(112, 76, 6)} />
    <Ink d="M136 66 L400 64 L400 84 L136 86 Z" />
    <Ink d="M150 76 L300 75" />
    <Ink d={dot(428, 74, 7)} />

    <Ink d="M72 112 L454 109 L454 146 L72 149 Z" />
    <Ink d="M92 130 L182 129" />
    <Ink d="M346 128 L372 128" />
    <Ink d="M388 128 L432 127" />

    <Ink d="M72 164 L250 162 L252 302 L74 304 Z" />
    <Ink d="M112 222 L212 220 L222 244 L102 246 Z" />
    <Ink d="M112 246 L114 282 L210 280 L212 244" />
    <Ink d="M146 282 L146 256 L176 255 L176 281" />

    <Ink d="M276 170 L450 168" />
    <Ink d="M276 190 L440 188" />
    <Ink d="M276 210 L452 208" />

    <Ink d="M276 244 L380 242 L382 276 L278 278 Z" />
    <Ink d="M300 260 L358 259" />
    <Ink d="M372 262 L372 298 L381 289 L388 306 L396 302 L389 286 L402 285 Z" />

    <Ink d="M482 40 C492 44 498 52 500 62" />
    <Ink d="M484 22 C502 28 514 42 518 60" />
  </>
);

const APP_ICONS: readonly (readonly [number, number])[] = [
  [198, 88],
  [240, 88],
  [282, 88],
  [198, 134],
  [240, 134],
  [282, 134],
  [198, 180],
  [240, 180],
  [282, 180],
];

const AndroidScene = () => (
  <>
    <Wash d="M184 50 L336 50 L336 318 L184 318 Z" tone="green" />
    <Wash d="M240 134 L276 134 L276 170 L240 170 Z" />

    <Ink d="M170 24 C170 14 178 8 188 8 L332 8 C342 8 350 14 350 24 L352 376 C352 386 344 392 334 392 L186 392 C176 392 168 386 168 376 Z" />
    <Ink d="M184 50 L336 50 L336 318 L184 318 Z" />
    <Ink d="M236 28 L284 28" />
    <Ink d="M184 66 L336 66" />
    <Ink d="M290 60 L290 56" />
    <Ink d="M296 60 L296 54" />
    <Ink d="M302 60 L302 52" />
    <Ink d="M312 53 L328 53 L328 62 L312 62 Z" />

    {APP_ICONS.map(([x, y]) => (
      <Ink
        key={`${x}-${y}`}
        d={`M${x} ${y} L${x + 36} ${y} L${x + 36} ${y + 36} L${x} ${y + 36} Z`}
      />
    ))}
    <Ink d="M198 236 L318 236" />
    <Ink d="M198 256 L300 256" />
    <Ink d="M198 276 L318 276" />
    <Ink d="M198 296 L270 296" />

    <Ink d="M196 348 L206 338 L216 348 M199 346 L199 356 L213 356 L213 346" />
    <Ink d="M244 340 L262 340 M244 347 L262 347 M244 354 L262 354" />
    <Ink d="M296 348 L304 340 M296 348 L304 356 M296 348 L318 348" />
    <Ink d={`${dot(338, 346, 5)} M342 350 L348 356`} />
    <Ink d={dot(260, 374, 9)} />

    <Ink d="M368 120 C386 136 386 176 368 192" />
    <Ink d="M392 100 C420 128 420 184 392 212" />
    <Ink d="M152 120 C134 136 134 176 152 192" />
    <Ink d="M128 100 C100 128 100 184 128 212" />
  </>
);

const SCENES: Record<OriginSceneId, () => ReactNode> = {
  desk: DeskScene,
  client: ClientScene,
  live: LiveScene,
  android: AndroidScene,
};

interface OriginSceneProps {
  id: OriginSceneId;
  alt: string;
}

export function OriginScene({ id, alt }: OriginSceneProps) {
  const Scene = SCENES[id];
  return (
    <svg viewBox="0 0 520 400" role="img" aria-label={alt}>
      <Scene />
    </svg>
  );
}
