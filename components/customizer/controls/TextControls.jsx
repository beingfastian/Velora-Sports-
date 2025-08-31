"use client";

import { useCustomizerStore } from '../store/customizerStore';

const fonts = [
  "Arial", "Times New Roman", "Segoe UI", "Tahoma", "Calibri", "Helvetica", 
  "Georgia", "Verdana", "Impact", "Comic Sans MS", "Trebuchet MS", "Palatino"
];

export default function TextControls({ isOpen }) {
  const [snap, setState] = useCustomizerStore();

  if (!isOpen) return null;

  const handleTextChange = (type, value) => {
    setState({
      [type === 'front' ? 'frontText' : 'backText']: value
    });
  };

  const handlePositionChange = (type, axis, delta) => {
    const positionKey = type === 'front' ? 'frontTextPosition' : 'backTextPosition';
    const newPosition = [...snap[positionKey]];
    newPosition[axis] = Math.max(-1, Math.min(1, newPosition[axis] + delta));
    setState({ [positionKey]: newPosition });
  };

  const handleScaleChange = (type, delta) => {
    const scaleKey = type === 'front' ? 'frontTextScale' : 'backTextScale';
    const currentScale = snap[scaleKey][0]; // Uniform scaling
    const newScale = Math.max(0.05, Math.min(0.5, currentScale + delta));
    setState({ [scaleKey]: [newScale, newScale, newScale] });
  };

  const handleColorChange = (type, color) => {
    setState({
      [type === 'front' ? 'frontTextColor' : 'backTextColor']: color
    });
  };

  const handleFontChange = (type, font) => {
    setState({
      [type === 'front' ? 'frontTextFont' : 'backTextFont']: font
    });
  };

  return (
    <div className="absolute left-full ml-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Text Settings</h3>
        
        {/* Front Text Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">Front Text</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                <input
                  type="text"
                  value={snap.frontText}
                  onChange={(e) => handleTextChange('front', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter front text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
                  <select 
                    value={snap.frontTextFont} 
                    onChange={(e) => handleFontChange('front', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <input
                    type="color"
                    value={snap.frontTextColor}
                    onChange={(e) => handleColorChange('front', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Position Controls */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Position</label>
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
                        {snap.frontTextPosition[0].toFixed(1)}
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
                        {snap.frontTextPosition[1].toFixed(1)}
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
                        {snap.frontTextScale[0].toFixed(2)}
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
          </div>
        </div>

        {/* Back Text Section */}
        <div className="space-y-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">Back Text</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                <input
                  type="text"
                  value={snap.backText}
                  onChange={(e) => handleTextChange('back', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter back text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
                  <select 
                    value={snap.backTextFont} 
                    onChange={(e) => handleFontChange('back', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <input
                    type="color"
                    value={snap.backTextColor}
                    onChange={(e) => handleColorChange('back', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Position Controls for Back Text */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Position</label>
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
                        {snap.backTextPosition[0].toFixed(1)}
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
                        {snap.backTextPosition[1].toFixed(1)}
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
                        {snap.backTextScale[0].toFixed(2)}
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
          </div>
        </div>
      </div>
    </div>
  );
}