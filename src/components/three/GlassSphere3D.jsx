import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FresnelRim from "./FresnelRim";

/**
 * Renders the animated glass sphere that responds to pointer movement.
 * @param {Object} props Scene inputs.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @returns {React.ReactElement}
 */
export default function GlassSphere3D({ mouse }) {
  const meshRef = useRef();

  useFrame(
    /** @param {Object} state Three.js frame state. @returns {void} */
    (state) => {
      if (!meshRef.current) return;
      const time = state.clock.getElapsedTime();

      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        1.8 + mouse.current.x * 0.4,
        0.05,
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        Math.sin(time * 1.2) * 0.1 + mouse.current.y * 0.4,
        0.05,
      );

      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = time * 0.15;
    },
  );

  return (
    <mesh ref={meshRef} position={[1.8, 0, 0]}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <meshPhysicalMaterial
        color="#d6f2ff"
        metalness={0.7}
        roughness={0.33}
        transmission={1}
        ior={1.5}
        thickness={10}
        specularIntensity={1}
        envMapIntensity={5}
      />
      <FresnelRim />
    </mesh>
  );
}
