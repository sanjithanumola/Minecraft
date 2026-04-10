import { useBox } from '@react-three/cannon';
import { useState } from 'react';
import { useStore, TextureType } from '../hooks/useStore';

interface CubeProps {
  position: [number, number, number];
  texture: TextureType;
}

const textureColors: Record<TextureType, string> = {
  dirt: '#5d4037',
  grass: '#4caf50',
  glass: '#81d4fa',
  wood: '#795548',
  log: '#4e342e',
  stone: '#9e9e9e',
  sand: '#fff176',
  cobblestone: '#757575',
  leaves: '#2e7d32',
};

export const Cube = ({ position, texture }: CubeProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const [addCube, removeCube, activeTexture] = useStore((state) => [
    state.addCube,
    state.removeCube,
    state.texture,
  ]);

  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  return (
    <mesh
      ref={ref as any}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHover(Math.floor(e.faceIndex! / 2));
      }}
      onPointerOut={() => {
        setHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex! / 2);
        const { x, y, z } = ref.current!.position;
        
        if (e.button === 0) { // Left click - remove
          removeCube(x, y, z);
          return;
        }

        if (e.button === 2 || e.altKey) { // Right click - add
          if (clickedFace === 0) addCube(x + 1, y, z);
          else if (clickedFace === 1) addCube(x - 1, y, z);
          else if (clickedFace === 2) addCube(x, y + 1, z);
          else if (clickedFace === 3) addCube(x, y - 1, z);
          else if (clickedFace === 4) addCube(x, y, z + 1);
          else if (clickedFace === 5) addCube(x, y, z - 1);
        }
      }}
    >
      <boxGeometry />
      <meshStandardMaterial
        color={textureColors[texture]}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
        map={null} // We could add textures here
      />
    </mesh>
  );
};
