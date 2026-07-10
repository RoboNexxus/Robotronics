"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

const MODEL_URL = "https://res.cloudinary.com/drqqqhudz/image/upload/v1783427413/logo-optimized_evx5on.glb";

useGLTF.preload(MODEL_URL);

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={2.5} />;
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-cyan-400 text-sm animate-pulse">Loading 3D model...</div>
    </div>
  );
}

export default function Logo3D() {
  return (
    <div className="w-full h-[500px] mb-8">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Model />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={4}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
