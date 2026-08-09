# Resonance Master Asset Registry — Schema & Import Workflow

Portable specification. Any coding host or agent (no Replit knowledge
needed) can maintain this system with a text editor and Node.js.
Governing policy: `docs/16_Audio_Source_License_Bible.md` (protected).

## Files

- `assets/REGISTRY.json` — the machine-readable master registry. ONE source
  of truth for provenance, licensing, and credits.
- `scripts/assets/registry.mjs` — validator + credits generator
  (`node scripts/assets/registry.mjs validate | credits`).
- `assets/generated/CREDITS.md` — human-readable credits, GENERATED. Do not
  edit by hand.
- `artifacts/resonance/src/generated/credits.json` and
  `artifacts/resonance-mobile/lib/generated/credits.json` — per-client
  copies of the player-facing credits data, GENERATED.
- `assets/audio/licenses/` — verbatim license texts, receipts, permission
  evidence, license-page snapshots. Referenced by entries.
- `assets/CATALOG.json` — reusable PACK/SOURCE catalog (research record of
  approved/reference sources so nobody re-researches the same libraries);
  human-readable twin generated at `assets/generated/CATALOG.md` via
  `node scripts/assets/registry.mjs catalog`.
- `assets/audio/LEDGER.md` — historical audio ledger, now a pointer into
  this registry (kept for continuity; no longer a parallel source of truth).

## Entry schema (every asset, all media types)

Required fields (use `null` only where marked optional):

| Field | Meaning |
|---|---|
| `id` | Stable internal asset ID, `RSN-<TYPE>-<NNN>` (e.g. `RSN-SFX-001`, `RSN-MUS-001`, `RSN-VOX-001`, `RSN-TEX-001`, `RSN-MDL-001`, `RSN-ANM-001`, `RSN-FNT-001`, `RSN-VID-001`, `RSN-GFX-001`, `RSN-OTH-001`). Never reused or renumbered. |
| `name` | Human name. |
| `type` | `sfx` \| `music` \| `voice` \| `graphic` \| `texture` \| `model3d` \| `animation` \| `font` \| `video` \| `other`. |
| `originalFilename` | Filename as published by the source. |
| `creator` | Creator/artist as published, or `"Fractured Flow"` for original work. |
| `sourceLibrary` | Library/pack name (e.g. "SONNISS GameAudioGDC 2026", "Kenney Sci-Fi Sounds"), or `"original"`. |
| `sourcePackId` | Optional: the `SRC-*` catalog id in `assets/CATALOG.json` this asset came from (e.g. `SRC-AUD-001`). The validator rejects unknown ids and imports from `reference-only` sources. |
| `sourceUrl` | Exact URL or durable source identifier; `null` if none exists (optional). |
| `license` | Exact license name/version (e.g. `CC0-1.0`, `CC-BY-4.0`, `SONNISS Royalty-Free`, `ZapSplat Standard (Basic)`). |
| `commercialUse` | `true`/`false` — commercial use permitted for this project. Must be `true` to ship. |
| `modificationAllowed` | `true`/`false` (ND-style limits noted in `notes`). |
| `attributionRequired` | `true`/`false`. |
| `attributionText` | Exact required attribution text, verbatim; `null` if not required. |
| `licenseEvidence` | Path under `assets/audio/licenses/` (or other references area) to the license text/snapshot/receipt; `null` only for well-known CC0 sources with `sourceUrl` recorded. |
| `purchaseRef` | Receipt/subscription reference and cost if paid; `null` if free. |
| `acquiredDate` | ISO date acquired/generated. |
| `fracturedFlowOriginal` | `true` if original creative work of the project (credited to Fractured Flow). |
| `generationSource` | Internal compliance record of the production tool/source when relevant (e.g. `"Suno"`); NEVER surfaced as a creative credit. `null` otherwise. |
| `masterSource` | Repo path (or reacquisition pointer) to the master/original file. Huge raw third-party libraries are NOT committed — record how to reacquire instead (see `reacquisition`). |
| `derivedFiles` | Array of repo paths to the game-ready derivatives actually shipped. |
| `processing` | Array of processing/transcoding steps applied (e.g. `"ffmpeg: wav -> ogg q5, loudnorm I=-16"`). |
| `targets` | Array: `"web"`, `"ios"`, or both. |
| `usedIn` | Array of in-game usage locations (e.g. `"Gate One identity #4 (transfer hatch), docs/16 §3"`). |
| `reacquisition` | Notes for reacquiring the original if the repo copy is lost (where, account needed, pack name, path inside pack). |
| `notes` | Anything else needed for compliance (share-alike obligations, ND caution, NC exclusions, etc.). |

## Import workflow (mandatory)

1. **Check the registry FIRST.** Before searching externally, search
   `REGISTRY.json` (by name, type, `usedIn`, `sourceLibrary`) — the asset or
   a suitable variant may already be here. This is the "don't dig every
   time" rule.
2. **Register before use.** A new asset gets its registry entry (all
   required fields) BEFORE its files are referenced by game code. An
   untracked asset must never be silently imported — the validator treats
   shipped-but-unregistered or registered-but-invalid assets as failures.
3. **Evidence in, bulk out.** Save license text/snapshot/receipt under the
   licenses area; do NOT commit huge raw third-party libraries. Commit only
   approved game-ready derivatives and, where sensible, small masters.
   Record reacquisition instructions instead of bulk data.
4. **Generate credits.** Run `node scripts/assets/registry.mjs credits`
   after any registry change; commit the regenerated outputs. Credits are
   never edited by hand, so they cannot drift from the registry.
5. **Validate.** `node scripts/assets/registry.mjs validate` must pass
   before pushing. It checks required fields, ID format/uniqueness,
   commercial-use compliance (no NC in a commercial release without
   separate permission recorded), attribution completeness, and that
   `derivedFiles` exist in the repo.

## Credit rules (from the protected Bible)

- Original creative work → credited to **Fractured Flow**; production tools
  (Suno, etc.) stay internal in `generationSource`.
- License-required third-party attribution is preserved EXACTLY and always
  overrides the creative-credit rule.
- No AI-product "generated-by" metadata anywhere player-facing.

## Scope

Repository infrastructure only. Nothing here changes game content or
unlocks narrative scope beyond what is separately authorised (Gate One).
