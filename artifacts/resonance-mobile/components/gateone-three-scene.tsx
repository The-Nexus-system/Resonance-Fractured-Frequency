/**
 * Gate One: continuous first-person 3D presentation for native iOS/Android.
 *
 * Uses the SAME walkable rectangles, authored landmarks and moving NPC
 * snapshots as the audio/accessible game. Never owns movement, collision,
 * choices, events or progression. No AI-generated imagery or unlicensed art:
 * modest, deterministic industrial geometry with practical equipment.
 *
 * Unlike a map or an overlay, this is actual world geometry in react-three-
 * fiber's native GL renderer. A failure must leave the game playable.
 */
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useFrame } from '@react-three/fiber';
import { Canvas } from './world3d/fiber-canvas';
import { WALKABLE, PLACES, type Rect } from '@/lib/gateone/world';
import type { EngineSnapshot } from '@/lib/gateone/engine';

const HEIGHT = 3.4;

type SurfaceProps = {
  at: [number, number, number];
  size: [number, number, number];
  color: string;
  metal?: number;
  rough?: number;
};
function Surface({ at, size, color, metal = 0.65, rough = 0.58 }: SurfaceProps) {
  return (
    <mesh position={at}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
    </mesh>
  );
}

/* Exterior wall segments exclude openings where two walkable areas join.
 * Presentation-only; the engine remains the collision authority. */
type Wall = { x: number; y: number; width: number; depth: number };
function wallsFrom(rects: Rect[]): Wall[] {
  const inside = (x: number, y: number) =>
    rects.some(r => x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2);
  const walls: Wall[] = [];
  const step = 0.5;
  for (const r of rects) {
    for (const [edgeY, outward] of [[r.y1, -0.3], [r.y2, 0.3]]) {
      let start: number | null = null;
      for (let i = 0; i <= Math.ceil((r.x2 - r.x1) / step); i++) {
        const x = Math.min(r.x2, r.x1 + i * step);
        const blocked = x < r.x2 && !inside(x, edgeY + outward);
        if (blocked && start === null) start = x;
        if ((!blocked || i === Math.ceil((r.x2 - r.x1) / step)) && start !== null) {
          const end = blocked ? r.x2 : x;
          if (end > start) walls.push({ x: (start + end) / 2, y: edgeY, width: end - start, depth: 0.22 });
          start = null;
        }
      }
    }
    for (const [edgeX, outward] of [[r.x1, -0.3], [r.x2, 0.3]]) {
      let start: number | null = null;
      for (let i = 0; i <= Math.ceil((r.y2 - r.y1) / step); i++) {
        const y = Math.min(r.y2, r.y1 + i * step);
        const blocked = y < r.y2 && !inside(edgeX + outward, y);
        if (blocked && start === null) start = y;
        if ((!blocked || i === Math.ceil((r.y2 - r.y1) / step)) && start !== null) {
          const end = blocked ? r.y2 : y;
          if (end > start) walls.push({ x: edgeX, y: (start + end) / 2, width: 0.22, depth: end - start });
          start = null;
        }
      }
    }
  }
  return walls;
}

const FINISH = [
  { floor: '#314b55', wall: '#455c63', light: '#efe3cc' }, // transport
  { floor: '#384b55', wall: '#50666a', light: '#e1e8e1' }, // transfer throat
  { floor: '#334c50', wall: '#536a6e', light: '#dce9e4' }, // lunar concourse
  { floor: '#404d50', wall: '#64747a', light: '#ebdfc5' }, // memorial alcove
  { floor: '#314956', wall: '#586c78', light: '#dce7ed' }, // berth apron
  { floor: '#293e4a', wall: '#4b6470', light: '#d6e8eb' }, // bridge
  { floor: '#3a4d45', wall: '#63736b', light: '#f0e7d0' }, // Hearth arrival
] as const;

