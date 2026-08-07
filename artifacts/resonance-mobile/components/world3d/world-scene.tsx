/**
 * Reusable 3-D world renderer (Phase 4 completion).
 *
 * Consumes SceneEntity views derived from the SEMANTIC world model — it
 * never owns object identity, position, discovery, interaction, puzzle,
 * attunement, reward, or progression state. Tapping an entity invokes the
 * caller's semantic action dispatcher: the same one behind the accessible
 * button, VoiceOver custom actions, shake, and the Shortcut route.
 *
 * Visual fracture language (coherent set, not generic glow):
 * - FRACTURED objects render as PHASE-OFFSET TWIN COPIES that jitter apart
 *   with broken symmetry and chromatic separation (cool/warm split) — the
 *   visual analogue of the detuned twin-oscillator beating in the audio.
 * - ATTUNED objects collapse to a single coherent form with a slow harmonic
 *   pulse and a settled ripple ring.
 * - The ENVIRONMENT is a particle field + ground lattice whose motion is
 *   desynchronised in proportion to (1 - environmentCoherence); as
 *   resonators are restored the particles synchronise into slow orbital
 *   agreement and the lattice settles flat. Restoring all four transforms
 *   the whole field, not just four icons.
 *
 * Quality/performance system:
 * - Tiers low/medium/high scale particle counts, twin copies, and segment
 *   counts. 'auto' starts at high and self-degrades when the measured frame
 *   time stays over budget. Purely presentational: gameplay logic, hidden
 *   objects, reachability, and discovery NEVER depend on the tier.
 * - Reduce Motion replaces movement with meaningful static alternatives:
 *   fractured = visibly split static twins; attuned = whole single form.
 */
import React, { useMemo, useRef, useState } from 'react';
import { Platform, View, Text } from 'react-native';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Canvas } from './fiber-canvas';
import type { SceneEntity, SceneState } from '@/lib/scene/entities';

/**
 * Honest capability check: some browsers/devices cannot create a WebGL
 * context. The 3-D view is OPTIONAL presentation — when it cannot exist,
 * the game must keep working through the text interface, not crash.
 */
