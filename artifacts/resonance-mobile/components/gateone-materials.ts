/**
 * Authored, deterministic industrial paint/grit for Gate One hard surfaces.
 *
 * These small procedural albedo maps provide micro-wear, inspection stripes
 * and layered repairs without image-generation artifacts, runtime downloads,
 * or a second media licence. Repeated uniformly; no flickering or motion.
 * Not a substitute for scanned PBR textures or hand-authored meshes.
 */
import * as THREE from 'three';

type Finish = 'hull' | 'deck' | 'repair';
function textureFor(finish: Finish): THREE.DataTexture {
  const side = 96;
  const pixels = new Uint8Array(side * side * 4);
  const salt = finish === 'hull' ? 1937 : finish === 'deck' ? 3791 : 7129;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      // Two deterministic grain frequencies: paint variation and fine tooling.
      let h = (Math.imul(x + salt, 374761393) ^ Math.imul(y + salt, 668265263)) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      h = (h ^ (h >>> 16)) >>> 0;
      const grain = (h % 23) - 11;
      const tool = ((x * 5 + y * 2 + salt) % 29) < 2 ? -15 : 0;
      const plateEdge = finish === 'deck'
        ? (y % 47 === 0 || y % 47 === 1 ? -32 : 0)
        : finish === 'repair'
          ? ((x % 52 === 0 || y % 51 === 0) ? -23 : 0)
          : ((x % 68 === 0) ? -18 : 0);
      const scrape = ((x * 31 + y * 7 + salt) % 197) < 3 ? 10 : 0;
      const base = finish === 'repair' ? 194 : finish === 'deck' ? 213 : 220;
      const value = Math.max(110, Math.min(255, base + grain + tool + plateEdge + scrape));
      const i = (y * side + x) * 4;
      pixels[i] = value;
      pixels[i + 1] = Math.min(255, value + 2);
      pixels[i + 2] = Math.min(255, value + 3);
      pixels[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(pixels, side, side, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(finish === 'deck' ? 4 : 3, finish === 'deck' ? 4 : 3);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export const GATE_ONE_FINISH = {
  hull: textureFor('hull'),
  deck: textureFor('deck'),
  repair: textureFor('repair'),
} as const;
