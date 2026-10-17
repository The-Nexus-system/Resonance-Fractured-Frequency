/**
 * Rigged glTF character integration for Gate One (browser / desktop).
 *
 * The gameplay engine supplies positions. This component never simulates
 * movement, collision, heading, narrative state, audio, or NPC routes.
 * GLB animations drive *only* the skeletal visual performance.
 *
 * Production characters MUST be in the approved model manifest before they
 * can replace the temporary geometric silhouettes. A deliberately crude
 * Khronos rig test can be opted into in development with ?gateoneRigTest=1.
 * That sample is NEVER enabled by a production build.
 */
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import type { EngineSnapshot } from "@/lib/gateone/engine";

type Npc = EngineSnapshot["npcs"][number];

export type GateOneCharacterModel = {
  /** A bundled, approved GLB. Never a temporary signed cloud URL. */
  url: string;
  /** Desired world-space model height in metres (not camera pixel scaling). */
  heightMeters: number;
  /** Turns the rig's exported forward axis toward the corridor travel axis. */
  forwardYaw?: number;
  /** An optional animation clip name supplied by the model. */
  walkClip?: string;
  idleClip?: string;
};

/** Shipping registry. Add entries only after licensing and art review. */
const APPROVED_NPC_MODELS: Partial<Record<string, GateOneCharacterModel>> = {};

/** Non-shipping animation test. The fixture stays attributed in REGISTRY.json. */
function activeModelFor(npc: Npc): GateOneCharacterModel | null {
  const approved = APPROVED_NPC_MODELS[npc.id];
  if (approved) return approved;
  if (
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("gateoneRigTest") &&
    npc.id === "worker1"
  ) {
    return {
      url: (import.meta.env.BASE_URL || "/") + "models/gateone/fixtures/RiggedFigure.glb",
      heightMeters: 1.7,
    };
  }
  return null;
}

class IndividualAssetBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function animationByName(
  clips: THREE.AnimationClip[],
  exact: string | undefined,
  fallback: RegExp,
): THREE.AnimationClip | undefined {
  return (exact ? clips.find(c => c.name === exact) : undefined)
    ?? clips.find(c => fallback.test(c.name));
}

function RiggedCharacter({ npc, asset }: { npc: Npc; asset: GateOneCharacterModel }) {
  const gltf = useLoader(GLTFLoader, asset.url);
  const root = useRef<THREE.Group>(null);
  const rig = useMemo(() => {
    // A skinned mesh cannot be reused by multiple NPCs without cloning bones.
    const cloned = cloneSkeleton(gltf.scene);
    cloned.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false; // rigged pose can exceed the bind-pose bounds
      }
    });
    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = size.y > 0.0001 ? asset.heightMeters / size.y : 1;
    return { object: cloned, scale, groundOffset: -bounds.min.y };
  }, [gltf.scene, asset.heightMeters]);

  const mixer = useMemo(() => new THREE.AnimationMixer(rig.object), [rig.object]);
  const walk = useMemo(
    () => animationByName(gltf.animations, asset.walkClip, /walk|locomotion|run/i)
      ?? gltf.animations[0],
    [gltf.animations, asset.walkClip],
  );
  const idle = useMemo(
    () => animationByName(gltf.animations, asset.idleClip, /idle|stand|breath|rest/i),
    [gltf.animations, asset.idleClip],
  );
  const activeClip = useRef<THREE.AnimationClip | null>(null);
  const prev = useRef({ x: npc.x, y: npc.y, lastMoved: -10, yaw: 0 });

  useEffect(() => {
    return () => { mixer.stopAllAction(); mixer.uncacheRoot(rig.object); };
  }, [mixer, rig.object]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const last = prev.current;
    const dx = npc.x - last.x;
    const dy = npc.y - last.y;
    const motion = Math.hypot(dx, dy);
    if (motion > 0.004) {
      last.lastMoved = state.clock.elapsedTime;
      last.yaw = Math.atan2(dx, dy);
      last.x = npc.x;
      last.y = npc.y;
    }
    const moving = state.clock.elapsedTime - last.lastMoved < 0.24;
    const selected = (moving ? walk : idle) ?? walk;
    if (selected && activeClip.current !== selected) {
      if (activeClip.current) mixer.existingAction(activeClip.current)?.fadeOut(0.16);
      const action = mixer.clipAction(selected);
      action.reset().fadeIn(0.16).play();
      activeClip.current = selected;
    }
    // Visual orientation smooths without changing the authoritative world pose.
    const q = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), last.yaw + (asset.forwardYaw ?? 0),
    );
    root.current.quaternion.slerp(q, Math.min(1, delta * 8));
    mixer.update(Math.min(delta, 0.05));
  });

  return (
    <group position={[npc.x, 0, -npc.y]}>
      <group ref={root}>
        <group scale={rig.scale}>
          <primitive object={rig.object} position={[0, rig.groundOffset, 0]} />
        </group>
      </group>
    </group>
  );
}

/** Keep a reliable geometric NPC during model loading or on a failed import. */
export function GateOneAnimatedNpc({ npc, fallback }: { npc: Npc; fallback: ReactNode }) {
  const asset = activeModelFor(npc);
  if (!asset) return <>{fallback}</>;
  return (
    <IndividualAssetBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <RiggedCharacter npc={npc} asset={asset} />
      </Suspense>
    </IndividualAssetBoundary>
  );
}