let webglSupport: boolean | null = null;
function supportsWebGL(): boolean {
  if (Platform.OS !== 'web') return true; // native uses expo-gl
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

class SceneErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('3-D view unavailable, falling back to text interface:', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export type QualityTier = 'low' | 'medium' | 'high';

export type WorldSceneProps = {
  scene: SceneState;
  /** Invoke the SAME semantic action as every other input mechanism. */
  onSelectEntity: (id: string) => void;
  reduceMotion: boolean;
  quality: QualityTier | 'auto';
  /** Notified when auto quality degrades (for the settings readout). */
  onAutoTier?: (tier: QualityTier) => void;
  height?: number;
};

const TIER_PARTICLES: Record<QualityTier, number> = { low: 120, medium: 350, high: 800 };
const TIER_SEGMENTS: Record<QualityTier, number> = { low: 8, medium: 16, high: 24 };

/** Cool/warm chromatic split used for fractured twins. */
const SPLIT_COOL = '#4cc9f0';
const SPLIT_WARM = '#f77f5e';
const COHERENT = '#7ae8d8'; // settled resonance — teal family, matches app palette
const FOCUS = '#ffe08a';

function kindGeometry(kind: SceneEntity['kind'], segments: number): React.ReactElement {
  switch (kind) {
    case 'pillar':
      return <cylinderGeometry args={[0.35, 0.5, 2.4, segments]} />;
    case 'signal':
      return <octahedronGeometry args={[0.4, 0]} />;
    case 'fracture':
      return <torusGeometry args={[0.7, 0.16, segments, segments * 2]} />;
    default:
      return <boxGeometry args={[0.9, 1.1, 0.9]} />;
  }
}

/** Deterministic per-id phase so jitter differs per object but replays identically. */
function idPhase(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (h % 628) / 100;
}

function EntityMesh({
  entity,
  segments,
  reduceMotion,
  onSelect,
}: {
  entity: SceneEntity;
  segments: number;
  reduceMotion: boolean;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const twinA = useRef<THREE.Mesh>(null);
  const twinB = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => idPhase(entity.id), [entity.id]);
  const fractured = entity.state !== 'attuned';

  useFrame(({ clock }) => {
    if (reduceMotion) return;
    const t = clock.getElapsedTime() + phase;
    if (fractured) {
      // Phase-offset twins beat apart and back — visible instability.
      const beat = Math.sin(t * 2.1) * 0.5 + Math.sin(t * 3.7) * 0.5;
      const split = 0.10 + 0.08 * beat;
      if (twinA.current) {
        twinA.current.position.x = -split;
        twinA.current.rotation.z = 0.06 * Math.sin(t * 2.9);
      }
      if (twinB.current) {
        twinB.current.position.x = split;
        twinB.current.rotation.z = -0.06 * Math.sin(t * 2.3);
      }
      // Animate the mapped THREE Y (elevation) only — never the mapped Z,
      // which encodes semantic north/south and must stay authoritative.
      if (group.current) group.current.position.y = entity.position.z + 1.2 + 0.03 * Math.sin(t * 5.1);
    } else {
      // Harmonic pulse: one slow, even breath.
      const pulse = 1 + 0.04 * Math.sin(t * 1.4);
      if (twinA.current) {
        twinA.current.position.x = 0;
        twinA.current.rotation.z = 0;
        twinA.current.scale.setScalar(pulse);
      }
      if (ring.current) {
        const r = ((clock.getElapsedTime() + phase) % 3) / 3;
        ring.current.scale.setScalar(1 + r * 1.6);
        (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - r);
      }
    }
  });

  // World model: x east, y north, z up → three.js: x east, y up, z south.
  const pos: [number, number, number] = [entity.position.x, entity.position.z + 1.2, -entity.position.y];
  const staticSplit = reduceMotion && fractured ? 0.16 : 0;

  return (
    <group
      ref={group}
      position={pos}
      rotation={[0, entity.rotation, 0]}
      scale={entity.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(entity.id);
      }}
    >
      <mesh ref={twinA} position={[-staticSplit, 0, 0]}>
        {kindGeometry(entity.kind, segments)}
        <meshStandardMaterial
          color={fractured ? SPLIT_COOL : COHERENT}
          emissive={entity.focused ? FOCUS : fractured ? SPLIT_COOL : COHERENT}
          emissiveIntensity={entity.focused ? 0.7 : 0.25 + 0.3 * entity.proximity}
          transparent
          opacity={fractured ? 0.85 : 1}
        />
      </mesh>
      {fractured ? (
        <mesh ref={twinB} position={[staticSplit, 0, 0]}>
          {kindGeometry(entity.kind, segments)}
          <meshStandardMaterial
            color={SPLIT_WARM}
            emissive={SPLIT_WARM}
            emissiveIntensity={0.2}
            transparent
            opacity={0.45}
            wireframe
          />
        </mesh>
      ) : (
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, 0]}>
          <ringGeometry args={[0.8, 0.9, segments * 2]} />
          <meshBasicMaterial color={COHERENT} transparent opacity={reduceMotion ? 0.3 : 0.25} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/** Environmental particle field: desynchronised while fractured, orbital agreement when restored. */
function ParticleField({
  count,
  coherence,
  reduceMotion,
}: {
  count: number;
  coherence: number;
  reduceMotion: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic spiral distribution — no Math.random.
      const a = i * 2.399963; // golden angle
      const r = 4 + (i / count) * 26;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.5 + ((i * 37) % 100) / 18;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (reduceMotion || !points.current) return;
    const t = clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position;
    const instability = 1 - coherence;
    for (let i = 0; i < count; i++) {
      const jitterPhase = i * 0.7;
      // Fractured: independent nervous jitter. Coherent: one shared slow wave.
      const jitter = Math.sin(t * (2 + (i % 7)) + jitterPhase) * 0.35 * instability;
      const sharedWave = Math.sin(t * 0.6 + base[i * 3] * 0.08) * 0.25 * coherence;
      positions.setY(i, base[i * 3 + 1] + jitter + sharedWave);
    }
    positions.needsUpdate = true;
    points.current.rotation.y = t * 0.01 * coherence; // settled field slowly revolves as one
  });

  const color = coherence >= 1 ? COHERENT : coherence > 0 ? '#9fd8cf' : '#5a7d8a';
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/** Ground lattice that visibly settles as the zone heals. */
function GroundLattice({ coherence, reduceMotion }: { coherence: number; reduceMotion: boolean }) {
  const grid = useRef<THREE.GridHelper>(null);
  useFrame(({ clock }) => {
    if (reduceMotion || !grid.current) return;
    const instability = 1 - coherence;
    // Unstable ground shivers; healed ground lies still.
    grid.current.position.y = -0.02 + Math.sin(clock.getElapsedTime() * 7.3) * 0.05 * instability;
  });
  return <gridHelper ref={grid} args={[60, 30, '#2c5b66', '#173a44']} />;
}

function SceneContents({
  scene,
  onSelectEntity,
  reduceMotion,
  tier,
  onFrameMs,
}: {
  scene: SceneState;
  onSelectEntity: (id: string) => void;
  reduceMotion: boolean;
  tier: QualityTier;
  onFrameMs: (ms: number) => void;
}) {
  const lastT = useRef<number | null>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lastT.current !== null) onFrameMs((t - lastT.current) * 1000);
    lastT.current = t;
  });

  // Camera follows the player's semantic pose.
  const heading = (scene.player.headingDeg * Math.PI) / 180;
  const cam: [number, number, number] = [
    scene.player.position.x,
    scene.player.position.z + 2.2,
    -scene.player.position.y,
  ];

  return (
    <group>
      <PlayerCamera position={cam} heading={heading} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 14, 6]} intensity={0.8} />
      <fog attach="fog" args={['#0b1e24', 12, 55]} />
      <GroundLattice coherence={scene.environmentCoherence} reduceMotion={reduceMotion} />
      <ParticleField count={TIER_PARTICLES[tier]} coherence={scene.environmentCoherence} reduceMotion={reduceMotion} />
      {scene.entities
        .filter((e) => e.visible)
        .map((e) => (
          <EntityMesh
            key={e.id}
            entity={e}
            segments={TIER_SEGMENTS[tier]}
            reduceMotion={reduceMotion}
            onSelect={onSelectEntity}
          />
        ))}
    </group>
  );
}

