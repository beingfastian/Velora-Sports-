import React from 'react';
import { motion } from 'framer-motion';

export function ColorPicker({ 
  isOpen, 
  currentColor, 
  onColorChange, 
  onToggle, 
  activeProduct 
}) {
  const getColorPalette = () => {
    if (activeProduct === 'trouser') {
      return ['#2563EB', '#1F2937', '#059669', '#7C2D12', '#4C1D95', '#BE123C',
              '#0F172A', '#374151', '#0D9488', '#92400E', '#5B21B6', '#BE185D',
              '#000000', '#FFFFFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    }
    return ['#EFBD48', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471',
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all hover:scale-105 shadow-md"
        style={{ backgroundColor: currentColor }}
        title={`Click to change ${activeProduct} color`}
      />
      
      {/* Color Picker Popup */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute top-12 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 p-4 min-w-[280px] z-50"
        >
          <div className="grid grid-cols-6 gap-2">
            {getColorPalette().map((color) => (
              <motion.button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 shadow-sm ${
                  currentColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}