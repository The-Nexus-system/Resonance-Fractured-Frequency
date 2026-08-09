/**
 * The six authored playable characters — locked canon.
 * Source: docs/design_notes/first_fracture_episode_one_locked_rules.md
 * The player chooses BEFORE Day One begins; the choice is canon, not creation.
 */
export type CharacterId = "nia" | "kesh" | "sanaa" | "ilyan" | "mara" | "quillaan";

export type PlayableCharacter = {
  id: CharacterId;
  name: string;
  pronouns: string;
  role: string;
  rank: string;
  origin: string;
  /** The automatic in-world answer given at the boarding badge scan. */
  boardingAnswer: string;
  /** Short accessible description for the selection screen. */
  blurb: string;
};

export const CHARACTERS: PlayableCharacter[] = [
  {
    id: "nia",
    name: "Nia Viaraxen",
    pronouns: "they/them",
    role: "Medical",
    rank: "Lieutenant",
    origin: "Aster Vale Station",
    boardingAnswer: "Medical.",
    blurb:
      "Deaf medic from the trauma-medicine community of Aster Vale Station. Warm with patients, dry with everyone else.",
  },
  {
    id: "kesh",
    name: "Kesh Rennik",
    pronouns: "he/him",
    role: "Engineering",
    rank: "Ensign",
    origin: "Kestrel Foundry",
    boardingAnswer: "Engineering.",
    blurb:
      "Engineer from Kestrel Foundry, where equipment that doesn't fit its user isn't finished. Listens to machines. Keeps borrowed tools.",
  },
  {
    id: "sanaa",
    name: "Sanaa al-Khatib",
    pronouns: "she/her",
    role: "Communications",
    rank: "Lieutenant Junior Grade",
    origin: "Concord Relay",
    boardingAnswer: "Communications.",
    blurb:
      "Communications specialist from Concord Relay. AAC is her voice — fast-minded, precise, mischievous.",
  },
  {
    id: "ilyan",
    name: "Ilyan Ibarra",
    pronouns: "they/them (currently)",
    role: "Navigation",
    rank: "Senior Chief Petty Officer",
    origin: "Farpoint Observatory",
    boardingAnswer: "Navigation.",
    blurb:
      "Blind navigator from Farpoint Observatory. Reads a ship the way other people read a room.",
  },
  {
    id: "mara",
    name: "Mara Venn",
    pronouns: "she/her",
    role: "Counseling",
    rank: "Lieutenant Commander",
    origin: "the Retrieval Network",
    boardingAnswer: "Counseling.",
    blurb:
      "Counselor raised inside the Retrieval Network — the people who go and get people back.",
  },
  {
    id: "quillaan",
    name: "Quillaan Folren",
    pronouns: "he/him",
    role: "General apprenticeship",
    rank: "Cadet",
    origin: "the Living Library tradition",
    boardingAnswer: "General apprenticeship.",
    blurb:
      "Living Library cadet. Carries stories between communities, remembers who knows what, paces his energy deliberately.",
  },
];

export function getCharacter(id: string | null | undefined): PlayableCharacter | null {
  return CHARACTERS.find((c) => c.id === id) ?? null;
}
