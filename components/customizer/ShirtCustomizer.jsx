"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, X, Save, Type, Upload, RotateCcw } from 'lucide-react';
import Canvas3D from './Canvas3D';
import ColorPicker from './controls/ColorPicker';
import TextControls from './controls/TextControls';
import LogoControls from './controls/LogoControls';
import { useCustomizerStore } from './store/customizerStore';

export default function ShirtCustomizer({ isOpen, onClose }) {
  const [snap, setState] = useCustomizerStore();
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (isOpen) {
      setState({ intro: false });
    }
  }, [isOpen, setState]);

  const tabs = [
    { id: 'color', icon: Palette, label: 'Colors' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'upload', icon: Upload, label: 'Logos' },
  ];

  const filterTabs = [
    { id: 'frontText', label: 'Front Text', active: snap.isFrontText },
    { id: 'backText', label: 'Back Text', active: snap.isBackText },
    { id: 'frontLogo', label: 'Front Logo', active: snap.isFrontLogoTexture },
    { id: 'backLogo', label: 'Back Logo', active: snap.isBackLogoTexture },
    { id: 'fullTexture', label: 'Full Pattern', active: snap.isFullTexture },
  ];

  const handleFilterToggle = (filterId) => {
    const filterMap = {
      frontText: 'isFrontText',
      backText: 'isBackText',
      frontLogo: 'isFrontLogoTexture',
      backLogo: 'isBackLogoTexture',
      fullTexture: 'isFullTexture',
    };
    
    setState({
      [filterMap[filterId]]: !snap[filterMap[filterId]]
    });
  };

  const downloadCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `custom-shirt-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetToDefaults = () => {
    setState({
      color: '#EFBD48',
      isFullTexture: false,
      isFrontLogoTexture: true,
      isBackLogoTexture: true,
      isFrontText: true,
      isBackText: true,
      frontText: 'FRONT',
      backText: 'BACK',
      frontTextPosition: [0, 0.04, 0.15],
      backTextPosition: [0, 0.04, -0.15],
      frontTextScale: [0.15, 0.15, 0.15],
      backTextScale: [0.15, 0.15, 0.15],
      frontTextColor: '#000000',
      backTextColor: '#000000',
      frontLogoPosition: [0, 0.04, 0.15],
      backLogoPosition: [0, 0.04, -0.15],
      frontLogoScale: 0.15,
      backLogoScale: 0.15,
    });
  };

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
            {/* Top Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm border-b">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-800">3D Shirt Designer</h1>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">Current Color:</div>
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: snap.color }}
                  ></div>
                  <button
                    onClick={onClose}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="h-full w-full pt-16 pb-20">
              <Canvas3D />
            </div>

            {/* Left Control Panel */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute left-4 top-24 z-30"
            >
              <div className="bg-white rounded-xl shadow-lg p-3 border">
                <div className="text-sm font-medium text-gray-700 mb-3 text-center">
                  Design Tools
                </div>
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                      className={`w-full p-3 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Control Panels - moved to bottom center */}
                <TextControls isOpen={activeTab === 'text'} />
                <LogoControls isOpen={activeTab === 'upload'} />
              </div>
            </motion.div>

            {/* Right Info Panel */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute right-4 top-24 z-30"
            >
              <div className="bg-white rounded-xl shadow-lg p-4 border w-64">
                <h3 className="font-semibold text-gray-800 mb-3">Quick Guide</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Click tools on left to customize</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Drag to rotate the shirt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Scroll to zoom in/out</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Toggle elements below</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <div className="text-xs text-gray-500 mb-2">Active Elements:</div>
                  <div className="space-y-1">
                    {snap.isFrontText && <div className="text-xs text-green-600">✓ Front Text: "{snap.frontText}"</div>}
                    {snap.isBackText && <div className="text-xs text-green-600">✓ Back Text: "{snap.backText}"</div>}
                    {snap.isFrontLogoTexture && <div className="text-xs text-green-600">✓ Front Logo</div>}
                    {snap.isBackLogoTexture && <div className="text-xs text-green-600">✓ Back Logo</div>}
                    {snap.isFullTexture && <div className="text-xs text-green-600">✓ Full Pattern</div>}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Control Bar */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="bg-white rounded-xl shadow-lg p-4 border max-w-4xl">
                {/* Color Picker Section */}
                {activeTab === 'color' && (
                  <div className="mb-6">
                    <ColorPicker isOpen={true} />
                  </div>
                )}

                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-sm font-medium text-gray-700">Show/Hide Elements:</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
                  {filterTabs.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterToggle(filter.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        filter.active
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={downloadCanvas}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Download Design</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}