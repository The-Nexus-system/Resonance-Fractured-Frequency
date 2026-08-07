/**
 * Scene entity adapter (Phase 4 completion).
 *
 * The bridge between the SEMANTIC world model (single source of truth) and
 * any presentation layer: 3-D renderer, AR, spatial audio, VoiceOver,
 * captions. A SceneEntity is a pure DERIVED VIEW of a semantic object — it
 * carries no state of its own, so an object can be shown simultaneously in
 * 3-D, AR, audio, and text without ever becoming separate versions.
 *
 * Reusable: nothing here is specific to The First Fracture. Campaigns
 * supply the world + a role lookup; the renderer displays whatever is
 * declared.
 *
 * Pure functions: safe to unit test in node.
 */

import type { SpatialWorld, WorldObject, ObjectState } from '../spatial/world';
import { distanceMeters, relativeDirection, distanceCategory, viewObject } from '../spatial/world';

export type SceneEntity = {
  /** Semantic object id — the accessibility/audio/AR/graphics link key. */
  id: string;
  label: string;
  kind: WorldObject['kind'];
  role?: string;
  /** World-space position in metres (x east, y north, z up). */
  position: { x: number; y: number; z: number };
  /** Uniform scale hint by kind; renderers may interpret. */
  scale: number;
  /** Facing rotation (radians about the up axis) — deterministic per id. */
  rotation: number;
  elevation: number;
  visible: boolean;
  discovered: boolean;
  interactable: boolean;
  state: ObjectState;
  /** 0 = fully fractured/unstable, 1 = fully resonant/coherent. */
  coherence: number;
  /** Distance from the player in metres. */
  distance: number;
  /** 0..1 proximity response (1 = at the player). */
  proximity: number;
  /** True when this is the current contextual action target. */
  focused: boolean;
  /** Accessibility metadata linking straight back to the semantic object. */
  accessibility: {
    label: string;
    direction: string;
    distanceWord: string;
    stateWord: string;
  };
};

export type SceneState = {
  entities: SceneEntity[];
  player: { position: { x: number; y: number; z: number }; headingDeg: number };
  /** 0..1 — how coherent the whole environment is (restored / total). */
  environmentCoherence: number;
};

/** Deterministic per-id rotation so layouts are stable across sessions. */
function idRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((h % 360) * Math.PI) / 180;
}

const KIND_SCALE: Record<WorldObject['kind'], number> = {
  pillar: 1.6,
  signal: 0.6,
  landmark: 1.0,
  fracture: 1.2,
};

export function stateWord(state: ObjectState): string {
  switch (state) {
    case 'attuned':
      return 'attuned and steady';
    case 'resonating':
      return 'resonating, unstable';
    default:
      return 'dormant';
  }
}

export function sceneState(
  world: SpatialWorld,
  options: {
    roleOf?: (id: string) => string | undefined;
    focusedId?: string | null;
    requiredIds?: readonly string[];
  } = {},
): SceneState {
  const required = options.requiredIds ?? [];
  const restored = required.filter((id) =>
    world.objects.some((o) => o.id === id && o.state === 'attuned'),
  ).length;
  const environmentCoherence = required.length === 0 ? 0 : restored / required.length;

  const entities: SceneEntity[] = world.objects.map((o) => {
    const v = viewObject(world, o);
    const proximity = Math.max(0, Math.min(1, 1 - v.distance / 25));
    return {
      id: o.id,
      label: o.label,
      kind: o.kind,
      role: options.roleOf?.(o.id),
      position: { ...o.position },
      scale: KIND_SCALE[o.kind],
      rotation: idRotation(o.id),
      elevation: o.position.z,
      visible: o.discovered,
      discovered: o.discovered,
      interactable: o.interactable,
      state: o.state,
      coherence: o.state === 'attuned' ? 1 : o.discovered ? 0.35 : 0.1,
      distance: v.distance,
      proximity,
      focused: options.focusedId === o.id,
      accessibility: {
        label: o.label,
        direction: relativeDirection(world.player, o.position),
        distanceWord: distanceCategory(v.distance),
        stateWord: stateWord(o.state),
      },
    };
  });

  return {
    entities,
    player: { position: { ...world.player.position }, headingDeg: world.player.headingDeg },
    environmentCoherence,
  };
}

/** Plain-text description of the visible scene — braille/VoiceOver parity. */
export function sceneDescription(scene: SceneState): string {
  const visible = scene.entities.filter((e) => e.visible);
  if (visible.length === 0) return 'Nothing discovered yet.';
  const parts = visible
    .slice()
    .sort((a, b) => a.distance - b.distance)
    .map(
      (e) =>
        `${e.label}, ${e.accessibility.direction.replace('-', ' and ')}, ${e.accessibility.distanceWord}, ${e.accessibility.stateWord}`,
    );
  return parts.join('. ') + '.';
}
