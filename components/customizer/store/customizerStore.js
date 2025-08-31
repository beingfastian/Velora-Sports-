const createStore = () => {
  // Create a simple 1x1 pixel transparent PNG as fallback
  const fallbackTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
  
  const state = {
    intro: true,
    color: '#EFBD48',
    isFullTexture: false,
    isFrontLogoTexture: true,
    isBackLogoTexture: true,
    isFrontText: true,
    isBackText: true,
    frontLogoDecal: fallbackTexture,
    backLogoDecal: fallbackTexture,
    fullDecal: fallbackTexture,
    frontText: 'FRONT',
    backText: 'BACK',
    frontTextPosition: [0, 0.04, 0.15],
    backTextPosition: [0, 0.04, -0.15],
    frontTextRotation: [0, 0, 0],
    backTextRotation: [0, Math.PI, 0],
    frontTextScale: [0.15, 0.15, 0.15],
    backTextScale: [0.15, 0.15, 0.15],
    frontTextFont: 'Arial',
    backTextFont: 'Arial',
    frontTextColor: '#000000',
    backTextColor: '#000000',
    frontTextSize: 60,
    backTextSize: 60,
    frontLogoPosition: [0, 0.04, 0.15],
    backLogoPosition: [0, 0.04, -0.15],
    frontLogoScale: 0.15,
    backLogoScale: 0.15,
    backLogoRotation: [0, Math.PI, 0]
  };

  const listeners = new Set();
  
  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const setState = (updates) => {
    console.log('Store updating:', updates);
    Object.assign(state, updates);
    listeners.forEach(fn => fn());
  };

  return { state, setState, subscribe };
};

export const customizerStore = createStore();

import { useState, useEffect } from 'react';

export const useCustomizerStore = () => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    return customizerStore.subscribe(() => forceUpdate({}));
  }, []);
  
  return [customizerStore.state, customizerStore.setState];
};