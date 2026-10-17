/**
 * Gate One recorded voice lines — the trigger map (voice wiring phase,
 * Oct 17 2026).
 *
 * Every authored script line whose cast voice has been produced is keyed
 * here by speaker + exact script text — the "so-and-so says" trigger. The
 * engine's emitLine() looks each line up: on a hit it plays the recorded
 * file INSTEAD of speech synthesis (badge, PA and narration non-
 * positional — they are "with you"; NPC and player lines positional at
 * the event's speaking position). On a miss the line keeps synthesis
 * exactly as before — that covers the dynamic lines (lookAround and
 * repeatGuidance output is composed at runtime) and Ilyan's boarding
 * answer "Navigation.", which has NO production file yet (the Suno
 * generation could not be trimmed clean) and is intentionally unmapped.
 *
 * Captions are the non-audio twin of every line and fire unchanged
 * whether or not a recording exists.
 *
 * Every file is a registered asset (assets/REGISTRY.json, RSN-VOX-001..
 * 058), served from /audio/gateone/voices/ via the audio loader's
 * audio/gateone/ base — values below are the loader-relative paths.
 */
import type { CharacterId } from "./characters";

type VoiceLineEntry = readonly [speaker: string, text: string, file: string];

const VOICE_LINE_LIST: VoiceLineEntry[] = [
  ["Badge", "If blue routing cannot be perceived, this badge provides equivalent directional guidance.", "voices/badge-01-guidance.ogg"],
  ["Badge", "Hearth transfer intake: forward, through the central concourse.", "voices/badge-02-intake.ogg"],
  ["Badge", "Bear right.", "voices/badge-03-bear-right.ogg"],
  ["Badge", "This is the Retrieval Network memorial. Your transfer remains available by the opposite corridor.", "voices/badge-04-memorial.ogg"],
  ["Badge", "Hearth boarding bridge ahead.", "voices/badge-05-bridge-ahead.ogg"],
  ["Badge", "CSV Hearth. Registry CSV-zero-one-zero-one-H.", "voices/badge-06-registry.ogg"],
  ["Badge", "Bridge connected. Proceed aboard.", "voices/badge-07-connected.ogg"],
  ["Badge", "Forward. First lift. Deck Three.", "voices/badge-08-lift.ogg"],
  ["Ship guidance", "Lunar transfer in four minutes. Hearth-bound personnel follow blue transfer routing.", "voices/pa-01.ogg"],
  ["", "Engine vibration hums through the deck of the Earth transport. Cargo restraints creak. Passengers settle around you.", "voices/narration-01.ogg"],
  ["", "The engine pitch drops. The transport is braking.", "voices/narration-02.ogg"],
  ["", "A settling thud. The transfer hatch ahead unseals and opens onto the lunar concourse.", "voices/narration-03.ogg"],
  ["", "The concourse is crowded: arrivals, departures, cargo, families, workers. Somewhere nearby an employee is signing to one person while answering another aloud.", "voices/narration-04.ogg"],
  ["", "Through the berth viewport: the Hearth. Large, but not pristine, not elegant. Hull sections from different periods. Mismatched repairs. Badly matched paint near the docking collar. Nobody says anything.", "voices/narration-05.ogg"],
  ["", "The acoustics change the moment you cross: different ventilation, a floor that resonates underfoot, more people. Busy, not ceremonial. Crew check arrivals while cargo and people move on their own errands.", "voices/narration-06.ogg"],
  ["", "Ordinary life keeps happening around you: a worker half inside an open wall compartment; two children racing until an adult says \u201cWalk\u201d; someone carrying dinner containers nowhere near dinner; a person asleep in a chair. Nothing here is waiting for you.", "voices/narration-07.ogg"],
  ["", "The first lift stands ahead, marked for Deck Three. Medical intake waits beyond it.", "voices/narration-08.ogg"],
  ["", "You are still reading something you should probably have put away by now. You do not put it away.", "voices/narration-09.ogg"],
  ["Child", "Can I see Earth yet?", "voices/npc-child-01.ogg"],
  ["Parent", "You can always see Earth from somewhere.", "voices/npc-parent-01.ogg"],
  ["Child", "That isn't what I asked.", "voices/npc-child-02.ogg"],
  ["Spatial AAC voice", "THE BLUE ONE. NOT THAT ONE.", "voices/npc-traveller-aac-01.ogg"],
  ["Woman, tracing a name", "They got my grandfather out.", "voices/npc-memorial-woman-01.ogg"],
  ["Her companion", "Which one?", "voices/npc-memorial-companion-01.ogg"],
  ["Woman", "All of them.", "voices/npc-memorial-woman-02.ogg"],
  ["Older passenger", "Earth customs said the chair had to stay with freight.", "voices/npc-older-passenger-01.ogg"],
  ["Dock worker", "Earth customs does not run this station. Your chair waits at the dock.", "voices/npc-dock-worker-01.ogg"],
  ["Crew member", "New assignment?", "voices/npc-crew-boarding-01.ogg"],
  ["Crew member", "Medical intake first. Everybody.", "voices/npc-crew-boarding-02.ogg"],
  ["Maintenance cart", "Cart coming around the corner. Thank you.", "voices/npc-cart-01.ogg"],
  ["Passenger", "Does checked medical equipment transfer automatically?", "voices/npc-passenger-cabin-01.ogg"],
  ["Crew", "It does. Thanks for checking.", "voices/npc-crew-cabin-01.ogg"],
  ["Surprised passenger", "You can tell?", "voices/npc-surprised-01.ogg"],
  ["You (Ilyan)", "We're braking. You can hear it in the engine pitch.", "voices/player-ilyan-01.ogg"],
  ["You (Ilyan)", "You can't?", "voices/player-ilyan-02.ogg"],
  ["You (Sanaa, AAC)", "WELCOME.", "voices/player-sanaa-welcome.ogg"],
  ["You", "Medical.", "voices/boarding-nia.ogg"],
  ["You", "Engineering.", "voices/boarding-kesh.ogg"],
  ["You", "Communications.", "voices/boarding-sanaa.ogg"],
  ["You", "Counseling.", "voices/boarding-mara.ogg"],
  ["You", "General apprenticeship.", "voices/boarding-quillaan.ogg"],
];

