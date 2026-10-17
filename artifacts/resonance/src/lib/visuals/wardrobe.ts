/**
 * Reusable *visual* wardrobe compositions, never audio implementation.
 * Specific selections are PROPOSED, not locked character canon. Reconcile
 * approvals with docs/design_notes/character_wardrobe/ and
 * docs/future_game_use/characters/ before changing status.
 *
 * The geometry component is reusable: garments, materials and attachment
 * options are data, while a character identity is only a composition.
 */
import type { CharacterId } from "@/lib/gateone/characters";

export type WardrobeAccessory = "patches" | "tool-loops" | "aac-carrier" | "tactile-cuffs" | "ordered-pockets" | "knowledge-bag";
export type WardrobeVisualProfile = {
  key: CharacterId;
  displayName: string;
  status: "concept";
  uniformType: string;
  outerFabric: string;
  trim: string;
  underLayer: string;
  accessory: WardrobeAccessory;
  cut: "standard" | "seated" | "layered";
  garmentDescription: string;
  documentPath: string;
};
export const WARDROBE_VISUALS: Record<CharacterId, WardrobeVisualProfile> = {
  nia: {
    key: "nia", displayName: "Nia Viaraxen", status: "concept",
    uniformType: "Medical duty", outerFabric: "#477d7a", trim: "#d7c69b", underLayer: "#b6ccca",
    accessory: "patches", cut: "standard",
    garmentDescription: "Medical-duty tunic, free signing movement, accessible medical pocket and proposed behind-ear communication patches.",
    documentPath: "docs/future_game_use/characters/nia-viaraxen.md",
  },
  kesh: {
    key: "kesh", displayName: "Kesh Rennik", status: "concept",
    uniformType: "Engineering duty", outerFabric: "#806b56", trim: "#dab783", underLayer: "#a9b8ae",
    accessory: "tool-loops", cut: "seated",
    garmentDescription: "Seated-cut engineer's jacket with secure tool retainers and a proposed visual model of his hybrid wheelchair.",
    documentPath: "docs/future_game_use/characters/kesh-rennik.md",
  },
  sanaa: {
    key: "sanaa", displayName: "Sanaa al-Khatib", status: "concept",
    uniformType: "Communications duty", outerFabric: "#4f6e86", trim: "#d8d2b6", underLayer: "#aac7d0",
    accessory: "aac-carrier", cut: "standard",
    garmentDescription: "Streamlined communications jacket and proposed easy-reach personal AAC carrying mount.",
    documentPath: "docs/future_game_use/characters/sanaa-al-khatib.md",
  },
  ilyan: {
    key: "ilyan", displayName: "Ilyan Ibarra", status: "concept",
    uniformType: "Navigation duty", outerFabric: "#466d70", trim: "#d6c59d", underLayer: "#9eb2ac",
    accessory: "tactile-cuffs", cut: "standard",
    garmentDescription: "Navigation outer layer with relief-pattern tactile cuffs and accessible rank identification; no assumed mobility aid.",
    documentPath: "docs/future_game_use/characters/ilyan-ibarra.md",
  },
  mara: {
    key: "mara", displayName: "Mara Venn", status: "concept",
    uniformType: "Counselling duty", outerFabric: "#69786c", trim: "#dcc8ad", underLayer: "#bbc0b2",
    accessory: "ordered-pockets", cut: "standard",
    garmentDescription: "Structured counsellor's overshirt with secure, repeatable pocket layout and reachable closures.",
    documentPath: "docs/future_game_use/characters/mara-venn.md",
  },
  quillaan: {
    key: "quillaan", displayName: "Quillaan Folren", status: "concept",
    uniformType: "Living Library traveller", outerFabric: "#85735f", trim: "#b8caad", underLayer: "#c1b79c",
    accessory: "knowledge-bag", cut: "layered",
    garmentDescription: "Light layered traveller's outfit and proposed removable knowledge pouch; exact reading device is undecided.",
    documentPath: "docs/future_game_use/characters/quillaan-folren.md",
  },
};