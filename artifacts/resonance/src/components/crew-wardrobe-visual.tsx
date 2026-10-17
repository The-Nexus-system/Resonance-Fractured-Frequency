/**
 * Reusable, non-interactive 3D garment concept viewer for crew selection.
 *
 * A composed wardrobe is not a finished character: proportions, garment
 * design, palette, device models and rigs all require Nexus review.
 *
 * This visual-only component never alters approved Gate One simulation,
 * captions, spatial audio, interaction or player accessibility settings.
 */
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { CharacterId } from "@/lib/gateone/characters";
import { WARDROBE_VISUALS, type WardrobeVisualProfile } from "@/lib/visuals/wardrobe";

type Position = [number, number, number];
type Size = [number, number, number];

function Shape({ at, size, shade, roughness = 0.85, metalness = 0 }: {
  at: Position; size: Size; shade: string; roughness?: number; metalness?: number;
}) {
  return (
    <mesh position={at}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={shade} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function Stripe({ at, size, color }: { at: Position; size: Size; color: string }) {
  return (
    <mesh position={at}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.13} roughness={0.55} />
    </mesh>
  );
}

/** Neutral clothes-form, not a skin-colour or face design for a canon actor. */
function ReusableGarmentForm({ config }: { config: WardrobeVisualProfile }) {
  const coat = config.outerFabric, trim = config.trim;
  const shortCut = config.cut === "seated";
  return (
    <group position={[0, -1.25, 0]}>
      {/* A neutral featureless form avoids inventing canon physiology. */}
      <mesh position={[0, 2.55, 0]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshStandardMaterial color="#7b8988" metalness={0.22} roughness={0.78} />
      </mesh>
      <Shape at={[0, 1.7, -0.02]} size={[1.18, shortCut ? 0.97 : 1.12, 0.46]} shade={coat} />
      <Shape at={[0, shortCut ? 1.16 : 1.08, -0.02]} size={[1.07, shortCut ? 0.19 : 0.25, 0.43]} shade={config.underLayer} />
      {/* Collar lapels and central fastener are separate reusable parts. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Shape at={[side * 0.28, 2.11, 0.225]} size={[0.29, 0.17, 0.055]} shade={config.underLayer} />
          <group position={[side * 0.73, 1.92, 0]} rotation={[0, 0, side * 0.16]}>
            <Shape at={[0, -0.38, 0]} size={[0.34, 0.99, 0.37]} shade={coat} />
            <Stripe at={[0, -0.79, 0.21]} size={[0.35, 0.075, 0.025]} color={trim} />
          </group>
          <Shape at={[side * 0.37, 0.9, -0.02]} size={[0.35, 0.68, 0.41]} shade="#364b56" />
          <Shape at={[side * 0.37, 0.47, 0.10]} size={[0.32, 0.16, 0.45]} shade="#70878b" />
        </group>
      ))}
      <Stripe at={[0, 1.7, 0.232]} size={[0.04, shortCut ? 0.81 : 1.04, 0.025]} color={trim} />
      <Shape at={[-0.37, 1.79, 0.245]} size={[0.3, 0.09, 0.035]} shade={trim} />
      <Shape at={[0, 0.8, 0.08]} size={[0.98, 0.13, 0.46]} shade="#34494e" />

      {/* Configurable worn gear, tied to real chosen outfit, never audio. */}
      {config.accessory === "patches" && (
        <group>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Shape at={[side * 0.27, 2.50, 0.01]} size={[0.055, 0.23, 0.11]} shade="#9abfb8" />
              <Stripe at={[side * 0.305, 2.55, 0.02]} size={[0.01, 0.075, 0.05]} color="#d7e6d9" />
            </group>
          ))}
          <Shape at={[0.37, 1.43, 0.275]} size={[0.26, 0.38, 0.09]} shade="#678e86" />
        </group>
      )}
      {config.accessory === "tool-loops" && (
        <group>
          {[-0.38, -0.12, 0.2, 0.43].map((x, i) => (
            <group key={i}>
              <Shape at={[x, 1.18, 0.26]} size={[0.13, 0.25, 0.06]} shade="#c5b38a" />
              <Shape at={[x, 1.02 - (i % 2) * 0.04, 0.29]} size={[0.065, 0.29, 0.085]} shade="#5e7072" metalness={0.5} />
            </group>
          ))}
          <Shape at={[0.55, 1.3, 0.04]} size={[0.15, 0.39, 0.6]} shade="#8d7760" />
        </group>
      )}
      {config.accessory === "aac-carrier" && (
        <group>
          <Shape at={[0.44, 1.50, 0.27]} size={[0.34, 0.57, 0.11]} shade="#2b4851" />
          <Shape at={[0.44, 1.56, 0.35]} size={[0.27, 0.37, 0.03]} shade="#bdd8d4" />
          {[1.46, 1.55, 1.64].map(y => <Stripe key={y} at={[0.43, y, 0.372]} size={[0.19, 0.025, 0.01]} color="#567e83" />)}
          <Shape at={[0.41, 1.08, 0.25]} size={[0.30, 0.095, 0.07]} shade={trim} />
        </group>
      )}
      {config.accessory === "tactile-cuffs" && (
        <group>
          {[-0.73, 0.73].map(x => (
            <group key={x}>
              {[1.20, 1.24, 1.28].map(y => (
                <Stripe key={y} at={[x, y, 0.225]} size={[0.28, 0.013, 0.02]} color="#e7d9b8" />
              ))}
            </group>
          ))}
          <Shape at={[0.39, 1.79, 0.26]} size={[0.26, 0.16, 0.028]} shade="#d9cfaa" />
        </group>
      )}
      {config.accessory === "ordered-pockets" && (
        <group>
          {[-0.34, 0.03, 0.39].map(x => (
            <group key={x}>
              <Shape at={[x, 1.35, 0.25]} size={[0.26, 0.34, 0.095]} shade="#8f9b8a" />
              <Stripe at={[x, 1.50, 0.31]} size={[0.22, 0.043, 0.02]} color={trim} />
            </group>
          ))}
        </group>
      )}
      {config.accessory === "knowledge-bag" && (
        <group>
          <Shape at={[0.35, 1.10, 0.36]} size={[0.65, 0.55, 0.19]} shade="#91816d" />
          <Stripe at={[0.36, 1.17, 0.47]} size={[0.52, 0.05, 0.023]} color={trim} />
          <mesh position={[0, 1.75, 0.31]} rotation={[0, 0, 0.34]}>
            <boxGeometry args={[0.14, 1.28, 0.09]} />
            <meshStandardMaterial color="#b0a18c" roughness={0.93} />
          </mesh>
          <Shape at={[0.35, 0.85, 0.38]} size={[0.14, 0.1, 0.20]} shade={trim} />
        </group>
      )}
    </group>
  );
}

