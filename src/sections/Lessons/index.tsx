import { useDrag } from '@use-gesture/react';
import { useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import buttonStyles from '../../components/Button.module.css';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import type { Lesson } from '../../content/types';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cx } from '../../lib/cx';
import { gsap, useGSAP } from '../../lib/gsap';
import { duration, ease } from '../../lib/motion';
import styles from './Lessons.module.css';

const { lessons } = content;
const COUNT = lessons.lessons.length;

const SWIPE_DISTANCE_PX = 110;
const SWIPE_VELOCITY = 0.45;
const DRAG_TILT = 0.05;
const FLY_DISTANCE = 1.3;
const STACK_DEPTH = 3;

type StackStyle = CSSProperties & { '--depth': number };

function StaticDeck() {
  return (
    <ol className={styles.staticList}>
      {lessons.lessons.map((lesson) => (
        <li key={lesson.id} className={styles.staticCard}>
          <h3>{lesson.front}</h3>
          <p>{lesson.back}</p>
        </li>
      ))}
    </ol>
  );
}

function CardFaces({
  lesson,
  index,
  flipped,
}: {
  lesson: Lesson;
  index: number;
  flipped: boolean;
}) {
  return (
    <>
      <span className={cx(styles.face, styles.front)} aria-hidden={flipped}>
        <span className={styles.position}>
          {index + 1}/{COUNT}
        </span>
        <span className={styles.lessonTitle}>{lesson.front}</span>
      </span>
      <span className={cx(styles.face, styles.back)} aria-hidden={!flipped}>
        <span className={styles.reflection}>{lesson.back}</span>
      </span>
    </>
  );
}

function Deck() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLSpanElement>(null);
  const justDragged = useRef(false);
  const hintId = useId();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { contextSafe } = useGSAP({ scope: scopeRef });

  const lessonAt = (offset: number): Lesson | undefined =>
    lessons.lessons[(index + offset + COUNT) % COUNT];
  const current = lessonAt(0);

  const flipTo = contextSafe((next: boolean) => {
    setFlipped(next);
    gsap.to(flipperRef.current, {
      rotationY: next ? 180 : 0,
      duration: duration.base,
      ease: ease.out,
    });
  });

  /** Replaces the top card: the old one flies off, and the new one starts unflipped. */
  const advance = contextSafe((step: 1 | -1, direction: 1 | -1 = step) => {
    const flyTo = direction * FLY_DISTANCE * (scopeRef.current?.clientWidth ?? 400);
    gsap.to(dragRef.current, {
      x: flyTo,
      rotation: direction * 14,
      autoAlpha: 0,
      duration: duration.fast,
      ease: ease.in,
      onComplete: () => {
        setIndex((value) => (value + step + COUNT) % COUNT);
        setFlipped(false);
        gsap.set(flipperRef.current, { rotationY: 0 });
        gsap.fromTo(
          dragRef.current,
          { x: 0, rotation: 0, autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: duration.fast, ease: ease.out },
        );
      },
    });
  });

  const settle = contextSafe(() => {
    gsap.to(dragRef.current, { x: 0, y: 0, rotation: 0, duration: duration.base, ease: ease.pop });
  });

  const bindDrag = useDrag(
    ({ down, movement: [mx, my], velocity: [vx], last }) => {
      if (down) {
        justDragged.current = Math.abs(mx) > 4 || Math.abs(my) > 4;
        gsap.set(dragRef.current, { x: mx, y: my * 0.3, rotation: mx * DRAG_TILT });
        return;
      }
      if (!last) return;
      const swiped = Math.abs(mx) > SWIPE_DISTANCE_PX || vx > SWIPE_VELOCITY;
      // A swipe in either direction deals the next card. Only the way it flies off differs.
      if (swiped && mx !== 0) advance(1, mx < 0 ? -1 : 1);
      else settle();
    },
    // keys: false, because the arrow keys page through the deck here, not nudge the card.
    { pointer: { touch: true, keys: false }, filterTaps: true, axis: 'lock' },
  );

  const onCardClick = () => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    flipTo(!flipped);
  };

  const onCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      advance(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      advance(1);
    }
  };

  if (!current) return null;

  return (
    <div ref={scopeRef} className={styles.deckArea}>
      <div className={styles.deck}>
        {Array.from({ length: STACK_DEPTH - 1 }, (_, slot) => {
          const depth = STACK_DEPTH - 1 - slot;
          const style: StackStyle = { '--depth': depth };
          return <div key={depth} className={styles.under} style={style} aria-hidden="true" />;
        })}

        <div ref={dragRef} className={styles.dragLayer}>
          <button
            type="button"
            className={styles.card}
            data-cursor="Flip"
            aria-describedby={hintId}
            {...bindDrag()}
            onClick={onCardClick}
            onKeyDown={onCardKeyDown}
          >
            <span ref={flipperRef} className={styles.flipper}>
              <CardFaces lesson={current} index={index} flipped={flipped} />
            </span>
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={cx(buttonStyles.button, buttonStyles.quiet)}
          onClick={() => advance(-1)}
        >
          {lessons.previousLabel}
        </button>
        <button
          type="button"
          className={cx(buttonStyles.button, buttonStyles.quiet)}
          aria-pressed={flipped}
          onClick={() => flipTo(!flipped)}
        >
          {lessons.flipLabel}
        </button>
        <button
          type="button"
          className={cx(buttonStyles.button, buttonStyles.quiet)}
          onClick={() => advance(1)}
        >
          {lessons.nextLabel}
        </button>
      </div>
      <p id={hintId} className="sr-only">
        {lessons.cardHint}
      </p>
      <p className="sr-only" role="status">
        Lesson {index + 1} of {COUNT}
      </p>
    </div>
  );
}

export default function Lessons() {
  const reduced = usePrefersReducedMotion();

  return (
    <SectionShell id="lessons" world="screen" era="modern" className={styles.lessons}>
      <SectionHeader
        id="lessons"
        number={lessons.number}
        title={lessons.title}
        lead={reduced ? undefined : lessons.hint}
      />
      {reduced ? <StaticDeck /> : <Deck />}
    </SectionShell>
  );
}
