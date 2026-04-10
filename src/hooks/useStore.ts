import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { generateTerrain } from '../lib/terrain';

export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'stone' | 'sand' | 'cobblestone' | 'leaves' | 'stick';

export interface Block {
  key: string;
  pos: [number, number, number];
  texture: TextureType;
}

interface InventoryItem {
  type: TextureType;
  count: number;
}

interface GameState {
  texture: TextureType;
  cubes: Block[];
  inventory: InventoryItem[];
  craftingGrid: (TextureType | null)[];
  isInventoryOpen: boolean;
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
  setTexture: (texture: TextureType) => void;
  saveWorld: () => void;
  resetWorld: () => void;
  toggleInventory: () => void;
  addToInventory: (type: TextureType, count?: number) => void;
  removeFromInventory: (type: TextureType) => void;
  setCraftingSlot: (index: number, type: TextureType | null) => void;
  clearCraftingGrid: () => void;
}

const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  return JSON.parse(window.localStorage.getItem(key) || 'null');
};
const setLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const initialCubes = getLocalStorage('cubes');

export const useStore = create<GameState>((set) => ({
  texture: 'dirt',
  cubes: initialCubes && initialCubes.length > 0 ? initialCubes : generateTerrain(30),
  inventory: getLocalStorage('inventory') || [
    { type: 'dirt', count: 64 },
    { type: 'grass', count: 64 },
    { type: 'glass', count: 64 },
    { type: 'wood', count: 64 },
    { type: 'log', count: 64 },
    { type: 'stone', count: 64 },
    { type: 'sand', count: 64 },
    { type: 'cobblestone', count: 64 },
    { type: 'leaves', count: 64 },
  ],
  craftingGrid: [null, null, null, null],
  isInventoryOpen: false,
  addCube: (x, y, z) => {
    set((state) => {
      // Check if block already exists at this position
      if (state.cubes.some(cube => cube.pos[0] === x && cube.pos[1] === y && cube.pos[2] === z)) {
        return state;
      }
      
      // Check if we have the item in inventory
      const itemIndex = state.inventory.findIndex(item => item.type === state.texture);
      if (itemIndex === -1 || state.inventory[itemIndex].count <= 0) {
        return state;
      }

      const newInventory = [...state.inventory];
      newInventory[itemIndex] = { ...newInventory[itemIndex], count: newInventory[itemIndex].count - 1 };

      return {
        cubes: [
          ...state.cubes,
          {
            key: nanoid(),
            pos: [x, y, z],
            texture: state.texture,
          },
        ],
        inventory: newInventory
      };
    });
  },
  removeCube: (x, y, z) => {
    set((state) => {
      const cubeToRemove = state.cubes.find(cube => cube.pos[0] === x && cube.pos[1] === y && cube.pos[2] === z);
      if (!cubeToRemove) return state;

      // Add to inventory
      const newInventory = [...state.inventory];
      const itemIndex = newInventory.findIndex(item => item.type === cubeToRemove.texture);
      if (itemIndex !== -1) {
        newInventory[itemIndex] = { ...newInventory[itemIndex], count: Math.min(64, newInventory[itemIndex].count + 1) };
      } else {
        newInventory.push({ type: cubeToRemove.texture, count: 1 });
      }

      return {
        cubes: state.cubes.filter((cube) => {
          const [cx, cy, cz] = cube.pos;
          return cx !== x || cy !== y || cz !== z;
        }),
        inventory: newInventory
      };
    });
  },
  setTexture: (texture) => {
    set(() => ({
      texture,
    }));
  },
  saveWorld: () => {
    set((state) => {
      setLocalStorage('cubes', state.cubes);
      setLocalStorage('inventory', state.inventory);
      return state;
    });
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }));
  },
  toggleInventory: () => {
    set((state) => ({ isInventoryOpen: !state.isInventoryOpen }));
  },
  addToInventory: (type, count = 1) => {
    set((state) => {
      const newInventory = [...state.inventory];
      const itemIndex = newInventory.findIndex(item => item.type === type);
      if (itemIndex !== -1) {
        newInventory[itemIndex] = { ...newInventory[itemIndex], count: Math.min(64, newInventory[itemIndex].count + count) };
      } else {
        newInventory.push({ type, count });
      }
      return { inventory: newInventory };
    });
  },
  removeFromInventory: (type) => {
    set((state) => {
      const newInventory = [...state.inventory];
      const itemIndex = newInventory.findIndex(item => item.type === type);
      if (itemIndex !== -1 && newInventory[itemIndex].count > 0) {
        newInventory[itemIndex] = { ...newInventory[itemIndex], count: newInventory[itemIndex].count - 1 };
        if (newInventory[itemIndex].count === 0) {
          // Keep it in inventory but with 0 count? Or remove?
          // Let's keep it for UI consistency if it was there
        }
      }
      return { inventory: newInventory };
    });
  },
  setCraftingSlot: (index, type) => {
    set((state) => {
      const newGrid = [...state.craftingGrid];
      newGrid[index] = type;
      return { craftingGrid: newGrid };
    });
  },
  clearCraftingGrid: () => {
    set(() => ({ craftingGrid: [null, null, null, null] }));
  }
}));
