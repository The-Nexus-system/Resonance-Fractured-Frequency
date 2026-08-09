#!/usr/bin/env node
/**
 * Resonance master asset registry tool. Portable — plain Node.js, no
 * host-specific dependencies. See assets/REGISTRY_SCHEMA.md.
 *
 * Usage:
 *   node scripts/assets/registry.mjs validate   # schema + compliance checks
 *   node scripts/assets/registry.mjs credits    # regenerate credits outputs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REGISTRY = join(ROOT, "assets", "REGISTRY.json");

const TYPES = ["sfx", "music", "voice", "graphic", "texture", "model3d", "animation", "font", "video", "other"];
const ID_RE = /^RSN-(SFX|MUS|VOX|GFX|TEX|MDL|ANM|FNT|VID|OTH)-\d{3,}$/;
const REQUIRED = [
  "id", "name", "type", "originalFilename", "creator", "sourceLibrary",
  "license", "commercialUse", "modificationAllowed", "attributionRequired",
  "acquiredDate", "fracturedFlowOriginal", "masterSource", "derivedFiles",
  "processing", "targets", "usedIn", "reacquisition",
];

function load() {
  return JSON.parse(readFileSync(REGISTRY, "utf8"));
}

function validate() {
  const reg = load();
  const errors = [];
  const ids = new Set();
  for (const a of reg.assets) {
    const label = a.id || a.name || "(unnamed entry)";
    for (const f of REQUIRED) if (a[f] === undefined) errors.push(`${label}: missing required field "${f}"`);
    if (a.id && !ID_RE.test(a.id)) errors.push(`${label}: id does not match RSN-<TYPE>-<NNN>`);
    if (a.id && ids.has(a.id)) errors.push(`${label}: duplicate id`);
    if (a.id) ids.add(a.id);
    if (a.type && !TYPES.includes(a.type)) errors.push(`${label}: unknown type "${a.type}"`);
    if (a.commercialUse !== true) errors.push(`${label}: commercialUse must be true to ship (NC material needs separate recorded permission)`);
    if (a.attributionRequired === true && !a.attributionText) errors.push(`${label}: attributionRequired but attributionText missing`);
    if (/-nc\b|noncommercial/i.test(a.license || "") && !/permission/i.test(a.notes || "")) errors.push(`${label}: NC license without recorded separate permission in notes`);
    if (a.fracturedFlowOriginal !== true && !a.sourceUrl && !a.reacquisition) errors.push(`${label}: third-party asset needs sourceUrl or reacquisition pointer`);
    for (const df of a.derivedFiles || []) if (!existsSync(join(ROOT, df))) errors.push(`${label}: derived file not found in repo: ${df}`);
  }
  if (errors.length) {
    console.error(`REGISTRY INVALID — ${errors.length} problem(s):`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log(`Registry valid: ${reg.assets.length} asset(s).`);
}

function credits() {
  const reg = load();
  // Player-facing credits: Fractured Flow for original work; exact
  // license-required attribution for third-party assets. Tools stay internal.
  const thirdParty = reg.assets.filter((a) => a.fracturedFlowOriginal !== true);
  const lines = [];
  const seen = new Set();
  for (const a of thirdParty) {
    const text = a.attributionRequired
      ? a.attributionText
      : `${a.sourceLibrary}${a.creator && a.creator !== a.sourceLibrary ? ` — ${a.creator}` : ""} (${a.license})`;
    if (!seen.has(text)) { seen.add(text); lines.push({ text, required: a.attributionRequired === true }); }
  }
  const hasOriginal = reg.assets.some((a) => a.fracturedFlowOriginal === true);
  const json = {
    generatedFrom: "assets/REGISTRY.json",
    note: "GENERATED FILE — do not edit. Run: node scripts/assets/registry.mjs credits",
    originalWorkCredit: hasOriginal ? "Original music and sound design by Fractured Flow" : null,
    entries: lines,
  };
  const md = [
    "# Resonance Audio & Asset Credits",
    "",
    "GENERATED from `assets/REGISTRY.json` — do not edit by hand.",
    "",
    ...(hasOriginal ? ["Original music and sound design by **Fractured Flow**.", ""] : []),
    ...(lines.length
      ? lines.map((l) => `- ${l.text}${l.required ? "" : " *(courtesy credit)*"}`)
      : ["*(No third-party assets imported yet.)*"]),
    "",
  ].join("\n");

  const outputs = [
    [join(ROOT, "assets", "generated", "CREDITS.md"), md],
    [join(ROOT, "assets", "generated", "credits.json"), JSON.stringify(json, null, 2) + "\n"],
    [join(ROOT, "artifacts", "resonance", "src", "generated", "credits.json"), JSON.stringify(json, null, 2) + "\n"],
    [join(ROOT, "artifacts", "resonance-mobile", "lib", "generated", "credits.json"), JSON.stringify(json, null, 2) + "\n"],
  ];
  for (const [path, content] of outputs) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    console.log("wrote " + path.slice(ROOT.length + 1));
  }
}

const cmd = process.argv[2];
if (cmd === "validate") validate();
else if (cmd === "credits") { validate(); credits(); }
else { console.error("usage: node scripts/assets/registry.mjs <validate|credits>"); process.exit(2); }
