/**
 * Gate One authored 3D environmental dressing.
 *
 * These fixtures are VISUAL ONLY: the approved world.ts rectangles, game
 * engine collision, NPC schedules, audio sources and script events stay
 * authoritative. Each fixture is placed against a scene already present in
 * the protected Earth transport -> lunar concourse -> CSV Hearth opening.
 *
 * No external assets, textures, animation clocks, or player input.
 */
import type { EngineSnapshot } from "@/lib/gateone/engine";
import { PLACES } from "@/lib/gateone/world";

type NpcSnapshot = EngineSnapshot["npcs"][number];

function Panel({ position, size, color = "#4e6971" }: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={0.56} roughness={0.48} />
    </mesh>
  );
}

function LightStrip({ position, size, color = "#a6ded8" }: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} toneMapped={false} />
    </mesh>
  );
}

function PassengerSeat({ x, y, facing = 1 }: { x: number; y: number; facing?: number }) {
  return (
    <group position={[x, 0, -y]} rotation={[0, facing < 0 ? Math.PI : 0, 0]}>
      <Panel position={[0, 0.5, 0]} size={[0.9, 0.16, 0.82]} color="#536c73" />
      <Panel position={[0, 1.15, 0.35]} size={[0.9, 1.22, 0.17]} color="#345463" />
      <Panel position={[-0.46, 0.74, 0]} size={[0.11, 0.35, 0.83]} color="#76929a" />
      <Panel position={[0.46, 0.74, 0]} size={[0.11, 0.35, 0.83]} color="#76929a" />
      <Panel position={[0, 0.12, 0.23]} size={[0.76, 0.22, 0.17]} color="#2c434a" />
      <LightStrip position={[0, 1.65, 0.44]} size={[0.49, 0.035, 0.035]} color="#90ccc2" />
    </group>
  );
}

function EarthTransportCabin() {
  return (
    <group>
      {/* Two side rows, leaving the central walk/arrival route visible. */}
      {[3.2, 7.9].map((y) => (
        <group key={y}>
          <PassengerSeat x={-3.15} y={y} />
          <PassengerSeat x={3.15} y={y} />
        </group>
      ))}
      {/* Cabin walls, cargo restraints, overhead luggage lockers. */}
      {[-3.65, 3.65].map((x) => (
        <group key={x}>
          <Panel position={[x, 2.68, -5.1]} size={[0.42, 0.62, 7.2]} color="#405b65" />
          {[3.2, 7.9].map((y) => (
            <group key={y}>
              <Panel position={[x * 0.93, 2.35, -y]} size={[0.12, 0.07, 1.24]} color="#9caeb2" />
              <LightStrip position={[x * 0.89, 2.33, -y]} size={[0.06, 0.025, 0.45]} />
            </group>
          ))}
        </group>
      ))}
      <Panel position={[0, 0.045, -2.9]} size={[1.2, 0.016, 4.9]} color="#536d73" />
      <Panel position={[0.9, 0.3, -10.4]} size={[1.05, 0.58, 0.78]} color="#607079" />
      <Panel position={[0.9, 0.62, -10.4]} size={[0.95, 0.04, 0.72]} color="#8c9da3" />
      {[-0.2, 0.5].map((x) => (
        <mesh key={x} position={[x, 1.2, -10.5]}>
          <torusGeometry args={[0.24, 0.028, 6, 16]} />
          <meshStandardMaterial color="#a3b2b6" metalness={0.77} roughness={0.35} />
        </mesh>
      ))}
      {/* Luminous floor lip just short of the sealed transport hatch. */}
      <LightStrip position={[0, 0.042, -11.72]} size={[2.2, 0.016, 0.07]} color="#d3b77a" />
      {/* The cabin window is an opening in the left wall, not an opaque box. */}
      <LightStrip position={[-3.94, 2.77, -8]} size={[0.03, 0.035, 2.8]} color="#8cb8ca" />
    </group>
  );
}

function StationPillar({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0, -y]}>
      <Panel position={[0, 1.72, 0]} size={[0.34, 3.44, 0.58]} color="#64787f" />
      <Panel position={[0, 0.23, 0]} size={[0.58, 0.44, 0.75]} color="#4d666e" />
      <LightStrip position={[0, 2.47, 0.307]} size={[0.23, 0.63, 0.025]} color="#9ae0d6" />
    </group>
  );
}

