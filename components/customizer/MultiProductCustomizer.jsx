"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, RotateCcw, Shirt, Package } from 'lucide-react';

// Import modular components
import { Canvas3D } from './Canvas3D';
import { ProductSlider } from './ProductSlider';
import { ColorPicker } from './ColorPicker';
import { ControlSidebar } from './ControlPanels';

export default function MultiProductCustomizer({ isOpen = false, onClose = () => {} }) {
  const [mounted, setMounted] = useState(false);
  const [activePopup, setActivePopup] = useState('');
  const [activeProduct, setActiveProduct] = useState('shirt');

  // Removed hat option from products array
  const products = [
    { 
      id: 'shirt', 
      name: 'T-Shirt', 
      icon: Shirt,
      color: '#3B82F6'
    },
    { 
      id: 'trouser', 
      name: 'Trouser', 
      icon: Package,
      color: '#8B5CF6'
    },
    { 
      id: 'shoe', 
      name: 'Shoe', 
      icon: Package,
      color: '#F59E0B'
    }
  ];

  const getDefaultState = (productType) => {
    const baseState = {
      intro: true,
      color: productType === 'trouser' ? '#2563EB' : 
             productType === 'shoe' ? '#1F2937' : '#EFBD48',
    };

    switch(productType) {
      case 'shirt':
        return {
          ...baseState,
          isFullTexture: false,
          isLeftChestLogo: false,
          isMainChestLogo: false,
          isRightChestLogo: false,
          isFullBackLogo: false,
          isFrontText: true,
          isBackText: true,
          leftChestDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          mainChestDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          rightChestDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          fullBackDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          fullDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          frontText: 'FRONT',
          backText: 'BACK',
          frontTextFont: 'Arial',
          backTextFont: 'Arial',
          frontTextColor: '#000000',
          backTextColor: '#000000',
          frontTextSize: 60,
          backTextSize: 60
        };
      case 'trouser':
        return {
          ...baseState,
          isRightLegText: true,
          isLeftLegText: true,
          rightLegDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          leftLegDecal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
          rightLegText: 'RIGHT',
          leftLegText: 'LEFT',
          rightLegTextFont: 'Arial',
          leftLegTextFont: 'Arial',
          rightLegTextColor: '#FFFFFF',
          leftLegTextColor: '#FFFFFF',
        };
      default:
        return baseState;
    }
  };

  const [customState, setCustomState] = useState(() => getDefaultState('shirt'));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCustomState(prev => ({ ...prev, intro: false }));
    }
  }, [isOpen]);

  const updateState = (updates) => {
    setCustomState(prev => ({ ...prev, ...updates }));
  };

  const switchProduct = (productId) => {
    setActiveProduct(productId);
    setCustomState(getDefaultState(productId));
    setActivePopup('');
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        if (activeProduct === 'shirt') {
          switch(type) {
            case 'leftChest':
              updateState({ leftChestDecal: imageUrl, isLeftChestLogo: true });
              break;
            case 'mainChest':
              updateState({ mainChestDecal: imageUrl, isMainChestLogo: true });
              break;
            case 'rightChest':
              updateState({ rightChestDecal: imageUrl, isRightChestLogo: true });
              break;
            case 'fullBack':
              updateState({ fullBackDecal: imageUrl, isFullBackLogo: true });
              break;
            case 'fullPattern':
              updateState({ fullDecal: imageUrl, isFullTexture: true });
              break;
          }
        } else if (activeProduct === 'trouser') {
          switch(type) {
            case 'rightLeg':
              updateState({ rightLegDecal: imageUrl });
              break;
            case 'leftLeg':
              updateState({ leftLegDecal: imageUrl });
              break;
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const toggleElement = (element) => {
    updateState({ [element]: !customState[element] });
  };

  const downloadCanvas = () => {
    if (typeof window === 'undefined') return;
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `custom-${activeProduct}-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetToDefaults = () => {
    setCustomState(getDefaultState(activeProduct));
    setActivePopup('');
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="h-full w-full relative"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-800">3D Designer Studio</h1>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">Color:</div>
                  <ColorPicker
                    isOpen={activePopup === 'colorPicker'}
                    currentColor={customState.color}
                    onColorChange={(color) => updateState({ color })}
                    onToggle={() => setActivePopup(activePopup === 'colorPicker' ? '' : 'colorPicker')}
                    activeProduct={activeProduct}
                  />
                  
                  <button
                    onClick={onClose}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors ml-4"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Control Sidebar */}
            <ControlSidebar
              activeProduct={activeProduct}
              activePopup={activePopup}
              onSetActivePopup={setActivePopup}
              customState={customState}
              onUpdateState={updateState}
              onFileUpload={handleFileUpload}
              onToggleElement={toggleElement}
              onDownload={downloadCanvas}
              onReset={resetToDefaults}
            />

            {/* 3D Canvas */}
            <div className={`relative h-[50%] w-full pt-16 pb-16 ${(activeProduct === 'shirt' || activeProduct === 'trouser') ? 'pl-20' : ''} z-10`}>
              <Canvas3D activeProduct={activeProduct} customState={customState} />
            


  <ProductSlider
    activeProduct={activeProduct}
    onProductChange={switchProduct}
    products={products}
  />
</div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}