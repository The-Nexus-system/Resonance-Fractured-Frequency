/**
 * Gate One world geometry — ONE continuous coordinate space, in metres.
 * +Y is "forward" (the direction of travel from Earth transport to the Hearth).
 * There are no teleports: every space connects by walkable overlap.
 * Geometry is STABLE — nothing here moves or is regenerated.
 */

export type Rect = { x1: number; y1: number; x2: number; y2: number };

export type ZoneId = "cabin" | "concourse" | "bridge" | "hearth";

export type Zone = { id: ZoneId; name: string; rect: Rect };

/** Walkable union. Movement is legal while the player's point stays inside at least one rect. */
export const WALKABLE: Rect[] = [
  // Transport cabin
  { x1: -4, y1: 0, x2: 4, y2: 12 },
  // Hatch throat (locked until docking)
  { x1: -1.2, y1: 12, x2: 1.2, y2: 14 },
  // Concourse hall
  { x1: -20, y1: 14, x2: 20, y2: 58 },
  // Memorial alcove (west side)
  { x1: -26, y1: 44, x2: -20, y2: 52 },
  // Berth apron leading east to the boarding bridge
  { x1: 8, y1: 58, x2: 20, y2: 62 },
  // Boarding bridge corridor
  { x1: 13.5, y1: 62, x2: 18.5, y2: 78 },
  // Hearth arrival deck
  { x1: 4, y1: 78, x2: 28, y2: 102 },
];

export const ZONES: Zone[] = [
  { id: "cabin", name: "Earth transport cabin", rect: { x1: -4, y1: 0, x2: 4, y2: 14 } },
  { id: "concourse", name: "Lunar transfer concourse", rect: { x1: -26, y1: 14, x2: 20, y2: 62 } },
  { id: "bridge", name: "Boarding bridge", rect: { x1: 13.5, y1: 62, x2: 18.5, y2: 78 } },
  { id: "hearth", name: "CSV Hearth — arrival deck", rect: { x1: 4, y1: 78, x2: 28, y2: 102 } },
];

export function zoneAt(x: number, y: number): Zone {
  // Later zones win so the hatch throat reads as cabin until crossed.
  let found: Zone = ZONES[0];
  for (const z of ZONES) {
    if (x >= z.rect.x1 && x <= z.rect.x2 && y >= z.rect.y1 && y <= z.rect.y2) found = z;
  }
  return found;
}

export function inRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2;
}

export function isWalkable(x: number, y: number, hatchOpen: boolean): boolean {
  for (const r of WALKABLE) {
    if (!hatchOpen && r.y1 >= 12 && r.y2 <= 14) continue; // hatch throat sealed pre-docking
    if (inRect(x, y, r)) {
      if (!hatchOpen && y > 11.6 && r.y2 <= 12) continue;
      return true;
    }
  }
  return false;
}

export const PLAYER_START = { x: 0, y: 2, heading: 0 }; // heading 0 = facing +Y (forward)

/** Named, stable places used by triggers, audio, and the Look Around description. */
export const PLACES = {
  playerSeat: { x: 0, y: 2, label: "your seat" },
  childAndParent: { x: -2, y: 5, label: "a child and their parent" },
  cabinPassenger: { x: 2, y: 6.5, label: "a fellow passenger" },
  cabinWindow: { x: -3.7, y: 8, label: "the cabin window" },
  cabinBelongings: { x: 0.8, y: 2, label: "your belongings" },
  hatch: { x: 0, y: 12, label: "the transfer hatch" },
  signingEmployee: { x: -8, y: 24, label: "a station employee" },
  aacVoice: { x: 10, y: 21, label: "a traveller with a spatial AAC voice" },
  junction: { x: 0, y: 40, label: "the concourse junction" },
  memorial: { x: -23, y: 48, label: "a memorial wall of names" },
  memorialWoman: { x: -22, y: 47, label: "a woman tracing a name" },
  chairArgument: { x: 12, y: 52, label: "an older passenger and a dock worker" },
  berthWindow: { x: 17, y: 59.5, label: "the berth viewport" },
  bridgeThreshold: { x: 16, y: 70, label: "the boarding bridge" },
  hearthThreshold: { x: 16, y: 78, label: "the Hearth airlock collar" },
  crewCheck: { x: 16, y: 82, label: "a crew member checking arrivals" },
  wallWorker: { x: 6, y: 86, label: "a worker in an open wall compartment" },
  sleeper: { x: 26.5, y: 88, label: "a person asleep in a chair" },
  maintenanceCorner: { x: 24, y: 96, label: "a blind corner" },
  lift: { x: 16, y: 100, label: "the first lift" },
} as const;