function CargoTrolley({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0, -y]}>
      <Panel position={[0, 0.43, 0]} size={[1.45, 0.13, 0.92]} color="#647e81" />
      <Panel position={[0, 0.76, -0.32]} size={[1.14, 0.53, 0.64]} color="#8a795e" />
      <Panel position={[0, 1.16, -0.27]} size={[0.95, 0.26, 0.53]} color="#665e54" />
      <Panel position={[0.7, 0.91, 0.02]} size={[0.045, 1.02, 0.76]} color="#aab8b8" />
      {[[-0.49, -0.37], [0.49, -0.37], [-0.49, 0.37], [0.49, 0.37]].map(([a, b], i) => (
        <mesh key={i} position={[a, 0.21, b]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 12]} />
          <meshStandardMaterial color="#28353b" />
        </mesh>
      ))}
    </group>
  );
}

function Concourse() {
  return (
    <group>
      {[-19.4, 19.4].map((x) =>
        [20, 34, 47].map((y) => <StationPillar key={x + "-" + y} x={x} y={y} />),
      )}
      {/* Concourse directional floorwork and suspended station signage. */}
      <Panel position={[0, 0.012, -31]} size={[0.16, 0.015, 26]} color="#73999b" />
      {[23, 39, 54].map((y) => (
        <group key={y}>
          <Panel position={[0, 3.06, -y]} size={[5.8, 0.43, 0.28]} color="#314f5c" />
          <LightStrip position={[-1.6, 2.99, -y + 0.155]} size={[1.9, 0.085, 0.024]} />
          <LightStrip position={[1.42, 2.99, -y + 0.155]} size={[1.18, 0.085, 0.024]} color="#e2cc89" />
        </group>
      ))}
      <CargoTrolley x={17.9} y={33} />
      <CargoTrolley x={-17.4} y={54} />
      {[-16.8, 16.8].map((x) => (
        <Panel key={x} position={[x, 0.028, -42]} size={[0.07, 0.025, 21]} color="#80979b" />
      ))}
      {/* Signs correspond to a signed conversation near the script's employee. */}
      <Panel position={[-9.5, 1.05, -24]} size={[1.4, 1.7, 0.55]} color="#466b74" />
      <LightStrip position={[-9.5, 1.9, -23.68]} size={[1.13, 0.055, 0.025]} />
      <pointLight position={[-8, 3.1, -24]} color="#b5d7d2" intensity={1.2} distance={8} />
    </group>
  );
}

function Memorial() {
  const p = PLACES.memorial;
  return (
    <group>
      {/* A recessed names wall in the west alcove: marks are abstract, not
          invented proper names. The script's interaction remains authoritative. */}
      <Panel position={[-25.75, 1.72, -p.y]} size={[0.25, 3.35, 6.95]} color="#384c59" />
      <Panel position={[-25.57, 1.61, -p.y]} size={[0.04, 2.75, 6.35]} color="#9caba9" />
      {Array.from({ length: 11 }, (_, column) =>
        Array.from({ length: 12 }, (_, row) => (
          <Panel
            key={column + "-" + row}
            position={[-25.533, 0.45 + row * 0.2, -(45.15 + column * 0.57)]}
            size={[0.016, 0.025, 0.33 + ((row + column) % 3) * 0.045]}
            color="#61767b"
          />
        )),
      )}
      <Panel position={[-24.5, 0.17, -p.y]} size={[1.5, 0.3, 3.4]} color="#526d72" />
      <LightStrip position={[-25.43, 3.04, -p.y]} size={[0.055, 0.038, 5.9]} color="#d7c9a7" />
      <pointLight position={[-23.1, 2.6, -p.y]} intensity={0.75} distance={7} color="#e7d8b8" />
    </group>
  );
}

