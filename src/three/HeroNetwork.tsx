import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, CanvasTexture, Color, NormalBlending, Object3D } from 'three';
import type { InstancedMesh, LineSegments } from 'three';
import { createNetwork } from './networkData';
import type { NetworkMode, NetworkPalette } from './NetworkStage';

const MAX_DPR = 1.5;
const LOW_DPR = 1;
const CAMERA_Z = 10;

const SPRITE_DIM = 0.14;
const SPRITE_LIT = 0.62;

const SIGNAL_RADIUS = 1.9;
const SIGNAL_FADE_PER_SECOND = 1.4;
const REMEMBERED_GLOW = 0.42;
const FAINT_GLOW = 0.12;
const SETTLE_RATE = 1.2;
const RISE_RATE = 14;
const SPREAD_RATE = 1.5;
const SPREAD_FROM = 0.72;
const SPREAD_GAP = 0.35;
const SETTLED_EPSILON = 0.004;

const WAVE_SECONDS = 2.4;
const WAVE_REACH = 2.8;
const WAVE_WIDTH = 0.1;
const WAVE_KEEP_CHANCE = 0.34;

const NEW_SHOP_EVERY_MS = 2600;
const NEW_SHOP_LIMIT = 0.62;
const LIT_FRAME_MS = 1000 / 30;
const TWINKLE_SPEED = 1.1;
const TWINKLE_DEPTH = 0.22;

function createGlowTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (context) {
    const middle = size / 2;
    const glow = context.createRadialGradient(middle, middle, 0, middle, middle, middle);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(0.2, 'rgba(255,255,255,1)');
    glow.addColorStop(0.28, 'rgba(255,255,255,0.38)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, size, size);
  }
  return new CanvasTexture(canvas);
}

interface NetworkFieldProps {
  mode: NetworkMode;
  palette: NetworkPalette;
  paused: boolean;
}

