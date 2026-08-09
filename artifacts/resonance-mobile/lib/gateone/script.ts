/**
 * Gate One authored script — verbatim from the protected Day One narrative,
 * Part 1 (docs/design_notes/episode_one_authority_1_day_one_script.md).
 * NOTHING here goes past "Medical intake first" / Deck Three guidance.
 */
import type { CharacterId } from "./characters";

export type SpeakerKind =
  | "npc"        // an in-world person, spatialised at a position
  | "pa"         // ship/station announcement, ambient
  | "badge"      // comm-badge guidance: earcon + vibration + short line
  | "player"     // the authored character's automatic reaction
  | "narration"; // environmental description (what you perceive)

export type ScriptLine = { speaker: string; kind: SpeakerKind; text: string };

export type ScriptEvent = {
  id: string;
  /** Fire once when this trigger becomes true. */
  trigger:
    | { type: "time"; atSeconds: number }                       // since scene start
    | { type: "near"; x: number; y: number; radius: number }
    | { type: "linger"; x: number; y: number; radius: number; seconds: number }
    | { type: "after"; eventId: string; delaySeconds: number }
    | { type: "cross"; y: number }                              // crossing a Y line moving forward
    | { type: "leave"; x: number; y: number; radius: number; afterEventId: string };
  /** Restrict to one authored character (undefined = everyone). */
  onlyCharacter?: CharacterId;
  /** World position of the speaking source — used for a spatial voice cue. */
  at?: { x: number; y: number };
  lines: ScriptLine[];
  /** side effects the engine understands */
  effect?: "openHatch" | "brakingAudio" | "boardingAcoustics" | "badgePulse" | "endGateOne";
};

