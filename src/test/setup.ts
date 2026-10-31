import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom has none of these. Reporting reduced motion means sections render their static versions.
const matchMedia = (query: string) => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
});
vi.stubGlobal('matchMedia', matchMedia);
Object.defineProperty(window, 'matchMedia', { writable: true, value: matchMedia });

class ObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
vi.stubGlobal('IntersectionObserver', ObserverStub);
vi.stubGlobal('ResizeObserver', ObserverStub);

// jsdom's getContext prints "not implemented". The hook should simply see no WebGL.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

afterEach(cleanup);
