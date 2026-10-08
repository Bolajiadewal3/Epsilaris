import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animates the active section's wireframe geometry in the background scene.
 * @param {Object} props Geometry selection and pointer state.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @param {string} [props.shape="torus"] Geometry variant name.
 * @returns {React.ReactElement}
 */
function PlaceholderObject3D({ mouse, shape = "torus" }) {
  const meshRef = useRef();

  useFrame(
    /** @param {Object} state Three.js frame state. @returns {void} */
    (state) => {
      if (!meshRef.current) return;
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.25;
      meshRef.current.rotation.x = time * 0.15;

      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        1.8 + mouse.current.x * 0.3,
        0.05,
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        Math.sin(time * 1.0) * 0.1 + mouse.current.y * 0.3,
        0.05,
      );
    },
  );

  /** Maps the requested geometry name to its Three.js primitive. @returns {React.ReactElement} */
  const renderGeometry = () => {
    switch (shape) {
      case "icosahedron":
        return <icosahedronGeometry args={[1.2, 0]} />;
      case "octahedron":
        return <octahedronGeometry args={[1.3, 0]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1.2, 0]} />;
      case "torus":
      default:
        return <torusKnotGeometry args={[1, 0.3, 128, 32]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={[1.8, 0, 0]}>
      {renderGeometry()}
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

/**
 * Mounts the non-home wireframe object inside a transparent Three.js canvas.
 * @param {Object} props Scene configuration.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @param {string} [props.shape="torus"] Geometry variant name.
 * @returns {React.ReactElement}
 */
export default function PlaceholderScene3D({ mouse, shape = "torus" }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <PlaceholderObject3D mouse={mouse} shape={shape} />
      </Canvas>
    </div>
  );
}
