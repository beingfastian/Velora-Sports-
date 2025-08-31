"use client";

import { SketchPicker } from 'react-color';
import { useCustomizerStore } from '../store/customizerStore';

export default function ColorPicker({ isOpen }) {
  const [snap, setState] = useCustomizerStore();

  if (!isOpen) return null;

  const handleColorChange = (color) => {
    setState({ color: color.hex });
  };

  const presetColors = [
    '#EFBD48', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471',
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'
  ];

  return (
    <div className="absolute left-full ml-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border p-4 min-w-80">
        <h3 className="font-semibold text-gray-800 mb-3">Choose Shirt Color</h3>
        
        {/* Color Picker */}
        <div className="mb-4">
          <SketchPicker
            color={snap.color}
            disableAlpha
            onChange={handleColorChange}
            width="260px"
          />
        </div>

        {/* Preset Colors */}
        <div className="border-t pt-3">
          <div className="text-sm text-gray-600 mb-2">Quick Colors:</div>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange({ hex: color })}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  snap.color === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Current Color Info */}
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-500">
            Current: <span className="font-mono">{snap.color}</span>
          </div>
        </div>
      </div>
    </div>
  );
}