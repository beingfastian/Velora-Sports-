"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import ShirtModel from './ShirtModel';

export default function Canvas3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      <Center>
        <Suspense fallback={null}>
          <ShirtModel />
        </Suspense>
      </Center>
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}