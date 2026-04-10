import { createNoise2D } from 'simplex-noise';
import { nanoid } from 'nanoid';
import { Block, TextureType } from '../hooks/useStore';

const noise2D = createNoise2D();

export const generateTerrain = (size: number = 40): Block[] => {
  const cubes: Block[] = [];
  const seed = Math.random();

  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      // Simplex noise for height
      const h = Math.floor(noise2D(x / 20, z / 20) * 5) + 5;

      for (let y = 0; y <= h; y++) {
        let texture: TextureType = 'dirt';
        if (y === h) {
          texture = 'grass';
          if (h < 3) texture = 'sand';
        } else if (y < h - 3) {
          texture = 'stone';
        }

        cubes.push({
          key: nanoid(),
          pos: [x, y, z],
          texture,
        });
      }

      // Random trees
      if (Math.random() > 0.98 && h >= 3) {
        const treeHeight = 4 + Math.floor(Math.random() * 3);
        for (let ty = 1; ty <= treeHeight; ty++) {
          cubes.push({
            key: nanoid(),
            pos: [x, h + ty, z],
            texture: 'log',
          });
        }
        // Leaves
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 0; ly <= 2; ly++) {
              if (Math.abs(lx) + Math.abs(ly) + Math.abs(lz) < 4) {
                cubes.push({
                  key: nanoid(),
                  pos: [x + lx, h + treeHeight + ly, z + lz],
                  texture: 'leaves',
                });
              }
            }
          }
        }
      }
    }
  }

  return cubes;
};
