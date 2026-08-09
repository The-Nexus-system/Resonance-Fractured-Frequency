/**
 * Gate One first-person 3D presentation (web client).
 *
 * Pure presentation: the Gate One engine remains the single source of truth
 * for position, collision, script, and audio — this component only renders
 * the current snapshot. Mapping between the semantic world and three.js:
 * world x (east) -> three x, world y (north/forward) -> three -z,
 * elevation -> three y. Renderer animation never mutates the mapped axes.
 *
 * The Replit preview sandbox has no WebGL: callers must gate on
 * `supportsWebGL()` and keep the 2D map + captions as the fallback. The
 * fallback is an equivalent presentation, not a lesser game.
 */
import { Canvas, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, type ReactNode } from "react";
import { WALKABLE, PLACES, type Rect } from "@/lib/gateone/world";
import type { EngineSnapshot } from "@/lib/gateone/engine";

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

const EYE_HEIGHT = 1.6;
const WALL_HEIGHT = 3.4;
const WALL_THICKNESS = 0.24;

/** Zone-tinted palette — calm, dim, teal-forward (house palette). */
const ZONE_TINT: Record<EngineSnapshot["zone"], { floor: string; wall: string; fog: string }> = {
  cabin: { floor: "#12303a", wall: "#1c4653", fog: "#081418" },
  concourse: { floor: "#173a42", wall: "#245863", fog: "#0a181c" },
  bridge: { floor: "#122f3f", wall: "#1d4a5e", fog: "#071219" },
  hearth: { floor: "#1a3b35", wall: "#2a5a50", fog: "#0a1714" },
};

type WallSeg = { cx: number; cy: number; w: number; d: number };

/**
 * Build wall segments from the walkable rects: for each rect edge, emit thin
 * wall boxes along the parts not shared with another walkable rect. Coarse
 * (0.4 m sampling) but static, computed once.
 */
function buildWalls(rects: Rect[]): WallSeg[] {
  const walk = (x: number, y: number) =>
    rects.some((r) => x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2);
  const segs: WallSeg[] = [];
  const STEP = 0.4;
  for (const r of rects) {
    // North/south edges
    for (const [edgeY, outward] of [
      [r.y2, 0.3],
      [r.y1, -0.3],
    ] as const) {
      let runStart: number | null = null;
      for (let x = r.x1; x <= r.x2 + STEP / 2; x += STEP) {
        const open = x <= r.x2 && walk(Math.min(x, r.x2), edgeY + outward);
        if (!open && x <= r.x2) {
          if (runStart === null) runStart = x;
        } else if (runStart !== null) {
          const end = Math.min(x, r.x2);
          segs.push({ cx: (runStart + end) / 2, cy: edgeY, w: end - runStart + STEP, d: WALL_THICKNESS });
          runStart = null;
        }
      }
    }
    // East/west edges
    for (const [edgeX, outward] of [
      [r.x2, 0.3],
      [r.x1, -0.3],
    ] as const) {
      let runStart: number | null = null;
      for (let y = r.y1; y <= r.y2 + STEP / 2; y += STEP) {
        const open = y <= r.y2 && walk(edgeX + outward, Math.min(y, r.y2));
        if (!open && y <= r.y2) {
          if (runStart === null) runStart = y;
        } else if (runStart !== null) {
          const end = Math.min(y, r.y2);
          segs.push({ cx: edgeX, cy: (runStart + end) / 2, w: WALL_THICKNESS, d: end - runStart + STEP });
          runStart = null;
        }
      }
    }
  }
  return segs;
}

const LANDMARKS: { key: keyof typeof PLACES; color: string; height: number }[] = [
  { key: "hatch", color: "#7fd4c1", height: 2.6 },
  { key: "memorial", color: "#c9d8d5", height: 2.2 },
  { key: "berthWindow", color: "#8fd0e8", height: 2.4 },
  { key: "hearthThreshold", color: "#7fd4c1", height: 2.6 },
  { key: "crewCheck", color: "#e8d48f", height: 1.4 },
  { key: "lift", color: "#7fe0a8", height: 2.8 },
];

/** Renderer errors must never take down the game: fall back to nothing —
 * the 2D map and captions remain on screen and carry the same information. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function GateOneScene({ snap }: { snap: EngineSnapshot }) {
  return (
    <SceneBoundary>
      <GateOneSceneInner snap={snap} />
    </SceneBoundary>
  );
}

function GateOneSceneInner({ snap }: { snap: EngineSnapshot }) {
  const walls = useMemo(() => buildWalls(WALKABLE), []);
  const tint = ZONE_TINT[snap.zone];

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ fov: 70, near: 0.1, far: 90 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
      onCreated={({ camera }) => {
        camera.rotation.order = "YXZ";
      }}
    >
      <color attach="background" args={[tint.fog]} />
      <fog attach="fog" args={[tint.fog, 8, 60]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 12, -4]} intensity={0.7} />

      {/* Camera follows the engine pose exactly (never animated separately). */}
      <CameraRig x={snap.x} y={snap.y} heading={snap.heading} />

      {/* Floors */}
      {WALKABLE.map((r, i) => (
        <mesh key={`f${i}`} position={[(r.x1 + r.x2) / 2, -0.05, -(r.y1 + r.y2) / 2]}>
          <boxGeometry args={[r.x2 - r.x1, 0.1, r.y2 - r.y1]} />
          <meshStandardMaterial color={tint.floor} />
        </mesh>
      ))}

      {/* Walls */}
      {walls.map((w, i) => (
        <mesh key={`w${i}`} position={[w.cx, WALL_HEIGHT / 2, -w.cy]}>
          <boxGeometry args={[w.w, WALL_HEIGHT, w.d]} />
          <meshStandardMaterial color={tint.wall} />
        </mesh>
      ))}

      {/* Sealed hatch reads as a door until docking opens it */}
      {!snap.hatchOpen && (
        <mesh position={[0, 1.5, -12]}>
          <boxGeometry args={[2.6, 3, 0.3]} />
          <meshStandardMaterial color="#3a6b66" emissive="#12332f" />
        </mesh>
      )}

      {/* Landmarks — dim emissive markers at authored fixture positions */}
      {LANDMARKS.map(({ key, color, height }) => {
        const p = PLACES[key];
        return (
          <mesh key={key} position={[p.x, height / 2, -p.y]}>
            <boxGeometry args={[1.2, height, 0.5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
          </mesh>
        );
      })}

      {/* NPCs in the current zone — simple figures at their live positions */}
      {snap.npcs.map((n) => (
        <group key={n.id} position={[n.x, 0, -n.y]}>
          <mesh position={[0, 0.85, 0]}>
            <capsuleGeometry args={[0.28, 1.0, 4, 10]} />
            <meshStandardMaterial color="#5f8a94" />
          </mesh>
          <mesh position={[0, 1.62, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#78a4ae" />
          </mesh>
        </group>
      ))}
    </Canvas>
  );
}

function CameraRig({ x, y, heading }: { x: number; y: number; heading: number }) {
  return <PerspectiveCameraSync x={x} y={y} heading={heading} />;
}

function PerspectiveCameraSync({ x, y, heading }: { x: number; y: number; heading: number }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(x, EYE_HEIGHT, -y);
    camera.rotation.set(0, -heading, 0);
    camera.updateMatrixWorld();
  }, [camera, x, y, heading]);
  return null;
}
