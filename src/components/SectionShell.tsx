import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Era, SectionId, World } from '../content/types';
import { cx } from '../lib/cx';
import styles from './SectionShell.module.css';

interface SectionShellProps {
  id: SectionId;
  world: World;
  era: Era;
  /** The previous section's world. Its colour bleeds into this one at the top edge. */
  bleedFrom?: World;
  className?: string | undefined;
  children: ReactNode;
}

type BleedStyle = CSSProperties & { '--bleed-from': string };

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell(
  { id, world, era, bleedFrom, className, children },
  ref,
) {
  const bleedStyle: BleedStyle | undefined = bleedFrom
    ? { '--bleed-from': `var(--w-${bleedFrom})` }
    : undefined;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      data-nav-section={id}
      data-world={world}
      data-era={era}
      className={cx(styles.shell, className)}
    >
      {bleedStyle && <div className={styles.bleed} style={bleedStyle} aria-hidden="true" />}
      {children}
    </section>
  );
});

interface SectionHeaderProps {
  id: SectionId;
  number: string;
  title: string;
  lead?: string;
}

export function SectionHeader({ id, number, title, lead }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.numeral} aria-hidden="true">
        {number}
      </span>
      <div className={styles.heading}>
        <h2 id={`${id}-title`} tabIndex={-1}>
          {title}
        </h2>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </header>
  );
}
