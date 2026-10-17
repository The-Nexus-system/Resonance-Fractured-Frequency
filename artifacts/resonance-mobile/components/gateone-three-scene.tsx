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
import { GateOneLighting } from './gateone-lighting';
import { GATE_ONE_FINISH } from './gateone-materials';
import * as THREE from 'three';
import { WALKABLE, PLACES, type Rect } from '@/lib/gateone/world';
import type { EngineSnapshot } from '@/lib/gateone/engine';

const HEIGHT = 3.4;

type SurfaceProps = {
  at: [number, number, number];
  size: [number, number, number];
  color: string;
  metal?: number;
  rough?: number;
  cast?: boolean;
};
function Surface({ at, size, color, metal = 0.65, rough = 0.58, cast = true }: SurfaceProps) {
  return (
    <mesh position={at} castShadow={cast} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metal}
        roughness={rough}
        map={at[1] < 0 && size[0] > 2 ? GATE_ONE_FINISH.deck : metal >= 0.45 ? GATE_ONE_FINISH.hull : undefined}
      />
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
  // Cut real observation openings in existing exterior walls. These are
  // scripted locations, not new routes or navigation geometry.
  return walls.flatMap(w => {
    if (!(w.width < 0.3 && w.depth > 0.3)) return [w];
    let opening: [number, number] | null = null;
    if (Math.abs(w.x + 4) < 0.3) opening = [7, 9.1];
    else if (Math.abs(w.x - 20) < 0.3 && w.y + w.depth / 2 > 58.35)
      opening = [58.35, 61.05];
    if (!opening) return [w];
    const low = w.y - w.depth / 2;
    const high = w.y + w.depth / 2;
    if (opening[1] <= low || opening[0] >= high) return [w];
    return [
      [low, Math.min(high, opening[0])],
      [Math.max(low, opening[1]), high],
    ].filter(([a, b]) => b - a > 0.08)
      .map(([a, b]) => ({ ...w, y: (a + b) / 2, depth: b - a }));
  });
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
            <Surface at={[cx, -0.06, -cy]} size={[width, 0.12, depth]} color={finish.floor} cast={false} />
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

/**
 * Physical dressing for Gate One's scripted spaces.
 * These are hand-arranged hard-surface parts: practical, repaired, occupied.
 * They do not create collision, progression or new fictional interactions.
 */
function WorkingStation({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0, -y]}>
      <Surface at={[0, 0.66, 0]} size={[1.55, 0.13, 0.71]} color="#667a7a" />
      {[-0.63, 0.63].map(edge => (
        <Surface key={edge} at={[edge, 0.32, 0]} size={[0.09, 0.62, 0.62]} color="#60727a" />
      ))}
      <Surface at={[0, 1.11, -0.2]} size={[0.91, 0.70, 0.11]} color="#344e57" />
      <Surface at={[0, 1.12, -0.14]} size={[0.75, 0.49, 0.018]} color="#83afa9" metal={0.14} rough={0.32} />
      <Surface at={[0.62, 0.75, 0.16]} size={[0.15, 0.07, 0.12]} color="#d4bc85" />
      <Surface at={[-0.34, 0.75, 0.06]} size={[0.38, 0.035, 0.24]} color="#aeb5ab" metal={0.18} />
    </group>
  );
}

function BerthExterior() {
  const y = PLACES.berthWindow.y;
  return (
    <group>
      {/* Glazed viewport, fixed structural frame, outside the walkable edge. */}
      <Surface at={[20.05, 2.89, -y]} size={[0.33, 0.42, 3.97]} color="#8ea0a8" />
      <Surface at={[20.05, 0.42, -y]} size={[0.33, 0.82, 3.97]} color="#6c7e87" />
      {[-1.82, 1.82].map(dz => (
        <Surface key={dz} at={[20.05, 1.62, -y + dz]} size={[0.33, 2.24, 0.16]} color="#b0bec1" />
      ))}
      <mesh position={[19.99, 1.73, -y]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.5, 2.06]} />
        <meshPhysicalMaterial
          color="#9bbed0"
          metalness={0.1}
          roughness={0.18}
          transparent
          opacity={0.12}
          side={2}
          depthWrite={false}
        />
      </mesh>
      {/* The existing Hearth, seen beyond the station glass. Multi-section
          hull, service patches and airlock collar, not a separate level. */}
      <group position={[33, 0.65, -y]}>
        <Surface at={[0, 2.13, 0]} size={[17.8, 5.7, 15.8]} color="#6b7e83" rough={0.63} metal={0.72} />
        <Surface at={[-8.55, 2.35, -1.8]} size={[0.10, 4.0, 10.0]} color="#859590" />
        <Surface at={[-8.65, 1.96, 5.8]} size={[0.13, 2.5, 3.3]} color="#415d69" />
        <Surface at={[-8.66, 3.82, 1.8]} size={[0.14, 0.18, 7.8]} color="#b4aaa0" />
        {[-4.3, 0.3, 4.5].map((dz, i) => (
          <group key={i}>
            <Surface at={[-8.72, 2.2, dz]} size={[0.12, 3.3, 0.28]} color={i === 1 ? "#b5a88e" : "#a0b0aa"} />
            <Surface at={[-8.80, 3.35, dz]} size={[0.018, 0.08, 1.05]} color="#acc3bf" metal={0.1} />
          </group>
        ))}
        <Surface at={[-6.9, -0.45, 0]} size={[2.4, 0.4, 9.1]} color="#4f707a" />
      </group>
    </group>
  );
}

