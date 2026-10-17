/**
 * Gate One authored lighting. The practical ceiling and work lamps are steady
 * (no flash, strobe or unsolicited motion), built to match the four existing
 * acoustic zones. One local spotlight casts soft shadows on nearby fixtures;
 * inexpensive fill sources keep the other inhabited spaces legible.
 *
 * Visual presentation only. Hatch state still comes from the game engine,
 * whose narration, sound and collision stay authoritative.
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';

export type GateOneLightZone = 'cabin' | 'concourse' | 'bridge' | 'hearth';

type Lamp = { x: number; y: number; color: string; intensity: number; reach: number };
const LAMPS: Lamp[] = [
  { x: 0, y: 5.5, color: '#ebddc8', intensity: 2.1, reach: 11 },
  { x: -9, y: 24, color: '#d3e1dc', intensity: 2.5, reach: 17 },
  { x: 0, y: 38, color: '#d9e9e5', intensity: 2.0, reach: 20 },
  { x: -23, y: 48, color: '#e7d2ad', intensity: 1.4, reach: 9 },
  { x: 14, y: 55, color: '#dae5e6', intensity: 2.1, reach: 13 },
  { x: 16, y: 69.5, color: '#cbe3e8', intensity: 2.1, reach: 15 },
  { x: 16, y: 83.5, color: '#d8e9df', intensity: 2.3, reach: 16 },
  { x: 16, y: 96, color: '#eee2cd', intensity: 2.0, reach: 13 },
];
const SHADOW_LAMPS: Record<GateOneLightZone, { x: number; y: number; color: string }> = {
  cabin: { x: 0, y: 5.5, color: '#efe3d1' },
  concourse: { x: -7, y: 34, color: '#d6e4df' },
  bridge: { x: 16, y: 70, color: '#d7eaf0' },
  hearth: { x: 16, y: 88, color: '#f0e2d1' },
};

/** Static target, positioned on the deck immediately under the ceiling lamp. */
export function GateOneLighting({
  zone,
  hatchOpen,
  shadowResolution = 512,
}: {
  zone: GateOneLightZone;
  hatchOpen: boolean;
  shadowResolution?: number;
}) {
  const fixture = SHADOW_LAMPS[zone];
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <hemisphereLight args={['#d9e4dd', '#15232a', 1.05]} />
      <ambientLight intensity={0.32} />
      {LAMPS.map(lamp => (
        <pointLight
          key={lamp.y}
          position={[lamp.x, 3.06, -lamp.y]}
          color={lamp.color}
          intensity={lamp.intensity}
          distance={lamp.reach}
          decay={2}
        />
      ))}
      <pointLight
        position={[0, 2.75, -12]}
        color={hatchOpen ? '#aed8d0' : '#deca9d'}
        intensity={0.9}
        distance={7}
        decay={2}
      />
      <primitive object={target} position={[fixture.x, 0, -fixture.y]} />
      <spotLight
        position={[fixture.x, 3.12, -fixture.y]}
        target={target}
        color={fixture.color}
        angle={1.14}
        penumbra={0.86}
        intensity={4.5}
        distance={19}
        decay={2}
        castShadow
        shadow-mapSize={[shadowResolution, shadowResolution]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.027}
        shadow-camera-near={0.25}
        shadow-camera-far={22}
      />
    </>
  );
}
