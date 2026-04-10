import { createNoise2D } from 'simplex-noise';
import { nanoid } from 'nanoid';
import { Block, TextureType } from '../hooks/useStore';

const noise2D = createNoise2D();

export const generateTerrain = (size: number = 48): Block[] => {
  const cubes: Block[] = [];

  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      // Simplex noise for height
      const noiseValue = noise2D(x / 30, z / 30);
      const h = Math.floor(noiseValue * 8) + 10;

      for (let y = 0; y <= h; y++) {
        let texture: TextureType = 'dirt';
        
        if (y === h) {
          texture = 'grass';
          if (h < 8) texture = 'sand';
        } else if (y < h - 4) {
          texture = 'stone';
        } else if (y < h) {
          texture = 'dirt';
        }

        cubes.push({
          key: nanoid(),
          pos: [x, y, z],
          texture,
        });
      }

      // Random trees
      if (Math.random() > 0.985 && h >= 8) {
        const treeHeight = 5 + Math.floor(Math.random() * 3);
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
              const distance = Math.sqrt(lx * lx + ly * ly + lz * lz);
              if (distance < 2.5) {
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