function ConcourseEquipment() {
  return (
    <group>
      {/* The signed station employee has an actual workstation. */}
      <WorkingStation x={-9.6} y={24} />
      {[-17.4, 17.4].map(x => (
        <group key={x}>
          <Surface at={[x, 0.43, -54]} size={[1.18, 0.81, 1.5]} color="#827969" />
          <Surface at={[x, 0.87, -54]} size={[1.22, 0.09, 1.55]} color="#b2ae9f" />
          {[-0.42, 0.42].map(dx => (
            <Surface key={dx} at={[x + dx, 0.10, -54]} size={[0.09, 0.20, 1.52]} color="#39474d" />
          ))}
        </group>
      ))}
      {/* Station signs are abstract plates: no invented copy or names. */}
      {[24, 39, 54].map(y => (
        <group key={y}>
          <Surface at={[0, 2.98, -y]} size={[5.2, 0.36, 0.22]} color="#315461" />
          <Surface at={[-1.35, 2.96, -y + 0.12]} size={[1.85, 0.07, 0.025]} color="#b3d5d3" metal={0.08} />
          <Surface at={[1.4, 2.96, -y + 0.12]} size={[1.1, 0.07, 0.025]} color="#e3c985" metal={0.08} />
        </group>
      ))}
      <pointLight position={[-8, 2.98, -24]} color="#d5e9dd" intensity={0.72} distance={12} />
    </group>
  );
}

