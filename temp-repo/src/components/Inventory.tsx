import { useStore, TextureType } from '../hooks/useStore';
import { motion, AnimatePresence } from 'motion/react';

const images: Record<TextureType, string> = {
  dirt: '🟫',
  grass: '🟩',
  glass: '💎',
  wood: '🪵',
  log: '🌲',
  stone: '🪨',
  sand: '⏳',
  cobblestone: '🧱',
  leaves: '🍃',
};

export const Inventory = () => {
  const [isInventoryOpen, toggleInventory, inventory, setTexture] = useStore((state) => [
    state.isInventoryOpen,
    state.toggleInventory,
    state.inventory,
    state.setTexture,
  ]);

  if (!isInventoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#c6c6c6] p-4 border-4 border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] shadow-2xl font-pixel"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-[#373737]">Inventory</h2>
          <button
            onClick={toggleInventory}
            className="w-8 h-8 bg-[#c6c6c6] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] active:border-t-[#555555] active:border-l-[#555555] active:border-b-[#ffffff] active:border-r-[#ffffff]"
          >
            X
          </button>
        </div>

        <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1 border-2 border-b-[#ffffff] border-r-[#ffffff] border-t-[#373737] border-l-[#373737]">
          {inventory.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setTexture(item.type);
                toggleInventory();
              }}
              className="w-12 h-12 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-white/10"
            >
              <span className="text-2xl">{images[item.type]}</span>
              <span className="absolute bottom-0 right-0.5 text-xs font-bold text-white drop-shadow-md">
                {item.count}
              </span>
            </div>
          ))}
          {Array.from({ length: 27 - inventory.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-12 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]"
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm text-[#373737] font-medium">Click an item to select it for your hotbar.</p>
        </div>
      </motion.div>
    </div>
  );
};