function NetworkField({ mode, palette, paused }: NetworkFieldProps) {
  const lit = mode === 'lit';
  const { viewport, invalidate, gl, size } = useThree();

  const count = size.width < 700 ? (lit ? 110 : 80) : lit ? 260 : 170;
  const network = useMemo(() => createNetwork({ count, quietCorner: !lit }), [count, lit]);
  const { nodes, edges } = network;

  const meshRef = useRef<InstancedMesh>(null);
  const linesRef = useRef<LineSegments>(null);

  const glow = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);

  const blending = palette.additive ? AdditiveBlending : NormalBlending;
  const colors = useMemo(
    () => ({
      dim: new Color(palette.dim),
      lit: new Color(palette.lit),
      litAlt: new Color(palette.litAlt),
      line: new Color(palette.line),
    }),
    [palette],
  );

  const linePositions = useMemo(() => new Float32Array(edges.length * 6), [edges.length]);
  const lineColors = useMemo(() => new Float32Array(edges.length * 8), [edges.length]);

  // Everything per-frame lives in refs: rendering this through React state would be far too slow.
  const sim = useRef({
    activation: new Float32Array(count),
    resting: new Float32Array(count).fill(lit ? 1 : 0),
    signal: { x: 0, y: 0, strength: 0 },
    wave: lit ? WAVE_SECONDS : 0,
    elapsed: 0,
    drift: { x: 0, y: 0 },
  });
  if (sim.current.activation.length !== count) {
    sim.current.activation = new Float32Array(count);
    sim.current.resting = new Float32Array(count).fill(lit ? 1 : 0);
  }

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const halfWidth = viewport.width * 0.53;
  const halfHeight = viewport.height * 0.53;

  useEffect(() => {
    edges.forEach(([a, b], edge) => {
      const from = nodes[a];
      const to = nodes[b];
      if (!from || !to) return;
      linePositions.set(
        [
          from.x * halfWidth,
          from.y * halfHeight,
          from.z,
          to.x * halfWidth,
          to.y * halfHeight,
          to.z,
        ],
        edge * 6,
      );
    });
    const positions = linesRef.current?.geometry.getAttribute('position');
    if (positions) positions.needsUpdate = true;
    invalidate();
  }, [edges, nodes, halfWidth, halfHeight, linePositions, invalidate]);

  // The pointer is the signal, tracked on window because the page's content sits above the canvas.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (pausedRef.current) return;
      const box = gl.domElement.getBoundingClientRect();
      const insideY = event.clientY >= box.top && event.clientY <= box.bottom;
      if (!insideY) return;
      const signal = sim.current.signal;
      signal.x = (((event.clientX - box.left) / box.width) * 2 - 1) * viewport.width * 0.5;
      signal.y = (1 - ((event.clientY - box.top) / box.height) * 2) * viewport.height * 0.5;
      signal.strength = 1;
      invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl, invalidate, viewport.height, viewport.width]);

  // Hero: another small shop comes online now and then. Lit: a steady, cheap twinkle.
  useEffect(() => {
    if (paused) return;
    invalidate();
    const interval = lit ? LIT_FRAME_MS : NEW_SHOP_EVERY_MS;
    const timer = window.setInterval(() => {
      if (!lit) {
        const { activation, resting } = sim.current;
        const onlineShare = resting.reduce((sum, value) => sum + (value > 0.3 ? 1 : 0), 0) / count;
        if (onlineShare < NEW_SHOP_LIMIT) {
          const shop = Math.floor(Math.random() * count);
          activation[shop] = 1;
          resting[shop] = REMEMBERED_GLOW;
        }
      }
      invalidate();
    }, interval);
    return () => window.clearInterval(timer);
  }, [count, invalidate, lit, paused]);

  const dummy = useMemo(() => new Object3D(), []);
  const tint = useMemo(() => new Color(), []);
  const litColor = useMemo(() => new Color(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const lines = linesRef.current;
    if (!mesh || !lines || pausedRef.current) return;

    const state = sim.current;
    const dt = Math.min(delta, 0.05);
    state.elapsed += dt;

    const { activation, resting, signal } = state;
    const settle = 1 - Math.exp(-dt * SETTLE_RATE);
    const rise = 1 - Math.exp(-dt * RISE_RATE);
    let moving = signal.strength > 0;

    const waveActive = state.wave < WAVE_SECONDS;
    const waveRadius = (state.wave / WAVE_SECONDS) * WAVE_REACH;
    if (waveActive) {
      state.wave += dt;
      moving = true;
    }

    nodes.forEach((node, i) => {
      const x = node.x * halfWidth;
      const y = node.y * halfHeight;
      let level = activation[i] ?? 0;
      const rest = resting[i] ?? 0;

      if (signal.strength > 0) {
        const reach = 1 - Math.hypot(x - signal.x, y - signal.y) / SIGNAL_RADIUS;
        if (reach > 0) {
          const target = reach * 1.25 * signal.strength;
          if (target > level) level += (target - level) * rise;
          if (reach > 0.45 && rest < REMEMBERED_GLOW) resting[i] = REMEMBERED_GLOW;
        }
      }

      if (waveActive) {
        const fromOrigin = Math.hypot(node.x - 0.55, node.y - 0.35);
        if (Math.abs(fromOrigin - waveRadius) < WAVE_WIDTH) {
          level = 1;
          const keeps = (node.phase * 7) % 1 < WAVE_KEEP_CHANCE;
          if (rest < FAINT_GLOW) resting[i] = keeps ? REMEMBERED_GLOW : FAINT_GLOW;
        }
      }

      const settled = resting[i] ?? 0;
      level += (settled - level) * settle;
      if (Math.abs(settled - level) > SETTLED_EPSILON) moving = true;
      activation[i] = level;
    });

    // Light travels along connections, which is what makes it read as a network and not a spotlight.
    edges.forEach(([a, b]) => {
      const levelA = activation[a] ?? 0;
      const levelB = activation[b] ?? 0;
      if (levelA > SPREAD_FROM && levelB < levelA - SPREAD_GAP) {
        activation[b] = levelB + dt * SPREAD_RATE;
      } else if (levelB > SPREAD_FROM && levelA < levelB - SPREAD_GAP) {
        activation[a] = levelA + dt * SPREAD_RATE;
      }
    });

    signal.strength = Math.max(0, signal.strength - dt * SIGNAL_FADE_PER_SECOND);

    nodes.forEach((node, i) => {
      const twinkle = lit
        ? 1 -
          TWINKLE_DEPTH +
          TWINKLE_DEPTH * Math.sin(state.elapsed * TWINKLE_SPEED + node.phase * 6.28)
        : 1;
      const level = Math.min(1, (activation[i] ?? 0) * twinkle);
      const scale = node.size * (SPRITE_DIM + (SPRITE_LIT - SPRITE_DIM) * level);
      dummy.position.set(node.x * halfWidth, node.y * halfHeight, node.z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      litColor.copy(node.tone > 0.5 ? colors.lit : colors.litAlt);
      mesh.setColorAt(i, tint.lerpColors(colors.dim, litColor, level));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    edges.forEach(([a, b], edge) => {
      const strength = Math.pow(Math.min(activation[a] ?? 0, activation[b] ?? 0), 1.4);
      const alpha = Math.min(1, strength * (lit ? 0.75 : 0.95));
      const offset = edge * 8;
      for (let end = 0; end < 2; end += 1) {
        const at = offset + end * 4;
        lineColors[at] = colors.line.r;
        lineColors[at + 1] = colors.line.g;
        lineColors[at + 2] = colors.line.b;
        lineColors[at + 3] = alpha;
      }
    });
    const lineColorAttribute = lines.geometry.getAttribute('color');
    if (lineColorAttribute) lineColorAttribute.needsUpdate = true;

    if (moving) invalidate();
  });

  return (
    <>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 4]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={blending} />
      </lineSegments>
      <instancedMesh
        key={count}
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={blending}
        />
      </instancedMesh>
    </>
  );
}

interface HeroNetworkProps {
  mode: NetworkMode;
  palette: NetworkPalette;
  paused: boolean;
  className?: string | undefined;
}

export default function HeroNetwork({ mode, palette, paused, className }: HeroNetworkProps) {
  const [dpr, setDpr] = useState(MAX_DPR);

  return (
    <Canvas
      className={className}
      dpr={[LOW_DPR, dpr]}
      flat
      frameloop="demand"
      // NextChapter scales this canvas's parent. offsetSize measures it without that transform.
      resize={{ offsetSize: true, scroll: false }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(LOW_DPR)} />
      <NetworkField mode={mode} palette={palette} paused={paused} />
    </Canvas>
  );
}