export type PlaceKey = keyof typeof PLACES;

/** Ambient NPC walk loops (independent schedules; they never wait for the player). */
export type NpcPath = {
  id: string;
  label: string;
  waypoints: { x: number; y: number }[];
  speed: number; // m/s
  /** chatter voice colour used by the audio engine */
  voice: "crowd" | "worker" | "child" | "cart";
  zone: ZoneId;
};

export const NPC_PATHS: NpcPath[] = [
  { id: "trav1", label: "a traveller pulling a case", voice: "crowd", speed: 1.3, zone: "concourse",
    waypoints: [{ x: -14, y: 18 }, { x: 6, y: 30 }, { x: 14, y: 52 }, { x: -4, y: 44 }] },
  { id: "trav2", label: "a family with luggage", voice: "crowd", speed: 0.9, zone: "concourse",
    waypoints: [{ x: 16, y: 18 }, { x: 2, y: 26 }, { x: -12, y: 38 }, { x: -2, y: 52 }] },
  { id: "cargo1", label: "a cargo hauler", voice: "cart", speed: 1.1, zone: "concourse",
    waypoints: [{ x: -18, y: 55 }, { x: -18, y: 20 }, { x: 18, y: 16 }] },
  { id: "worker1", label: "a station worker", voice: "worker", speed: 1.5, zone: "concourse",
    waypoints: [{ x: -6, y: 22 }, { x: -10, y: 36 }, { x: 8, y: 40 }] },
  { id: "crew1", label: "crew moving cargo aboard", voice: "worker", speed: 1.2, zone: "hearth",
    waypoints: [{ x: 8, y: 80 }, { x: 24, y: 84 }, { x: 12, y: 92 }] },
  { id: "kids1", label: "two children racing", voice: "child", speed: 2.4, zone: "hearth",
    waypoints: [{ x: 6, y: 92 }, { x: 20, y: 88 }, { x: 10, y: 98 }] },
  { id: "dinner1", label: "a person carrying dinner containers", voice: "crowd", speed: 1.1, zone: "hearth",
    waypoints: [{ x: 26, y: 80 }, { x: 8, y: 88 }, { x: 22, y: 98 }] },
  { id: "cart1", label: "a maintenance cart", voice: "cart", speed: 0.9, zone: "hearth",
    waypoints: [{ x: 27, y: 92 }, { x: 22, y: 96 }, { x: 27, y: 100 }] },
];

export function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

/** Compass-style direction from the player's heading to a target, for descriptions. */
export function relativeDirection(
  px: number, py: number, heading: number, tx: number, ty: number,
): string {
  const angle = Math.atan2(tx - px, ty - py); // 0 = +Y forward
  let rel = angle - heading;
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  const deg = (rel * 180) / Math.PI;
  if (Math.abs(deg) <= 22) return "ahead";
  if (deg > 22 && deg <= 67) return "ahead and to your right";
  if (deg > 67 && deg <= 112) return "to your right";
  if (deg > 112 && deg <= 157) return "behind you, to the right";
  if (deg < -22 && deg >= -67) return "ahead and to your left";
  if (deg < -67 && deg >= -112) return "to your left";
  if (deg < -112 && deg >= -157) return "behind you, to the left";
  return "behind you";
}
