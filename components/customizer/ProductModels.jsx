import React, { Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

// Shirt Model Component
export function ShirtMesh({ customState }) {
  const fallbackTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
  
  const { nodes, materials } = useGLTF('/models/shirt.glb');
  
  // Load textures with proper fallback
  const leftChestTexture = useTexture(customState.leftChestDecal && customState.leftChestDecal !== fallbackTexture ? customState.leftChestDecal : fallbackTexture);
  const mainChestTexture = useTexture(customState.mainChestDecal && customState.mainChestDecal !== fallbackTexture ? customState.mainChestDecal : fallbackTexture);
  const rightChestTexture = useTexture(customState.rightChestDecal && customState.rightChestDecal !== fallbackTexture ? customState.rightChestDecal : fallbackTexture);
  const fullBackTexture = useTexture(customState.fullBackDecal && customState.fullBackDecal !== fallbackTexture ? customState.fullBackDecal : fallbackTexture);
  const fullTexture = useTexture(customState.fullDecal && customState.fullDecal !== fallbackTexture ? customState.fullDecal : fallbackTexture);

  useFrame((state, delta) => {
    if (materials?.lambert1?.color) {
      easing.dampC(materials.lambert1.color, customState.color, 0.25, delta);
    }
  });

  const createTextTexture = (text, font, size, color) => {
    if (typeof window === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 512;
    canvas.height = 256;
    
    ctx.font = `bold ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  if (!nodes?.T_Shirt_male || !materials?.lambert1) {
    return (
      <mesh>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={customState.color} />
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
        {customState.isFullTexture && customState.fullDecal !== fallbackTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Left Chest Logo */}
        {customState.isLeftChestLogo && customState.leftChestDecal !== fallbackTexture && (
          <Decal
            position={[-0.1, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.1}
            map={leftChestTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Main Chest Logo */}
        {customState.isMainChestLogo && customState.mainChestDecal !== fallbackTexture && (
          <Decal
            position={[0, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.2}
            map={mainChestTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Right Chest Logo */}
        {customState.isRightChestLogo && customState.rightChestDecal !== fallbackTexture && (
          <Decal
            position={[0.1, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.1}
            map={rightChestTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Full Back Logo */}
        {customState.isFullBackLogo && customState.fullBackDecal !== fallbackTexture && (
          <Decal
            position={[0, 0.05, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.25}
            map={fullBackTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Front Text Decal */}
        {customState.isFrontText && customState.frontText && (
          <Decal
            position={[0, -0.12, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.4}
            map={createTextTexture(customState.frontText, customState.frontTextFont, customState.frontTextSize, customState.frontTextColor)}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* Back Text Decal */}
        {customState.isBackText && customState.backText && (
          <Decal
            position={[0, -0.13, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.4}
            map={createTextTexture(customState.backText, customState.backTextFont, customState.backTextSize, customState.backTextColor)}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

// Trouser Model Component - Updated to use GLTF model
export function TrouserMesh({ customState }) {
  const fallbackTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
  
  const { nodes, materials } = useGLTF('/models/solid_color_formal_pant.glb');
  
  const rightLegTexture = useTexture(customState.rightLegDecal && customState.rightLegDecal !== fallbackTexture ? customState.rightLegDecal : fallbackTexture);
  const leftLegTexture = useTexture(customState.leftLegDecal && customState.leftLegDecal !== fallbackTexture ? customState.leftLegDecal : fallbackTexture);

  useFrame((state, delta) => {
    // Update material color if available
    if (materials) {
      Object.values(materials).forEach(material => {
        if (material?.color) {
          easing.dampC(material.color, customState.color, 0.25, delta);
        }
      });
    }
  });

  const createVerticalTextTexture = (text, font, size, color) => {
    if (typeof window === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 256;
    canvas.height = 512;
    
    ctx.font = `bold ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Fallback if model doesn't load
  if (!nodes || !materials) {
    const trouserGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.8, 16);
    const trouserMaterial = new THREE.MeshStandardMaterial({ 
      color: customState.color,
      metalness: 0.1,
      roughness: 0.8 
    });

    return (
      <group scale={[0.8, 0.8, 0.8]}>
        <mesh geometry={trouserGeometry} material={trouserMaterial}>
          {customState.isRightLegText && customState.rightLegText && (
            <Decal
              position={[0.4, -0.2, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[0.3, 0.6, 0.3]}
              map={createVerticalTextTexture(customState.rightLegText, customState.rightLegTextFont, 40, customState.rightLegTextColor)}
              depthTest={false}
              depthWrite={true}
            />
          )}

          {customState.isLeftLegText && customState.leftLegText && (
            <Decal
              position={[-0.4, -0.2, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[0.3, 0.6, 0.3]}
              map={createVerticalTextTexture(customState.leftLegText, customState.leftLegTextFont, 40, customState.leftLegTextColor)}
              depthTest={false}
              depthWrite={true}
            />
          )}
        </mesh>
        
        <mesh position={[-0.25, -1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.2, 12]} />
          <meshStandardMaterial color={customState.color} metalness={0.1} roughness={0.8} />
        </mesh>
        
        <mesh position={[0.25, -1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.2, 12]} />
          <meshStandardMaterial color={customState.color} metalness={0.1} roughness={0.8} />
        </mesh>
      </group>
    );
  }

  // Use the actual GLTF model
  const meshes = Object.keys(nodes).map(key => {
    const mesh = nodes[key];
    if (mesh.geometry) {
      return (
        <mesh
          key={key}
          geometry={mesh.geometry}
          material={materials[mesh.material?.name] || materials[Object.keys(materials)[0]]}
          material-metalness={0.1}
          dispose={null}
        >
          {/* Right Leg Text */}
          {customState.isRightLegText && customState.rightLegText && (
            <Decal
              position={[0.5, -0.3, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[0.4, 0.8, 0.4]}
              map={createVerticalTextTexture(customState.rightLegText, customState.rightLegTextFont, 40, customState.rightLegTextColor)}
              depthTest={false}
              depthWrite={true}
            />
          )}

          {/* Left Leg Text */}
          {customState.isLeftLegText && customState.leftLegText && (
            <Decal
              position={[-0.5, -0.3, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[0.4, 0.8, 0.4]}
              map={createVerticalTextTexture(customState.leftLegText, customState.leftLegTextFont, 40, customState.leftLegTextColor)}
              depthTest={false}
              depthWrite={true}
            />
          )}
        </mesh>
      );
    }
    return null;
  });

  return <group>{meshes}</group>;
}

// Hat Model Component
export function HatMesh({ customState }) {
  const hatMaterial = new THREE.MeshStandardMaterial({ 
    color: customState.color,
    metalness: 0.1,
    roughness: 0.8 
  });

  useFrame((state, delta) => {
    if (hatMaterial?.color) {
      easing.dampC(hatMaterial.color, customState.color, 0.25, delta);
    }
  });

  return (
    <group>
      {/* Hat brim */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color={customState.color} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Hat crown */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
        <meshStandardMaterial color={customState.color} metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Shoe Model Component
export function ShoeMesh({ customState }) {
  const shoeMaterial = new THREE.MeshStandardMaterial({ 
    color: customState.color,
    metalness: 0.2,
    roughness: 0.6 
  });

  useFrame((state, delta) => {
    if (shoeMaterial?.color) {
      easing.dampC(shoeMaterial.color, customState.color, 0.25, delta);
    }
  });

  return (
    <group>
      {/* Shoe body */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshStandardMaterial color={customState.color} metalness={0.2} roughness={0.6} />
      </mesh>
      
      {/* Shoe sole */}
      <mesh position={[0, -0.25, 0.1]}>
        <boxGeometry args={[0.85, 0.1, 1.4]} />
        <meshStandardMaterial color="#2D1810" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Main Product Model Component
export function ProductModel({ activeProduct, customState }) {
  return (
    <Suspense fallback={
      <mesh>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={customState.color} />
      </mesh>
    }>
      {activeProduct === 'shirt' && <ShirtMesh customState={customState} />}
      {activeProduct === 'trouser' && <TrouserMesh customState={customState} />}
      {activeProduct === 'hat' && <HatMesh customState={customState} />}
      {activeProduct === 'shoe' && <ShoeMesh customState={customState} />}
    </Suspense>
  );
}