/** Build the full Gate One event list for the chosen character. */
export function buildScript(character: CharacterId): ScriptEvent[] {
  const events: ScriptEvent[] = [
    // ---- Earth transport cabin -------------------------------------------
    {
      id: "cabin-open",
      trigger: { type: "time", atSeconds: 2 },
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "Engine vibration hums through the deck of the Earth transport. Cargo restraints creak. Passengers settle around you.",
        },
      ],
    },
    {
      id: "child-earth-1",
      at: { x: -2, y: 5 },
      trigger: { type: "time", atSeconds: 8 },
      lines: [
        { speaker: "Child", kind: "npc", text: "Can I see Earth yet?" },
        { speaker: "Parent", kind: "npc", text: "You can always see Earth from somewhere." },
        { speaker: "Child", kind: "npc", text: "That isn't what I asked." },
      ],
    },
    {
      id: "braking",
      trigger: { type: "time", atSeconds: 26 },
      effect: "brakingAudio",
      lines: [
        { speaker: "", kind: "narration", text: "The engine pitch drops. The transport is braking." },
      ],
    },
    {
      id: "pa-transfer",
      trigger: { type: "time", atSeconds: 46 },
      lines: [
        {
          speaker: "Ship guidance",
          kind: "pa",
          text:
            "Lunar transfer in four minutes. Hearth-bound personnel follow blue transfer routing.",
        },
        {
          speaker: "Badge",
          kind: "badge",
          text:
            "If blue routing cannot be perceived, this badge provides equivalent directional guidance.",
        },
      ],
    },
    {
      id: "docking",
      trigger: { type: "time", atSeconds: 70 },
      effect: "openHatch",
      lines: [
        {
          speaker: "",
          kind: "narration",
          text: "A settling thud. The transfer hatch ahead unseals and opens onto the lunar concourse.",
        },
        { speaker: "Badge", kind: "badge", text: "Hearth transfer intake: forward, through the central concourse." },
      ],
    },

    // ---- Lunar concourse --------------------------------------------------
    {
      id: "concourse-arrive",
      trigger: { type: "cross", y: 14 },
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "The concourse is crowded: arrivals, departures, cargo, families, workers. Somewhere nearby an employee is signing to one person while answering another aloud.",
        },
      ],
    },
    {
      id: "aac-blue-one",
      at: { x: 10, y: 21 },
      trigger: { type: "near", x: 10, y: 21, radius: 7 },
      lines: [
        { speaker: "Spatial AAC voice", kind: "npc", text: "THE BLUE ONE. NOT THAT ONE." },
      ],
    },
    {
      id: "junction-right",
      trigger: { type: "near", x: 0, y: 40, radius: 6 },
      effect: "badgePulse",
      lines: [{ speaker: "Badge", kind: "badge", text: "Bear right." }],
    },
    {
      id: "memorial-identify",
      at: { x: -22, y: 47 },
      trigger: { type: "linger", x: -22.5, y: 48, radius: 4, seconds: 2 },
      lines: [
        {
          speaker: "Badge",
          kind: "badge",
          text:
            "This is the Retrieval Network memorial. Your transfer remains available by the opposite corridor.",
        },
        { speaker: "Woman, tracing a name", kind: "npc", text: "They got my grandfather out." },
        { speaker: "Her companion", kind: "npc", text: "Which one?" },
        { speaker: "Woman", kind: "npc", text: "All of them." },
      ],
    },
    {
      id: "chair-argument",
      at: { x: 12, y: 52 },
      trigger: { type: "near", x: 12, y: 52, radius: 6 },
      lines: [
        {
          speaker: "Older passenger",
          kind: "npc",
          text: "Earth customs said the chair had to stay with freight.",
        },
        {
          speaker: "Dock worker",
          kind: "npc",
          text: "Earth customs does not run this station. Your chair waits at the dock.",
        },
      ],
    },
    {
      id: "berth-guidance",
      trigger: { type: "near", x: 14, y: 58, radius: 6 },
      lines: [{ speaker: "Badge", kind: "badge", text: "Hearth boarding bridge ahead." }],
    },
    {
      id: "hearth-first-view",
      trigger: { type: "near", x: 17, y: 59.5, radius: 3.5 },
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "Through the berth viewport: the Hearth. Large, but not pristine, not elegant. Hull sections from different periods. Mismatched repairs. Badly matched paint near the docking collar. Nobody says anything.",
        },
        { speaker: "Badge", kind: "badge", text: "CSV Hearth. Registry CSV-zero-one-zero-one-H." },
      ],
    },

    // ---- Boarding bridge → Hearth ----------------------------------------
    {
      id: "bridge-proceed",
      trigger: { type: "cross", y: 62 },
      lines: [{ speaker: "Badge", kind: "badge", text: "Bridge connected. Proceed aboard." }],
    },
    {
      id: "boarding",
      trigger: { type: "cross", y: 78 },
      effect: "boardingAcoustics",
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "The acoustics change the moment you cross: different ventilation, a floor that resonates underfoot, more people. Busy, not ceremonial. Crew check arrivals while cargo and people move on their own errands.",
        },
      ],
    },
    {
      id: "crew-scan",
      at: { x: 16, y: 82 },
      trigger: { type: "near", x: 16, y: 82, radius: 3 },
      lines: [
        { speaker: "Crew member", kind: "npc", text: "New assignment?" },
        { speaker: "You", kind: "player", text: BOARDING_ANSWERS[character] },
        { speaker: "Crew member", kind: "npc", text: "Medical intake first. Everybody." },
        { speaker: "Badge", kind: "badge", text: "Forward. First lift. Deck Three." },
      ],
    },
    {
      id: "hearth-life",
      trigger: { type: "after", eventId: "crew-scan", delaySeconds: 6 },
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "Ordinary life keeps happening around you: a worker half inside an open wall compartment; two children racing until an adult says \u201cWalk\u201d; someone carrying dinner containers nowhere near dinner; a person asleep in a chair. Nothing here is waiting for you.",
        },
      ],
    },
    {
      id: "cart-warning",
      at: { x: 24, y: 96 },
      trigger: { type: "near", x: 24, y: 96, radius: 5 },
      lines: [
        { speaker: "Maintenance cart", kind: "npc", text: "Cart coming around the corner. Thank you." },
      ],
    },
    {
      id: "gate-one-end",
      trigger: { type: "near", x: 16, y: 100, radius: 2.5 },
      effect: "endGateOne",
      lines: [
        {
          speaker: "",
          kind: "narration",
          text:
            "The first lift stands ahead, marked for Deck Three. Medical intake waits beyond it.",
        },
      ],
    },
  ];

  // ---- Authored character reactions (cabin) ------------------------------
  if (character === "ilyan") {
    events.push({
      id: "ilyan-braking",
      at: { x: 2, y: 6.5 },
      trigger: { type: "after", eventId: "braking", delaySeconds: 2 },
      onlyCharacter: "ilyan",
      lines: [
        { speaker: "You (Ilyan)", kind: "player", text: "We're braking. You can hear it in the engine pitch." },
        { speaker: "Surprised passenger", kind: "npc", text: "You can tell?" },
        { speaker: "You (Ilyan)", kind: "player", text: "You can't?" },
      ],
    });
  }
  if (character === "sanaa") {
    events.push({
      id: "sanaa-aac-cabin",
      at: { x: 2, y: 6.5 },
      trigger: { type: "time", atSeconds: 34 },
      onlyCharacter: "sanaa",
      lines: [
        {
          speaker: "Passenger",
          kind: "npc",
          text: "Does checked medical equipment transfer automatically?",
        },
        { speaker: "Crew", kind: "npc", text: "It does. Thanks for checking." },
        { speaker: "You (Sanaa, AAC)", kind: "player", text: "WELCOME." },
      ],
    });
  }
  if (character === "quillaan") {
    events.push({
      id: "quillaan-reading",
      trigger: { type: "time", atSeconds: 16 },
      onlyCharacter: "quillaan",
      lines: [
        {
          speaker: "",
          kind: "narration",
          text: "You are still reading something you should probably have put away by now. You do not put it away.",
        },
      ],
    });
  }

  return events;
}

const BOARDING_ANSWERS: Record<CharacterId, string> = {
  nia: "Medical.",
  kesh: "Engineering.",
  sanaa: "Communications.",
  ilyan: "Navigation.",
  mara: "Counseling.",
  quillaan: "General apprenticeship.",
};
