import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Renders a rotating album object textured from the selected album artwork.
 * @param {Object} props Selected album and shared pointer position.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @param {Object} props.selectedAlbum Album whose cover is applied to the cuboid.
 * @returns {React.ReactElement}
 */
export default function RotatingCuboid({ mouse, selectedAlbum }) {
  const meshRef = useRef();

  const [texture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    return new THREE.CanvasTexture(canvas);
  });

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
  }, [texture]);

  useEffect(() => {
    const canvas = texture.image;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#14151a";
    ctx.fillRect(0, 0, 512, 512);

    if (selectedAlbum?.coverUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = selectedAlbum.coverUrl;

      img.onload = () => {
        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
        texture.needsUpdate = true;
      };
    } else {
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(selectedAlbum?.title || "No Album", 40, 256);
      texture.needsUpdate = true;
    }
  }, [selectedAlbum, texture]);

  useFrame(
    /** @param {Object} state Three.js frame state. @param {number} delta Frame duration in seconds. @returns {void} */
    (state, delta) => {
      if (!meshRef.current) return;
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.5,
        0.05,
      );
    },
  );

  return (
    <group ref={meshRef}>
      <RoundedBox args={[5, 5, 0.4, 6, 0.15]}>
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.95}
          roughness={0.12}
          envMapIntensity={3}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.2}
          metalness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh position={[0, 0, -0.21]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.2}
          metalness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
