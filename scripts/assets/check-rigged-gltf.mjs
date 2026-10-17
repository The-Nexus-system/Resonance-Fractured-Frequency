#!/usr/bin/env node
/**
 * Static GLB verifier. Checks actual skinned mesh + animation data in the
 * shipped-format binary, without a GPU, Replit, browser, or 3D cloud service.
 *
 * Usage: node scripts/assets/check-rigged-gltf.mjs path/to/character.glb
 * Designed to fail early before we put bad image-to-3D exports into the game.
 */
import { readFileSync } from 'node:fs';

function verify(filename) {
  const data = readFileSync(filename);
  if (data.length < 20 || data.toString('ascii', 0, 4) !== 'glTF') throw Error('Not a GLB file');
  const version = data.readUInt32LE(4);
  if (version !== 2) throw Error('GLB must be glTF 2.0');
  if (data.readUInt32LE(8) !== data.length) throw Error('GLB header file length mismatch');

  let offset = 12, json = null, binarySize = 0;
  while (offset + 8 <= data.length) {
    const chunkSize = data.readUInt32LE(offset);
    const type = data.readUInt32LE(offset + 4);
    offset += 8;
    if (offset + chunkSize > data.length) throw Error('GLB chunk overflow');
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8', offset, offset + chunkSize));
    if (type === 0x004e4942) binarySize += chunkSize;
    offset += chunkSize;
  }
  if (offset !== data.length) throw Error('GLB unaligned/trailing data');
  if (!json || !Array.isArray(json.meshes) || json.meshes.length === 0) throw Error('No mesh geometry');
  if (!json.skins?.length || !json.skins.some(s => (s.joints?.length ?? 0) >= 2))
    throw Error('No humanoid-compatible skinned joint chain');
  if (!json.nodes?.some(n => typeof n.skin === 'number'))
    throw Error('No skinned mesh node');
  if (!json.animations?.length || !json.animations.some(a => a.channels?.length && a.samplers?.length))
    throw Error('No skeletal animation channels');
  if (!binarySize) throw Error('No geometry buffer');

  const skins = json.skins.map(s => ({ jointCount: s.joints?.length ?? 0 }));
  const clips = json.animations.map(a => a.name || '(unnamed)').slice(0, 40);
  console.log(JSON.stringify({
    file: filename, bytes: data.length, meshes: json.meshes.length,
    skins, clips, binaryBytes: binarySize,
  }, null, 2));
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/assets/check-rigged-gltf.mjs file.glb [file2.glb ...]');
  process.exit(2);
}
try {
  for (const f of files) verify(f);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
