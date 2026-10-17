# Gate One — rigged character import and art approval

This is the implementation handoff. The protected semantic gameplay engine
owns positions, narrative triggers, audio, captions and haptics. Models are
presentation only.

## Implemented

- The browser Gate One scene can load real skinned glTF/GLB characters and
  skeletal animation clips. It uses the existing NPC snapshot and scales to
  actual metre height; independent characters have cloned bone rigs.
- During downloading or on rendering failure the original geometric NPC
  remains, preserving navigation and semantic presence.
- The shipping APPROVED_NPC_MODELS manifest in
  artifacts/resonance/src/components/gateone-animated-character.tsx is EMPTY.
  No generated or test figure is silently shipped as a canonical character.
- The small Khronos RiggedFigure test GLB is in
  artifacts/resonance/public/models/gateone/fixtures/RiggedFigure.glb.
  It is a plain CC-BY technical fixture, not final visual art.
  A web DEVELOPMENT ONLY query flag gateoneRigTest=1 shows the figure in
  place of worker1 to exercise the actual loader and mixer.
- Verify imported character skeletons and clips with:
  node scripts/assets/check-rigged-gltf.mjs <path-to-file.glb>

## Image to rigged character to finished game

1. Use an original or rights-cleared character picture; obtain front, side
   and ideally rear views, at a consistent scale and in A-pose or T-pose.
   Respect locked identity and visual design; do not invent a person's
   physical or cultural traits.
2. Generate a 3D reconstruction (e.g. Meshy image-to-3D) or download a
   licensed existing model. A video moving a still photo is NOT usable 3D.
3. Check hands, shoulders, joints, face, eyes, shoes, clothing, back, hair
   and texture. Correct distortions and repetitive AI-looking anatomy in an
   actual modeling editor instead of hiding flaws with camera placement.
4. Add a skeleton and joint weights; animate Idle, Walk, Start, Stop and
   turns with real weight transfer. Add expressions and specialized motion
   only with the character bible and subject-matter review. Do not substitute
   generic waving for sign language.
5. Export a self-contained GLB with named skeletal clips, PBR maps,
   metres/Y-up and a documented forward direction. Root motion must never
   take over the engine's player or NPC coordinates.
6. Record exact source and permission in assets/REGISTRY.json. If generated
   through a paid service, preserve task/source identifiers, commercial
   terms and a durable copy of the exported files.
7. Verify the model in-game from all directions with lighting and shadows.
   Check LOD, texture memory, GPU costs and the optional nonvisual equivalents.
8. Only after art, licence and technical approval activate the appropriate
   character ID in APPROVED_NPC_MODELS. The same engine state continues to
   drive the 3D avatar and its navigation/audio counterparts.
9. Export a suitable USD/USDZ asset for Apple's RealityKit as necessary;
   test rigs, animation and real-world AR occlusion on real devices. Passing
   web tests is not proof of native AR character fidelity.

## Where to source assets

- Meshy provides image-to-3D and rigged GLB outputs; its published cookbook
  documents the A-pose, remeshing, skeleton and walking/running steps.
- Poly Haven and ambientCG are catalogued for CC0 physical materials and
  props, not for inventing human anatomy.
- Licensed rigged models, animation packs and photogrammetry can be sourced
  from specialist asset marketplaces; verify terms for each actual download.
- Never embed expiring remote links, unauthorised reproductions, or opaque
  vendor output as final-game dependencies. Keep model bytes and source rights.

## Status

The browser loader and isolated skeleton test sample are in GitHub.
Production-quality character meshes, facial rigs, animations, native
character-loading parity and device QA are NOT completed by these changes.
