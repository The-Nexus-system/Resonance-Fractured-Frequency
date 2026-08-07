/**
 * Semantic world -> native presentation bridge (pure mapping + thin sync).
 *
 * The semantic engine (lib/spatial/world.ts) stays authoritative: this file
 * only translates its state into the shapes the native module consumes.
 * The pure mapping functions are unit-testable without any native code.
 */
import type { SpatialWorld, WorldObject } from '../spatial/world';
import { KIND_TONE_FREQ } from '../spatial/audio';
import { ResonanceNative, isNativeSpatialAudioAvailable } from '../../modules/resonance-native';

export type NativeEntity = {
  id: string;
  x: number;
  y: number;
  z: number;
  kind: string;
  resolved: boolean;
};

export type NativeAudioSource = NativeEntity & { frequency: number };

function isFiniteVec(o: WorldObject): boolean {
  return (
    Number.isFinite(o.position.x) && Number.isFinite(o.position.y) && Number.isFinite(o.position.z)
  );
}

/** Discovered, finite-position objects as native AR entities. */
export function toNativeEntities(world: SpatialWorld, isDone: (id: string) => boolean): NativeEntity[] {
  return world.objects
    .filter((o: WorldObject) => o.discovered && isFiniteVec(o))
    .map((o: WorldObject) => ({
      id: o.id,
      x: o.position.x,
      y: o.position.y,
      z: o.position.z,
      kind: o.kind,
      resolved: isDone(o.id),
    }));
}

/** Discovered objects as positional audio sources with canonical tone identity. */
export function toNativeAudioSources(
  world: SpatialWorld,
  isDone: (id: string) => boolean,
): NativeAudioSource[] {
  return toNativeEntities(world, isDone).map((e) => ({
    ...e,
    frequency: KIND_TONE_FREQ[e.kind as keyof typeof KIND_TONE_FREQ] ?? 440,
  }));
}

/**
 * Push the current semantic state into the native spatial audio engine.
 * No-op outside a native iOS build. Errors are surfaced to the caller —
 * no silent fallbacks beyond the documented "module not present" case.
 */
export async function syncNativeSpatialAudio(
  world: SpatialWorld,
  isDone: (id: string) => boolean,
): Promise<boolean> {
  if (!isNativeSpatialAudioAvailable() || !ResonanceNative) return false;
  const { position, headingDeg } = world.player;
  await ResonanceNative.setListenerPose(position.x, position.y, position.z, headingDeg);
  for (const source of toNativeAudioSources(world, isDone)) {
    await ResonanceNative.upsertAudioSource(
      source.id,
      source.x,
      source.y,
      source.z,
      source.frequency,
      source.resolved,
    );
  }
  return true;
}
