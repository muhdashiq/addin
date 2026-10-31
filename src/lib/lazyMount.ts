/*
 * Lazy sections normally mount when they come near the viewport. Jumping to an anchor needs
 * every section above the target at its real height first, so navigation can force them all.
 */

let mountAll = false;
const listeners = new Set<() => void>();

export function requestMountAll(): void {
  if (mountAll) return;
  mountAll = true;
  listeners.forEach((listener) => listener());
}

export function subscribeMountAll(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMountAll(): boolean {
  return mountAll;
}
