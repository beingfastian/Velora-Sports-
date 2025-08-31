"use client";

import { useCustomizerStore } from '../store/customizerStore';
import { Upload, Image, Layers } from 'lucide-react';

export default function LogoControls({ isOpen }) {
  const [snap, setState] = useCustomizerStore();

  if (!isOpen) return null;

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        if (type === 'front') {
          setState({ frontLogoDecal: imageUrl });
        } else if (type === 'back') {
          setState({ backLogoDecal: imageUrl });
        } else if (type === 'full') {
          setState({ fullDecal: imageUrl, isFullTexture: true });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = (type, axis, delta) => {
    const positionKey = type === 'front' ? 'frontLogoPosition' : 'backLogoPosition';
    const newPosition = [...snap[positionKey]];
    newPosition[axis] = Math.max(-1, Math.min(1, newPosition[axis] + delta));
    setState({ [positionKey]: newPosition });
  };

  const handleScaleChange = (type, delta) => {
    const scaleKey = type === 'front' ? 'frontLogoScale' : 'backLogoScale';
    const newScale = Math.max(0.05, Math.min(0.5, snap[scaleKey] + delta));
    setState({ [scaleKey]: newScale });
  };

  return (
    <div className="absolute left-full ml-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Logo & Images</h3>
        
        {/* Upload Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center mb-3">
              <Upload className="w-4 h-4 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-800">Upload Images</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  Front Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('front', e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  Back Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('back', e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Layers className="w-4 h-4 inline mr-1" />
                  Full Pattern
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('full', e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Front Logo Controls */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">Front Logo Position</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Left/Right</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePositionChange('front', 0, -0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    ←
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.frontLogoPosition[0].toFixed(1)}
                  </div>
                  <button
                    onClick={() => handlePositionChange('front', 0, 0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Up/Down</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePositionChange('front', 1, -0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    ↓
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.frontLogoPosition[1].toFixed(1)}
                  </div>
                  <button
                    onClick={() => handlePositionChange('front', 1, 0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Size</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleScaleChange('front', -0.02)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    -
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.frontLogoScale.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleScaleChange('front', 0.02)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Logo Controls */}
        <div className="space-y-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">Back Logo Position</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Left/Right</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePositionChange('back', 0, -0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    ←
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.backLogoPosition[0].toFixed(1)}
                  </div>
                  <button
                    onClick={() => handlePositionChange('back', 0, 0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Up/Down</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePositionChange('back', 1, -0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    ↓
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.backLogoPosition[1].toFixed(1)}
                  </div>
                  <button
                    onClick={() => handlePositionChange('back', 1, 0.05)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Size</div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleScaleChange('back', -0.02)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l text-xs"
                  >
                    -
                  </button>
                  <div className="px-2 py-1 bg-gray-100 text-xs flex-1 text-center min-w-12">
                    {snap.backLogoScale.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleScaleChange('back', 0.02)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Front Logo:</span>
              <span className={snap.isFrontLogoTexture ? 'text-green-600' : 'text-red-600'}>
                {snap.isFrontLogoTexture ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Back Logo:</span>
              <span className={snap.isBackLogoTexture ? 'text-green-600' : 'text-red-600'}>
                {snap.isBackLogoTexture ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Full Pattern:</span>
              <span className={snap.isFullTexture ? 'text-green-600' : 'text-red-600'}>
                {snap.isFullTexture ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}