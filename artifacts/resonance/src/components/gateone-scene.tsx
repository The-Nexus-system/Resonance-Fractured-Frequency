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
import { WALKABLE, type Rect } from "@/lib/gateone/world";
import type { EngineSnapshot } from "@/lib/gateone/engine";
import { GateOneEnvironment, GateOneNpc } from "./gateone-environment";

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
          <meshStandardMaterial color={i < 2 ? ZONE_TINT.cabin.floor : i < 5 ? ZONE_TINT.concourse.floor : i === 5 ? ZONE_TINT.bridge.floor : ZONE_TINT.hearth.floor} />
        </mesh>
      ))}

      {/* Fixed ship interior fittings, generated from the real walkable geometry.
          These are visual only: the game engine retains movement and audio authority. */}
      {WALKABLE.map((r, i) => {
        const cx = (r.x1 + r.x2) / 2;
        const cy = (r.y1 + r.y2) / 2;
        const width = r.x2 - r.x1;
        const length = r.y2 - r.y1;
        return (
          <group key={"ship-fittings-" + i}>
            <mesh position={[cx, WALL_HEIGHT + 0.08, -cy]}>
              <boxGeometry args={[width, 0.13, length]} />
              <meshStandardMaterial color="#344449" metalness={0.68} roughness={0.54} />
            </mesh>
            {[r.x1 + 0.3, r.x2 - 0.3].map((edge) => (
              <mesh key={edge} position={[edge, 0.015, -cy]}>
                <boxGeometry args={[0.045, 0.02, length]} />
                <meshStandardMaterial color="#687e82" metalness={0.72} roughness={0.5} />
              </mesh>
            ))}
            {Array.from({ length: Math.floor(length / 5) }, (_, j) => (
              <group key={j} position={[cx, WALL_HEIGHT - 0.1, -(r.y1 + (j + 1) * 5)]}>
                <mesh>
                  <boxGeometry args={[width, 0.16, 0.15]} />
                  <meshStandardMaterial color="#60767a" metalness={0.7} roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.095, 0]}>
                  <boxGeometry args={[Math.min(width * 0.45, 4), 0.02, 0.09]} />
                  <meshBasicMaterial color="#d6e8df" toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Walls */}
      {walls.filter((w) => {
        // Renderer-only openings for two existing script landmarks.
        // The cabin's left window (x=-4) and east berth viewport (x=20)
        // are not walkable doors; the game collision stays untouched.
        const cabinWindow = w.w < 0.5 && Math.abs(w.cx + 4) < 0.25 && w.cy > 0 && w.cy < 12;
        const berthViewport = w.w < 0.5 && Math.abs(w.cx - 20) < 0.25 && w.cy > 58 && w.cy < 62;
        return !cabinWindow && !berthViewport;
      }).map((w, i) => (
        <mesh key={`w${i}`} position={[w.cx, WALL_HEIGHT / 2, -w.cy]}>
          <boxGeometry args={[w.w, WALL_HEIGHT, w.d]} />
          <meshStandardMaterial color={tint.wall} />
        </mesh>
      ))}
      {/* A real side window cut into the transport wall. The exterior view is
          deliberately dark: no unapproved planet position or cutscene image. */}
      <group>
        <mesh position={[-4, WALL_HEIGHT / 2, -3.2]}>
          <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, 6.4]} />
          <meshStandardMaterial color={ZONE_TINT.cabin.wall} />
        </mesh>
        <mesh position={[-4, WALL_HEIGHT / 2, -10.7]}>
          <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, 2.6]} />
          <meshStandardMaterial color={ZONE_TINT.cabin.wall} />
        </mesh>
        <mesh position={[-4, 3.12, -8]}>
          <boxGeometry args={[0.33, 0.58, 3.25]} />
          <meshStandardMaterial color="#8099a3" metalness={0.7} roughness={0.42} />
        </mesh>
        <mesh position={[-4, 0.43, -8]}>
          <boxGeometry args={[0.33, 0.85, 3.25]} />
          <meshStandardMaterial color="#758f9a" metalness={0.7} roughness={0.42} />
        </mesh>
        {[6.5, 9.5].map((y) => (
          <mesh key={y} position={[-4, 1.73, -y]}>
            <boxGeometry args={[0.33, 2.55, 0.13]} />
            <meshStandardMaterial color="#8ea6aa" metalness={0.7} roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[-4, 1.79, -8]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.9, 2.25]} />
          <meshPhysicalMaterial color="#376582" roughness={0.19} metalness={0.12} transparent opacity={0.38} side={2} depthWrite={false} />
        </mesh>
      </group>

      {/* Transfer hatch: a framed pressure door that opens with the real docking state.
          Visual geometry never changes the authoritative walkable collision space. */}
      <group position={[0, 0, -12]}>
        {[-1.35, 1.35].map((x) => (
          <mesh key={x} position={[x, 1.52, 0]}>
            <boxGeometry args={[0.19, 3.04, 0.36]} />
            <meshStandardMaterial color="#718c8d" metalness={0.76} roughness={0.46} />
          </mesh>
        ))}
        <mesh position={[0, 3.03, 0]}>
          <boxGeometry args={[2.86, 0.2, 0.36]} />
          <meshStandardMaterial color="#718c8d" metalness={0.76} roughness={0.46} />
        </mesh>
        {!snap.hatchOpen && (
          <group>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[2.53, 2.95, 0.22]} />
              <meshStandardMaterial color="#334d55" metalness={0.79} roughness={0.52} />
            </mesh>
            <mesh position={[0, 1.5, 0.12]}>
              <boxGeometry args={[1.94, 2.45, 0.025]} />
              <meshStandardMaterial color="#517079" metalness={0.73} roughness={0.48} />
            </mesh>
            {[0.72, 1.52, 2.32].map((height) => (
              <mesh key={height} position={[0, height, 0.15]}>
                <boxGeometry args={[2.02, 0.06, 0.035]} />
                <meshStandardMaterial color="#8ba9aa" metalness={0.78} roughness={0.37} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Authored scene fixtures replace generic glowing landmark cubes.
          All physical travel and interaction remain in the Gate One engine. */}
      <GateOneEnvironment />

      {/* Each existing moving entity keeps its authoritative simulation pose. */}
      {snap.npcs.map((n) => <GateOneNpc key={n.id} npc={n} />)}
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