/** Reusable wheelchair visual concept for a seated outfit. Final engineering
 * rig and Kesh's detachable battery mechanism still need approved models. */
function ConceptChair() {
  return (
    <group position={[0, -1.25, 0]}>
      <Shape at={[0, 1.10, -0.35]} size={[1.37, 0.16, 1.07]} shade="#435b63" metalness={0.5} />
      <Shape at={[0, 1.61, -0.84]} size={[1.28, 1.0, 0.16]} shade="#536b6f" />
      {[-1, 1].map(side => (
        <group key={side}>
          <mesh position={[side * 0.89, 0.77, -0.30]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.63, 0.077, 8, 32]} />
            <meshStandardMaterial color="#9baeb0" metalness={0.52} roughness={0.46} />
          </mesh>
          <mesh position={[side * 0.89, 0.77, -0.30]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.43, 0.025, 6, 32]} />
            <meshStandardMaterial color="#718789" metalness={0.55} />
          </mesh>
          <Shape at={[side * 0.76, 1.25, -0.25]} size={[0.13, 0.12, 0.76]} shade="#687f7d" />
        </group>
      ))}
      <Shape at={[0, 0.43, 0.10]} size={[0.95, 0.17, 0.73]} shade="#596e72" />
      <Shape at={[-0.58, 0.45, 0.25]} size={[0.21, 0.20, 0.36]} shade="#84938b" />
    </group>
  );
}

function CrewWardrobeStage({ config }: { config: WardrobeVisualProfile }) {
  return (
    <>
      <color attach="background" args={["#101b25"]} />
      <ambientLight intensity={1.2} />
      <hemisphereLight intensity={0.7} color="#d9e8ed" groundColor="#38434a" />
      <directionalLight position={[-2, 5, 4]} intensity={2.1} />
      <directionalLight position={[4, 2, -3]} intensity={0.6} color="#c5ddd5" />
      <group rotation={[0, -0.4, 0]}>
        <ReusableGarmentForm config={config} />
        {config.cut === "seated" && <ConceptChair />}
      </group>
      <mesh position={[0, -1.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.7, 40]} />
        <meshStandardMaterial color="#21313a" metalness={0.2} roughness={0.95} />
      </mesh>
    </>
  );
}

export function CrewWardrobePreview({ characterId }: { characterId: CharacterId }) {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      setWebgl(Boolean(window.WebGLRenderingContext && (probe.getContext("webgl2") || probe.getContext("webgl"))));
    } catch {
      setWebgl(false);
    }
  }, []);

  const config = WARDROBE_VISUALS[characterId];
  return (
    <div aria-hidden="true" className="h-full w-full overflow-hidden rounded-lg bg-slate-900">
      {webgl ? (
        <Canvas
          key={characterId}
          dpr={[1, 1.5]}
          gl={{ alpha: false, antialias: true }}
          camera={{ fov: 38, position: [3.0, 1.4, 6.1], near: 0.1, far: 20 }}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <CrewWardrobeStage config={config} />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center text-center text-sm text-slate-300">
          Wardrobe concept
        </div>
      )}
    </div>
  );
}