function HearthArrivalEquipment() {
  return (
    <group>
      {/* Existing arrivals checkpoint and repair work, with an open centre. */}
      {[-1.53, 1.53].map(dx => (
        <Surface key={dx} at={[16 + dx, 1.18, -82]} size={[0.17, 2.34, 0.38]} color="#708b87" />
      ))}
      <Surface at={[16, 2.4, -82]} size={[3.24, 0.2, 0.39]} color="#849b94" />
      <Surface at={[16, 2.22, -81.77]} size={[1.86, 0.048, 0.025]} color="#b6d7c7" metal={0.12} />
      <Surface at={[4.5, 1.5, -86]} size={[0.15, 2.5, 3.0]} color="#445b61" />
      <Surface at={[4.67, 1.52, -86]} size={[0.08, 1.51, 2.22]} color="#233c44" />
      {[85.4, 86, 86.6].map(y => (
        <Surface key={y} at={[4.77, 1.58, -y]} size={[0.025, 0.06, 0.31]} color="#b6c3b5" />
      ))}
      {/* Cargo is left at the perimeter, outside the central guided route. */}
      {[86, 93].map((y, i) => (
        <group key={y}>
          <Surface at={[27.05, 0.47, -y]} size={[1.31, 0.94, 1.84]} color={i ? "#8b7a66" : "#718681"} />
          <Surface at={[27.05, 0.96, -y]} size={[1.36, 0.06, 1.9]} color="#aaad9e" />
        </group>
      ))}
      <pointLight position={[16, 2.98, -88]} color="#e5dcc7" intensity={0.8} distance={18} />
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
      <ConcourseEquipment />
      <BerthExterior />
      <HearthArrivalEquipment />
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

/**
 * Generic travellers keep recognisable movement silhouettes and belongings.
 * No identity, medical or cultural traits are invented for story characters.
 * The moving coordinates still come directly from the Game One engine.
 */
function MovingPeople({ npcs }: { npcs: EngineSnapshot['npcs'] }) {
  return (
    <group>
      {npcs.map(n => {
        const cargo = n.id.includes('cargo') || n.id.includes('cart');
        const worker = n.id.includes('worker') || n.id.includes('crew');
        const child = n.id.includes('kids');
        const traveller = n.id.includes('trav');
        const dinner = n.id.includes('dinner');
        const height = child ? 1.05 : 1.58;
        return (
          <group key={n.id} position={[n.x, 0, -n.y]}>
            {cargo ? (
              <group>
                <Surface at={[0, 0.56, 0]} size={[1.22, 0.78, 1.46]} color="#718683" />
                <Surface at={[0, 1.02, -0.04]} size={[1.04, 0.17, 1.19]} color="#a79e8d" />
                <Surface at={[0.55, 0.86, 0.04]} size={[0.08, 0.85, 0.84]} color="#a7b2af" />
                {[-0.49, 0.49].map(x =>
                  [-0.51, 0.51].map(z => (
                    <mesh key={x + ':' + z} position={[x, 0.17, z]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.15, 0.15, 0.10, 12]} />
                      <meshStandardMaterial color="#2a353b" roughness={0.93} />
                    </mesh>
                  )),
                )}
              </group>
            ) : (
              <group>
                {/* Clothing, posture and carried items—not colour alone—separate roles. */}
                <mesh position={[0, height * 0.55, 0]} castShadow>
                  <capsuleGeometry args={[child ? 0.20 : 0.28, height * 0.39, 4, 9]} />
                  <meshStandardMaterial
                    color={worker ? '#9ca9a2' : child ? '#b2a080' : '#758f94'}
                    roughness={0.92}
                  />
                </mesh>
                <mesh position={[0, height * 0.96, 0]} castShadow>
                  <sphereGeometry args={[child ? 0.16 : 0.19, 10, 10]} />
                  <meshStandardMaterial color="#b5a89a" roughness={0.92} />
                </mesh>
                {/* Distinct legs and practical shoes, avoiding a floating pawn shape. */}
                {[-0.13, 0.13].map(x => (
                  <group key={x}>
                    <Surface at={[x, height * 0.18, 0]} size={[child ? 0.11 : 0.14, height * 0.33, 0.16]} color="#394a51" metal={0.05} rough={0.96} />
                    <Surface at={[x, 0.065, -0.055]} size={[child ? 0.15 : 0.18, 0.13, 0.29]} color="#30393d" metal={0.05} rough={0.96} />
                  </group>
                ))}
                {worker && (
                  <group>
                    <Surface at={[0.32, height * 0.53, 0.02]} size={[0.17, 0.40, 0.28]} color="#637b7c" />
                    <Surface at={[0, height * 0.68, 0.295]} size={[0.28, 0.09, 0.026]} color="#d1d1be" />
                  </group>
                )}
                {traveller && (
                  <group position={[0.43, 0, 0.26]}>
                    <Surface at={[0, 0.39, 0]} size={[0.33, 0.63, 0.30]} color="#927b65" rough={0.88} metal={0.12} />
                    <Surface at={[0, 0.77, 0]} size={[0.05, 0.28, 0.08]} color="#a1a6a4" />
                    {[-0.10, 0.10].map(x => (
                      <mesh key={x} position={[x, 0.075, 0]}>
                        <sphereGeometry args={[0.066, 8, 6]} />
                        <meshStandardMaterial color="#39434a" />
                      </mesh>
                    ))}
                  </group>
                )}
                {dinner && (
                  <group position={[0.43, height * 0.52, 0.28]}>
                    <Surface at={[0, 0, 0]} size={[0.52, 0.19, 0.40]} color="#ac9c7f" rough={0.84} metal={0.12} />
                    <Surface at={[0, 0.13, 0]} size={[0.48, 0.08, 0.39]} color="#d1c6a4" rough={0.9} metal={0.08} />
                  </group>
                )}
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

export function GateOneThreeScene({ snap, height = 190 }: { snap: EngineSnapshot; height?: number }) {
  return (
    <RendererBoundary>
      <View
        style={{ height, borderRadius: 12, overflow: 'hidden' }}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Canvas
          camera={{ fov: 72, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
          shadows
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.12;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
          style={{ flex: 1 }}
        >
          <color attach="background" args={['#0c1a1e']} />
          <fog attach="fog" args={['#0c1a1e', 12, 65]} />
          <GateOneLighting zone={snap.zone} hatchOpen={snap.hatchOpen} shadowResolution={384} />
          <PlayerCamera x={snap.x} y={snap.y} heading={snap.heading} />
          <Architecture />
          <LivedInSpaces hatchOpen={snap.hatchOpen} />
          <MovingPeople npcs={snap.npcs} />
        </Canvas>
      </View>
    </RendererBoundary>
  );
}
