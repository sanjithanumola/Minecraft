import { useEffect, useState } from 'react';
import { useStore, TextureType } from '../hooks/useStore';
import { useKeyboard } from '../hooks/useKeyboard';

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

export const TextureSelector = () => {
  const [visible, setVisible] = useState(false);
  const [activeTexture, setTexture] = useStore((state) => [state.texture, state.setTexture]);
  const { dirt, grass, glass, wood, log, stone, sand, cobblestone, leaves } = useKeyboard();

  useEffect(() => {
    const textures: Record<string, boolean> = {
      dirt, grass, glass, wood, log, stone, sand, cobblestone, leaves
    };
    const pressedTexture = Object.entries(textures).find(([k, v]) => v);
    if (pressedTexture) {
      setTexture(pressedTexture[0] as TextureType);
    }
  }, [setTexture, dirt, grass, glass, wood, log, stone, sand, cobblestone, leaves]);

  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setVisible(false);
    }, 2000);
    setVisible(true);
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [activeTexture]);

  return (
    <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-50'}`}>
      {Object.entries(images).map(([k, src]) => (
        <div
          key={k}
          className={`w-12 h-12 flex items-center justify-center text-2xl rounded border-2 transition-all ${
            k === activeTexture ? 'border-white scale-110 bg-white/20' : 'border-transparent'
          }`}
        >
          {src}
        </div>
      ))}
    </div>
  );
};
