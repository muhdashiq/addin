import { useEffect, useRef } from 'react';

export const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

const normalize = (key: string): string => (key.length === 1 ? key.toLowerCase() : key);

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Calls onMatch when the keys are pressed in order. Keys typed into form fields don't count,
 * so a business called "Shop 2010" can't flip the site's skin.
 */
export function useKeySequence(sequence: readonly string[], onMatch: () => void): void {
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;

  useEffect(() => {
    const expected = sequence.map(normalize);
    let pressed: string[] = [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) {
        pressed = [];
        return;
      }
      pressed = [...pressed, normalize(event.key)].slice(-expected.length);
      if (pressed.length === expected.length && pressed.every((key, i) => key === expected[i])) {
        pressed = [];
        onMatchRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sequence]);
}
