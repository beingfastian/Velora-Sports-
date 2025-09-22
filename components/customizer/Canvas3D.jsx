import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import { ProductModel } from './ProductModels';

export function Canvas3D({ activeProduct, customState }) {
  const getCameraSettings = () => {
    switch(activeProduct) {
      case 'hat': return { position: [0, 0, 3], fov: 25 };
      case 'shoe': return { position: [0, 0, 2.5], fov: 25 };
      default: return { position: [0, 0, 2], fov: 25 };
    }
  };

  const camera = getCameraSettings();

  return (
    <Canvas
      camera={camera}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      
      <Center>
        <Suspense fallback={null}>
          <ProductModel activeProduct={activeProduct} customState={customState} />
        </Suspense>
      </Center>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={activeProduct === 'shirt' ? Math.PI / 2 : 0}
        maxPolarAngle={activeProduct === 'shirt' ? Math.PI / 2 : Math.PI}
        minDistance={1.5}
        maxDistance={8}
      />
      
    </Canvas>
  );
}