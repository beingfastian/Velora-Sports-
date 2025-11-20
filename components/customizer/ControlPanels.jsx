import React from 'react';
import { motion } from 'framer-motion';
import { Type, Upload, Eye, Save, RotateCcw } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

const fonts = [
  'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana',
  'Impact', 'Comic Sans MS', 'Trebuchet MS'
];

export function TextControlPanel({
  isOpen,
  activeProduct,
  customState,
  onUpdateState
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className="absolute top-12 bg-white p-2 rounded-xl shadow-2xl border-2 border-gray-100 p-5 w-[200px] max-h-96 overflow-y-auto z-50"
    >
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <Type className="w-5 h-5 mr-2" />
        Text Settings
      </h3>

      {/* Only Shirt Text Options */}
      <>
        {/* Front Text */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-800 mb-3">Front Text</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={customState.frontText || ''}
              onChange={(e) => onUpdateState({ frontText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter front text"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={customState.frontTextFont || 'Arial'}
                onChange={(e) => onUpdateState({ frontTextFont: e.target.value })}
                className="px-2 py-2 border rounded-lg text-xs"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <input
                type="color"
                value={customState.frontTextColor || '#000000'}
                onChange={(e) => onUpdateState({ frontTextColor: e.target.value })}
                className="w-full h-10 border rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Back Text */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Back Text</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={customState.backText || ''}
              onChange={(e) => onUpdateState({ backText: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Enter back text"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={customState.backTextFont || 'Arial'}
                onChange={(e) => onUpdateState({ backTextFont: e.target.value })}
                className="px-2 py-2 border rounded-lg text-xs"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <input
                type="color"
                value={customState.backTextColor || '#000000'}
                onChange={(e) => onUpdateState({ backTextColor: e.target.value })}
                className="w-full h-10 border rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </>
    </motion.div>
  );
}


export function LogoUploadPanel({
  isOpen,
  customState,
  onFileUpload
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className="absolute top-12 bg-white p-2 rounded-xl shadow-2xl border-2 border-gray-100 p-5 w-[200px] max-h-96 overflow-y-auto z-50"
    >
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Logo Upload
      </h3>

      <div className="space-y-4">
        {/* Left Chest */}
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">Left Chest</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload('leftChest', e)}
            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer"
          />
          {customState.isLeftChestLogo && (
            <div className="mt-2 text-xs text-green-600">✓ Uploaded</div>
          )}
        </div>

        {/* Main Chest */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Main Chest</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload('mainChest', e)}
            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer cursor-pointer"
          />
          {customState.isMainChestLogo && (
            <div className="mt-2 text-xs text-green-600">✓ Uploaded</div>
          )}
        </div>

        {/* Right Chest */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Right Chest</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload('rightChest', e)}
            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600 file:cursor-pointer cursor-pointer"
          />
          {customState.isRightChestLogo && (
            <div className="mt-2 text-xs text-green-600">✓ Uploaded</div>
          )}
        </div>

        {/* Full Back */}
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Full Back</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload('fullBack', e)}
            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600 file:cursor-pointer cursor-pointer"
          />
          {customState.isFullBackLogo && (
            <div className="mt-2 text-xs text-green-600">✓ Uploaded</div>
          )}
        </div>

        {/* Full Pattern */}
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">Full Pattern</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload('fullPattern', e)}
            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 file:cursor-pointer cursor-pointer"
          />
          {customState.isFullTexture && (
            <div className="mt-2 text-xs text-green-600">✓ Uploaded</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function VisibilityPanel({
  isOpen,
  activeProduct,
  customState,
  onToggleElement
}) {
  if (!isOpen) return null;

  const getVisibilityOptions = () => {
    if (activeProduct === 'shirt') {
      return [
        { key: 'isFrontText', label: 'Front Text' },
        { key: 'isBackText', label: 'Back Text' },
        { key: 'isLeftChestLogo', label: 'Left Chest Logo' },
        { key: 'isMainChestLogo', label: 'Main Chest Logo' },
        { key: 'isRightChestLogo', label: 'Right Chest Logo' },
        { key: 'isFullBackLogo', label: 'Full Back Logo' },
        { key: 'isFullTexture', label: 'Full Pattern' },
      ];
    }
    // Note: You can expand this for 'trouser'/'shoe' if they get visibility options later
    return [
      { key: 'isRightLegText', label: 'Right Leg Text' },
      { key: 'isLeftLegText', label: 'Left Leg Text' },
      { key: 'isRightLegLogo', label: 'Right Leg Logo' },
      { key: 'isLeftLegLogo', label: 'Left Leg Logo' },
      { key: 'isRightPocketLogo', label: 'Right Pocket Logo' },
      { key: 'isLeftPocketLogo', label: 'Left Pocket Logo' },
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className="absolute top-12 bg-white p-2 rounded-xl shadow-2xl border-2 border-gray-100 p-4 w-[200px] z-50"
    >
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Show/Hide Elements
      </h3>

      <div className="space-y-2">
        {getVisibilityOptions().map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onToggleElement(key)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${customState[key]
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {customState[key] ? '✓ ' : '○ '}{label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function ControlSidebar({
  activeProduct,
  activePopup,
  onSetActivePopup,
  customState,
  onUpdateState,
  onFileUpload,
  onToggleElement,
  onDownload,
  onReset,
  onAddToCart
}) {
  
  //  CSS-in-JS for the gradient to bypass Tailwind compilation issues
  const gradientStyle = {
    background: 'linear-gradient(to right, #f97316, #ef4444)' // This is orange-500 to red-500
  };

  // 🚫 For trouser & shoes → only cart button
  if (activeProduct === "trouser" || activeProduct === "shoe") {
    return (
      <div className="absolute bottom-20 right-4 z-20">
        <button
          onClick={onAddToCart}
          // ✅ FIXED: Using inline style for the gradient
          style={gradientStyle}
          // ✅ REMOVED: bg-gradient-to-r, from-orange-500, to-red-500
          className="flex flex-col items-center text-white px-5 py-4 rounded-2xl shadow-xl border-2 border-white hover:shadow-orange-400 hover:scale-105 transition-all"
        >
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="text-sm font-semibold">Add to Cart</span>
        </button>
      </div>
    );
  }

  // 🧥 For shirt → keep full sidebar controls
  return (
    <div className="absolute top-20 left-0 bottom-0 w-20 z-20 bg-white shadow-sm border-r pt-16">
      <div className="flex flex-col items-center py-4 space-y-4">

        {/* Text Button */}
        <div className="relative">
          <button
            onClick={() => onSetActivePopup(activePopup === "text" ? "" : "text")}
            className={`w-12 h-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center text-lg font-bold border-2 ${activePopup === "text"
                ? "bg-blue-500 text-white shadow-blue-300 border-blue-400"
                : "bg-white text-blue-600 hover:bg-blue-50 border-blue-200 hover:border-blue-400"
              }`}
            title="Text Controls"
          >
            <Type className="w-5 h-5" />
          </button>

          <TextControlPanel
            isOpen={activePopup === "text"}
            activeProduct={activeProduct}
            customState={customState}
            onUpdateState={onUpdateState}
          />
        </div>

        {/* Logo (only shirt) */}
        <div className="relative">
          <button
            onClick={() => onSetActivePopup(activePopup === "logo" ? "" : "logo")}
            className={`w-12 h-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center border-2 ${activePopup === "logo"
                ? "bg-purple-500 text-white shadow-purple-300 border-purple-400"
                : "bg-white text-purple-600 hover:bg-purple-50 border-purple-200 hover:border-purple-400"
              }`}
            title="Logo Upload"
          >
            <Upload className="w-5 h-5" />
          </button>

          <LogoUploadPanel
            isOpen={activePopup === "logo"}
            customState={customState}
            onFileUpload={onFileUpload}
          />
        </div>

        {/* Visibility */}
        <div className="relative">
          <button
            onClick={() => onSetActivePopup(activePopup === "visibility" ? "" : "visibility")}
            className={`w-12 h-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center border-2 ${activePopup === "visibility"
                ? "bg-green-500 text-white shadow-green-300 border-green-400"
                : "bg-white text-green-600 hover:bg-green-50 border-green-200 hover:border-green-400"
              }`}
            title="Show/Hide Elements"
          >
            <Eye className="w-5 h-5" />
          </button>

          <VisibilityPanel
            isOpen={activePopup === "visibility"}
            activeProduct={activeProduct}
            customState={customState}
            onToggleElement={onToggleElement}
          />
        </div>

        {/* Cart Button */}
        <button
          onClick={onAddToCart}
          // ✅ FIXED: Using inline style for the gradient
          style={gradientStyle}
          // ✅ REMOVED: bg-gradient-to-r, from-orange-500, to-red-500
          className="w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center text-white hover:shadow-xl transform hover:scale-105 border-2 border-white"
          title="Add to Cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}