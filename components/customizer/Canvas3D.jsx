// import React, { Suspense, memo } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Center, OrbitControls } from "@react-three/drei";
// import { ProductModel } from "./ProductModels";

// export const Canvas3D = memo(function Canvas3D({ activeProduct, customState }) {
//   // 🎯 Optimized camera settings for each product
//   const getCameraSettings = () => {
//     switch (activeProduct) {
// case "shoe":
//   return { position: [0, 0, 2.0], fov: 20 }; // 🔥 Closer + little narrower view
//       case "trouser":
//         return { position: [0, 0, 2.8], fov: 25 }; // ✅ Slightly zoomed out
//       case "shirt":
//       default:
//         return { position: [0, 0, 2.8], fov: 25 };
//     }
//   };

//   const camera = getCameraSettings();

//   // 🎯 Better vertical positioning for each product
//   const centerOffset = 
//     activeProduct === "trouser" ? [0, -0.2, 0] : // ✅ Moved up from -0.6
//     activeProduct === "shoe" ? [0, -0.3, 0] :    // ✅ Slight downward for shoes
//     [0, 0, 0];

//   return (
//     <Canvas
//       camera={camera}
//       dpr={[1, 1.25]}
//       gl={{ antialias: false, powerPreference: "high-performance" }}
//       className="w-full h-full"
//       onCreated={({ gl }) => {
//         gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
//       }}
//     >
//       <ambientLight intensity={0.6} />
//       <directionalLight position={[10, 10, 5]} intensity={0.8} />
//       <directionalLight position={[-10, -10, -5]} intensity={0.3} />

//       <Center position={centerOffset}>
//         <Suspense fallback={null}>
//           <group frustumCulled={true}>
//             <ProductModel
//               activeProduct={activeProduct}
//               customState={customState}
//             />
//           </group>
//         </Suspense>
//       </Center>

// <OrbitControls
//   enablePan={false}
//   enableZoom={true}
//   enableRotate={true}
//   enableDamping={true}
//   dampingFactor={0.05}
//   minPolarAngle={Math.PI / 2} // 🔒 Locks vertical rotation (all products)
//   maxPolarAngle={Math.PI / 2} // 🔒 Horizontal-only rotation
//   minDistance={activeProduct === "shoe" ? 1.2 : 1.5} // 🔍 Zoom in more on shoe
//   maxDistance={8}
// />

//     </Canvas>
//   );
// });


import React, { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import { ProductModel } from "./ProductModels";

export const Canvas3D = memo(function Canvas3D({ activeProduct, customState }) {
  const getCameraSettings = () => {
    switch (activeProduct) {
      case "shoe":
        return { position: [0, 0, 2.0], fov: 20 };
      case "trouser":
        return { position: [0, 0, 2.8], fov: 25 };
      case "shirt":
      default:
        return { position: [0, 0, 2.8], fov: 25 };
    }
  };

  const camera = getCameraSettings();
  const centerOffset = 
    activeProduct === "trouser" ? [0, -0.2, 0] :
    activeProduct === "shoe" ? [0, -0.3, 0] :
    [0, 0, 0];

  return (
    <Canvas
      camera={camera}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        powerPreference: "high-performance",
        preserveDrawingBuffer: true  // ✅ CRITICAL FOR CANVAS CAPTURE
      }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      <Center position={centerOffset}>
        <Suspense fallback={null}>
          <group frustumCulled={true}>
            <ProductModel
              activeProduct={activeProduct}
              customState={customState}
            />
          </group>
        </Suspense>
      </Center>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        minDistance={activeProduct === "shoe" ? 1.2 : 1.5}
        maxDistance={8}
      />
    </Canvas>
  );
});