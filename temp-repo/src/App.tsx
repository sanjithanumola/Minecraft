import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Cubes } from './components/Cubes';
import { Player } from './components/Player';
import { FPV } from './components/FPV';
import { TextureSelector } from './components/TextureSelector';
import { Inventory } from './components/Inventory';
import { HUD } from './components/HUD';
import { useStore } from './hooks/useStore';
import { useEffect } from 'react';

export default function App() {
  const [toggleInventory, isInventoryOpen] = useStore((state) => [
    state.toggleInventory,
    state.isInventoryOpen,
  ]);

  // Handle inventory toggle from keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        toggleInventory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleInventory]);

  return (
    <div className="w-full h-screen bg-sky-400 overflow-hidden">
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 100, 20]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <Cubes />
        </Physics>
        
        <FPV />
      </Canvas>

      <HUD />
      <TextureSelector />
      <Inventory />

      {/* Initial Help Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/20 p-8 rounded-xl text-white text-center animate-pulse font-pixel">
          <h1 className="text-2xl font-bold mb-4">VoxelCraft 3D</h1>
          <p className="text-sm">Click anywhere to start</p>
        </div>
      </div>
    </div>
  );
}
