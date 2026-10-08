import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import Particles3D from "./Particles3D";
import GlassSphere3D from "./GlassSphere3D";

/**
 * Composes the interactive home scene from the particle field and glass sphere.
 * @param {Object} props Shared scene inputs.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @param {boolean} props.hasEntered Entry state supplied by the surrounding frame.
 * @returns {React.ReactElement}
 */
export default function HomeScene3D({ mouse, hasEntered }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
      >
        <Environment files="/monochrome_studio_02_1k.hdr" background={false} />
        <ambientLight intensity={0.3} />
        <Particles3D mouse={mouse} />
        <GlassSphere3D mouse={mouse} />
      </Canvas>
    </div>
  );
}
