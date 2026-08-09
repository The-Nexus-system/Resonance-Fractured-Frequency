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
const CATALOG = join(ROOT, "assets", "CATALOG.json");

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

function loadCatalog() {
  return JSON.parse(readFileSync(CATALOG, "utf8"));
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
  // Catalog checks + registry->catalog references
  const cat = loadCatalog();
  const CAT_ID_RE = /^SRC-(AUD|GFX)-\d{3,}$/;
  const CAT_STATUS = ["approved", "approved-per-file", "reference-only", "needs-license-check"];
  const catIds = new Set();
  for (const s of cat.sources) {
    const label = s.id || s.name || "(unnamed source)";
    if (!s.id || !CAT_ID_RE.test(s.id)) errors.push(`catalog ${label}: id does not match SRC-<AUD|GFX>-<NNN>`);
    if (s.id && catIds.has(s.id)) errors.push(`catalog ${label}: duplicate id`);
    if (s.id) catIds.add(s.id);
    if (!CAT_STATUS.includes(s.status)) errors.push(`catalog ${label}: unknown status "${s.status}"`);
    for (const f of ["name", "creator", "location", "license", "preferredUse"]) if (!s[f]) errors.push(`catalog ${label}: missing "${f}"`);
  }
  for (const a of reg.assets) {
    if (a.sourcePackId && !catIds.has(a.sourcePackId)) errors.push(`${a.id}: sourcePackId "${a.sourcePackId}" not found in CATALOG.json`);
    if (a.sourcePackId) {
      const s = cat.sources.find((x) => x.id === a.sourcePackId);
      if (s && s.status === "reference-only") errors.push(`${a.id}: source ${s.id} is reference-only — a verified per-file license must flip it to approved-per-file before import`);
    }
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

function catalogMd() {
  const cat = loadCatalog();
  const groups = [
    ["audio", "Audio / Music / Voice sources"],
    ["graphics", "Graphics / 3D / Textures / Fonts / Animation sources"],
  ];
  const md = ["# Resonance Source & Pack Catalog", "", "GENERATED from `assets/CATALOG.json` — do not edit by hand.", ""];
  for (const [key, title] of groups) {
    md.push(`## ${title}`, "");
    for (const s of cat.sources.filter((x) => x.category === key)) {
      md.push(`### ${s.id} — ${s.name}`);
      md.push(`- **Status:** ${s.status}`);
      md.push(`- **Creator/Publisher:** ${s.creator}`);
      md.push(`- **Location/Reacquisition:** ${s.location}`);
      md.push(`- **License:** ${s.license}`);
      md.push(`- **Commercial use:** ${s.commercialUse ? "yes" : "not without further verification"}`);
      md.push(`- **Attribution:** ${s.attribution}`);
      md.push(`- **Modification/Redistribution:** ${s.modificationRedistribution}`);
      md.push(`- **Whole pack approved:** ${s.wholePackApproved ? "yes" : "no — per-file/per-pack verification required"}`);
      md.push(`- **Purchase/Subscription:** ${s.purchase}`);
      md.push(`- **Preferred use in Resonance:** ${s.preferredUse}`);
      if (s.notes) md.push(`- **Notes:** ${s.notes}`);
      md.push("");
    }
  }
  const out = join(ROOT, "assets", "generated", "CATALOG.md");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, md.join("\n") + "\n");
  console.log("wrote assets/generated/CATALOG.md");
}

const cmd = process.argv[2];
if (cmd === "validate") validate();
else if (cmd === "credits") { validate(); credits(); }
else if (cmd === "catalog") { validate(); catalogMd(); }
else { console.error("usage: node scripts/assets/registry.mjs <validate|credits|catalog>"); process.exit(2); }
