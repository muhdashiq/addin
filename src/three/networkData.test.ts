import { describe, expect, it } from 'vitest';
import { createNetwork } from './networkData';

describe('createNetwork', () => {
  it('is deterministic for a seed, so WebGL and SVG draw the same map', () => {
    expect(createNetwork({ count: 40 })).toEqual(createNetwork({ count: 40 }));
  });

  it('creates the requested nodes with valid, unique edges', () => {
    const { nodes, edges } = createNetwork({ count: 50 });
    expect(nodes).toHaveLength(50);
    expect(edges.length).toBeGreaterThan(0);

    const keys = new Set(edges.map(([a, b]) => `${a}-${b}`));
    expect(keys.size).toBe(edges.length);
    edges.forEach(([a, b]) => {
      expect(a).not.toBe(b);
      expect(nodes[a]).toBeDefined();
      expect(nodes[b]).toBeDefined();
    });
  });

  it('keeps the headline corner quieter when asked', () => {
    const inCorner = (node: { x: number; y: number }) => node.x < 0.3 && node.y < 0.15;
    const open = createNetwork({ count: 200 }).nodes.filter(inCorner).length;
    const quiet = createNetwork({ count: 200, quietCorner: true }).nodes.filter(inCorner).length;
    expect(quiet).toBeLessThan(open);
  });
});
