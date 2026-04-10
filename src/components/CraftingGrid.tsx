import { useStore, TextureType } from '../hooks/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useMemo } from 'react';

const images: Record<string, string> = {
  dirt: '🟫',
  grass: '🟩',
  glass: '💎',
  wood: '🪵',
  log: '🌲',
  stone: '🪨',
  sand: '⏳',
  cobblestone: '🧱',
  leaves: '🍃',
  stick: '🥢',
};

interface Recipe {
  input: (TextureType | null)[];
  output: { type: TextureType; count: number };
}

const RECIPES: Recipe[] = [
  {
    input: ['log', null, null, null],
    output: { type: 'wood', count: 4 },
  },
  {
    input: ['wood', null, 'wood', null],
    output: { type: 'stick', count: 4 },
  },
  {
    input: ['stone', 'stone', 'stone', 'stone'],
    output: { type: 'cobblestone', count: 4 },
  },
  {
    input: ['sand', null, null, null],
    output: { type: 'glass', count: 1 },
  },
  {
    input: ['grass', 'dirt', null, null],
    output: { type: 'leaves', count: 2 },
  },
];

export const CraftingGrid = () => {
  const { craftingGrid, setCraftingSlot, clearCraftingGrid, addToInventory, removeFromInventory, inventory } = useStore(useShallow((state) => ({
    craftingGrid: state.craftingGrid,
    setCraftingSlot: state.setCraftingSlot,
    clearCraftingGrid: state.clearCraftingGrid,
    addToInventory: state.addToInventory,
    removeFromInventory: state.removeFromInventory,
    inventory: state.inventory,
  })));

  const result = useMemo(() => {
    const recipe = RECIPES.find((r) => 
      r.input.every((val, index) => val === craftingGrid[index])
    );
    return recipe ? recipe.output : null;
  }, [craftingGrid]);

  const handleSlotClick = (index: number) => {
    const currentItem = craftingGrid[index];
    if (currentItem) {
      addToInventory(currentItem);
      setCraftingSlot(index, null);
    }
  };

  const handleInventoryItemClick = (type: TextureType) => {
    const emptyIndex = craftingGrid.findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      const invItem = inventory.find(i => i.type === type);
      if (invItem && invItem.count > 0) {
        removeFromInventory(type);
        setCraftingSlot(emptyIndex, type);
      }
    }
  };

  const handleCraft = () => {
    if (result) {
      addToInventory(result.type, result.count);
      clearCraftingGrid();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]">
      <div className="flex items-center gap-8">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1">
          {craftingGrid.map((slot, i) => (
            <div
              key={i}
              onClick={() => handleSlotClick(i)}
              className="w-12 h-12 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center cursor-pointer hover:bg-white/10"
            >
              {slot && <span className="text-2xl">{images[slot]}</span>}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="text-2xl text-[#373737]">➜</div>

        {/* Result Slot */}
        <div
          onClick={handleCraft}
          className={`w-16 h-16 bg-[#8b8b8b] border-4 ${result ? 'border-yellow-400' : 'border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]'} flex items-center justify-center relative cursor-pointer hover:bg-white/10`}
        >
          {result && (
            <>
              <span className="text-3xl">{images[result.type]}</span>
              <span className="absolute bottom-1 right-1 text-xs font-bold text-white drop-shadow-md">
                {result.count}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="text-[10px] text-[#373737] text-center max-w-[200px]">
        Click inventory items to add to grid. Click grid items to return. Click result to craft.
      </div>

      {/* Quick Inventory for Crafting */}
      <div className="grid grid-cols-5 gap-1 mt-2">
        {inventory.filter(i => i.count > 0).slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => handleInventoryItemClick(item.type)}
            className="w-10 h-10 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-white/10"
          >
            <span className="text-xl">{images[item.type]}</span>
            <span className="absolute bottom-0 right-0.5 text-[8px] font-bold text-white">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
