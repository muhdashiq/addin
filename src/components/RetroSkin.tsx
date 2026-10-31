import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { content } from '../content/content';
import { KONAMI_CODE, useKeySequence } from '../hooks/useKeySequence';
import { Toast } from './Toast';

const SEQUENCE_2010 = ['2', '0', '1', '0'] as const;
const GOODBYE_MS = 3000;

type SkinMessage = 'on' | 'off' | null;

/** The easter egg: typing "2010" or the Konami code sets data-skin="retro" on <html>. */
export function RetroSkin() {
  const [retro, setRetro] = useState(false);
  const [message, setMessage] = useState<SkinMessage>(null);

  const toggle = useCallback(() => {
    setMessage(retro ? 'off' : 'on');
    setRetro(!retro);
  }, [retro]);

  useKeySequence(SEQUENCE_2010, toggle);
  useKeySequence(KONAMI_CODE, toggle);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (retro) root.dataset.skin = 'retro';
    else delete root.dataset.skin;
  }, [retro]);

  useEffect(() => {
    if (message !== 'off') return;
    const timer = window.setTimeout(() => setMessage(null), GOODBYE_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (message === 'on') {
    return (
      <Toast
        message={content.easterEgg.onMessage}
        actionLabel={content.easterEgg.exitLabel}
        onAction={toggle}
      />
    );
  }
  return message === 'off' ? <Toast message={content.easterEgg.offMessage} /> : null;
}
