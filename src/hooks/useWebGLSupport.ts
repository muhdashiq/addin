import { useState } from 'react';

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function canCreateContext(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

function isLowPower(): boolean {
  const hints: NavigatorHints = navigator;
  return (
    hints.connection?.saveData === true ||
    hints.hardwareConcurrency <= 2 ||
    (hints.deviceMemory !== undefined && hints.deviceMemory < 2)
  );
}

/** False when the hero should use the SVG network: no WebGL, or a device that would struggle. */
export function useWebGLSupport(): boolean {
  const [supported] = useState(() => !isLowPower() && canCreateContext());
  return supported;
}