const VOICE_LINES = new Map<string, string>(
  VOICE_LINE_LIST.map(([speaker, text, file]) => [`${speaker}\n${text}`, file]),
);

/** The recorded file for a scripted line, or undefined to keep synthesis. */
export function voiceFileFor(speaker: string, text: string): string | undefined {
  return VOICE_LINES.get(`${speaker}\n${text}`);
}

/**
 * Registered voice files with NO discrete playback call site yet.
 * They are registered (RSN-VOX) and held here so the asset/code
 * correspondence stays complete; nothing below is triggered by the
 * engine today:
 * - Turn-help strings occur only as fragments inside the dynamic
 *   lookAround/repeatGuidance output (delivered as aria-live text).
 * - Zone names reach the player as aria-live text and labels.
 * - The Day One reset string is an aria-live announcement in the page.
 * - Character blurbs are rendered as text on the character-select
 *   screen; that screen has no audio playback path yet.
 */
export const TURN_HELP_FILES: Record<string, string> = {
  "Move forward.": "voices/turnhelp-01.ogg",
  "Turn around to your right, then move forward.": "voices/turnhelp-02.ogg",
  "Turn around to your left, then move forward.": "voices/turnhelp-03.ogg",
  "Turn around, then move forward.": "voices/turnhelp-04.ogg",
  "Turn right, then move forward.": "voices/turnhelp-05.ogg",
  "Turn left, then move forward.": "voices/turnhelp-06.ogg",
};

export const ZONE_NAME_FILES: Record<string, string> = {
  "Earth transport cabin": "voices/zone-01.ogg",
  "Lunar transfer concourse": "voices/zone-02.ogg",
  "Boarding bridge": "voices/zone-03.ogg",
  "CSV Hearth \u2014 arrival deck": "voices/zone-04.ogg",
};

export const UI_RESET_FILE = "voices/ui-reset.ogg";

export const CHARACTER_BLURB_FILES: Record<CharacterId, string> = {
  nia: "voices/blurb-nia.ogg",
  kesh: "voices/blurb-kesh.ogg",
  sanaa: "voices/blurb-sanaa.ogg",
  ilyan: "voices/blurb-ilyan.ogg",
  mara: "voices/blurb-mara.ogg",
  quillaan: "voices/blurb-quillaan.ogg",
};