function Architecture() {
  const walls = useMemo(() => wallsFrom(WALKABLE), []);
  return (
    <group>
      {WALKABLE.map((r, i) => {
        const cx = (r.x1 + r.x2) / 2;
        const cy = (r.y1 + r.y2) / 2;
        const width = r.x2 - r.x1;
        const depth = r.y2 - r.y1;
        const finish = FINISH[i];
        return (
          <group key={i}>
            <Surface at={[cx, -0.06, -cy]} size={[width, 0.12, depth]} color={finish.floor} />
            <Surface at={[cx, HEIGHT + 0.06, -cy]} size={[width, 0.12, depth]} color={finish.wall} />
            {[r.x1 + 0.35, r.x2 - 0.35].map(x => (
              <Surface key={x} at={[x, 0.015, -cy]} size={[0.035, 0.015, depth]} color="#92a09b" />
            ))}
            {Array.from({ length: Math.floor(depth / 5) }, (_, j) => {
              const y = r.y1 + (j + 1) * 5;
              return (
                <group key={j}>
                  <Surface at={[cx, HEIGHT - 0.08, -y]} size={[width, 0.15, 0.16]} color="#667b7e" />
                  <mesh position={[cx, HEIGHT - 0.18, -y]}>
                    <boxGeometry args={[Math.min(3.2, width * 0.55), 0.02, 0.08]} />
                    <meshBasicMaterial color={finish.light} toneMapped={false} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}
      {walls.map((w, i) => (
        <Surface
          key={i}
          at={[w.x, HEIGHT / 2, -w.y]}
          size={[w.width, HEIGHT, w.depth]}
          color="#455c63"
          rough={0.65}
        />
      ))}
    </group>
  );
}

function Seat({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0, -y]}>
      <Surface at={[0, 0.48, 0]} size={[0.78, 0.18, 0.78]} color="#526974" rough={0.88} metal={0.2} />
      <Surface at={[0, 1.03, 0.29]} size={[0.78, 1.05, 0.16]} color="#415a67" rough={0.9} metal={0.18} />
      {[-0.4, 0.4].map(edge => (
        <Surface key={edge} at={[edge, 0.75, 0]} size={[0.09, 0.36, 0.74]} color="#82969b" />
      ))}
      <Surface at={[0, 0.19, 0.22]} size={[0.65, 0.25, 0.14]} color="#4b6468" />
    </group>
  );
}

function LivedInSpaces({ hatchOpen }: { hatchOpen: boolean }) {
  const memorial = PLACES.memorial;
  return (
    <group>
      {/* Earth transport: occupied but navigable, with a central aisle. */}
      {[3.2, 7.9].map(y => (
        <group key={y}>
          <Seat x={-3.12} y={y} />
          <Seat x={3.12} y={y} />
        </group>
      ))}
      {[-3.65, 3.65].map(x => (
        <Surface key={x} at={[x, 2.75, -5.1]} size={[0.34, 0.49, 7.2]} color="#566f79" />
      ))}
      {/* Boarding hatch: detailed frame remains after authorised opening. */}
      {[-1.34, 1.34].map(x => (
        <Surface key={x} at={[x, 1.51, -12]} size={[0.18, 3.02, 0.35]} color="#94a5a6" />
      ))}
      <Surface at={[0, 3.04, -12]} size={[2.85, 0.18, 0.35]} color="#94a5a6" />
      {!hatchOpen && (
        <group>
          <Surface at={[0, 1.5, -12]} size={[2.51, 2.93, 0.22]} color="#354e56" />
          <Surface at={[0, 1.5, -11.86]} size={[1.98, 2.46, 0.04]} color="#59717b" />
          {[0.72, 1.52, 2.3].map(h => (
            <Surface key={h} at={[0, h, -11.83]} size={[2.06, 0.045, 0.035]} color="#9dadad" />
          ))}
        </group>
      )}
      {/* Transfer concourse: pillars and freight kept near the perimeter. */}
      {[-19.2, 19.2].map(x =>
        [21, 35, 48].map(y => (
          <group key={x + ':' + y}>
            <Surface at={[x, 1.67, -y]} size={[0.44, 3.34, 0.59]} color="#697b7f" />
            <Surface at={[x, 2.44, -y + 0.32]} size={[0.27, 0.54, 0.025]} color="#a7cbc3" />
          </group>
        )),
      )}
      {[-17.5, 17.5].map(x => (
        <group key={x}>
          <Surface at={[x, 0.4, -37]} size={[1.15, 0.8, 1.55]} color="#777367" />
          <Surface at={[x, 0.86, -37]} size={[1.19, 0.075, 1.6]} color="#a29d8e" />
        </group>
      ))}
      {/* Memorial: no invented names, just physical engraving. */}
      <Surface at={[-25.8, 1.58, -memorial.y]} size={[0.25, 3.15, 6.6]} color="#879698" />
      <Surface at={[-25.62, 1.59, -memorial.y]} size={[0.04, 2.8, 6.05]} color="#435761" />
      {Array.from({ length: 12 }, (_, i) => (
        <Surface
          key={i}
          at={[-25.59, 0.52 + i * 0.19, -memorial.y]}
          size={[0.012, 0.028, 4.85 - (i % 3) * 0.45]}
          color="#a2b6b1"
        />
      ))}
      {/* Boarding bridge collar and the first Hearth lift. */}
      {[65, 70, 75].map(y => (
        <group key={y}>
          <Surface at={[16, 3.04, -y]} size={[4.55, 0.19, 0.22]} color="#8ea2a5" />
          {[-2.04, 2.04].map(dx => (
            <Surface key={dx} at={[16 + dx, 1.51, -y]} size={[0.18, 3.0, 0.18]} color="#84989e" />
          ))}
        </group>
      ))}
      <group position={[PLACES.lift.x, 0, -101.7]}>
        <Surface at={[0, 1.61, 0]} size={[4.1, 3.22, 0.2]} color="#526e77" />
        {[-0.86, 0.86].map(x => (
          <Surface key={x} at={[x, 1.45, 0.13]} size={[1.62, 2.77, 0.055]} color="#a0afb0" />
        ))}
        <Surface at={[0, 3.24, 0]} size={[4.5, 0.23, 0.45]} color="#889993" />
      </group>
    </group>
  );
}

function MovingPeople({ npcs }: { npcs: EngineSnapshot['npcs'] }) {
  return (
    <group>
      {npcs.map(n => {
        const cargo = n.id.includes('cargo') || n.id.includes('cart');
        const worker = n.id.includes('worker') || n.id.includes('crew');
        const child = n.id.includes('kids');
        const height = child ? 1.05 : 1.58;
        return (
          <group key={n.id} position={[n.x, 0, -n.y]}>
            {cargo ? (
              <group>
                <Surface at={[0, 0.55, 0]} size={[1.12, 0.84, 1.36]} color="#738480" />
                <Surface at={[0, 1.01, 0]} size={[0.95, 0.1, 1.1]} color="#b2aa97" />
              </group>
            ) : (
              <group>
                <mesh position={[0, height * 0.55, 0]}>
                  <capsuleGeometry args={[child ? 0.2 : 0.28, height * 0.39, 4, 9]} />
                  <meshStandardMaterial color={worker ? '#9daaa4' : '#758f94'} roughness={0.92} />
                </mesh>
                <mesh position={[0, height * 0.96, 0]}>
                  <sphereGeometry args={[child ? 0.16 : 0.19, 10, 10]} />
                  <meshStandardMaterial color="#b5a89a" roughness={0.92} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

function PlayerCamera({ x, y, heading }: Pick<EngineSnapshot, 'x' | 'y' | 'heading'>) {
  useFrame(({ camera }) => {
    camera.position.set(x, 1.62, -y);
    camera.rotation.set(0, -heading, 0, 'YXZ');
  });
  return null;
}

class RendererBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <View style={{ height: 190, justifyContent: 'center', padding: 12 }}>
        <Text accessibilityRole="text">3-D presentation is unavailable. The map and all accessible game controls are still available.</Text>
      </View>
    ) : this.props.children;
  }
}

export function GateOneThreeScene({ snap }: { snap: EngineSnapshot }) {
  return (
    <RendererBoundary>
      <View
        style={{ height: 190, borderRadius: 12, overflow: 'hidden' }}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Canvas
          camera={{ fov: 72, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
          style={{ flex: 1 }}
        >
          <color attach="background" args={['#0c1a1e']} />
          <fog attach="fog" args={['#0c1a1e', 12, 65]} />
          <ambientLight intensity={0.65} />
          <directionalLight position={[6, 10, -4]} intensity={0.72} />
          <PlayerCamera x={snap.x} y={snap.y} heading={snap.heading} />
          <Architecture />
          <LivedInSpaces hatchOpen={snap.hatchOpen} />
          <MovingPeople npcs={snap.npcs} />
        </Canvas>
      </View>
    </RendererBoundary>
  );
}
