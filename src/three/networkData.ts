/*
 * The network's shape, shared by the WebGL scene and its SVG fallback.
 * Coordinates are normalized to -1..1 so each renderer can fit them to its own viewport.
 */

export interface NetworkNode {
  x: number;
  y: number;
  z: number;
  size: number;
  /** 0..1, picks between the two lit colours. */
  tone: number;
  /** 0..1, offsets the node's idle twinkle. */
  phase: number;
}

export type NetworkEdge = readonly [number, number];

export interface Network {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

interface NetworkOptions {
  count: number;
  seed?: number;
  neighbours?: number;
  /** Thins out the lower-left corner, where the hero's headline sits. */
  quietCorner?: boolean;
}

const WIDESCREEN = 16 / 9;
const QUIET_KEEP_CHANCE = 0.28;

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function createNetwork({
  count,
  seed = 2010,
  neighbours = 3,
  quietCorner = false,
}: NetworkOptions): Network {
  const random = seededRandom(seed);
  const nodes: NetworkNode[] = [];

  while (nodes.length < count) {
    const x = random() * 2 - 1;
    const y = random() * 2 - 1;
    if (quietCorner && x < 0.3 && y < 0.15 && random() > QUIET_KEEP_CHANCE) continue;
    nodes.push({
      x,
      y,
      z: (random() - 0.5) * 1.6,
      size: 0.7 + random() * 0.6,
      tone: random(),
      phase: random(),
    });
  }

  const seen = new Set<string>();
  const edges: NetworkEdge[] = [];
  nodes.forEach((node, index) => {
    nodes
      .map((other, otherIndex) => ({
        otherIndex,
        distance: Math.hypot((node.x - other.x) * WIDESCREEN, node.y - other.y),
      }))
      .filter(({ otherIndex }) => otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, neighbours)
      .forEach(({ otherIndex }) => {
        const low = Math.min(index, otherIndex);
        const high = Math.max(index, otherIndex);
        const key = `${low}-${high}`;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([low, high]);
      });
  });

  return { nodes, edges };
}
