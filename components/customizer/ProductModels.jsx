import React, { Suspense, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Decal } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";

// Helper function to create text texture
const createTextTexture = (text, font, color, fontSize = 512) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set font first to measure text
  ctx.font = `bold ${fontSize}px ${font}`;
  
  // Measure text width
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  
  // Set canvas size with padding
  canvas.width = Math.max(textWidth + 200, 1024); // Add padding and minimum width
  canvas.height = 512;
  
  // Clear and redraw (setting canvas size resets context)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set text properties again after resize
  ctx.font = `bold ${fontSize}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw text
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
};

/* 🧥 SHIRT */
export function ShirtMesh({ customState }) {
  const fallbackTexture =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=";

  const { nodes, materials } = useGLTF("/models/shirt.glb");

  const leftChestTexture = useTexture(
    customState.leftChestDecal && customState.leftChestDecal !== fallbackTexture
      ? customState.leftChestDecal
      : fallbackTexture
  );
  const mainChestTexture = useTexture(
    customState.mainChestDecal && customState.mainChestDecal !== fallbackTexture
      ? customState.mainChestDecal
      : fallbackTexture
  );
  const rightChestTexture = useTexture(
    customState.rightChestDecal && customState.rightChestDecal !== fallbackTexture
      ? customState.rightChestDecal
      : fallbackTexture
  );
  const fullBackTexture = useTexture(
    customState.fullBackDecal && customState.fullBackDecal !== fallbackTexture
      ? customState.fullBackDecal
      : fallbackTexture
  );
  const fullTexture = useTexture(
    customState.fullDecal && customState.fullDecal !== fallbackTexture
      ? customState.fullDecal
      : fallbackTexture
  );

  // Generate text textures
  const frontTextTexture = useMemo(() => {
    if (customState.frontText) {
      return createTextTexture(
        customState.frontText,
        customState.frontTextFont || 'Arial',
        customState.frontTextColor || '#000000'
      );
    }
    return null;
  }, [customState.frontText, customState.frontTextFont, customState.frontTextColor]);

  const backTextTexture = useMemo(() => {
    if (customState.backText) {
      return createTextTexture(
        customState.backText,
        customState.backTextFont || 'Arial',
        customState.backTextColor || '#000000'
      );
    }
    return null;
  }, [customState.backText, customState.backTextFont, customState.backTextColor]);

  useFrame((_, delta) => {
    if (materials?.lambert1?.color) {
      easing.dampC(materials.lambert1.color, customState.color, 0.25, delta);
    }
  });

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
        {customState.isFullTexture && (
          <Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} map={fullTexture} />
        )}
        {customState.isLeftChestLogo && (
          <Decal
            position={[-0.1, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.1}
            map={leftChestTexture}
          />
        )}
        {customState.isMainChestLogo && (
          <Decal
            position={[0, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.2}
            map={mainChestTexture}
          />
        )}
        {customState.isRightChestLogo && (
          <Decal
            position={[0.1, 0.05, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.1}
            map={rightChestTexture}
          />
        )}
        {customState.isFullBackLogo && (
          <Decal
            position={[0, 0.05, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.25}
            map={fullBackTexture}
          />
        )}
        
        {/* Front Text as Decal */}
        {customState.isFrontText && frontTextTexture && (
          <Decal
            position={[0, -0.10, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.12}
            map={frontTextTexture}
            transparent={true}
          />
        )}

        {/* Back Text as Decal */}
        {customState.isBackText && backTextTexture && (
          <Decal
            position={[0, -0.10, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.12}
            map={backTextTexture}
            transparent={true}
          />
        )}
      </mesh>
    </group>
  );
}

/* 👖 TROUSER */
export function TrouserMesh({ customState }) {
  const { nodes, materials } = useGLTF("/models/tactical-pants-001.glb");

  useFrame((_, delta) => {
    if (materials) {
      Object.values(materials).forEach((mat) => {
        if (mat?.color) easing.dampC(mat.color, customState.color, 0.25, delta);
      });
    }
  });

  if (!nodes || !materials) {
    return (
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color={customState.color} />
      </mesh>
    );
  }

  return (
    <group scale={[1, 1, 1]} position={[0, -0.4, 0]}>
      {Object.keys(nodes).map((key) => {
        const mesh = nodes[key];
        if (mesh.geometry) {
          return (
            <mesh
              key={key}
              geometry={mesh.geometry}
              material={
                materials[mesh.material?.name] || materials[Object.keys(materials)[0]]
              }
              material-metalness={0.1}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

/* 🧢 HAT */
export function HatMesh({ customState }) {
  const { nodes, materials } = useGLTF("/models/hat.glb");

  useFrame((_, delta) => {
    if (materials) {
      Object.values(materials).forEach((mat) => {
        if (mat?.color) easing.dampC(mat.color, customState.color, 0.25, delta);
      });
    }
  });

  if (!nodes || !materials) {
    return (
      <group>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
          <meshStandardMaterial color={customState.color} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
          <meshStandardMaterial color={customState.color} />
        </mesh>
      </group>
    );
  }

  return (
    <group scale={[1, 1, 1]}>
      {Object.keys(nodes).map((key) => {
        const mesh = nodes[key];
        if (mesh.geometry) {
          return (
            <mesh
              key={key}
              geometry={mesh.geometry}
              material={
                materials[mesh.material?.name] || materials[Object.keys(materials)[0]]
              }
            />
          );
        }
        return null;
      })}
    </group>
  );
}

/* 👟 SHOE (FIXED COLOR HANDLING) */
export function ShoeMesh({ customState }) {
  const { nodes, materials } = useGLTF("/models/white_right_shoe.glb");

  // ✅ Create separate material groups for body and sole
  const materialGroups = useMemo(() => {
    if (!materials) return { body: [], sole: [] };
    
    const body = [];
    const sole = [];
    
    Object.entries(materials).forEach(([key, mat]) => {
      // Identify sole materials (adjust these names based on your model)
      if (key.toLowerCase().includes('sole') || 
          key.toLowerCase().includes('bottom') ||
          key.toLowerCase().includes('rubber')) {
        sole.push(mat);
      } else {
        body.push(mat);
      }
    });
    
    return { body, sole };
  }, [materials]);

  // ✅ Animate color changes smoothly
  useFrame((_, delta) => {
    if (!materials) return;

    // Update body color
    materialGroups.body.forEach((mat) => {
      if (mat?.color && customState.bodyColor) {
        easing.dampC(mat.color, customState.bodyColor, 0.25, delta);
      }
    });

    // Update sole color
    materialGroups.sole.forEach((mat) => {
      if (mat?.color && customState.soleColor) {
        easing.dampC(mat.color, customState.soleColor, 0.25, delta);
      }
    });
  });

  if (!nodes || !materials) {
    return (
      <mesh>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color={customState.bodyColor || customState.color} />
      </mesh>
    );
  }

  return (
    <group scale={[1, 1, 1]} rotation={[0, Math.PI / 2, 0]}>
      {Object.keys(nodes).map((key) => {
        const mesh = nodes[key];
        if (mesh.geometry) {
          return (
            <mesh
              key={key}
              geometry={mesh.geometry}
              material={
                materials[mesh.material?.name] ||
                new THREE.MeshStandardMaterial({
                  color: customState.bodyColor || customState.color,
                  metalness: 0.2,
                  roughness: 0.6,
                })
              }
              material-metalness={0.2}
              material-roughness={0.6}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

/* 🧩 Main Product Switch */
export function ProductModel({ activeProduct, customState }) {
  return (
    <Suspense
      fallback={
        <mesh>
          <boxGeometry args={[1, 1.5, 0.1]} />
          <meshStandardMaterial color={customState.color} />
        </mesh>
      }
    >
      {activeProduct === "shirt" && <ShirtMesh customState={customState} />}
      {activeProduct === "trouser" && <TrouserMesh customState={customState} />}
      {activeProduct === "hat" && <HatMesh customState={customState} />}
      {activeProduct === "shoe" && <ShoeMesh customState={customState} />}
    </Suspense>
  );
}
