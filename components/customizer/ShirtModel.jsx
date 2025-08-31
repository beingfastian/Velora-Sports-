"use client";

import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { useCustomizerStore } from './store/customizerStore';
import { Suspense } from 'react';

function ShirtMesh() {
  const [snap] = useCustomizerStore();
  
  // Always call hooks at the top level - never conditionally
  const { nodes, materials } = useGLTF('/models/shirt.glb');
  const logoTexture = useTexture(snap.frontLogoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const backLogoTexture = useTexture(snap.backLogoDecal);

  useFrame((state, delta) => {
    if (materials?.lambert1?.color) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    }
  });

  const createTextTexture = (text, font, size, color) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 512;
    canvas.height = 256;
    
    // Set font and styling
    ctx.font = `bold ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Clear canvas and draw text
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Early return if model isn't loaded
  if (!nodes?.T_Shirt_male || !materials?.lambert1) {
    return (
      <mesh>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={snap.color} />
      </mesh>
    );
  }

  return (
    <group>
      <mesh
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-metalness={0.1}
        dispose={null}
      >
        {/* Full Texture Decal */}
        {snap.isFullTexture && fullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Front Logo Decal */}
        {snap.isFrontLogoTexture && logoTexture && (
          <Decal
            position={snap.frontLogoPosition}
            rotation={[0, 0, 0]}
            scale={snap.frontLogoScale}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Front Text Decal */}
        {snap.isFrontText && snap.frontText && (
          <Decal
            position={snap.frontTextPosition}
            rotation={snap.frontTextRotation}
            scale={snap.frontTextScale}
            map={createTextTexture(snap.frontText, snap.frontTextFont, snap.frontTextSize, snap.frontTextColor)}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Back Logo Decal */}
        {snap.isBackLogoTexture && backLogoTexture && (
          <Decal
            position={snap.backLogoPosition}
            rotation={snap.backLogoRotation}
            scale={snap.backLogoScale}
            map={backLogoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Back Text Decal */}
        {snap.isBackText && snap.backText && (
          <Decal
            position={snap.backTextPosition}
            rotation={snap.backTextRotation}
            scale={snap.backTextScale}
            map={createTextTexture(snap.backText, snap.backTextFont, snap.backTextSize, snap.backTextColor)}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

export default function ShirtModel() {
  return (
    <Suspense fallback={
      <mesh>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#EFBD48" />
      </mesh>
    }>
      <ShirtMesh />
    </Suspense>
  );
}