function BerthViewportAndHearthExterior() {
  const p = PLACES.berthWindow;
  return (
    <group>
      {/* Replace the east apron wall with actual glazed viewport geometry.
          All hull surfaces beyond x=20 are scenery outside walkable bounds. */}
      <Panel position={[20.03, 3.07, -p.y]} size={[0.36, 0.55, 4.0]} color="#687d87" />
      <Panel position={[20.03, 0.45, -p.y]} size={[0.36, 0.90, 4.0]} color="#556c76" />
      {[-1.9, 1.9].map((z) => (
        <Panel key={z} position={[20.02, 1.75, -p.y + z]} size={[0.38, 2.2, 0.18]} color="#96abb0" />
      ))}
      <mesh position={[20.03, 1.81, -p.y]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.66, 2.1]} />
        <meshPhysicalMaterial color="#729bb0" metalness={0.1} roughness={0.2} transparent opacity={0.18} side={2} depthWrite={false} />
      </mesh>
      {/* The patched, functioning Hearth hull visible through the viewport.
          Not a destination change: this exists strictly outside the apron. */}
      <group position={[33, 0.9, -p.y]}>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[17.5, 5.5, 15.5]} />
          <meshStandardMaterial color="#657981" metalness={0.76} roughness={0.57} />
        </mesh>
        <Panel position={[-6.6, 1.6, -1.5]} size={[1.3, 4.5, 9]} color="#81918e" />
        <Panel position={[-3.6, 4.6, 2.1]} size={[5.2, 0.11, 5]} color="#b4aba0" />
        <Panel position={[-4.7, 1.8, -6.4]} size={[5.4, 2.5, 0.08]} color="#4b6473" />
        <Panel position={[-8.9, 1.95, 0]} size={[1.1, 2.7, 4]} color="#49656e" />
        {[-4.5, 0.2, 4.3].map((z, i) => (
          <group key={i}>
            <Panel position={[-8.94, 1.7, z]} size={[0.07, 3.9, 0.2]} color={i === 1 ? "#b9a88b" : "#94a6a6"} />
            <LightStrip position={[-8.99, 3.3, z]} size={[0.045, 0.06, 1.2]} color="#95b8bd" />
          </group>
        ))}
        <Panel position={[-7.1, -0.42, 0]} size={[2.2, 0.42, 9.4]} color="#4e6972" />
      </group>
      <pointLight position={[22, 2.5, -p.y]} intensity={0.65} color="#9fbec7" distance={14} />
    </group>
  );
}

function BoardingBridge() {
  return (
    <group>
      {[65.5, 70.5, 75.5].map((y) => (
        <group key={y}>
          <Panel position={[16, 3.05, -y]} size={[4.55, 0.2, 0.24]} color="#7f9397" />
          <Panel position={[13.95, 1.58, -y]} size={[0.22, 2.95, 0.2]} color="#687c85" />
          <Panel position={[18.05, 1.58, -y]} size={[0.22, 2.95, 0.2]} color="#687c85" />
          <LightStrip position={[16, 2.91, -y + 0.16]} size={[2.6, 0.04, 0.025]} />
        </group>
      ))}
      {[13.82, 18.18].map((x) => (
        <group key={x}>
          <Panel position={[x, 0.94, -70]} size={[0.09, 0.12, 15]} color="#94a7a7" />
          <LightStrip position={[x, 0.12, -70]} size={[0.035, 0.02, 15.6]} color="#7cbcb6" />
        </group>
      ))}
      <Panel position={[16, 0.04, -70]} size={[1.35, 0.018, 15.6]} color="#3a5d66" />
    </group>
  );
}

