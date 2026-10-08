import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Creates the pointer-responsive particle field used in the home scene.
 * @param {Object} props Particle count and shared pointer position.
 * @param {number} [props.count=80] Number of particles.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @returns {React.ReactElement}
 */
export default function Particles3D({ count = 80, mouse }) {
  const pointsRef = useRef();

  const [positions] = useState(
    /** @returns {Float32Array} Initial 3D coordinates for every particle. */
    () => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 12;
        pos[i + 1] = (Math.random() - 0.5) * 12;
        pos[i + 2] = (Math.random() - 0.5) * 10;
      }
      return pos;
    },
  );

  const particleTexture = React.useMemo(
    /** @returns {THREE.CanvasTexture} Soft circular texture shared by all points. */
    () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    },
    [],
  );

  useFrame(
    /** @param {Object} state Three.js frame state. @param {number} delta Frame duration in seconds. @returns {void} */
    (state, delta) => {
      if (!pointsRef.current) return;
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;

      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        mouse.current.x * 0.4,
        0.05,
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        mouse.current.y * 0.4,
        0.05,
      );
    },
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        map={particleTexture}
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
