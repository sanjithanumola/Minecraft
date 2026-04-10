import { useStore } from '../hooks/useStore';

export const HUD = () => {
  const [cubes] = useStore((state) => [state.cubes]);

  return (
    <>
      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-4 h-0.5 bg-white/80" />
        <div className="h-4 w-0.5 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Stats */}
      <div className="fixed top-4 left-4 p-3 bg-black/40 backdrop-blur-sm rounded text-white font-pixel text-[10px] z-10 space-y-2">
        <div>
          <p>Blocks: {cubes.length}</p>
          <p>FPS: {Math.round(60)}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => useStore.getState().saveWorld()}
            className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded pointer-events-auto cursor-pointer"
          >
            Save
          </button>
          <button 
            onClick={() => {
              useStore.getState().resetWorld();
              window.location.reload();
            }}
            className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded pointer-events-auto cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded text-white font-pixel text-[8px] z-10 space-y-2">
        <p>WASD: Move</p>
        <p>SPACE: Jump</p>
        <p>SHIFT: Sprint</p>
        <p>E: Inventory</p>
        <p>L-CLICK: Destroy</p>
        <p>R-CLICK: Place</p>
        <p>1-9: Quick Select</p>
      </div>
    </>
  );
};