function ArrivalDeck() {
  const check = PLACES.crewCheck;
  const lift = PLACES.lift;
  return (
    <group>
      {/* Real arrivals checkpoint; open path is left between stations. */}
      <group position={[check.x, 0, -check.y]}>
        {[-1.55, 1.55].map((x) => (
          <Panel key={x} position={[x, 1.15, 0]} size={[0.16, 2.3, 0.35]} color="#607b7f" />
        ))}
        <Panel position={[0, 2.35, 0]} size={[3.26, 0.19, 0.4]} color="#637f83" />
        <LightStrip position={[0, 2.2, 0.23]} size={[1.8, 0.04, 0.025]} color="#a9dfd4" />
      </group>
      {/* Worker at open wall compartment: equipment near the wall, no
          assumption of a new playable workstation. */}
      <Panel position={[4.5, 1.5, -86]} size={[0.17, 2.5, 3]} color="#344e58" />
      <Panel position={[4.65, 1.6, -86]} size={[0.09, 1.45, 2.2]} color="#182f38" />
      {[85.4, 86, 86.6].map((y) => (
        <Panel key={y} position={[4.76, 1.65, -y]} size={[0.1, 0.035, 0.3]} color="#9bb3aa" />
      ))}
      <LightStrip position={[4.77, 2.3, -86]} size={[0.025, 0.04, 1.8]} />
      {/* Stowed cargo crates against outer wall, not a game collision change. */}
      {[82, 86, 93].map((y, i) => (
        <group key={y}>
          <Panel position={[27.1, 0.5, -y]} size={[1.25, 1.0, 1.9]} color={i % 2 ? "#877c67" : "#637c78"} />
          <Panel position={[27.1, 1.04, -y]} size={[1.28, 0.05, 1.92]} color="#a29d86" />
        </group>
      ))}
      {/* The first lift: clear recognisable doors at the scripted endpoint,
          but no invented interaction beyond the Gate One stop. */}
      <group position={[lift.x, 0, -101.7]}>
        <Panel position={[0, 1.61, 0]} size={[4.1, 3.22, 0.22]} color="#59717d" />
        <Panel position={[-0.86, 1.48, 0.16]} size={[1.62, 2.79, 0.05]} color="#9aa9aa" />
        <Panel position={[0.86, 1.48, 0.16]} size={[1.62, 2.79, 0.05]} color="#879c9e" />
        <Panel position={[0, 1.5, 0.2]} size={[0.052, 2.8, 0.05]} color="#d0d4cd" />
        <Panel position={[0, 3.23, 0]} size={[4.5, 0.24, 0.48]} color="#6c8685" />
        {[-2.16, 2.16].map((x) => (
          <LightStrip key={x} position={[x, 1.52, 0.24]} size={[0.055, 2.24, 0.04]} color="#b5e3c6" />
        ))}
      </group>
      {[81, 90, 98].map((y) => (
        <LightStrip key={y} position={[16, 0.038, -y]} size={[0.06, 0.019, 2.2]} color="#95bea9" />
      ))}
      <pointLight position={[16, 3.15, -87]} color="#bcddd0" intensity={1} distance={14} />
    </group>
  );
}

/** Fixed landmarks and dressing that never affect engine coordinates or triggers. */
export function GateOneEnvironment() {
  return (
    <group>
      <EarthTransportCabin />
      <Concourse />
      <Memorial />
      <BerthViewportAndHearthExterior />
      <BoardingBridge />
      <ArrivalDeck />
    </group>
  );
}

/** Readable visual differences within the existing generic moving NPC roster.
 * Narrative characters are not invented or assigned specific bodies here.
 */
export function GateOneNpc({ npc }: { npc: NpcSnapshot }) {
  const cargo = npc.id === "cargo1" || npc.id === "cart1";
  const child = npc.id === "kids1";
  const worker = npc.id === "worker1" || npc.id === "crew1";
  const height = child ? 1.02 : 1.58;
  const clothing = child ? "#c6a276" : worker ? "#a1ac9b" : "#779fa7";
  return (
    <group position={[npc.x, 0, -npc.y]}>
      {cargo ? (
        <group>
          <Panel position={[0, 0.51, 0]} size={[1.1, 0.86, 1.42]} color="#6f8381" />
          <Panel position={[0, 0.99, -0.13]} size={[0.86, 0.19, 1.03]} color="#b7a991" />
          {[-0.44, 0.44].map((x) =>
            [-0.48, 0.48].map((z) => (
              <mesh key={x + ":" + z} position={[x, 0.17, z]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.12, 10]} />
                <meshStandardMaterial color="#28373b" />
              </mesh>
            )),
          )}
          <LightStrip position={[0, 0.65, -0.72]} size={[0.42, 0.07, 0.025]} color="#dccd8c" />
        </group>
      ) : (
        <group>
          <mesh position={[0, height * 0.53, 0]}>
            <capsuleGeometry args={[child ? 0.22 : 0.29, height * 0.4, 4, 10]} />
            <meshStandardMaterial color={clothing} roughness={0.82} />
          </mesh>
          <mesh position={[0, height * 0.96, 0]}>
            <sphereGeometry args={[child ? 0.16 : 0.2, 12, 12]} />
            <meshStandardMaterial color={worker ? "#b3aaa0" : "#c4ada0"} roughness={0.86} />
          </mesh>
          {worker && <Panel position={[0.35, 0.8, 0.01]} size={[0.2, 0.45, 0.34]} color="#6c8084" />}
          {npc.id === "trav1" && <Panel position={[0.45, 0.33, 0.24]} size={[0.31, 0.57, 0.28]} color="#8f765e" />}
          {npc.id === "dinner1" && <Panel position={[0.44, 0.83, 0.25]} size={[0.6, 0.17, 0.44]} color="#b49c79" />}
        </group>
      )}
    </group>
  );
}
