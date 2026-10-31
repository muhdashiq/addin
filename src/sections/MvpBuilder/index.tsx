import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Announcements, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import buttonStyles from '../../components/Button.module.css';
import { MagneticButton } from '../../components/MagneticButton';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import { scoreMvp, totalCost } from '../../features/mvp/score';
import type { MvpFeature, MvpResult } from '../../features/mvp/score';
import { cx } from '../../lib/cx';
import { Gauge } from './Gauge';
import styles from './MvpBuilder.module.css';

const { mvp } = content;
const ZONE_ID = 'mvp-zone';
const DRAG_DISTANCE_PX = 6;

const featureById = (id: unknown): MvpFeature | undefined =>
  mvp.features.find((feature) => feature.id === id);

interface FeatureTileProps {
  feature: MvpFeature;
  added: boolean;
  onToggle: (feature: MvpFeature) => void;
}

function FeatureTile({ feature, added, onToggle }: FeatureTileProps) {
  const { setNodeRef, setActivatorNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: feature.id,
    disabled: added,
  });

  return (
    <li
      ref={setNodeRef}
      className={cx(styles.tile, added && styles.tileAdded, isDragging && styles.tileDragging)}
      data-cursor={added ? undefined : mvp.dragHint}
      {...listeners}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className={styles.grip}
        aria-label={`${mvp.dragHint} ${feature.label}`}
        {...attributes}
      >
        <svg viewBox="0 0 10 16" width="10" height="16" aria-hidden="true">
          <path
            d="M2 2h.01M8 2h.01M2 8h.01M8 8h.01M2 14h.01M8 14h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className={styles.tileText}>
        <strong>{feature.label}</strong>
        <small>{feature.note}</small>
      </div>
      <span className={styles.cost}>
        <span aria-hidden="true">{feature.cost}</span>
        <span className="sr-only">Costs {feature.cost}</span>
      </span>
      <button
        type="button"
        className={cx(buttonStyles.button, buttonStyles.quiet)}
        aria-pressed={added}
        aria-label={`${added ? mvp.removeLabel : mvp.addLabel} ${feature.label}`}
        onClick={() => onToggle(feature)}
      >
        {added ? mvp.removeLabel : mvp.addLabel}
      </button>
    </li>
  );
}

interface DropZoneProps {
  picked: MvpFeature[];
  spent: number;
  message: string;
  onRemove: (feature: MvpFeature) => void;
  onSubmit: () => void;
}

function DropZone({ picked, spent, message, onRemove, onSubmit }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: ZONE_ID });
  const pips = Array.from({ length: mvp.budget }, (_, index) => index < spent);

  return (
    <div ref={setNodeRef} className={cx(styles.zone, isOver && styles.zoneOver)}>
      <h3>{mvp.zoneTitle}</h3>

      <div className={styles.budget}>
        <span className={styles.pips} aria-hidden="true">
          {pips.map((filled, index) => (
            <span key={index} className={cx(styles.pip, filled && styles.pipFilled)} />
          ))}
        </span>
        <span>
          {spent} / {mvp.budget} {mvp.budgetLabel}
        </span>
      </div>

      {picked.length === 0 ? (
        <p className={styles.zoneEmpty}>{mvp.zoneEmpty}</p>
      ) : (
        <ul className={styles.picked}>
          {picked.map((feature) => (
            <li key={feature.id}>
              <span>{feature.label}</span>
              <button
                type="button"
                className={styles.removeChip}
                aria-label={`${mvp.removeLabel} ${feature.label}`}
                onClick={() => onRemove(feature)}
              >
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.message} role="status">
        {message}
      </p>

      <MagneticButton onClick={onSubmit}>{mvp.submitLabel}</MagneticButton>
    </div>
  );
}

interface ResultCardProps {
  result: MvpResult;
  picked: MvpFeature[];
  onRetry: () => void;
}

function ResultCard({ result, picked, onRetry }: ResultCardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const outcome = mvp.outcomes[result.outcome];

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={styles.result}>
      <Gauge score={result.score} label={mvp.gaugeLabel} />
      <div className={styles.resultText}>
        <h3 ref={headingRef} tabIndex={-1}>
          {outcome.title}
        </h3>
        <p>{outcome.message}</p>
        <p className={styles.lesson}>{mvp.lesson}</p>
        {picked.length > 0 && (
          <p className={styles.resultPicks}>
            {mvp.pickedLabel}: {picked.map((feature) => feature.label).join(', ')}.
          </p>
        )}
        <button type="button" className={buttonStyles.button} onClick={onRetry}>
          {mvp.tryAgainLabel}
        </button>
      </div>
    </div>
  );
}

export default function MvpBuilder() {
  const [pickedIds, setPickedIds] = useState<readonly string[]>([]);
  const [result, setResult] = useState<MvpResult | null>(null);
  const [message, setMessage] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_DISTANCE_PX } }),
    useSensor(KeyboardSensor),
  );

  const picked = useMemo(
    () => mvp.features.filter((feature) => pickedIds.includes(feature.id)),
    [pickedIds],
  );
  const spent = totalCost(picked);

  const add = (feature: MvpFeature) => {
    if (spent + feature.cost > mvp.budget) {
      setMessage(mvp.overBudget);
      return;
    }
    setMessage('');
    setPickedIds((ids) => [...ids, feature.id]);
  };

  const remove = (feature: MvpFeature) => {
    setMessage('');
    setPickedIds((ids) => ids.filter((id) => id !== feature.id));
  };

  const toggle = (feature: MvpFeature) => {
    if (pickedIds.includes(feature.id)) remove(feature);
    else add(feature);
  };

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    const feature = featureById(active.id);
    if (feature && over?.id === ZONE_ID && !pickedIds.includes(feature.id)) add(feature);
  };

  const announcements = useMemo<Announcements>(
    () => ({
      onDragStart: ({ active }) => `Picked up ${featureById(active.id)?.label ?? 'feature'}.`,
      onDragOver: ({ over }) => (over ? `Over ${mvp.zoneTitle}.` : 'Outside the drop area.'),
      onDragEnd: ({ active, over }) =>
        over
          ? `Dropped ${featureById(active.id)?.label ?? 'feature'} into ${mvp.zoneTitle}.`
          : 'Dropped outside. Nothing changed.',
      onDragCancel: () => 'Cancelled. Nothing changed.',
    }),
    [],
  );

  const retry = () => {
    setPickedIds([]);
    setResult(null);
    setMessage('');
  };

  const activeFeature = featureById(activeId);

  return (
    <SectionShell id="mvp" world="screen" era="modern" bleedFrom="dusk">
      <SectionHeader id="mvp" number={mvp.number} title={mvp.title} lead={mvp.lead} />

      {result ? (
        <ResultCard result={result} picked={picked} onRetry={retry} />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
          accessibility={{ announcements }}
        >
          <div className={styles.board}>
            <div>
              <h3 className={styles.poolTitle}>{mvp.poolTitle}</h3>
              <ul className={styles.pool}>
                {mvp.features.map((feature) => (
                  <FeatureTile
                    key={feature.id}
                    feature={feature}
                    added={pickedIds.includes(feature.id)}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            </div>
            <DropZone
              picked={picked}
              spent={spent}
              message={message}
              onRemove={remove}
              onSubmit={() => setResult(scoreMvp(picked, mvp.budget))}
            />
          </div>
          <DragOverlay dropAnimation={null}>
            {activeFeature && <div className={styles.overlay}>{activeFeature.label}</div>}
          </DragOverlay>
        </DndContext>
      )}
    </SectionShell>
  );
}
