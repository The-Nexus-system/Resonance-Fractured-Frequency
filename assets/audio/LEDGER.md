# Resonance Audio Asset Ledger → superseded by the Master Asset Registry

This audio-only ledger has been integrated into the project-wide master
asset registry so there is exactly ONE source of truth for provenance,
licensing, and credits across audio, music, voices, graphics, textures,
3D models, animations, fonts, and video:

- **Registry (machine-readable):** `assets/REGISTRY.json`
- **Schema and import workflow:** `assets/REGISTRY_SCHEMA.md`
- **Tooling:** `node scripts/assets/registry.mjs validate | credits`
- **Generated credits:** `assets/generated/CREDITS.md` (never hand-edited)
- **License texts / receipts / permission evidence:** `assets/audio/licenses/`

No audio assets had been imported under this ledger before the migration,
so the registry starts empty and complete. All rules from
`docs/16_Audio_Source_License_Bible.md` (protected) continue to govern:
register before use, never silently import an untracked asset, preserve
required attribution exactly, Fractured Flow is the artist credit for
original creative work, and production tools are never creative credits.