function PlayerCamera({ position, heading }: { position: [number, number, number]; heading: number }) {
  useFrame(({ camera }) => {
    camera.position.set(position[0], position[1], position[2]);
    camera.rotation.set(0, -heading, 0, 'YXZ');
  });
  return null;
}

export function WorldScene({
  scene,
  onSelectEntity,
  reduceMotion,
  quality,
  onAutoTier,
  height = 260,
}: WorldSceneProps) {
  const [autoTier, setAutoTier] = useState<QualityTier>('high');
  const tier: QualityTier = quality === 'auto' ? autoTier : quality;

  // Auto-degradation: sustained frame times over ~28ms step the tier down.
  const overBudget = useRef(0);
  const handleFrameMs = (ms: number) => {
    if (quality !== 'auto') return;
    if (ms > 28) {
      overBudget.current += 1;
      if (overBudget.current > 90 && autoTier !== 'low') {
        const next: QualityTier = autoTier === 'high' ? 'medium' : 'low';
        overBudget.current = 0;
        setAutoTier(next);
        onAutoTier?.(next);
      }
    } else {
      overBudget.current = Math.max(0, overBudget.current - 2);
    }
  };

  const fallback = (
    <View
      style={{ height, borderRadius: 12, backgroundColor: '#0b1e24', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      accessible
      accessibilityLabel="3-D view unavailable on this device. All information remains in the text below."
    >
      <Text style={{ color: '#9fd8cf', textAlign: 'center' }}>
        3-D view is not available on this device.{'\n'}Everything in the world is described in the text below.
      </Text>
    </View>
  );

  if (!supportsWebGL()) return fallback;

  return (
    <SceneErrorBoundary fallback={fallback}>
      <Canvas
        style={{ height, borderRadius: 12 }}
        camera={{ fov: 60, near: 0.1, far: 120 }}
        gl={{ antialias: tier !== 'low' }}
        frameloop={reduceMotion ? 'demand' : 'always'}
      >
        <color attach="background" args={['#0b1e24']} />
        <SceneContents
          scene={scene}
          onSelectEntity={onSelectEntity}
          reduceMotion={reduceMotion}
          tier={tier}
          onFrameMs={handleFrameMs}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
