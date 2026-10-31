type StorageKind = 'local' | 'session';

// Touching window.localStorage can itself throw (blocked site data, sandboxed frames),
// so the property read has to live inside the try as well.
const area = (kind: StorageKind): Storage =>
  kind === 'local' ? window.localStorage : window.sessionStorage;

export function readStorage(kind: StorageKind, key: string): string | null {
  try {
    return area(kind).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(kind: StorageKind, key: string, value: string): void {
  try {
    area(kind).setItem(key, value);
  } catch {
    // The preference just won't persist past this page view.
  }
}
